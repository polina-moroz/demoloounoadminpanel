import { useLocation } from 'react-router-dom'
import { Bell, Search, Menu } from 'lucide-react'

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Platform overview' },
  '/users': { title: 'Users', subtitle: 'Manage accounts and access' },
  '/streams': { title: 'Streams', subtitle: 'Live and past stream activity' },
  '/reports': { title: 'Reports', subtitle: 'User-submitted flags and moderation' },
  '/economy': { title: 'Economy', subtitle: 'Withdrawals, transactions, and revenue' },
  '/kyc': { title: 'KYC Verification', subtitle: 'Identity verification powered by Stripe' },
  '/gift-catalog': { title: 'Gift Catalog', subtitle: 'Manage virtual gifts and pricing' },
  '/coin-packages': { title: 'Coin Packages', subtitle: 'In-app and website purchase tiers' },
  '/competitions': { title: 'Competitions', subtitle: 'Monthly leaderboard and prize config' },
  '/prestige': { title: 'Prestige System', subtitle: 'XP levels, SP tiers, and VIP ranks' },
  '/notifications': { title: 'Notifications', subtitle: 'Send push notifications to users' },
  '/settings': { title: 'Settings', subtitle: 'Platform configuration and policies' },
}

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation()
  const meta = pageMeta[location.pathname] ?? { title: 'Loouno Admin', subtitle: '' }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-hamburger" onClick={onMenuClick} title="Menu" aria-label="Open navigation">
          <Menu size={18} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="topbar-title">{meta.title}</span>
          {meta.subtitle && <span className="topbar-subtitle">{meta.subtitle}</span>}
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-phase-badge">
          <span className="dot" />
          Closed Testing
        </div>
        <button className="topbar-icon-btn" title="Search">
          <Search />
        </button>
        <button className="topbar-icon-btn" title="Notifications">
          <Bell />
        </button>
      </div>
    </header>
  )
}
