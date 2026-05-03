'use client'

import { useState, useEffect } from 'react'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { erc20Abi } from 'viem'
import { VAULT_ADDRESS, USDC_ADDRESS, vaultAbi, formatUsdc, formatShares, parseUsdc } from '@/lib/contracts'
import { useFakeMode } from '@/lib/fakeMode'
import { FAKE } from '@/lib/fakeData'

type Tab = 'deposit' | 'withdraw'
type WithdrawMode = 'usdc' | 'shares'

export function VaultActions() {
  const { address, isConnected } = useAccount()
  const { fakeMode } = useFakeMode()
  const [tab, setTab] = useState<Tab>('deposit')
  const [amount, setAmount] = useState('')
  const [withdrawMode, setWithdrawMode] = useState<WithdrawMode>('usdc')

  const isDeployed = fakeMode ? true : !!VAULT_ADDRESS
  const effectiveIsConnected = fakeMode ? true : isConnected
  const amountBigInt = parseUsdc(amount)

  // ── Reads ─────────────────────────────────────────────────────────────────

  const { data: usdcBalanceRaw, refetch: refetchUsdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address && !fakeMode },
  })

  const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address, VAULT_ADDRESS] : undefined,
    query: { enabled: isConnected && !!address && !!VAULT_ADDRESS && !fakeMode },
  })

  const { data: vUmyoBalanceRaw, refetch: refetchVUmyoBalance } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address && !!VAULT_ADDRESS && !fakeMode },
  })

  const { data: maxWithdrawableRaw } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'maxWithdraw',
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address && !!VAULT_ADDRESS && !fakeMode },
  })

  const usdcBalance = fakeMode ? FAKE.usdcBalanceBigInt : usdcBalanceRaw
  const allowance = fakeMode ? FAKE.allowanceBigInt : allowanceRaw
  const vUmyoBalance = fakeMode ? FAKE.vumyBigInt : vUmyoBalanceRaw
  const maxWithdrawable = fakeMode ? FAKE.maxWithdrawBigInt : maxWithdrawableRaw

  const { data: depositPreview } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'previewDeposit',
    args: amountBigInt > 0n ? [amountBigInt] : undefined,
    query: { enabled: tab === 'deposit' && amountBigInt > 0n && !!VAULT_ADDRESS && !fakeMode },
  })

  const withdrawAmountBigInt = withdrawMode === 'usdc' ? amountBigInt : 0n
  const redeemSharesBigInt = withdrawMode === 'shares' ? amountBigInt : 0n

  const { data: withdrawPreview } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'previewWithdraw',
    args: withdrawAmountBigInt > 0n ? [withdrawAmountBigInt] : undefined,
    query: { enabled: tab === 'withdraw' && withdrawMode === 'usdc' && withdrawAmountBigInt > 0n && !!VAULT_ADDRESS && !fakeMode },
  })

  const { data: redeemPreview } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: 'previewRedeem',
    args: redeemSharesBigInt > 0n ? [redeemSharesBigInt] : undefined,
    query: { enabled: tab === 'withdraw' && withdrawMode === 'shares' && redeemSharesBigInt > 0n && !!VAULT_ADDRESS && !fakeMode },
  })

  // ── Writes ────────────────────────────────────────────────────────────────

  const { writeContract: writeApprove, data: approveTxHash, isPending: isApprovePending } = useWriteContract()
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveTxHash })

  const { writeContract: writeDeposit, data: depositTxHash, isPending: isDepositPending } = useWriteContract()
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({ hash: depositTxHash })

  const { writeContract: writeWithdraw, data: withdrawTxHash, isPending: isWithdrawPending } = useWriteContract()
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawTxHash })

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isApproveSuccess) refetchAllowance()
  }, [isApproveSuccess, refetchAllowance])

  useEffect(() => {
    if (isDepositSuccess) {
      setAmount('')
      refetchUsdcBalance()
      refetchVUmyoBalance()
      refetchAllowance()
    }
  }, [isDepositSuccess, refetchUsdcBalance, refetchVUmyoBalance, refetchAllowance])

  useEffect(() => {
    if (isWithdrawSuccess) {
      setAmount('')
      refetchUsdcBalance()
      refetchVUmyoBalance()
    }
  }, [isWithdrawSuccess, refetchUsdcBalance, refetchVUmyoBalance])

  // ── Derived state ─────────────────────────────────────────────────────────

  const needsApproval = allowance !== undefined && amountBigInt > 0n && allowance < amountBigInt
  const hasEnoughUsdc = usdcBalance !== undefined && amountBigInt > 0n && usdcBalance >= amountBigInt

  const depositButtonBusy = isApprovePending || isApproveConfirming || isDepositPending || isDepositConfirming
  const withdrawButtonBusy = isWithdrawPending || isWithdrawConfirming

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleApprove() {
    writeApprove({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [VAULT_ADDRESS, amountBigInt],
    })
  }

  function handleDeposit() {
    if (!address) return
    writeDeposit({
      address: VAULT_ADDRESS,
      abi: vaultAbi,
      functionName: 'deposit',
      args: [amountBigInt, address],
    })
  }

  function handleWithdraw() {
    if (!address) return
    if (withdrawMode === 'usdc') {
      writeWithdraw({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        functionName: 'withdraw',
        args: [withdrawAmountBigInt, address, address],
      })
    } else {
      writeWithdraw({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        functionName: 'redeem',
        args: [redeemSharesBigInt, address, address],
      })
    }
  }

  function setMax() {
    if (tab === 'deposit' && usdcBalance != null) {
      setAmount((Number(usdcBalance) / 1e6).toString())
    } else if (tab === 'withdraw') {
      if (withdrawMode === 'usdc' && maxWithdrawable != null) {
        setAmount((Number(maxWithdrawable) / 1e6).toString())
      } else if (withdrawMode === 'shares' && vUmyoBalance != null) {
        setAmount((Number(vUmyoBalance) / 1e6).toString())
      }
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (!isDeployed) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
        <p className="text-yellow-400 font-medium">Contract not deployed</p>
        <p className="text-white/40 text-sm mt-1">
          Set <code className="font-mono text-xs bg-white/10 px-1 py-0.5 rounded">NEXT_PUBLIC_VAULT_ADDRESS</code> to enable vault interactions.
        </p>
      </div>
    )
  }

  if (!effectiveIsConnected) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
        <p className="text-white/60">Connect your wallet to deposit or withdraw.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {(['deposit', 'withdraw'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setAmount('') }}
            className={`flex-1 py-3.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? 'text-white border-b-2 border-blue-500'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {/* Withdraw mode toggle */}
        {tab === 'withdraw' && (
          <div className="flex gap-2">
            {(['usdc', 'shares'] as WithdrawMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setWithdrawMode(m); setAmount('') }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  withdrawMode === m
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                    : 'border-white/10 text-white/40 hover:text-white/60'
                }`}
              >
                {m === 'usdc' ? 'By USDC amount' : 'By vUMYO shares'}
              </button>
            ))}
          </div>
        )}

        {/* Balance line */}
        <div className="flex justify-between text-xs text-white/40">
          <span>
            {tab === 'deposit'
              ? `Balance: $${usdcBalance != null ? formatUsdc(usdcBalance) : '…'} USDC`
              : withdrawMode === 'usdc'
              ? `Max withdrawable: $${maxWithdrawable != null ? formatUsdc(maxWithdrawable) : '…'} USDC`
              : `Balance: ${vUmyoBalance != null ? formatShares(vUmyoBalance) : '…'} vUMYO`}
          </span>
          <button onClick={setMax} className="text-blue-400 hover:text-blue-300 font-medium">
            MAX
          </button>
        </div>

        {/* Amount input */}
        <div className="relative">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-lg text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">
            {tab === 'deposit' ? 'USDC' : withdrawMode === 'usdc' ? 'USDC' : 'vUMYO'}
          </span>
        </div>

        {/* Preview */}
        {tab === 'deposit' && depositPreview != null && amountBigInt > 0n && (
          <p className="text-xs text-white/40">
            ≈ <span className="text-white/70">{formatShares(depositPreview as bigint)} vUMYO</span> received
          </p>
        )}
        {tab === 'withdraw' && withdrawMode === 'usdc' && withdrawPreview != null && withdrawAmountBigInt > 0n && (
          <p className="text-xs text-white/40">
            Burns ≈ <span className="text-white/70">{formatShares(withdrawPreview as bigint)} vUMYO</span>
          </p>
        )}
        {tab === 'withdraw' && withdrawMode === 'shares' && redeemPreview != null && redeemSharesBigInt > 0n && (
          <p className="text-xs text-white/40">
            ≈ <span className="text-white/70">${formatUsdc(redeemPreview as bigint)} USDC</span> received
          </p>
        )}

        {/* Action buttons */}
        {tab === 'deposit' ? (
          <div className="space-y-2">
            {needsApproval && (
              <button
                onClick={handleApprove}
                disabled={depositButtonBusy || amountBigInt === 0n}
                className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isApprovePending || isApproveConfirming ? 'Approving…' : 'Step 1: Approve USDC'}
              </button>
            )}
            <button
              onClick={handleDeposit}
              disabled={depositButtonBusy || needsApproval || amountBigInt === 0n || !hasEnoughUsdc}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isDepositPending || isDepositConfirming ? 'Depositing…' : needsApproval ? 'Step 2: Deposit' : 'Deposit'}
            </button>
            {isDepositSuccess && (
              <p className="text-xs text-green-400 text-center">Deposit confirmed!</p>
            )}
            {!hasEnoughUsdc && amountBigInt > 0n && (
              <p className="text-xs text-red-400 text-center">Insufficient USDC balance</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleWithdraw}
              disabled={withdrawButtonBusy || amountBigInt === 0n}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isWithdrawPending || isWithdrawConfirming ? 'Withdrawing…' : 'Withdraw'}
            </button>
            {isWithdrawSuccess && (
              <p className="text-xs text-green-400 text-center">Withdrawal confirmed!</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
