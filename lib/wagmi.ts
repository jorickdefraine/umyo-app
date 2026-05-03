import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'UMYO — USDC Morpho Yield Optimizer',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000',
  chains: [base],
  ssr: true,
})
