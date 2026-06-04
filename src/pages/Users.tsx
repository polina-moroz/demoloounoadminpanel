import { useState } from 'react'
import { Eye, AlertTriangle, PauseCircle, Ban, X, Radio, Wallet, Flag, RotateCcw, Star, WifiOff } from 'lucide-react'
import Badge, { statusLabel } from '../components/Badge'
import { useStore } from '../store'
import type { User, UserStatus } from '../types'

type FilterTab = 'all' | UserStatus

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'banned', label: 'Banned' },
  { key: 'unverified', label: 'Unverified' },
]

interface SlideOverProps {
  user: User | null
  onClose: () => void
  onWarn: (id: string) => void
  onSuspend: (id: string) => void
  onBan: (id: string) => void
  onReinstate: (id: string) => void
  onPromote: (id: string) => void
  onDemote: (id: string) => void
  onIPBan: (id: string) => void
}

function UserSlideOver({ user, onClose, onWarn, onSuspend, onBan, onReinstate, onPromote, onDemote, onIPBan }: SlideOverProps) {
  const { streams, reports } = useStore()
  if (!user) return null
  const userStreams = streams.filter(s => s.streamerHandle === user.handle)
  const userReports = reports.filter(r => r.targetHandle === user.handle)

  const canReinstate = user.status === 'suspended' || user.status === 'banned'

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over open">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>User Details</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
          {/* Profile */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 24, alignItems: 'flex-start' }}>
            <div className="avatar avatar-lg" style={{ background: user.avatarColor }}>
              {user.displayName[0]}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{user.displayName}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>@{user.handle}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge variant={user.status} dot>{statusLabel(user.status)}</Badge>
                <Badge variant={user.role} dot={false}>{user.role}</Badge>
                <Badge variant={user.kyc} dot>{statusLabel(user.kyc)}</Badge>
                {user.isTopStreamer && (
                  <span className="badge badge-top-streamer">⭐ Top Streamer</span>
                )}
                {user.isIPBanned && (
                  <span className="badge badge-ip-banned">🚫 IP Banned</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { icon: <Radio size={14} />, label: 'Streams', value: user.totalStreams },
              { icon: null, label: 'Followers', value: user.followers.toLocaleString() },
              { icon: <Wallet size={14} />, label: 'Wallet Balance', value: `${user.walletBalance.toLocaleString()} 💎` },
              { icon: null, label: 'Total Earned', value: `${user.totalEarned.toLocaleString()} 💎` },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Info rows */}
          {[
            { label: 'Email', value: user.email },
            { label: 'Country', value: user.country },
            { label: 'Joined', value: user.joined },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{row.label}</span>
              <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}

          {/* Recent Streams */}
          {userStreams.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-secondary)' }}>Recent Streams ({userStreams.length})</div>
              {userStreams.slice(0, 3).map(s => (
                <div key={s.id} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{s.duration} · {s.peakViewers.toLocaleString()} peak viewers · {s.diamondsEarned.toLocaleString()} 💎</div>
                </div>
              ))}
            </div>
          )}

          {/* Reports */}
          {userReports.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Flag size={13} style={{ color: 'var(--ruby-bright)' }} />
                Reports Against ({userReports.length})
              </div>
              {userReports.map(r => (
                <div key={r.id} style={{ background: 'rgba(155,17,30,0.06)', border: '1px solid rgba(155,17,30,0.15)', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.reason}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>by @{r.reporterHandle} · {new Date(r.reportedAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-warn btn-sm" onClick={() => { onWarn(user.id); onClose() }}>
              <AlertTriangle size={12} /> Warn
            </button>
            {user.status !== 'suspended' && user.status !== 'banned' && (
              <button className="btn btn-secondary btn-sm" onClick={() => { onSuspend(user.id); onClose() }}>
                <PauseCircle size={12} /> Suspend
              </button>
            )}
            {user.status !== 'banned' && (
              <button className="btn btn-danger btn-sm" onClick={() => { onBan(user.id); onClose() }}>
                <Ban size={12} /> Ban
              </button>
            )}
            {!user.isIPBanned && (
              <button className="btn btn-danger btn-sm" onClick={() => { onIPBan(user.id); onClose() }}
                title="Permanently block this device from the platform">
                <WifiOff size={12} /> IP Ban
              </button>
            )}
            {canReinstate && (
              <button className="btn btn-success btn-sm" onClick={() => { onReinstate(user.id); onClose() }}>
                <RotateCcw size={12} /> Reinstate
              </button>
            )}
          </div>

          {/* Top Streamer promotion */}
          {user.role === 'creator' && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: 8 }}>Trending Promotion</div>
              {user.isTopStreamer ? (
                <button className="btn btn-secondary btn-sm" onClick={() => { onDemote(user.id); onClose() }}>
                  <Star size={12} /> Remove Top Streamer Badge
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => { onPromote(user.id); onClose() }}>
                  <Star size={12} /> Promote to Top Streamer
                </button>
              )}
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                Top Streamers appear first on the trending page and receive a ⭐ badge.
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default function Users() {
  const { users, warnUser, setUserStatus, promoteTopStreamer, demoteTopStreamer, ipBanUser } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterTab>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // keep slide-over in sync with live state
  const liveSelectedUser = selectedUser ? users.find(u => u.id === selectedUser.id) ?? null : null

  const filtered = users.filter(u => {
    const matchFilter = filter === 'all' || u.status === filter
    const matchSearch =
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.handle.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Users</div>
          <div className="subtitle">Manage all user accounts</div>
        </div>
        <div className="page-header-actions">
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {filtered.length} of {users.length} users
          </span>
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            className="search-input"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {filterTabs.map(t => (
            <button
              key={t.key}
              className={`filter-tab${filter === t.key ? ' active' : ''}`}
              onClick={() => setFilter(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Followers</th>
                <th>KYC</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="avatar-row">
                      <div className="avatar" style={{ background: u.avatarColor }}>
                        {u.displayName[0]}
                      </div>
                      <div>
                        <div className="user-name">{u.displayName}</div>
                        <div className="user-handle">@{u.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td><Badge variant={u.role} dot={false}>{u.role}</Badge></td>
                  <td><Badge variant={u.status} dot>{statusLabel(u.status)}</Badge></td>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{u.joined}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.followers.toLocaleString()}</td>
                  <td><Badge variant={u.kyc} dot>{statusLabel(u.kyc)}</Badge></td>
                  <td>
                    {u.isTopStreamer ? (
                      <span className="badge badge-top-streamer" style={{ cursor: 'pointer' }}
                        title="Remove Top Streamer badge"
                        onClick={() => demoteTopStreamer(u.id)}>
                        ⭐ Top
                      </span>
                    ) : u.role === 'creator' ? (
                      <button className="btn btn-ghost btn-sm" title="Promote to Top Streamer"
                        onClick={() => promoteTopStreamer(u.id)}
                        style={{ fontSize: 10, padding: '3px 8px' }}>
                        <Star size={11} /> Promote
                      </button>
                    ) : <span style={{ color: 'var(--text-subtle)', fontSize: 12 }}>—</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-icon" title="View" onClick={() => setSelectedUser(u)}>
                        <Eye size={13} />
                      </button>
                      <button className="btn btn-warn btn-icon" title="Warn" onClick={() => warnUser(u.id)}>
                        <AlertTriangle size={13} />
                      </button>
                      {u.status === 'active' || u.status === 'unverified' ? (
                        <button className="btn btn-secondary btn-icon" title="Suspend" onClick={() => setUserStatus(u.id, 'suspended')}>
                          <PauseCircle size={13} />
                        </button>
                      ) : u.status === 'suspended' ? (
                        <button className="btn btn-success btn-icon" title="Reinstate" onClick={() => setUserStatus(u.id, 'active')}>
                          <RotateCcw size={13} />
                        </button>
                      ) : null}
                      {u.status !== 'banned' ? (
                        <button className="btn btn-danger btn-icon" title="Ban" onClick={() => setUserStatus(u.id, 'banned')}>
                          <Ban size={13} />
                        </button>
                      ) : (
                        <button className="btn btn-success btn-icon" title="Unban" onClick={() => setUserStatus(u.id, 'active')}>
                          <RotateCcw size={13} />
                        </button>
                      )}
                      {!u.isIPBanned && (
                        <button className="btn btn-danger btn-icon" title="IP Ban — permanently block device"
                          onClick={() => ipBanUser(u.id)}>
                          <WifiOff size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserSlideOver
        user={liveSelectedUser}
        onClose={() => setSelectedUser(null)}
        onWarn={warnUser}
        onSuspend={id => setUserStatus(id, 'suspended')}
        onBan={id => setUserStatus(id, 'banned')}
        onReinstate={id => setUserStatus(id, 'active')}
        onPromote={promoteTopStreamer}
        onDemote={demoteTopStreamer}
        onIPBan={ipBanUser}
      />
    </div>
  )
}
