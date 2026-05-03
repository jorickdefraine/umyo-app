export const FAKE = {
  tvl: '$47,823.50',
  apy: '8.42%',
  sharePrice: '$1.008742',
  vumy: '12,234.5600 vUMYO',
  withdrawable: '$12,340.89',
  walletUsdc: '$3,250.00',
  walletAddress: '0x71Ab3c4D2e58FB9a01c3E5d72f4aB81E90cC3d2f' as `0x${string}`,

  // bigints for VaultActions logic (6 decimals like USDC)
  usdcBalanceBigInt: 3_250_000_000n,
  vumyBigInt: 12_234_560_000n,
  maxWithdrawBigInt: 12_340_890_000n,
  allowanceBigInt: 999_999_999_999_999n,

  rebalances: [
    {
      oldVault: '0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB',
      newVault: '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca',
      deployed: '$47,823.50',
      date: 'Apr 28, 04:12 AM',
    },
    {
      oldVault: '0x78Fc2c2eD1A4cDb5402365934aE5648aDAd094d0',
      newVault: '0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB',
      deployed: '$43,102.20',
      date: 'Apr 10, 11:35 PM',
    },
    {
      oldVault: '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca',
      newVault: '0x78Fc2c2eD1A4cDb5402365934aE5648aDAd094d0',
      deployed: '$35,750.45',
      date: 'Mar 22, 09:17 AM',
    },
    {
      oldVault: '0x0000000000000000000000000000000000000000',
      newVault: '0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB',
      deployed: '$18,200.00',
      date: 'Feb 28, 02:44 PM',
    },
  ],
} as const
