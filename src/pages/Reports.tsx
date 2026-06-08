import { useState, useRef, useEffect } from 'react'
import { X, AlertTriangle, Ban, RotateCcw, Plus, Trash2, ExternalLink, Send, ScrollText } from 'lucide-react'
import Badge, { statusLabel } from '../components/Badge'
import { useStore } from '../store'
import type { ReportType, ReportStatus, ReportReason, WarnMessage, ReportLogEntry } from '../types'

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

const appliesToColors: Record<ReportReason['appliesTo'], string> = {
  all:     '#8A8A8E',
  stream:  '#D4AF37',
  user:    '#9966CC',
  message: '#3498DB',
}

const appliesToLabels: Record<ReportReason['appliesTo'], string> = {
  all:     'All types',
  stream:  'Stream',
  user:    'User',
  message: 'Message',
}

function AppliesToBadge({ value }: { value: ReportReason['appliesTo'] }) {
  const color = appliesToColors[value]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      color, background: `${color}18`, border: `1px solid ${color}30`,
      whiteSpace: 'nowrap',
    }}>
      {appliesToLabels[value]}
    </span>
  )
}

/* ── Add Reason Modal ─────────────────────────────────────────── */

function AddReasonModal({ onClose }: { onClose: () => void }) {
  const { addReportReason } = useStore()
  const [label, setLabel] = useState('')
  const [appliesTo, setAppliesTo] = useState<ReportReason['appliesTo']>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleAdd = () => {
    if (!label.trim()) return
    addReportReason(label, appliesTo)
    onClose()
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <span className="modal-title">Add Report Reason</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Reason Label</label>
            <input
              ref={inputRef}
              className="form-input"
              placeholder="e.g. Inappropriate thumbnail"
              value={label}
              onChange={e => setLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Applies To</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(Object.keys(appliesToLabels) as ReportReason['appliesTo'][]).map(key => {
                const color = appliesToColors[key]
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAppliesTo(key)}
                    style={{
                      padding: '9px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                      background: appliesTo === key ? `${color}12` : 'var(--bg-surface-2)',
                      border: `1.5px solid ${appliesTo === key ? color : 'var(--border)'}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: appliesTo === key ? color : 'var(--text-secondary)' }}>
                      {appliesToLabels[key]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!label.trim()}
            style={{ opacity: label.trim() ? 1 : 0.45 }}
            onClick={handleAdd}
          >
            <Plus size={13} /> Add Reason
          </button>
        </div>
      </div>
    </>
  )
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

/* ── Warn Picker Modal ────────────────────────────────────────── */

function WarnPickerModal({
  targetHandle,
  messages,
  onSend,
  onClose,
}: {
  targetHandle: string
  messages: WarnMessage[]
  onSend: (message: string) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <span className="modal-title">Send Warning to @{targetHandle}</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(m.id)}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                textAlign: 'left',
                background: selected === m.id ? 'rgba(243,156,18,0.08)' : 'var(--bg-surface-2)',
                border: `1.5px solid ${selected === m.id ? '#F39C12' : 'var(--border)'}`,
                color: selected === m.id ? '#F39C12' : 'var(--text-secondary)',
                fontSize: 13,
                lineHeight: 1.5,
                transition: 'all 0.15s',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-warn"
            disabled={!selected}
            style={{ opacity: selected ? 1 : 0.45 }}
            onClick={() => {
              if (selected) {
                const msg = messages.find(m => m.id === selected)
                if (msg) onSend(msg.label)
              }
            }}
          >
            <Send size={13} /> Send Warning
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Main Page ────────────────────────────────────────────────── */

export default function Reports() {
  const {
    reports, dismissReport, reopenReport, banReportTarget, warnReportTarget,
    reportReasons, updateReportReason, removeReportReason, warnMessages,
  } = useStore()

  const [selectedTypes,    setSelectedTypes]    = useState<ReportType[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<ReportStatus[]>([])
  const [showAddReason, setShowAddReason] = useState(false)
  const [warnPickerReport, setWarnPickerReport] = useState<{ id: string; targetHandle: string } | null>(null)
  const [logReport, setLogReport] = useState<{ id: string; log: ReportLogEntry[] } | null>(null)

  const filtered = reports.filter(r => {
    const typeOk   = selectedTypes.length   === 0 || selectedTypes.includes(r.type)
    const statusOk = selectedStatuses.length === 0 || selectedStatuses.includes(r.status)
    return typeOk && statusOk
  })

  const pending  = reports.filter(r => r.status === 'pending').length
  const resolved = reports.filter(r => r.status === 'resolved').length
  const activeReasons = reportReasons.filter(r => r.enabled).length

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

      {/* ── Report Reason Presets ─────────────────────────────── */}
      <div className="table-wrapper" style={{ marginTop: 24 }}>
        <div className="table-header">
          <div>
            <div className="table-title">Report Reason Presets</div>
            <div className="table-subtitle">
              Predefined reasons shown to users when submitting a report ·{' '}
              <span style={{ color: 'var(--emerald)' }}>{activeReasons} active</span>
              {reportReasons.length - activeReasons > 0 && (
                <span style={{ color: 'var(--text-subtle)' }}> · {reportReasons.length - activeReasons} disabled</span>
              )}
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddReason(true)}>
            <Plus size={13} /> Add Reason
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Reason</th>
                <th style={{ width: 130 }}>Applies To</th>
                <th style={{ width: 80 }}>Enabled</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {reportReasons.map(reason => (
                <tr key={reason.id} style={{ opacity: reason.enabled ? 1 : 0.45 }}>
                  <td>
                    <input
                      className="form-input"
                      value={reason.label}
                      onChange={e => updateReportReason(reason.id, { label: e.target.value })}
                      style={{
                        background: 'transparent',
                        border: '1px solid transparent',
                        fontSize: 13,
                        padding: '4px 8px',
                        borderRadius: 6,
                        width: '100%',
                        color: 'var(--text-primary)',
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => (e.target.style.borderColor = 'var(--border-gold)')}
                      onBlur={e => (e.target.style.borderColor = 'transparent')}
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={reason.appliesTo}
                      onChange={e => updateReportReason(reason.id, { appliesTo: e.target.value as ReportReason['appliesTo'] })}
                      style={{ fontSize: 12, width: 120 }}
                    >
                      <option value="all">All types</option>
                      <option value="stream">Stream</option>
                      <option value="user">User</option>
                      <option value="message">Message</option>
                    </select>
                  </td>
                  <td>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={reason.enabled}
                        onChange={e => updateReportReason(reason.id, { enabled: e.target.checked })}
                      />
                      <span className="toggle-track" />
                    </label>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => removeReportReason(reason.id)}
                      title="Remove reason"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-subtle)' }}>
          Reason labels are editable inline. Changes apply immediately. Disabled reasons stay in history but are hidden from users.
        </div>
      </div>

      {showAddReason && <AddReasonModal onClose={() => setShowAddReason(false)} />}
      {warnPickerReport && (
        <WarnPickerModal
          targetHandle={warnPickerReport.targetHandle}
          messages={warnMessages}
          onSend={msg => {
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
    </div>
  )
}
