'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { parseAbiItem } from 'viem'
import { VAULT_ADDRESS, formatUsdc } from '@/lib/contracts'

interface RebalanceEntry {
  blockNumber: bigint
  timestamp: bigint
  oldVault: string
  newVault: string
  assetsWithdrawn: bigint
  assetsDeployed: bigint
  txHash: string
}

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function formatTs(ts: bigint): string {
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
      const blockNumber = await publicClient.getBlockNumber()
      const fromBlock = blockNumber > 50_000n ? blockNumber - 50_000n : 0n

      const logs = await publicClient.getLogs({
        address: VAULT_ADDRESS,
        event: parseAbiItem(
          'event Rebalanced(address indexed oldVault, address indexed newVault, uint256 assetsWithdrawn, uint256 assetsDeployed, uint256 timestamp)'
        ),
        fromBlock,
        toBlock: 'latest',
      })

      return logs.slice(-10).reverse().map((log) => ({
        blockNumber: log.blockNumber ?? 0n,
        timestamp: (log.args as { timestamp: bigint }).timestamp,
        oldVault: (log.args as { oldVault: string }).oldVault,
        newVault: (log.args as { newVault: string }).newVault,
        assetsWithdrawn: (log.args as { assetsWithdrawn: bigint }).assetsWithdrawn,
        assetsDeployed: (log.args as { assetsDeployed: bigint }).assetsDeployed,
        txHash: log.transactionHash ?? '',
      }))
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
                  <span className="text-white/30 font-mono">{shortAddr(e.oldVault)}</span>
                  <span className="text-white/20">→</span>
                  <span className="text-white/60 font-mono">{shortAddr(e.newVault)}</span>
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
