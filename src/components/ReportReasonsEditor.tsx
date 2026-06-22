import { useState } from 'react'
import { Trash2, Plus, Check, X, Video, UserRound, MessageSquare, Layers } from 'lucide-react'
import { useStore } from '../store'
import type { ReportType } from '../types'

type Ctx = ReportType | 'all'

const CFG: Record<Ctx, {
  label: string
  description: string
  color: string
  colorDim: string
  bg: string
  border: string
  icon: React.ReactNode
}> = {
  stream: {
    label: 'Stream reasons',
    description: 'Shown when reporting a live or past stream',
    color: '#3B9EE8',
    colorDim: 'rgba(59,158,232,0.15)',
    bg: 'rgba(59,158,232,0.06)',
    border: 'rgba(59,158,232,0.22)',
    icon: <Video size={13} />,
  },
  user: {
    label: 'User reasons',
    description: 'Shown when reporting a user profile',
    color: '#9B59B6',
    colorDim: 'rgba(155,89,182,0.15)',
    bg: 'rgba(155,89,182,0.06)',
    border: 'rgba(155,89,182,0.22)',
    icon: <UserRound size={13} />,
  },
  message: {
    label: 'Message reasons',
    description: 'Shown when reporting a chat message',
    color: '#F97316',
    colorDim: 'rgba(249,115,22,0.15)',
    bg: 'rgba(249,115,22,0.06)',
    border: 'rgba(249,115,22,0.22)',
    icon: <MessageSquare size={13} />,
  },
  all: {
    label: 'Universal reasons',
    description: 'Shown for all report types',
    color: '#D4AF37',
    colorDim: 'rgba(212,175,55,0.15)',
    bg: 'rgba(212,175,55,0.06)',
    border: 'rgba(212,175,55,0.22)',
    icon: <Layers size={13} />,
  },
}

interface Props {
  /* which sections to show — omit for all four */
  show?: Ctx[]
}

export default function ReportReasonsEditor({ show }: Props) {
  const { reportReasons, addReportReason, updateReportReason, removeReportReason } = useStore()
  const [addingFor, setAddingFor] = useState<Ctx | null>(null)
  const [newLabel, setNewLabel] = useState('')

  const sections: Ctx[] = show ?? ['stream', 'user', 'message', 'all']

  const handleAdd = (ctx: Ctx) => {
    if (!newLabel.trim()) return
    addReportReason(newLabel.trim(), ctx === 'all' ? 'all' : ctx)
    setNewLabel('')
    setAddingFor(null)
  }

  const startAdding = (ctx: Ctx) => {
    setAddingFor(ctx)
    setNewLabel('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
      {sections.map(ctx => {
        const cfg = CFG[ctx]
        const reasons = reportReasons.filter(r => r.appliesTo === ctx)

        return (
          <div
            key={ctx}
            className="table-wrapper"
            style={{ border: `1px solid ${cfg.border}`, overflow: 'hidden' }}
          >
            {/* Section header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 20px',
              background: cfg.bg,
              borderBottom: `1px solid ${cfg.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 8,
                  background: cfg.colorDim, color: cfg.color,
                  flexShrink: 0,
                }}>
                  {cfg.icon}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{cfg.description}</div>
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
                  style={{
                    background: cfg.colorDim, color: cfg.color,
                    border: `1px solid ${cfg.border}`,
                  }}
                  onClick={() => addingFor === ctx ? setAddingFor(null) : startAdding(ctx)}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>

            {/* Reasons list */}
            {reasons.length === 0 && addingFor !== ctx ? (
              <div style={{ padding: '20px 24px', fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No reasons yet — click Add to create one.
              </div>
            ) : (
              <div>
                {reasons.map((r, i) => (
                  <div
                    key={r.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '9px 16px 9px 20px',
                      borderBottom: (i < reasons.length - 1 || addingFor === ctx) ? '1px solid var(--border)' : 'none',
                      borderLeft: `3px solid ${r.enabled ? cfg.color : 'var(--border)'}`,
                      transition: 'border-left-color 0.15s',
                    }}
                  >
                    <input
                      className="form-input"
                      value={r.label}
                      onChange={e => updateReportReason(r.id, { label: e.target.value })}
                      style={{
                        flex: 1, background: 'transparent', border: '1px solid transparent',
                        fontSize: 13, padding: '3px 7px', borderRadius: 5,
                        color: r.enabled ? 'var(--text-primary)' : 'var(--text-muted)',
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => (e.target.style.borderColor = cfg.border)}
                      onBlur={e => (e.target.style.borderColor = 'transparent')}
                    />
                    <button
                      onClick={() => updateReportReason(r.id, { enabled: !r.enabled })}
                      style={{
                        flexShrink: 0, background: r.enabled ? cfg.colorDim : 'var(--bg-surface-2)',
                        border: `1px solid ${r.enabled ? cfg.border : 'var(--border)'}`,
                        borderRadius: 10, padding: '2px 9px', fontSize: 11,
                        fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                        color: r.enabled ? cfg.color : 'var(--text-muted)',
                      }}
                    >
                      {r.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => removeReportReason(r.id)}
                      title="Remove reason"
                      style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                {/* Add new inline row */}
                {addingFor === ctx && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 16px 8px 20px',
                    background: cfg.bg,
                    borderLeft: `3px solid ${cfg.color}`,
                  }}>
                    <input
                      className="form-input"
                      placeholder="Reason label…"
                      value={newLabel}
                      autoFocus
                      onChange={e => setNewLabel(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAdd(ctx)
                        if (e.key === 'Escape') { setAddingFor(null); setNewLabel('') }
                      }}
                      style={{ flex: 1, fontSize: 13 }}
                    />
                    <button
                      className="btn btn-icon"
                      style={{
                        width: 26, height: 26, background: cfg.colorDim,
                        color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 6,
                      }}
                      onClick={() => handleAdd(ctx)}
                      disabled={!newLabel.trim()}
                      title="Save"
                    >
                      <Check size={11} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      style={{ width: 26, height: 26 }}
                      onClick={() => { setAddingFor(null); setNewLabel('') }}
                      title="Cancel"
                    >
                      <X size={11} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
