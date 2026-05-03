'use client'

import { useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { VAULT_ADDRESS, USDC_ADDRESS, vaultAbi, formatUsdc, formatShares } from '@/lib/contracts'
import { erc20Abi } from 'viem'
import { useFakeMode } from '@/lib/fakeMode'
import { FAKE } from '@/lib/fakeData'

interface MorphoVault {
  address: string
  name: string
  dailyApys: { netApy: number } | null
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-2xl font-semibold ${accent ? 'text-green-400' : 'text-white'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  )
}

export function VaultStats() {
  const { address: userAddress } = useAccount()
  const { fakeMode } = useFakeMode()
  const isDeployed = !!VAULT_ADDRESS

  const { data: totalAssets } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'totalAssets',
    query: { enabled: isDeployed && !fakeMode, refetchInterval: 15_000 },
  })

  const { data: sharePrice } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'convertToAssets',
    args: [1_000_000n],
    query: { enabled: isDeployed && !fakeMode, refetchInterval: 15_000 },
  })

  const { data: morphoVaultAddr } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'morphoVault',
    query: { enabled: isDeployed && !fakeMode, refetchInterval: 30_000 },
  })

  const { data: vUmyoBalance } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: isDeployed && !!userAddress && !fakeMode, refetchInterval: 15_000 },
  })

  const { data: maxWithdrawable } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'maxWithdraw',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: isDeployed && !!userAddress && !fakeMode, refetchInterval: 15_000 },
  })

  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress && !fakeMode, refetchInterval: 15_000 },
  })

  const { data: morphoData } = useQuery<MorphoVault[]>({
    queryKey: ['morpho-apys'],
    queryFn: async () => {
      const res = await fetch('/api/morpho')
      if (!res.ok) throw new Error('Morpho API error')
      return res.json()
    },
    enabled: !fakeMode,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })

  const currentApy = morphoData?.find(
    (v) => morphoVaultAddr && v.address.toLowerCase() === morphoVaultAddr.toLowerCase()
  )?.dailyApys?.netApy

  const zeroAddr = '0x0000000000000000000000000000000000000000'
  const hasActiveMorphoVault = morphoVaultAddr && morphoVaultAddr !== zeroAddr

  const tvlDisplay = fakeMode
    ? FAKE.tvl
    : totalAssets != null
    ? `$${formatUsdc(totalAssets)}`
    : isDeployed ? '…' : '—'

  const apyDisplay = fakeMode
    ? FAKE.apy
    : currentApy != null
    ? `${(currentApy * 100).toFixed(2)}%`
    : '—'

  const sharePriceDisplay = fakeMode
    ? FAKE.sharePrice
    : sharePrice != null
    ? `$${(Number(sharePrice) / 1e6).toFixed(6)}`
    : isDeployed ? '…' : '—'

  const showUserPosition = fakeMode || !!userAddress

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Value Locked" value={tvlDisplay} sub="USDC deposited" />
        <StatCard
          label="Current APY"
          value={apyDisplay}
          sub={fakeMode ? 'via Morpho' : hasActiveMorphoVault ? 'via Morpho' : 'no vault set'}
          accent
        />
        <StatCard label="Share Price" value={sharePriceDisplay} sub="1 vUMYO = X USDC" />
      </div>

      {showUserPosition && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Your Position</p>
            <p className="text-xl font-semibold text-white">
              {fakeMode ? FAKE.vumy : vUmyoBalance != null ? `${formatShares(vUmyoBalance)} vUMYO` : '…'}
            </p>
            <p className="text-xs text-white/40 mt-1">
              {fakeMode
                ? `≈ $${FAKE.withdrawable} withdrawable`
                : maxWithdrawable != null
                ? `≈ $${formatUsdc(maxWithdrawable)} withdrawable`
                : null}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Wallet USDC</p>
            <p className="text-xl font-semibold text-white">
              {fakeMode ? FAKE.walletUsdc : usdcBalance != null ? `$${formatUsdc(usdcBalance)}` : '…'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
