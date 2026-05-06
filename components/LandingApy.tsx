'use client'

import { useQuery } from '@tanstack/react-query'
import { useReadContract } from 'wagmi'
import { VAULT_ADDRESS, vaultAbi } from '@/lib/contracts'

interface MorphoVault {
  address: string
  name: string
  dailyApys: { netApy: number } | null
}

export function LandingApy() {
  const { data: morphoVaultAddr } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'morphoVault',
    query: { enabled: !!VAULT_ADDRESS, refetchInterval: 30_000 },
  })

  const { data } = useQuery<MorphoVault[]>({
    queryKey: ['morpho-apys'],
    queryFn: async () => {
      const res = await fetch('/api/morpho')
      if (!res.ok) throw new Error()
      return res.json()
    },
    staleTime: 60_000,
  })

  const currentApy = data?.find(
    (v) => morphoVaultAddr && v.address.toLowerCase() === morphoVaultAddr.toLowerCase()
  )?.dailyApys?.netApy

  const apyStr = currentApy != null
    ? `${(currentApy * 100).toFixed(2)}%`
    : '8%+'

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <p className="text-xs text-white/30 uppercase tracking-widest">Current APY</p>
      <p className="text-6xl sm:text-7xl font-bold text-green-400 leading-none tabular-nums">
        {apyStr}
      </p>
      <p className="text-sm text-white/30 mt-1">via Morpho vaults on Base · updated live</p>
    </div>
  )
}
