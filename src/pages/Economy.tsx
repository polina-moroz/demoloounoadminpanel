import { DollarSign, Clock, Gem, TrendingUp, CheckCircle, XCircle, PauseCircle, Info } from 'lucide-react'
import StatCard from '../components/StatCard'
import Badge, { statusLabel } from '../components/Badge'
import { useStore } from '../store'
import { mockTransactions } from '../mockData'

const typeLabels: Record<string, string> = {
  coin_purchase: 'Coin Purchase',
  gift_sent: 'Gift Sent',
  gift_received: 'Gift Received',
  withdrawal: 'Withdrawal',
  refund: 'Refund',
}

const typeColors: Record<string, string> = {
  coin_purchase: '#2ECC8A',
  gift_sent: '#9966CC',
  gift_received: '#D4AF37',
  withdrawal: '#3498DB',
  refund: '#C0392B',
}

export default function Economy() {
  const { withdrawals, approveWithdrawal, rejectWithdrawal, holdWithdrawal } = useStore()
  const pending = withdrawals.filter(w => w.status === 'pending').length

  return (
    <div>
      <div className="stat-grid">
        <StatCard label="Total Revenue"    value="$48,200" sub="This month (gross)"         icon={<DollarSign size={20} />} />
        <StatCard label="Pending Payouts"  value={String(pending)} sub="Awaiting approval"  icon={<Clock size={20} />} />
        <StatCard label="Diamonds Issued"  value="2.4M"    sub="All-time creator earnings"  icon={<Gem size={20} />} />
        <StatCard label="Avg Withdrawal"   value="$71"     sub="Per approved request"       icon={<TrendingUp size={20} />} />
      </div>

      <div className="callout callout-info mb-24">
        <Info size={15} />
        <div>
          <strong>Economy rules:</strong> 1 gifted coin = 1 creator diamond (1:1). 10,000 💎 = $7 gross.
          ~3% processing fee deducted. 7-day hold. 10,000 💎 minimum withdrawal. KYC via Stripe Connect required on first withdrawal.
        </div>
      </div>

      {/* Withdrawal Requests */}
      <div className="section">
        <div className="table-wrapper">
          <div className="table-header">
            <div>
              <div className="table-title">Withdrawal Requests</div>
              <div className="table-subtitle">10,000 💎 minimum · 7-day hold · $7 per 10,000 💎 gross</div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Diamonds</th>
                  <th>Est. USD</th>
                  <th>KYC</th>
                  <th>Requested</th>
                  <th>Hold Until</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map(w => (
                  <tr key={w.id}>
                    <td>
                      <div className="avatar-row">
                        <div className="avatar" style={{ background: w.avatarColor }}>{w.user[0]}</div>
                        <div>
                          <div className="user-name">{w.user}</div>
                          <div className="user-handle">@{w.userHandle}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{w.diamonds.toLocaleString()} 💎</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>${w.estimatedUSD.toFixed(2)}</span>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        after fee: ${(w.estimatedUSD * 0.97).toFixed(2)}
                      </div>
                    </td>
                    <td><Badge variant={w.kycStatus} dot>{statusLabel(w.kycStatus)}</Badge></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(w.requestedAt).toLocaleDateString()}
                    </td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                      <span style={{ color: new Date(w.holdUntil) > new Date() ? '#F39C12' : 'var(--emerald)', fontWeight: 600 }}>
                        {new Date(w.holdUntil).toLocaleDateString()}
                      </span>
                    </td>
                    <td><Badge variant={w.status} dot>{statusLabel(w.status)}</Badge></td>
                    <td>
                      {(w.status === 'pending' || w.status === 'on_hold') ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => approveWithdrawal(w.id)}
                            style={{ opacity: w.kycStatus !== 'approved' ? 0.45 : 1 }}
                            title={w.kycStatus !== 'approved' ? 'KYC not verified' : 'Approve withdrawal'}
                          >
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => rejectWithdrawal(w.id)} title="Reject">
                            <XCircle size={12} />
                          </button>
                          {w.status !== 'on_hold' && (
                            <button className="btn btn-secondary btn-sm" onClick={() => holdWithdrawal(w.id)} title="Place on hold">
                              <PauseCircle size={12} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {w.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction Log — read-only */}
      <div className="table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">Transaction Log</div>
            <div className="table-subtitle">Recent platform transactions</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 13 }}>{t.user}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>@{t.userHandle}</div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      color: typeColors[t.type],
                      background: `${typeColors[t.type]}18`,
                      border: `1px solid ${typeColors[t.type]}30`,
                    }}>
                      {typeLabels[t.type] ?? t.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: t.currency === 'USD' ? 'var(--emerald)' : 'var(--gold)' }}>
                      {t.currency === 'USD'
                        ? `$${t.amount.toFixed(2)}`
                        : `${t.amount.toLocaleString()} ${t.currency === 'coins' ? '🪙' : '💎'}`}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{t.note ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
