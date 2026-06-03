import { useState } from 'react'
import { Info, ExternalLink } from 'lucide-react'
import Badge, { statusLabel } from '../components/Badge'
import { useStore } from '../store'
import type { KYCStatus } from '../types'

type FilterTab = 'all' | KYCStatus

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all',          label: 'All' },
  { key: 'pending',      label: 'Pending' },
  { key: 'approved',     label: 'Approved' },
  { key: 'rejected',     label: 'Rejected' },
  { key: 'not_submitted', label: 'Not Submitted' },
]

export default function KYC() {
  const { kyc } = useStore()
  const [filter, setFilter] = useState<FilterTab>('all')

  const filtered = kyc.filter(k => filter === 'all' || k.status === filter)
  const pending = kyc.filter(k => k.status === 'pending').length

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">KYC Verification</div>
          <div className="subtitle">Identity verification status for creator payouts</div>
        </div>
        <div className="page-header-actions">
          {pending > 0 && (
            <span style={{
              fontSize: 13, padding: '4px 12px', borderRadius: 20,
              background: 'rgba(243,156,18,0.1)', color: '#F39C12',
              border: '1px solid rgba(243,156,18,0.2)',
            }}>
              {pending} pending
            </span>
          )}
        </div>
      </div>

      {/* Stripe callout */}
      <div className="callout" style={{
        background: 'rgba(52,152,219,0.07)',
        border: '1px solid rgba(52,152,219,0.2)',
        borderRadius: 10, padding: '12px 16px',
        display: 'flex', alignItems: 'flex-start', gap: 10,
        marginBottom: 20, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
      }}>
        <Info size={15} style={{ color: '#3498DB', marginTop: 2, flexShrink: 0 }} />
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>Approvals are handled by Stripe Connect.</strong>
          {' '}This panel shows the current verification status synced from Stripe. To review documents,
          approve, or reject a submission, open the{' '}
          <a
            href="https://dashboard.stripe.com/connect/accounts/overview"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#3498DB', display: 'inline-flex', alignItems: 'center', gap: 3 }}
          >
            Stripe Dashboard <ExternalLink size={11} />
          </a>.
          KYC is triggered on a creator's <strong>first withdrawal request</strong>.
        </div>
      </div>

      <div className="filter-tabs mb-20" style={{ display: 'inline-flex' }}>
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

      <div className="table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">Verification Records ({filtered.length})</div>
            <div className="table-subtitle">Read-only — managed by Stripe Connect</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Creator</th>
                <th>Email</th>
                <th>Stripe Verification ID</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Stripe</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(k => (
                <tr key={k.id}>
                  <td>
                    <div className="avatar-row">
                      <div className="avatar" style={{ background: k.avatarColor }}>{k.user[0]}</div>
                      <div>
                        <div className="user-name">{k.user}</div>
                        <div className="user-handle">@{k.userHandle}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{k.email}</td>
                  <td>
                    <code style={{
                      fontSize: 12, fontFamily: 'monospace', color: '#3498DB',
                      background: 'rgba(52,152,219,0.08)', padding: '3px 7px',
                      borderRadius: 4, border: '1px solid rgba(52,152,219,0.15)',
                    }}>
                      {k.stripeVerificationId}
                    </code>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(k.submittedAt).toLocaleDateString()}<br />
                    <span style={{ fontSize: 11 }}>
                      {new Date(k.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td>
                    <Badge variant={k.status} dot>{statusLabel(k.status)}</Badge>
                  </td>
                  <td>
                    <a
                      href="https://dashboard.stripe.com/connect/accounts/overview"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                    >
                      <ExternalLink size={12} /> View in Stripe
                    </a>
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
