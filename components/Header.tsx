'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useFakeMode } from '@/lib/fakeMode'
import { FAKE } from '@/lib/fakeData'

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function Header() {
  const { fakeMode, toggleFakeMode } = useFakeMode()

  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
            U
          </div>
          <div>
            <p className="font-semibold text-white leading-none">UMYO</p>
            <p className="text-xs text-white/40 leading-none mt-0.5">USDC Morpho Yield Optimizer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            Base
          </span>

          <button
            onClick={toggleFakeMode}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              fakeMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'border-white/10 text-white/30 hover:text-white/50 hover:border-white/20'
            }`}
          >
            {fakeMode ? 'Demo ON' : 'Demo'}
          </button>

          {fakeMode ? (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
              <span className="text-xs text-white/70 font-mono hidden sm:block">
                {shortAddr(FAKE.walletAddress)}
              </span>
            </div>
          ) : (
            <ConnectButton
              accountStatus="avatar"
              chainStatus="none"
              showBalance={false}
            />
          )}
        </div>
      </div>
    </header>
  )
}
