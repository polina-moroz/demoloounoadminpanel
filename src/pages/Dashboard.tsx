import { useState } from 'react'
import { Radio, Users, DollarSign, Flag, X, AlertTriangle, Ban, CheckCircle } from 'lucide-react'
import StatCard from '../components/StatCard'
import Badge, { statusLabel } from '../components/Badge'
import { useStore } from '../store'
import { revenueData } from '../mockData'
import type { Report } from '../types'

/* ── Revenue chart ───────────────────────────────────────────── */

function RevenueChart() {
  const max = Math.max(...revenueData.map(d => d.amount))
  return (
    <div className="card section">
      <div className="card-header">
        <div>
          <div className="card-title">Revenue — Last 7 Days</div>
          <div className="card-subtitle">Coin purchases (gross)</div>
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)' }}>$3,140</span>
      </div>
      <div className="card-body">
        <div className="revenue-chart">
          {revenueData.map(d => (
            <div className="revenue-bar-wrap" key={d.day}>
              <div className="revenue-bar" style={{ height: `${(d.amount / max) * 90}%` }} title={`$${d.amount}`} />
              <span className="revenue-bar-label">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Platform status ─────────────────────────────────────────── */

function PlatformStatus() {
  return (
    <div className="section">
      <div className="platform-status-grid">
        <div className="platform-status-item">
          <div className="label">App Version</div>
          <div className="value">1.0.0</div>
        </div>
        <div className="platform-status-item">
          <div className="label">Phase</div>
          <div className="value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E05C6A', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Closed Testing
          </div>
        </div>
        <div className="platform-status-item">
          <div className="label">Min Withdrawal</div>
          <div className="value">10,000 💎</div>
        </div>
        <div className="platform-status-item">
          <div className="label">Age Gate</div>
          <div className="value">18+</div>
        </div>
      </div>
    </div>
  )
}

/* ── Report detail modal ─────────────────────────────────────── */

function ReportModal({ report, onClose }: { report: Report; onClose: () => void }) {
  const { users, dismissReport, warnReportTarget, banReportTarget } = useStore()

  const reporter = users.find(u => u.handle === report.reporterHandle)
  const target   = users.find(u => u.handle === report.targetHandle)

  const typeColor: Record<string, string> = {
    stream:  '#3498DB',
    user:    '#9966CC',
    message: '#F39C12',
  }

  const doAction = (fn: (id: string) => void) => {
    fn(report.id)
    onClose()
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 520 }}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Flag size={16} style={{ color: 'var(--ruby-bright)' }} />
            <span className="modal-title">Report Details</span>
            <Badge variant={report.type} dot={false}>{report.type}</Badge>
          </div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Reason */}
          <div style={{
            background: 'rgba(192,57,43,0.07)', border: '1px solid rgba(192,57,43,0.18)',
            borderLeft: '3px solid var(--ruby-bright)',
            borderRadius: 10, padding: '12px 16px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ruby-bright)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
              Reported Reason
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.55 }}>
              {report.reason}
            </div>
          </div>

          {/* Reporter → Target */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>
            {/* Reporter */}
            <div style={{ background: 'var(--bg-surface-2)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
                Reporter
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: reporter?.avatarColor ?? '#48484A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {report.reporter[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{report.reporter}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{report.reporterHandle}</div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 600 }}>reported</span>
              <span style={{ color: typeColor[report.type] ?? 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}>→</span>
            </div>

            {/* Target */}
            <div style={{ background: 'var(--bg-surface-2)', borderRadius: 10, padding: '12px 14px', border: `1px solid ${typeColor[report.type] ?? 'var(--border)'}40` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: typeColor[report.type] ?? 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
                Target ({report.type})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: target?.avatarColor ?? '#9B111E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {report.target[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{report.target}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{report.targetHandle}</div>
                  {target && (
                    <Badge variant={target.status} dot style={{ marginTop: 4 }}>
                      {statusLabel(target.status)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Report ID',    value: report.id.toUpperCase() },
              { label: 'Status',       value: <Badge variant={report.status} dot>{statusLabel(report.status)}</Badge> },
              { label: 'Reported At',  value: new Date(report.reportedAt).toLocaleString() },
            ].map(row => (
              <div key={row.label}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 4 }}>
                  {row.label}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          {report.status === 'pending' ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => doAction(dismissReport)}>
                <X size={13} /> Dismiss
              </button>
              <button className="btn btn-warn btn-sm" onClick={() => doAction(warnReportTarget)}>
                <AlertTriangle size={13} /> Warn @{report.targetHandle}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => doAction(banReportTarget)}>
                <Ban size={13} /> Ban @{report.targetHandle}
              </button>
            </div>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} style={{ color: 'var(--emerald)' }} />
              Already {report.status}
            </span>
          )}
        </div>
      </div>
    </>
  )
}

/* ── Page ────────────────────────────────────────────────────── */

export default function Dashboard() {
  const { reports } = useStore()
  const [reviewingReport, setReviewingReport] = useState<Report | null>(null)

  const pendingReports = reports.filter(r => r.status === 'pending').slice(0, 5)

  return (
    <div>
      {/* KPI cards */}
      <div className="stat-grid">
        <StatCard label="Active Live Streams" value="47"      sub="4 more than yesterday"     icon={<Radio size={20} />} />
        <StatCard label="Total Users"          value="12,841"  sub="+38 this week"             icon={<Users size={20} />} />
        <StatCard label="Revenue Today"        value="$2,140"  sub="Coin purchases (gross)"    icon={<DollarSign size={20} />} />
        <StatCard label="Open Reports"         value={String(reports.filter(r => r.status === 'pending').length)} sub="8 require urgent review" icon={<Flag size={20} />} />
      </div>

      <RevenueChart />
      <PlatformStatus />

      {/* Pending reports */}
      <div className="table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">Pending Reports</div>
            <div className="table-subtitle">Require admin review</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Type</th>
                <th>Target</th>
                <th>Reason</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingReports.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-muted)' }}>
                    No pending reports 🎉
                  </td>
                </tr>
              ) : pendingReports.map(r => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--text-muted)' }}>@{r.reporterHandle}</td>
                  <td><Badge variant={r.type} dot={false}>{r.type}</Badge></td>
                  <td><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{r.target}</span></td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 220, fontSize: 13 }}>{r.reason}</td>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: 12 }}>
                    {new Date(r.reportedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setReviewingReport(r)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report detail modal */}
      {reviewingReport && (
        <ReportModal
          report={reports.find(r => r.id === reviewingReport.id) ?? reviewingReport}
          onClose={() => setReviewingReport(null)}
        />
      )}
    </div>
  )
}
