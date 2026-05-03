import { Header } from '@/components/Header'
import { VaultStats } from '@/components/VaultStats'
import { VaultActions } from '@/components/VaultActions'
import { ActivityFeed } from '@/components/ActivityFeed'

export default function VaultPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Vault Dashboard</h1>
          <p className="text-white/40 text-sm">
            Your USDC earns optimized yield, automatically rebalanced across Morpho vaults on Base.
          </p>
        </div>

        <VaultStats />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <VaultActions />
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-white/20">
        UMYO runs on Base · vUMYO is an ERC-4626 vault share
      </footer>
    </div>
  )
}
