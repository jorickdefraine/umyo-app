'use client'

import { useQuery } from '@tanstack/react-query'

interface MorphoVault {
  address: string
  name: string
  dailyApys: { netApy: number } | null
}

export function LandingApy() {
  const { data } = useQuery<MorphoVault[]>({
    queryKey: ['morpho-apys'],
    queryFn: async () => {
      const res = await fetch('/api/morpho')
      if (!res.ok) throw new Error()
      return res.json()
    },
    staleTime: 60_000,
  })

  const best = data?.reduce((max, v) => {
    const apy = v.dailyApys?.netApy ?? 0
    return apy > max ? apy : max
  }, 0)

  const apyStr = best != null && best > 0
    ? `${(best * 100).toFixed(2)}%`
    : '8%+'

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <p className="text-xs text-white/30 uppercase tracking-widest">Current best APY</p>
      <p className="text-6xl sm:text-7xl font-bold text-green-400 leading-none tabular-nums">
        {apyStr}
      </p>
      <p className="text-sm text-white/30 mt-1">via Morpho vaults on Base · updated live</p>
    </div>
  )
}
