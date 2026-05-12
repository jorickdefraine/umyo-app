'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { parseAbiItem } from 'viem'
import { VAULT_ADDRESS, formatUsdc } from '@/lib/contracts'

interface RebalanceEntry {
  blockNumber: bigint
  timestamp: number
  fromVault: string
  toVault: string
  assetsDeployed: bigint
  txHash: string
}

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function formatTs(ts: number): string {
  return new Date(Number(ts) * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ActivityFeed() {
  const publicClient = usePublicClient()
  const isDeployed = !!VAULT_ADDRESS

  const { data: events, isLoading } = useQuery<RebalanceEntry[]>({
    queryKey: ['rebalances', VAULT_ADDRESS],
    queryFn: async () => {
      if (!publicClient) return []

      const CHUNK_SIZE = 2_000n
      const MAX_LOOKBACK = 302_400n // ~7 days on Base (2s/block)
      const TARGET = 10

      const latestBlock = await publicClient.getBlockNumber()
      const minBlock = latestBlock > MAX_LOOKBACK ? latestBlock - MAX_LOOKBACK : 0n

      let toBlock = latestBlock
      let allLogs: Awaited<ReturnType<typeof publicClient.getLogs>> = []

      while (toBlock >= minBlock && allLogs.length < TARGET) {
        const fromBlock = toBlock > CHUNK_SIZE ? toBlock - CHUNK_SIZE : 0n
        const clampedFrom = fromBlock < minBlock ? minBlock : fromBlock

        const chunk = await publicClient.getLogs({
          address: VAULT_ADDRESS,
          event: parseAbiItem(
            'event Rebalanced(address indexed fromVault, address indexed toVault, uint256 assetsDeployed)'
          ),
          fromBlock: clampedFrom,
          toBlock,
        })

        allLogs = [...chunk, ...allLogs]

        if (clampedFrom <= minBlock) break
        toBlock = clampedFrom - 1n
      }

      const entries = await Promise.all(
        allLogs.slice(-TARGET).reverse().map(async (log) => {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber! })
          return {
            blockNumber: log.blockNumber ?? 0n,
            timestamp: Number(block.timestamp),
            fromVault: (log.args as { fromVault: string }).fromVault,
            toVault: (log.args as { toVault: string }).toVault,
            assetsDeployed: (log.args as { assetsDeployed: bigint }).assetsDeployed,
            txHash: log.transactionHash ?? '',
          }
        })
      )
      return entries
    },
    enabled: isDeployed && !!publicClient,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <p className="text-xs text-white/40 uppercase tracking-wider mb-4">Recent Rebalances</p>

      {!isDeployed && (
        <p className="text-white/30 text-sm">Vault not deployed yet.</p>
      )}

      {isDeployed && isLoading && (
        <p className="text-white/30 text-sm">Loading…</p>
      )}

      {isDeployed && !isLoading && (!events || events.length === 0) && (
        <p className="text-white/30 text-sm">No rebalances yet.</p>
      )}

      {events && events.length > 0 && (
        <div className="space-y-3">
          {events.map((e, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b border-white/5 last:border-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white/30 font-mono">{shortAddr(e.fromVault)}</span>
                  <span className="text-white/20">→</span>
                  <span className="text-white/60 font-mono">{shortAddr(e.toVault)}</span>
                </div>
                <p className="text-xs text-white/30">{formatTs(e.timestamp)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white font-medium">${formatUsdc(e.assetsDeployed)}</p>
                <p className="text-xs text-white/30">deployed</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
