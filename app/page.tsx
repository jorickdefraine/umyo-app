import Link from 'next/link'
import { LandingApy } from '@/components/LandingApy'

function IconDeposit() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M9 13l3 3 3-3" />
    </svg>
  )
}

function IconOptimize() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12a7.5 7.5 0 0 1 13.5-4.5" />
      <path d="M19.5 12a7.5 7.5 0 0 1-13.5 4.5" />
      <path d="M16 7.5l2 .5.5-2" />
      <path d="M8 16.5l-2-.5-.5 2" />
    </svg>
  )
}

function IconWithdraw() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16V8M9 11l3-3 3 3" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4v5c0 5-3.5 9-8 10C7.5 21 4 17 4 12V7l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function IconAuto() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

function IconLink() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function IconUnlock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-10 border-b border-white/10 bg-black/50 backdrop-blur-sm">
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
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              Base
            </span>
            <Link
              href="/vault"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-20 px-4 sm:px-6 text-center overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(ellipse 90% 50% at 50% -5%, rgba(59,130,246,0.13) 0%, transparent 100%)',
            }}
          />

          <div className="max-w-3xl mx-auto">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/50 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Live on Base · Non-custodial · ERC-4626
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
              Your USDC,{' '}
              <span className="text-white/50">always</span>
              <br />
              earning.
            </h1>

            <p className="text-lg text-white/40 max-w-xl mx-auto mb-12 leading-relaxed">
              UMYO automatically routes your deposits to the highest-yielding Morpho vault on Base — and rebalances whenever a better opportunity appears.
            </p>

            {/* APY showcase */}
            <div className="mb-12">
              <LandingApy />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vault"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
              >
                Deposit USDC →
              </Link>
              <a
                href="#how-it-works"
                className="border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 font-medium px-8 py-4 rounded-xl transition-colors text-base"
              >
                How it works
              </a>
            </div>
          </div>
        </section>

        {/* ── Comparison bar ──────────────────────────────────────────────── */}
        <section className="py-8 px-4 sm:px-6 border-y border-white/5">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-4 sm:gap-0 sm:divide-x sm:divide-white/10 text-center">
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-white/20">~0.5%</p>
                <p className="text-xs text-white/30">savings account</p>
              </div>
              <div className="space-y-1 sm:py-2">
                <p className="text-2xl sm:text-3xl font-bold text-white/20">~3%</p>
                <p className="text-xs text-white/30">ETH staking</p>
              </div>
              <div className="space-y-1 relative">
                <p className="text-2xl sm:text-3xl font-bold text-green-400"><LandingApy /></p>
                <p className="text-xs text-green-400/60">UMYO · USDC</p>
                <span className="absolute -top-1 -right-1 sm:right-0 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  best
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3">As simple as it gets</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Three steps. That&apos;s it.</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-7">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
                  <IconDeposit />
                </div>
                <span className="absolute top-7 right-7 text-xs text-white/15 font-mono">01</span>
                <h3 className="text-white font-semibold text-lg mb-2">Deposit</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Connect your wallet and deposit USDC. You receive vUMYO — ERC-4626 receipt tokens representing your share of the vault.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-7">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-5">
                  <IconOptimize />
                </div>
                <span className="absolute top-7 right-7 text-xs text-white/15 font-mono">02</span>
                <h3 className="text-white font-semibold text-lg mb-2">Earn</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  UMYO continuously monitors Morpho vaults on Base and automatically rebalances toward the best available APY.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-7">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
                  <IconWithdraw />
                </div>
                <span className="absolute top-7 right-7 text-xs text-white/15 font-mono">03</span>
                <h3 className="text-white font-semibold text-lg mb-2">Withdraw</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Redeem your vUMYO shares for USDC + accrued yield. No delay, no exit fee, no lock-up — anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why UMYO ─────────────────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Why UMYO</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Built to be trusted.</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex gap-5">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IconShield />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1.5">Non-custodial</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Your funds never pass through our hands. UMYO is a smart contract on Base — no one can block or touch your deposits.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex gap-5">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IconAuto />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1.5">Fully automated</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    No manual rate monitoring. UMYO handles everything — watches, compares, rebalances — so your yield is always optimized.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex gap-5">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IconLink />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1.5">ERC-4626 standard</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    vUMYO shares are composable tokens compatible with the entire DeFi ecosystem. Use them in other protocols or transfer freely.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex gap-5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IconUnlock />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1.5">No lock-up</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Withdraw anytime, with no penalty and no delay. Your USDC + yield are available whenever you want them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Morpho trust section ─────────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-white/20 uppercase tracking-widest mb-6">Powered by</p>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">M</div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Morpho Protocol</p>
                <p className="text-white/30 text-xs">The most audited lending protocol on Base</p>
              </div>
            </div>
            <p className="text-white/25 text-sm mt-6 max-w-md mx-auto leading-relaxed">
              UMYO doesn&apos;t invent risk — it selects the best audited, battle-tested Morpho USDC vaults and routes your funds there.
            </p>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 100%)',
            }}
          />
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Your USDC is sleeping. <br />
              <span className="text-white/40">It could be earning.</span>
            </h2>
            <p className="text-white/35 text-base mb-10 leading-relaxed">
              Join UMYO and start generating yield on your stablecoins — automatically, safely, on Base.
            </p>
            <Link
              href="/vault"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl transition-colors text-base"
            >
              Deposit USDC →
            </Link>
            <p className="text-white/20 text-xs mt-5">
              Wallet required · Works with MetaMask, Coinbase Wallet, Rainbow and 60+ others
            </p>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center font-bold text-white text-[10px]">U</div>
            <span>UMYO · USDC Morpho Yield Optimizer</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Base Network</span>
            <span>·</span>
            <span>ERC-4626</span>
            <span>·</span>
            <span>Non-custodial</span>
            <span>·</span>
            <Link href="/vault" className="hover:text-white/50 transition-colors">App →</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
