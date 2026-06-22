import { useState } from 'react'
import { X, AlertTriangle, Ban, RotateCcw, ExternalLink, ScrollText } from 'lucide-react'
import Badge, { statusLabel } from '../components/Badge'
import WarnModal from '../components/WarnModal'
import WarnMessagesEditor from '../components/WarnMessagesEditor'
import ReportReasonsEditor from '../components/ReportReasonsEditor'
import { useStore } from '../store'
import type { ReportType, ReportStatus, ReportLogEntry } from '../types'

const TYPE_OPTIONS:   { key: ReportType;   label: string }[] = [
  { key: 'stream',  label: 'Stream'  },
  { key: 'user',    label: 'User'    },
  { key: 'message', label: 'Message' },
]
const STATUS_OPTIONS: { key: ReportStatus; label: string }[] = [
  { key: 'pending',   label: 'Pending'   },
  { key: 'resolved',  label: 'Resolved'  },
  { key: 'dismissed', label: 'Dismissed' },
]

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
}

/* ── Report Log Modal ─────────────────────────────────────────── */

const ACTION_LABELS: Record<ReportLogEntry['action'], string> = {
  warned:    'Warning sent',
  banned:    'User banned',
  resolved:  'Resolved',
  dismissed: 'Dismissed',
  reopened:  'Reopened',
}

const ACTION_COLORS: Record<ReportLogEntry['action'], string> = {
  warned:    '#F39C12',
  banned:    '#E05C6A',
  resolved:  '#2ECC8A',
  dismissed: '#8A8A8E',
  reopened:  '#3498DB',
}

function ReportLogModal({ log, reportId, onClose }: { log: ReportLogEntry[]; reportId: string; onClose: () => void }) {
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <span className="modal-title">Action Log — #{reportId}</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ padding: 0 }}>
          {log.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No actions taken yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {log.map((entry, i) => {
                const color = ACTION_COLORS[entry.action]
                return (
                  <div key={entry.id} style={{
                    display: 'flex', gap: 14, padding: '14px 20px',
                    borderBottom: i < log.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ paddingTop: 2 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: color, flexShrink: 0, marginTop: 4,
                      }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color }}>{ACTION_LABELS[entry.action]}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>by {entry.adminName}</span>
                      </div>
                      {entry.note && (
                        <div style={{
                          marginTop: 5, fontSize: 12, color: 'var(--text-secondary)',
                          background: 'var(--bg-surface-2)', borderRadius: 8,
                          padding: '6px 10px', lineHeight: 1.5,
                        }}>
                          "{entry.note}"
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 4 }}>
                        {new Date(entry.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  )
}

/* ── Main Page ────────────────────────────────────────────────── */

export default function Reports() {
  const {
    reports, dismissReport, reopenReport, banReportTarget, warnReportTarget,
  } = useStore()

  const [activeSection, setActiveSection] = useState<'reports' | 'templates' | 'reasons'>('reports')
  const [selectedTypes,    setSelectedTypes]    = useState<ReportType[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<ReportStatus[]>([])
  const [warnPickerReport, setWarnPickerReport] = useState<{ id: string; targetHandle: string } | null>(null)
  const [logReport, setLogReport] = useState<{ id: string; log: ReportLogEntry[] } | null>(null)

  const filtered = reports.filter(r => {
    const typeOk   = selectedTypes.length   === 0 || selectedTypes.includes(r.type)
    const statusOk = selectedStatuses.length === 0 || selectedStatuses.includes(r.status)
    return typeOk && statusOk
  })

  const pending  = reports.filter(r => r.status === 'pending').length
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

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {([
          { key: 'reports', label: 'Reports' },
          { key: 'templates', label: 'Warn Templates' },
          { key: 'reasons', label: 'Report Reasons' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 16px', fontSize: 14, fontWeight: 500,
              color: activeSection === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeSection === tab.key ? '2px solid var(--gold)' : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSection === 'templates' ? (
        <WarnMessagesEditor />
      ) : activeSection === 'reasons' ? (
        <ReportReasonsEditor variant="message" />
      ) : (
        <>
          {/* Multi-picker filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</span>
              <div className="filter-tabs" style={{ display: 'inline-flex' }}>
                {TYPE_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`filter-tab${selectedTypes.includes(key) ? ' active' : ''}`}
                    onClick={() => setSelectedTypes(prev => toggle(prev, key))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</span>
              <div className="filter-tabs" style={{ display: 'inline-flex' }}>
                {STATUS_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`filter-tab${selectedStatuses.includes(key) ? ' active' : ''}`}
                    onClick={() => setSelectedStatuses(prev => toggle(prev, key))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {(selectedTypes.length > 0 || selectedStatuses.length > 0) && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setSelectedTypes([]); setSelectedStatuses([]) }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Reports table */}
          <div className="table-wrapper">
            <div className="table-header">
              <div><div className="table-title">Reports ({filtered.length})</div></div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
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
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-ghost btn-icon"
                            title="View action log"
                            onClick={() => setLogReport({ id: r.id, log: r.log ?? [] })}
                          >
                            <ScrollText size={12} />
                            {(r.log?.length ?? 0) > 0 && (
                              <span style={{ fontSize: 10, marginLeft: 2, color: 'var(--text-muted)' }}>{r.log!.length}</span>
                            )}
                          </button>
                          {r.type === 'stream' && (
                            <a
                              href={`https://loouno.com/live/${r.targetHandle}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-ghost btn-sm"
                              title="Open stream"
                            >
                              <ExternalLink size={12} /> Stream
                            </a>
                          )}
                          {r.status === 'pending' ? (
                            <>
                              <button className="btn btn-ghost btn-sm" title="Dismiss" onClick={() => dismissReport(r.id)}>
                                <X size={12} /> Dismiss
                              </button>
                              <button className="btn btn-warn btn-sm" title="Warn target" onClick={() => setWarnPickerReport({ id: r.id, targetHandle: r.targetHandle })}>
                                <AlertTriangle size={12} />
                              </button>
                              <button className="btn btn-danger btn-sm" title="Ban target" onClick={() => banReportTarget(r.id)}>
                                <Ban size={12} />
                              </button>
                            </>
                          ) : (
                            <button className="btn btn-ghost btn-sm" title="Reopen report" onClick={() => reopenReport(r.id)}>
                              <RotateCcw size={12} /> Reopen
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

          {warnPickerReport && (
            <WarnModal
              targetLabel={`@${warnPickerReport.targetHandle}`}
              onConfirm={msg => {
                warnReportTarget(warnPickerReport.id, msg)
                setWarnPickerReport(null)
              }}
              onClose={() => setWarnPickerReport(null)}
            />
          )}
          {logReport && (
            <ReportLogModal
              log={logReport.log}
              reportId={logReport.id}
              onClose={() => setLogReport(null)}
            />
          )}
        </>
      )}
    </div>
  )
}
