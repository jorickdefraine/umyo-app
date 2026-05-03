import { parseAbi } from 'viem'

export const VAULT_ADDRESS = (process.env.NEXT_PUBLIC_VAULT_ADDRESS ?? '') as `0x${string}`
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const satisfies `0x${string}`
export const USDC_DECIMALS = 6

export const vaultAbi = parseAbi([
  'function totalAssets() view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function morphoVault() view returns (address)',
  'function balanceOf(address account) view returns (uint256)',
  'function maxWithdraw(address owner) view returns (uint256)',
  'function maxRedeem(address owner) view returns (uint256)',
  'function previewDeposit(uint256 assets) view returns (uint256)',
  'function previewWithdraw(uint256 assets) view returns (uint256)',
  'function previewRedeem(uint256 shares) view returns (uint256)',
  'function deposit(uint256 assets, address receiver) nonpayable returns (uint256 shares)',
  'function withdraw(uint256 assets, address receiver, address owner) nonpayable returns (uint256 shares)',
  'function redeem(uint256 shares, address receiver, address owner) nonpayable returns (uint256 assets)',
  'event Rebalanced(address indexed oldVault, address indexed newVault, uint256 assetsWithdrawn, uint256 assetsDeployed, uint256 timestamp)',
])

export function formatUsdc(value: bigint, decimals = 2): string {
  return (Number(value) / 1e6).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatShares(value: bigint, decimals = 4): string {
  return (Number(value) / 1e6).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function parseUsdc(value: string): bigint {
  const n = parseFloat(value)
  if (isNaN(n) || n <= 0) return 0n
  return BigInt(Math.floor(n * 1e6))
}
