import { useState } from 'react'
import { Trash2, Plus, Check, X, Video, UserRound, MessageSquare } from 'lucide-react'
import { useStore } from '../store'
import type { ReportType } from '../types'

const VARIANT = {
  stream: {
    color: '#3B9EE8',
    colorDim: 'rgba(59,158,232,0.12)',
    border: 'rgba(59,158,232,0.28)',
    bg: 'rgba(59,158,232,0.05)',
    icon: <Video size={14} />,
    title: 'Stream Report Reasons',
    subtitle: 'Reasons shown when reporting a live or past stream',
    appliesTo: 'stream' as ReportType,
  },
  user: {
    color: '#9B59B6',
    colorDim: 'rgba(155,89,182,0.12)',
    border: 'rgba(155,89,182,0.28)',
    bg: 'rgba(155,89,182,0.05)',
    icon: <UserRound size={14} />,
    title: 'User Report Reasons',
    subtitle: 'Reasons shown when reporting a user profile',
    appliesTo: 'user' as ReportType,
  },
  message: {
    color: '#F97316',
    colorDim: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.28)',
    bg: 'rgba(249,115,22,0.05)',
    icon: <MessageSquare size={14} />,
    title: 'Message Report Reasons',
    subtitle: 'Reasons shown when reporting a chat message',
    appliesTo: 'message' as ReportType,
  },
}

interface Props {
  variant: keyof typeof VARIANT
}

export default function ReportReasonsEditor({ variant }: Props) {
  const { reportReasons, addReportReason, updateReportReason, removeReportReason } = useStore()
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')

  const cfg = VARIANT[variant]

  const reasons = reportReasons.filter(
    r => r.appliesTo === cfg.appliesTo || r.appliesTo === 'all'
  )

  const handleAdd = () => {
    if (!newLabel.trim()) return
    addReportReason(newLabel.trim(), cfg.appliesTo)
    setNewLabel('')
    setAdding(false)
  }

  return (
    <div className="table-wrapper" style={{ marginTop: 24, border: `1px solid ${cfg.border}`, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', background: cfg.bg, borderBottom: `1px solid ${cfg.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 30, height: 30, borderRadius: 8,
            background: cfg.colorDim, color: cfg.color, flexShrink: 0,
          }}>
            {cfg.icon}
          </span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{cfg.subtitle}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
            background: cfg.colorDim, color: cfg.color,
          }}>
            {reasons.length} reason{reasons.length !== 1 ? 's' : ''}
          </span>
          <button
            className="btn btn-sm"
            style={{ background: cfg.colorDim, color: cfg.color, border: `1px solid ${cfg.border}` }}
            onClick={() => { setAdding(v => !v); setNewLabel('') }}
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Reason</th>
              <th style={{ width: 90, textAlign: 'center' }}>Scope</th>
              <th style={{ width: 100, textAlign: 'center' }}>Status</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {reasons.length === 0 && !adding && (
              <tr>
                <td colSpan={4} style={{ padding: '28px 20px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>
                  No reasons yet — click Add to create one.
                </td>
              </tr>
            )}

            {reasons.map(r => (
              <tr key={r.id} style={{ borderLeft: `3px solid ${r.enabled ? cfg.color : 'transparent'}` }}>
                <td>
                  <input
                    className="form-input"
                    value={r.label}
                    onChange={e => updateReportReason(r.id, { label: e.target.value })}
                    style={{
                      background: 'transparent', border: '1px solid transparent',
                      fontSize: 13, padding: '3px 7px', borderRadius: 5,
                      color: r.enabled ? 'var(--text-primary)' : 'var(--text-muted)',
                      width: '100%', transition: 'border-color 0.15s',
                    }}
                    onFocus={e => (e.target.style.borderColor = cfg.border)}
                    onBlur={e => (e.target.style.borderColor = 'transparent')}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: 11, padding: '2px 7px', borderRadius: 8,
                    background: r.appliesTo === 'all' ? 'rgba(212,175,55,0.1)' : cfg.colorDim,
                    color: r.appliesTo === 'all' ? '#D4AF37' : cfg.color,
                    fontWeight: 600, border: `1px solid ${r.appliesTo === 'all' ? 'rgba(212,175,55,0.25)' : cfg.border}`,
                  }}>
                    {r.appliesTo === 'all' ? 'universal' : r.appliesTo}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => updateReportReason(r.id, { enabled: !r.enabled })}
                    style={{
                      background: r.enabled ? cfg.colorDim : 'var(--bg-surface-2)',
                      border: `1px solid ${r.enabled ? cfg.border : 'var(--border)'}`,
                      borderRadius: 10, padding: '2px 9px', fontSize: 11,
                      fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                      color: r.enabled ? cfg.color : 'var(--text-muted)',
                    }}
                  >
                    {r.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => removeReportReason(r.id)}
                    title="Remove"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}

            {adding && (
              <tr style={{ background: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}>
                <td>
                  <input
                    className="form-input"
                    placeholder="Reason label…"
                    value={newLabel}
                    autoFocus
                    onChange={e => setNewLabel(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAdd()
                      if (e.key === 'Escape') { setAdding(false); setNewLabel('') }
                    }}
                    style={{ fontSize: 13 }}
                  />
                </td>
                <td />
                <td />
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button
                      className="btn btn-icon"
                      style={{ width: 24, height: 24, background: cfg.colorDim, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 6 }}
                      onClick={handleAdd}
                      disabled={!newLabel.trim()}
                      title="Save"
                    >
                      <Check size={11} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      style={{ width: 24, height: 24 }}
                      onClick={() => { setAdding(false); setNewLabel('') }}
                      title="Cancel"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '10px 20px', borderTop: `1px solid ${cfg.border}`, fontSize: 12, color: 'var(--text-subtle)' }}>
        Name editable inline. "Universal" reasons apply to all report types and appear here for reference.
      </div>
    </div>
  )
}
