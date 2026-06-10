import { useState } from 'react'
import { Eye, AlertTriangle, PauseCircle, Ban, X, Radio, Wallet, Flag, RotateCcw, Star, PlusCircle, MinusCircle, Receipt, ChevronDown, ChevronRight, CheckCircle, XCircle, RefreshCw, ScrollText } from 'lucide-react'
import Badge, { statusLabel } from '../components/Badge'
import WarnModal from '../components/WarnModal'
import WarnMessagesEditor from '../components/WarnMessagesEditor'
import TxHistoryModal from '../components/TxHistoryModal'
import ActionLogModal from '../components/ActionLogModal'
import { useStore } from '../store'
import { mockTransactions } from '../mockData'
import type { User, UserStatus, Report } from '../types'

/* ── User Reports Modal ───────────────────────────────────────── */

const reportStatusMeta: Record<Report['status'], { color: string; label: string }> = {
  pending:   { color: '#F39C12', label: 'Pending'   },
  resolved:  { color: '#2ECC8A', label: 'Resolved'  },
  dismissed: { color: '#8A8A8E', label: 'Dismissed' },
}

const logActionMeta: Record<string, { color: string; label: string }> = {
  warned:    { color: '#F39C12', label: 'Warned'    },
  banned:    { color: '#E74C3C', label: 'Banned'    },
  resolved:  { color: '#2ECC8A', label: 'Resolved'  },
  dismissed: { color: '#8A8A8E', label: 'Dismissed' },
  reopened:  { color: '#3498DB', label: 'Reopened'  },
}

function UserReportsModal({ user, reports, onClose }: {
  user: User
  reports: Report[]
  onClose: () => void
}) {
  const { resolveReport, dismissReport, reopenReport } = useStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const pendingCount = reports.filter(r => r.status === 'pending').length

  return (
    <div className="modal-overlay" style={{ zIndex: 350 }} onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 560, maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(155,17,30,0.12)', border: '1px solid rgba(155,17,30,0.25)',
            }}>
              <Flag size={14} color="var(--ruby-bright)" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Reports Against @{user.handle}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                {reports.length} total
                {pendingCount > 0 && (
                  <span style={{ marginLeft: 6, color: '#F39C12', fontWeight: 600 }}>· {pendingCount} pending</span>
                )}
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        {/* body */}
        <div className="modal-body" style={{ overflowY: 'auto', padding: 0 }}>
          {reports.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No reports found for this user.
            </div>
          ) : reports.map((r, idx) => {
            const isOpen = expandedId === r.id
            const meta = reportStatusMeta[r.status]
            return (
              <div key={r.id} style={{ borderBottom: idx < reports.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                {/* row */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : r.id)}
                  style={{
                    width: '100%', padding: '13px 20px', display: 'flex', alignItems: 'center',
                    gap: 12, background: isOpen ? 'var(--bg-surface-2)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                  }}
                >
                  {/* status dot */}
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color, flexShrink: 0, marginTop: 1 }} />

                  {/* main info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.reason}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      by @{r.reporterHandle} · {new Date(r.reportedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      <span style={{
                        marginLeft: 8, fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20,
                        background: meta.color + '1A', color: meta.color,
                        textTransform: 'uppercase', letterSpacing: '0.3px',
                      }}>
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  {/* type chip */}
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, flexShrink: 0,
                    background: 'var(--bg-surface-3, #2A2A30)', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.3px',
                  }}>
                    {r.type}
                  </span>

                  {isOpen ? <ChevronDown size={14} color="var(--text-muted)" /> : <ChevronRight size={14} color="var(--text-muted)" />}
                </button>

                {/* expanded detail */}
                {isOpen && (
                  <div style={{ background: 'var(--bg-surface-2)', borderTop: '1px solid var(--border-subtle)', padding: '16px 20px 18px' }}>

                    {/* meta grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: 16 }}>
                      {[
                        { label: 'Report ID',  value: `#${r.id}` },
                        { label: 'Type',       value: r.type.charAt(0).toUpperCase() + r.type.slice(1) },
                        { label: 'Reporter',   value: `@${r.reporterHandle}` },
                        { label: 'Email',      value: r.reporter },
                        { label: 'Submitted',  value: new Date(r.reportedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                        { label: 'Status',     value: reportStatusMeta[r.status].label },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* description */}
                    {r.description && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 6 }}>Description</div>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0, padding: '10px 12px', background: 'var(--bg-base, #0F0F13)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                          {r.description}
                        </p>
                      </div>
                    )}

                    {/* action log */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 8 }}>
                        Action Log {r.log && r.log.length > 0 ? `(${r.log.length})` : ''}
                      </div>
                      {r.log && r.log.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {r.log.map(entry => {
                            const lm = logActionMeta[entry.action] ?? { color: '#8A8A8E', label: entry.action }
                            return (
                              <div key={entry.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12 }}>
                                <span style={{
                                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, flexShrink: 0,
                                  background: lm.color + '1A', color: lm.color,
                                  textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 1,
                                }}>
                                  {lm.label}
                                </span>
                                <div style={{ color: 'var(--text-secondary)', flex: 1 }}>
                                  {entry.note && <span>{entry.note} · </span>}
                                  <span style={{ color: 'var(--text-muted)' }}>
                                    {entry.adminName} · {new Date(entry.timestamp).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>No actions taken yet.</span>
                      )}
                    </div>

                    {/* divider */}
                    <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 14 }} />

                    {/* action buttons */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {r.status !== 'resolved' && (
                        <button className="btn btn-success btn-sm" onClick={() => resolveReport(r.id)}>
                          <CheckCircle size={12} /> Resolve
                        </button>
                      )}
                      {r.status !== 'dismissed' && (
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }} onClick={() => dismissReport(r.id)}>
                          <XCircle size={12} /> Dismiss
                        </button>
                      )}
                      {(r.status === 'resolved' || r.status === 'dismissed') && (
                        <button className="btn btn-secondary btn-sm" onClick={() => reopenReport(r.id)}>
                          <RefreshCw size={12} /> Reopen
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

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
  onWarn: (id: string, message: string) => void
  onSuspend: (id: string) => void
  onReinstate: (id: string) => void
  onPromote: (id: string) => void
  onDemote: (id: string) => void
  onIPBan: (id: string) => void
  onAdjustBalance: (id: string, delta: number, reason: string) => void
  onViewLog: () => void
}

function UserSlideOver({ user, onClose, onWarn, onSuspend, onReinstate, onPromote, onDemote, onIPBan, onAdjustBalance, onViewLog }: SlideOverProps) {
  const { streams, reports } = useStore()
  const [balanceAmount, setBalanceAmount] = useState('')
  const [balanceReason, setBalanceReason] = useState('')
  const [txOpen, setTxOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  const [warnOpen, setWarnOpen] = useState(false)
  if (!user) return null
  const userStreams = streams.filter(s => s.streamerHandle === user.handle)
  const userReports = reports.filter(r => r.targetHandle === user.handle)
  const userTxs = mockTransactions.filter(t => t.userHandle === user.handle)
  const pendingReports = userReports.filter(r => r.status === 'pending').length

  const canReinstate = user.status === 'suspended' || user.status === 'banned'

  return (
    <>
      {txOpen && <TxHistoryModal userHandle={user.handle} userName={user.displayName} transactions={userTxs} onClose={() => setTxOpen(false)} />}
      {reportsOpen && <UserReportsModal user={user} reports={userReports} onClose={() => setReportsOpen(false)} />}
      {warnOpen && (
        <WarnModal
          targetLabel={`@${user.handle}`}
          onConfirm={msg => onWarn(user.id, msg)}
          onClose={() => setWarnOpen(false)}
        />
      )}
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over open">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>User Details</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setTxOpen(true)}
              style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <Receipt size={13} />
              Transactions{userTxs.length > 0 ? ` (${userTxs.length})` : ''}
            </button>
            <button className="modal-close" onClick={onClose}><X size={14} /></button>
          </div>
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
                  <span className="badge badge-top-streamer">⭐ Star Badge</span>
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

          {/* Balance adjustment */}
          <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wallet size={13} style={{ color: 'var(--amethyst)' }} /> Adjust Balance
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="form-input"
                type="number"
                placeholder="Amount (e.g. 5000 or -5000)"
                value={balanceAmount}
                onChange={e => setBalanceAmount(e.target.value)}
                style={{ flex: 1, fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                className="form-input"
                type="text"
                placeholder="Reason (optional)"
                value={balanceReason}
                onChange={e => setBalanceReason(e.target.value)}
                style={{ flex: 1, fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-success btn-sm"
                disabled={!balanceAmount || Number(balanceAmount) === 0}
                onClick={() => {
                  const delta = Math.round(Number(balanceAmount))
                  if (!delta) return
                  onAdjustBalance(user.id, delta, balanceReason.trim())
                  setBalanceAmount('')
                  setBalanceReason('')
                }}
              >
                {Number(balanceAmount) < 0 ? <MinusCircle size={12} /> : <PlusCircle size={12} />}
                Apply
              </button>
              {balanceAmount && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
                  {Number(balanceAmount) >= 0 ? '+' : ''}{Number(balanceAmount).toLocaleString()} 💎 → {Math.max(0, user.walletBalance + (Number(balanceAmount) || 0)).toLocaleString()} 💎
                </span>
              )}
            </div>
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

          {/* Reports row */}
          <button
            onClick={() => userReports.length > 0 && setReportsOpen(true)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', marginTop: 16, borderRadius: 10, border: 'none',
              background: pendingReports > 0
                ? 'rgba(155,17,30,0.07)'
                : 'var(--bg-surface-2)',
              outline: pendingReports > 0
                ? '1px solid rgba(155,17,30,0.18)'
                : '1px solid var(--border)',
              cursor: userReports.length > 0 ? 'pointer' : 'default',
              transition: 'background 0.15s',
              textAlign: 'left',
            }}
          >
            <Flag size={14} color={pendingReports > 0 ? 'var(--ruby-bright)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: pendingReports > 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              Reports Against
            </span>
            {userReports.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {pendingReports > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                    background: 'rgba(243,156,18,0.15)', color: '#F39C12',
                    textTransform: 'uppercase', letterSpacing: '0.3px',
                  }}>
                    {pendingReports} pending
                  </span>
                )}
                <span style={{
                  minWidth: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  background: pendingReports > 0 ? 'var(--ruby-bright)' : 'var(--bg-surface-3, #2A2A30)',
                  color: pendingReports > 0 ? '#fff' : 'var(--text-muted)',
                }}>
                  {userReports.length}
                </span>
                <ChevronRight size={13} color="var(--text-muted)" />
              </div>
            ) : (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>None</span>
            )}
          </button>

          {/* Action Log row */}
          <button
            onClick={onViewLog}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', marginTop: 8, borderRadius: 10, border: 'none',
              background: 'var(--bg-surface-2)',
              outline: '1px solid var(--border)',
              cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left',
            }}
          >
            <ScrollText size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Action Log
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {(user.log?.length ?? 0) > 0 && (
                <span style={{ minWidth: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, background: 'var(--bg-surface-3, #2A2A30)', color: 'var(--text-muted)' }}>
                  {user.log!.length}
                </span>
              )}
              <ChevronRight size={13} color="var(--text-muted)" />
            </div>
          </button>

          {/* Actions */}
          <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-warn btn-sm" onClick={() => setWarnOpen(true)}>
              <AlertTriangle size={12} /> Warn
            </button>
            {user.status !== 'suspended' && user.status !== 'banned' && (
              <button className="btn btn-secondary btn-sm" onClick={() => { onSuspend(user.id); onClose() }}>
                <PauseCircle size={12} /> Suspend
              </button>
            )}
            {user.status !== 'banned' && (
              <button className="btn btn-danger btn-sm" onClick={() => { onIPBan(user.id); onClose() }}>
                <Ban size={12} /> Ban
              </button>
            )}
            {canReinstate && (
              <button className="btn btn-success btn-sm" onClick={() => { onReinstate(user.id); onClose() }}>
                <RotateCcw size={12} /> Reinstate
              </button>
            )}
          </div>

          {/* Star Badge promotion */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: 8 }}>Star Badge</div>
              {user.isTopStreamer ? (
                <button className="btn btn-secondary btn-sm" onClick={() => { onDemote(user.id); onClose() }}>
                  <Star size={12} /> Remove Star Badge
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" disabled={user.kyc !== 'approved'} onClick={() => { if (user.kyc === 'approved') { onPromote(user.id); onClose() } }}
                  style={{ opacity: user.kyc !== 'approved' ? 0.35 : 1, cursor: user.kyc !== 'approved' ? 'not-allowed' : 'pointer' }}>
                  <Star size={12} /> Grant Star Badge
                </button>
              )}
              {user.kyc !== 'approved' && <div style={{ fontSize: 11, color: '#F39C12', marginTop: 4 }}>KYC approval required to grant Star Badge.</div>}
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                Star Badge streamers appear first on the trending page and receive a boost in visibility.
              </div>
            </div>
        </div>
      </aside>
    </>
  )
}

export default function Users() {
  const { users, warnUser, setUserStatus, promoteTopStreamer, demoteTopStreamer, ipBanUser, adjustWalletBalance } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterTab>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [warnTarget, setWarnTarget] = useState<User | null>(null)
  const [logUser, setLogUser] = useState<User | null>(null)

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
      {warnTarget && (
        <WarnModal
          targetLabel={`@${warnTarget.handle}`}
          onConfirm={msg => warnUser(warnTarget.id, msg)}
          onClose={() => setWarnTarget(null)}
        />
      )}
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
                  <td><Badge variant={u.status} dot>{statusLabel(u.status)}</Badge></td>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{u.joined}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.followers.toLocaleString()}</td>
                  <td><Badge variant={u.kyc} dot>{statusLabel(u.kyc)}</Badge></td>
                  <td>
                    {u.isTopStreamer ? (
                      <span className="badge badge-top-streamer" style={{ cursor: 'pointer' }}
                        title="Remove Star Badge"
                        onClick={() => demoteTopStreamer(u.id)}>
                        ⭐ Star
                      </span>
                    ) : (
                      <button className="btn btn-ghost btn-sm" title={u.kyc !== 'approved' ? 'KYC must be approved to grant Star Badge' : 'Grant Star Badge'}
                        onClick={() => u.kyc === 'approved' && promoteTopStreamer(u.id)}
                        style={{ fontSize: 10, padding: '3px 8px', opacity: u.kyc !== 'approved' ? 0.35 : 1, cursor: u.kyc !== 'approved' ? 'not-allowed' : 'pointer' }}>
                        <Star size={11} /> Grant
                      </button>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-icon" title="View" onClick={() => setSelectedUser(u)}>
                        <Eye size={13} />
                      </button>
                      <button className="btn btn-warn btn-icon" title="Warn" onClick={() => setWarnTarget(u)}>
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
                        <button className="btn btn-danger btn-icon" title="Ban" onClick={() => ipBanUser(u.id)}>
                          <Ban size={13} />
                        </button>
                      ) : (
                        <button className="btn btn-success btn-icon" title="Unban" onClick={() => setUserStatus(u.id, 'active')}>
                          <RotateCcw size={13} />
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
        onWarn={(id, msg) => warnUser(id, msg)}
        onSuspend={id => setUserStatus(id, 'suspended')}
        onReinstate={id => setUserStatus(id, 'active')}
        onPromote={promoteTopStreamer}
        onDemote={demoteTopStreamer}
        onIPBan={ipBanUser}
        onAdjustBalance={adjustWalletBalance}
        onViewLog={() => setLogUser(liveSelectedUser)}
      />

      {logUser && (
        <ActionLogModal
          title={`@${logUser.handle} — ${logUser.displayName}`}
          entries={logUser.log ?? []}
          onClose={() => setLogUser(null)}
        />
      )}

      <WarnMessagesEditor />
    </div>
  )
}
