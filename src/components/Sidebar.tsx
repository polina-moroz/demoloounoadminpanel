import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Radio, Flag, Coins, BadgeCheck,
  Gift, Package, Trophy, Star, Bell, Settings, X, Dices,
  Shield, LogOut, ShieldAlert, Pencil,
} from 'lucide-react'
import { useStore } from '../store'

const roleLabel: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
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
  const { currentAdmin, logout, updateAdminMember } = useStore()
  const [editOpen, setEditOpen] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftEmail, setDraftEmail] = useState('')

  const displayName = currentAdmin?.displayName ?? 'Admin'
  const displayRole = roleLabel[currentAdmin?.role ?? 'admin'] ?? 'Admin'
  const avatarLetter = displayName[0]?.toUpperCase() ?? 'A'
  const avatarColor = currentAdmin?.avatarColor ?? 'var(--gold)'

  function openEdit() {
    setDraftName(currentAdmin?.displayName ?? '')
    setDraftEmail(currentAdmin?.email ?? '')
    setEditOpen(true)
  }

  function saveEdit() {
    if (!currentAdmin) return
    const name = draftName.trim()
    const email = draftEmail.trim()
    if (!name || !email) return
    updateAdminMember(currentAdmin.id, { displayName: name, email })
    setEditOpen(false)
  }

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
            onClick={openEdit}
            title="Edit profile"
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-muted)', padding: '4px',
              borderRadius: 6, display: 'flex', alignItems: 'center',
              flexShrink: 0, transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={logout}
            title="Sign out"
            style={{
              background: 'none', border: 'none',
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

      {editOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={e => { if (e.target === e.currentTarget) setEditOpen(false) }}
        >
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 24, width: 360, display: 'flex',
            flexDirection: 'column', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Edit Profile</span>
              <button
                onClick={() => setEditOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, display: 'flex' }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Display Name</label>
              <input
                value={draftName}
                onChange={e => setDraftName(e.target.value)}
                placeholder="Your name"
                style={{
                  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '8px 12px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={draftEmail}
                onChange={e => setDraftEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '8px 12px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button
                onClick={() => setEditOpen(false)}
                style={{
                  background: 'none', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '8px 16px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13,
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={!draftName.trim() || !draftEmail.trim()}
                style={{
                  background: 'var(--gold)', border: 'none', borderRadius: 8,
                  padding: '8px 16px', color: '#000', cursor: 'pointer', fontSize: 13,
                  fontWeight: 600, opacity: (!draftName.trim() || !draftEmail.trim()) ? 0.5 : 1,
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
