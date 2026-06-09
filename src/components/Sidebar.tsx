import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Radio, Flag, Coins, BadgeCheck,
  Gift, Package, Trophy, Star, Bell, Settings, X, Dices,
  Shield, LogOut, ShieldAlert,
} from 'lucide-react'
import { useStore } from '../store'

const roleLabel: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
  support: 'Support',
  viewer: 'Viewer',
}

const sections = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/users', icon: Users, label: 'Users' },
      { to: '/streams', icon: Radio, label: 'Streams' },
      { to: '/reports', icon: Flag, label: 'Reports' },
    ],
  },
  {
    label: 'Economy',
    items: [
      { to: '/economy', icon: Coins, label: 'Economy' },
      { to: '/kyc', icon: BadgeCheck, label: 'KYC' },
      { to: '/fraud-detect', icon: ShieldAlert, label: 'Fraud Detection' },
      { to: '/gift-catalog', icon: Gift, label: 'Gift Catalog' },
      { to: '/coin-packages', icon: Package, label: 'Coin Packages' },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { to: '/competitions', icon: Trophy, label: 'Competitions' },
      { to: '/prestige', icon: Star, label: 'XP & Levels' },
      { to: '/fortune-wheel', icon: Dices, label: 'Fortune Wheel' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/notifications', icon: Bell, label: 'Notifications' },
      { to: '/admin-team', icon: Shield, label: 'Admin Team' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentAdmin, logout } = useStore()

  const displayName = currentAdmin?.displayName ?? 'Admin'
  const displayRole = roleLabel[currentAdmin?.role ?? 'admin'] ?? 'Admin'
  const avatarLetter = displayName[0]?.toUpperCase() ?? 'A'
  const avatarColor = currentAdmin?.avatarColor ?? 'var(--gold)'

  return (
    <aside className={`sidebar${isOpen ? ' mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-ring">
          <span>L</span>
        </div>
        <div className="sidebar-logo-text">
          <span className="name">Loouno</span>
          <span className="label">Admin</span>
        </div>
        <button className="sidebar-close-btn" onClick={onClose} title="Close menu" aria-label="Close navigation">
          <X size={14} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-nav-item${isActive ? ' active' : ''}`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-user">
          <div
            className="sidebar-footer-avatar"
            style={{ background: avatarColor, color: avatarColor === '#D4AF37' ? '#000' : '#fff' }}
          >
            {avatarLetter}
          </div>
          <div className="sidebar-footer-info">
            <div className="name">{displayName}</div>
            <div className="role">{displayRole}</div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-muted)', padding: '4px',
              borderRadius: 6, display: 'flex', alignItems: 'center',
              flexShrink: 0, transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E74C3C')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
