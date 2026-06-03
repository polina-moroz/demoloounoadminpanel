import { useState } from 'react'
import { X, AlertTriangle, Ban, CheckCircle } from 'lucide-react'
import Badge, { statusLabel } from '../components/Badge'
import { useStore } from '../store'
import type { ReportType, ReportStatus } from '../types'

type FilterTab = 'all' | ReportType | ReportStatus

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'stream', label: 'Stream' },
  { key: 'user', label: 'User' },
  { key: 'message', label: 'Message' },
  { key: 'pending', label: 'Pending' },
  { key: 'resolved', label: 'Resolved' },
]

export default function Reports() {
  const { reports, resolveReport, dismissReport, banReportTarget, warnReportTarget } = useStore()
  const [filter, setFilter] = useState<FilterTab>('all')

  const filtered = reports.filter(r => {
    if (filter === 'all') return true
    return r.type === filter || r.status === filter
  })

  const pending = reports.filter(r => r.status === 'pending').length
  const resolved = reports.filter(r => r.status === 'resolved').length

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Reports</div>
          <div className="subtitle">User-submitted content flags</div>
        </div>
        <div className="page-header-actions">
          <span style={{ fontSize: 13, padding: '4px 10px', borderRadius: 20, background: 'rgba(243,156,18,0.1)', color: '#F39C12', border: '1px solid rgba(243,156,18,0.2)' }}>
            {pending} pending
          </span>
          <span style={{ fontSize: 13, padding: '4px 10px', borderRadius: 20, background: 'rgba(46,204,138,0.1)', color: '#2ECC8A', border: '1px solid rgba(46,204,138,0.2)' }}>
            {resolved} resolved
          </span>
        </div>
      </div>

      <div className="filter-tabs mb-20" style={{ display: 'inline-flex' }}>
        {filterTabs.map(t => (
          <button key={t.key} className={`filter-tab${filter === t.key ? ' active' : ''}`} onClick={() => setFilter(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <div><div className="table-title">Reports ({filtered.length})</div></div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Reporter</th>
                <th>Type</th>
                <th>Target</th>
                <th>Reason</th>
                <th>Reported At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--text-subtle)', fontFamily: 'monospace', fontSize: 12 }}>
                    #{String(i + 1).padStart(4, '0')}
                  </td>
                  <td>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{r.reporter}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>@{r.reporterHandle}</div>
                  </td>
                  <td><Badge variant={r.type} dot={false}>{r.type}</Badge></td>
                  <td>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{r.target}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>@{r.targetHandle}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 200, fontSize: 12 }}>{r.reason}</td>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: 12 }}>
                    {new Date(r.reportedAt).toLocaleDateString()}<br />
                    <span style={{ fontSize: 11 }}>{new Date(r.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td><Badge variant={r.status} dot>{statusLabel(r.status)}</Badge></td>
                  <td>
                    {r.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" title="Dismiss" onClick={() => dismissReport(r.id)}>
                          <X size={12} /> Dismiss
                        </button>
                        <button className="btn btn-warn btn-sm" title="Warn target" onClick={() => warnReportTarget(r.id)}>
                          <AlertTriangle size={12} />
                        </button>
                        <button className="btn btn-danger btn-sm" title="Ban target" onClick={() => banReportTarget(r.id)}>
                          <Ban size={12} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 4px' }}>
                          {r.status === 'resolved' ? '✓ Resolved' : '— Dismissed'}
                        </span>
                        <button className="btn btn-ghost btn-icon" title="Re-open" onClick={() => resolveReport(r.id)}>
                          <CheckCircle size={12} />
                        </button>
                      </div>
                    )}
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
