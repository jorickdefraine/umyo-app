# UMYO — USDC Morpho Yield Optimizer

A non-custodial yield optimizer that automatically routes USDC deposits to the highest-APY Morpho vault on Base, and rebalances whenever a better opportunity appears.

**Live on Base mainnet** · Contract: [`0xA41Af22a823D8756911E58e0603763d934Ac4038`](https://basescan.org/address/0xA41Af22a823D8756911E58e0603763d934Ac4038)

---

## What it does

Users deposit USDC and receive **vUMYO** — ERC-4626 vault shares. The contract continuously monitors whitelisted Morpho USDC vaults on Base and rebalances toward the best available yield. Withdrawals are available anytime with no lock-up and no exit fee.

The frontend provides:
- Live vault stats (TVL, current APY, share price) pulled directly from the contract and the Morpho API
- Deposit and withdrawal flows with USDC approval handling
- A rebalance activity feed reading on-chain events
- Wallet connection via RainbowKit (MetaMask, Coinbase Wallet, WalletConnect, and 60+ others)

## Architecture

This repository is the **frontend application**. The smart contract source lives in [`usdc-morpho-yield-optimizer`](https://github.com/jorickdefraine/usdc-morpho-yield-optimizer).

```
umyo-app/                    ← this repo (Next.js frontend)
usdc-morpho-yield-optimizer/ ← ERC-4626 vault contract (Foundry)
```

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Blockchain | wagmi v2 · viem · RainbowKit |
| Data fetching | TanStack Query |
| Network | Base (L2) |
| Yield source | Morpho Protocol |

## Local setup

```bash
git clone https://github.com/your-username/umyo-app
cd umyo-app
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_VAULT_ADDRESS=0xA41Af22a823D8756911E58e0603763d934Ac4038
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The app is designed to deploy on Vercel with zero configuration. Add the two environment variables in Vercel's project settings and every push to `main` redeploys automatically.

## License

MIT
