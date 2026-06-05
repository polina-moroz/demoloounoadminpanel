import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Radio, Flag, Coins, BadgeCheck,
  Gift, Package, Trophy, Star, Bell, Settings, X, Dices
} from 'lucide-react'

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
      { to: '/gift-catalog', icon: Gift, label: 'Gift Catalog' },
      { to: '/coin-packages', icon: Package, label: 'Coin Packages' },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { to: '/competitions', icon: Trophy, label: 'Competitions' },
      { to: '/prestige', icon: Star, label: 'Prestige' },
      { to: '/fortune-wheel', icon: Dices, label: 'Fortune Wheel' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/notifications', icon: Bell, label: 'Notifications' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
          <div className="sidebar-footer-avatar">C</div>
          <div className="sidebar-footer-info">
            <div className="name">Cyrus</div>
            <div className="role">Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
