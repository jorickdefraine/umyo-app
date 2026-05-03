import { NextResponse } from 'next/server'

const MORPHO_API = 'https://api.morpho.org/graphql'

const QUERY = `
  query {
    vaults(
      where: {
        chainId_in: [8453],
        whitelisted: true,
        assetSymbol_in: ["USDC"],
        totalAssetsUsd_gte: 1000000
      }
    ) {
      items {
        address
        symbol
        name
        dailyApys { netApy }
      }
    }
  }
`

export async function GET() {
  try {
    const res = await fetch(MORPHO_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY }),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json([], { status: 502 })
    }

    const json = await res.json()
    const items = json?.data?.vaults?.items ?? []

    const vaults = items
      .filter((v: { dailyApys?: { netApy?: number } }) => v.dailyApys?.netApy != null)
      .sort((a: { dailyApys: { netApy: number } }, b: { dailyApys: { netApy: number } }) =>
        b.dailyApys.netApy - a.dailyApys.netApy
      )

    return NextResponse.json(vaults)
  } catch {
    return NextResponse.json([], { status: 502 })
  }
}
