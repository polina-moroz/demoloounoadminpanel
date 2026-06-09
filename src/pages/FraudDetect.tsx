import { useState } from 'react'
import { ShieldAlert, CheckCircle, XCircle, X, Clock, AlertTriangle, History } from 'lucide-react'
import StatCard from '../components/StatCard'
import Badge, { statusLabel } from '../components/Badge'
import TxHistoryModal from '../components/TxHistoryModal'
import { useStore } from '../store'
import { mockTransactions } from '../mockData'
import type { FraudAlert, FraudAlertStatus } from '../types'

type FilterTab = 'all' | FraudAlertStatus

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

interface SlideOverProps {
  alert: FraudAlert | null
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

function AlertSlideOver({ alert, onClose, onApprove, onReject }: SlideOverProps) {
  const [txOpen, setTxOpen] = useState(false)

  if (!alert) return null

  const userTxCount = mockTransactions.filter(t => t.userHandle === alert.userHandle).length

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over open">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Fraud Alert Review</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Alert #{alert.id}</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>
          {/* User profile header */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'flex-start' }}>
            <div className="avatar avatar-lg" style={{ background: alert.avatarColor }}>
              {alert.user[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{alert.user}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>@{alert.userHandle}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                {alert.email} · {alert.country}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <Badge variant={alert.kycStatus} dot>{statusLabel(alert.kycStatus)}</Badge>
                <Badge variant={alert.status} dot>
                  {alert.status === 'pending' ? 'Pending' : alert.status === 'approved' ? 'Approved' : 'Rejected'}
                </Badge>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginLeft: 'auto', fontSize: 12, padding: '4px 10px' }}
                  onClick={() => setTxOpen(true)}
                >
                  <History size={12} /> Transactions ({userTxCount})
                </button>
              </div>
            </div>
          </div>

          {/* User stat grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Joined', value: alert.joined },
              { label: 'Followers', value: alert.followers.toLocaleString() },
              { label: 'Total Streams', value: String(alert.totalStreams) },
              { label: 'Total Earned', value: `${alert.totalEarned.toLocaleString()} 💎` },
              { label: 'Wallet Balance', value: `${alert.walletBalance.toLocaleString()} 💎` },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Flagged withdrawal details */}
          <div style={{ background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.22)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldAlert size={13} /> Flagged Withdrawal
            </div>
            {[
              { label: 'Amount', value: `${alert.diamonds.toLocaleString()} 💎`, color: 'var(--gold)' },
              { label: 'Est. USD (gross)', value: `$${alert.estimatedUSD.toFixed(2)}`, color: 'var(--emerald)' },
              { label: 'After 3% fee', value: `$${(alert.estimatedUSD * 0.97).toFixed(2)}`, color: 'var(--emerald)' },
              { label: 'Requested', value: new Date(alert.requestedAt).toLocaleString(), color: 'var(--text-secondary)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(192,57,43,0.1)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{r.label}</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          {alert.status === 'pending' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-success btn-sm"
                style={{ flex: 1 }}
                onClick={() => { onApprove(alert.id); onClose() }}
              >
                <CheckCircle size={13} /> Approve Withdrawal
              </button>
              <button
                className="btn btn-danger btn-sm"
                style={{ flex: 1 }}
                onClick={() => { onReject(alert.id); onClose() }}
              >
                <XCircle size={13} /> Reject
              </button>
            </div>
          )}
        </div>
      </aside>

      {txOpen && (
        <TxHistoryModal
          userHandle={alert.userHandle}
          userName={alert.user}
          transactions={mockTransactions.filter(t => t.userHandle === alert.userHandle)}
          onClose={() => setTxOpen(false)}
        />
      )}
    </>
  )
}

export default function FraudDetect() {
  const { fraudAlerts, fraudThresholdUSD, approveFraudAlert, rejectFraudAlert } = useStore()
  const [filter, setFilter] = useState<FilterTab>('all')
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null)

  const liveAlert = selectedAlert ? fraudAlerts.find(a => a.id === selectedAlert.id) ?? null : null

  const filtered = fraudAlerts.filter(a => filter === 'all' || a.status === filter)
  const pending = fraudAlerts.filter(a => a.status === 'pending').length
  const approved = fraudAlerts.filter(a => a.status === 'approved').length
  const rejected = fraudAlerts.filter(a => a.status === 'rejected').length

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Fraud Detection</div>
          <div className="subtitle">
            Withdrawals above ${fraudThresholdUSD} USD are held and require manual approval
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard
          label="Pending Review"
          value={String(pending)}
          sub="Awaiting decision"
          icon={<Clock size={20} />}
        />
        <StatCard
          label="Approved"
          value={String(approved)}
          sub="Cleared this period"
          icon={<CheckCircle size={20} />}
        />
        <StatCard
          label="Rejected"
          value={String(rejected)}
          sub="Denied this period"
          icon={<XCircle size={20} />}
        />
      </div>

      <div className="callout mb-24" style={{ background: 'rgba(192,57,43,0.05)', borderColor: 'rgba(192,57,43,0.22)', marginTop: 24 }}>
        <AlertTriangle size={15} style={{ color: '#C0392B', flexShrink: 0 }} />
        <div>
          <strong>Fraud detection is active.</strong> Any withdrawal request above{' '}
          <strong>${fraudThresholdUSD} USD</strong> is automatically flagged here for manual approval.
          Threshold can be adjusted in <strong>Settings → Fraud Detection</strong>.
        </div>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs" style={{ marginBottom: 16 }}>
        {filterTabs.map(t => (
          <button
            key={t.key}
            className={`filter-tab${filter === t.key ? ' active' : ''}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
            {t.key === 'pending' && pending > 0 && (
              <span style={{
                marginLeft: 6, background: '#C0392B', color: '#fff',
                borderRadius: 20, fontSize: 10, padding: '1px 6px', fontWeight: 700,
              }}>
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Country</th>
                <th>KYC</th>
                <th>Diamonds</th>
                <th>Est. USD</th>
                <th>Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>
                    No alerts in this category
                  </td>
                </tr>
              ) : filtered.map(a => (
                <tr
                  key={a.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedAlert(a)}
                >
                  <td>
                    <div className="avatar-row">
                      <div className="avatar" style={{ background: a.avatarColor }}>{a.user[0]}</div>
                      <div>
                        <div className="user-name">{a.user}</div>
                        <div className="user-handle">@{a.userHandle}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{a.country}</td>
                  <td><Badge variant={a.kycStatus} dot>{statusLabel(a.kycStatus)}</Badge></td>
                  <td>
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                      {a.diamonds.toLocaleString()} 💎
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>
                      ${a.estimatedUSD.toFixed(2)}
                    </span>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      after fee: ${(a.estimatedUSD * 0.97).toFixed(2)}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(a.requestedAt).toLocaleDateString()}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <Badge variant={a.status} dot>
                      {a.status === 'pending' ? 'Pending' : a.status === 'approved' ? 'Approved' : 'Rejected'}
                    </Badge>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    {a.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => approveFraudAlert(a.id)}
                          title="Approve withdrawal"
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button
                          className="btn btn-danger btn-icon"
                          onClick={() => rejectFraudAlert(a.id)}
                          title="Reject withdrawal"
                        >
                          <XCircle size={12} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {a.status === 'approved' ? '✓ Cleared' : '✗ Rejected'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlertSlideOver
        alert={liveAlert}
        onClose={() => setSelectedAlert(null)}
        onApprove={approveFraudAlert}
        onReject={rejectFraudAlert}
      />
    </div>
  )
}
