import { useState } from 'react'
import { Trash2, Plus, Check, X, Video, UserRound, MessageSquare } from 'lucide-react'
import { useStore } from '../store'
import type { WarnMessageType } from '../types'

const TYPE_LABELS: Record<WarnMessageType, string> = {
  message: 'Message',
  user:    'User',
  stream:  'Stream',
  all:     'All',
}

const VARIANT = {
  stream: {
    color: '#3B9EE8',
    colorDim: 'rgba(59,158,232,0.12)',
    border: 'rgba(59,158,232,0.28)',
    bg: 'rgba(59,158,232,0.05)',
    rowBg: 'rgba(59,158,232,0.03)',
    icon: <Video size={14} />,
    subtitle: 'Warning templates for streamers — sent as a notification when a stream is flagged',
    typeOptions: ['stream', 'all'] as WarnMessageType[],
  },
  user: {
    color: '#9B59B6',
    colorDim: 'rgba(155,89,182,0.12)',
    border: 'rgba(155,89,182,0.28)',
    bg: 'rgba(155,89,182,0.05)',
    rowBg: 'rgba(155,89,182,0.03)',
    icon: <UserRound size={14} />,
    subtitle: 'Warning templates for users — sent as a notification when a profile is actioned',
    typeOptions: ['user', 'all'] as WarnMessageType[],
  },
  report: {
    color: '#F97316',
    colorDim: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.28)',
    bg: 'rgba(249,115,22,0.05)',
    rowBg: 'rgba(249,115,22,0.03)',
    icon: <MessageSquare size={14} />,
    subtitle: 'All warning templates across every type — sent as a notification when a report is actioned',
    typeOptions: ['message', 'user', 'stream', 'all'] as WarnMessageType[],
  },
} as const

function toggleValue<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
}

interface Props {
  variant: keyof typeof VARIANT
}

export default function WarnMessagesEditor({ variant }: Props) {
  const { warnMessages, addWarnMessage, updateWarnMessage, removeWarnMessage } = useStore()
  const [adding, setAdding]     = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newMessage, setNewMessage] = useState('')

  const cfg = VARIANT[variant]
  const [newType, setNewType] = useState<WarnMessageType>(cfg.typeOptions[0])
  const [typeFilter, setTypeFilter] = useState<WarnMessageType[]>([])

  const filterable = cfg.typeOptions.length > 2
  const visibleMessages = filterable
    ? (typeFilter.length === 0 ? warnMessages : warnMessages.filter(m => typeFilter.includes(m.appliesTo)))
    : warnMessages.filter(m => cfg.typeOptions.includes(m.appliesTo))

  const handleAdd = () => {
    if (!newTitle.trim() || !newMessage.trim()) return
    addWarnMessage(newTitle.trim(), newMessage.trim(), newType)
    setNewTitle('')
    setNewMessage('')
    setNewType(cfg.typeOptions[0])
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
            <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>Warn Templates</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{cfg.subtitle}</div>
          </div>
        </div>
        <button
          className="btn btn-sm"
          style={{ background: cfg.colorDim, color: cfg.color, border: `1px solid ${cfg.border}` }}
          onClick={() => setAdding(v => !v)}
        >
          <Plus size={13} /> Add Template
        </button>
      </div>

      {filterable && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderBottom: `1px solid ${cfg.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</span>
          <div className="filter-tabs" style={{ display: 'inline-flex' }}>
            {cfg.typeOptions.map(type => (
              <button
                key={type}
                className={`filter-tab${typeFilter.includes(type) ? ' active' : ''}`}
                onClick={() => setTypeFilter(prev => toggleValue(prev, type))}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>
          {typeFilter.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => setTypeFilter([])}>Clear</button>
          )}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 220 }}>Title</th>
              <th>Message (user notification)</th>
              <th style={{ width: 110 }}>Type</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {visibleMessages.map(msg => (
              <tr key={msg.id} style={{ borderLeft: `3px solid ${cfg.color}` }}>
                <td>
                  <input
                    className="form-input"
                    value={msg.title}
                    onChange={e => updateWarnMessage(msg.id, { title: e.target.value })}
                    style={{ background: 'transparent', border: '1px solid transparent', fontSize: 13, padding: '4px 8px', borderRadius: 6, width: '100%', color: 'var(--text-primary)', transition: 'border-color 0.15s', fontWeight: 600 }}
                    onFocus={e => (e.target.style.borderColor = cfg.border)}
                    onBlur={e => (e.target.style.borderColor = 'transparent')}
                  />
                </td>
                <td>
                  <textarea
                    className="form-input"
                    value={msg.message}
                    onChange={e => updateWarnMessage(msg.id, { message: e.target.value })}
                    rows={2}
                    style={{ background: 'transparent', border: '1px solid transparent', fontSize: 12, padding: '4px 8px', borderRadius: 6, width: '100%', color: 'var(--text-secondary)', resize: 'vertical', transition: 'border-color 0.15s', fontFamily: 'inherit', lineHeight: 1.5 }}
                    onFocus={e => (e.target.style.borderColor = cfg.border)}
                    onBlur={e => (e.target.style.borderColor = 'transparent')}
                  />
                </td>
                <td>
                  <select
                    className="form-select"
                    value={msg.appliesTo}
                    onChange={e => updateWarnMessage(msg.id, { appliesTo: e.target.value as WarnMessageType })}
                    style={{ fontSize: 12, padding: '5px 26px 5px 8px', width: '100%' }}
                  >
                    {cfg.typeOptions.map(type => (
                      <option key={type} value={type}>{TYPE_LABELS[type]}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="btn btn-ghost btn-icon" onClick={() => removeWarnMessage(msg.id)} title="Delete template" style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}

            {adding && (
              <tr style={{ background: cfg.rowBg, borderLeft: `3px solid ${cfg.color}` }}>
                <td>
                  <input
                    className="form-input"
                    placeholder="Template title"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    autoFocus
                    style={{ fontSize: 13, fontWeight: 600 }}
                  />
                </td>
                <td>
                  <textarea
                    className="form-input"
                    placeholder="Message the user will receive in their notification"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    rows={2}
                    style={{ fontSize: 12, width: '100%', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
                  />
                </td>
                <td>
                  <select
                    className="form-select"
                    value={newType}
                    onChange={e => setNewType(e.target.value as WarnMessageType)}
                    style={{ fontSize: 12, padding: '5px 26px 5px 8px', width: '100%' }}
                  >
                    {cfg.typeOptions.map(type => (
                      <option key={type} value={type}>{TYPE_LABELS[type]}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button
                      className="btn btn-icon"
                      style={{ width: 24, height: 24, background: cfg.colorDim, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 6 }}
                      onClick={handleAdd}
                      disabled={!newTitle.trim() || !newMessage.trim()}
                      title="Save"
                    >
                      <Check size={11} />
                    </button>
                    <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setAdding(false); setNewTitle(''); setNewMessage(''); setNewType(cfg.typeOptions[0]) }} title="Cancel">
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
        Title, message, and type are editable inline. Changes apply immediately.
      </div>
    </div>
  )
}
