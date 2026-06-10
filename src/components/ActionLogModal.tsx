import { X } from 'lucide-react'
import type { ActionLogEntry } from '../types'

const ACTION_META: Record<string, { color: string; label: string }> = {
  warned:           { color: '#F39C12', label: 'Warning sent'       },
  terminated:       { color: '#E74C3C', label: 'Stream terminated'  },
  suspended:        { color: '#F39C12', label: 'User suspended'     },
  banned:           { color: '#E74C3C', label: 'User banned'        },
  reinstated:       { color: '#2ECC8A', label: 'User reinstated'    },
  ip_banned:        { color: '#E74C3C', label: 'IP banned'          },
  balance_adjusted: { color: '#3498DB', label: 'Balance adjusted'   },
}

const fallbackMeta = { color: '#8A8A8E', label: 'Action' }

interface Props {
  title: string
  entries: ActionLogEntry[]
  onClose: () => void
}

export default function ActionLogModal({ title, entries, onClose }: Props) {
  return (
    <div className="modal-overlay" style={{ zIndex: 600 }} onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Action Log</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{title}</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {entries.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No actions recorded yet.
            </div>
          ) : [...entries].reverse().map((entry, i) => {
            const meta = ACTION_META[entry.action] ?? { ...fallbackMeta, label: entry.action }
            return (
              <div key={entry.id} style={{
                display: 'flex', gap: 14, padding: '14px 20px',
                borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ paddingTop: 5, flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: meta.color }}>{meta.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>by {entry.adminName}</span>
                  </div>
                  {entry.note && (
                    <div style={{ marginTop: 5, fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-surface-2)', borderRadius: 8, padding: '6px 10px', lineHeight: 1.5 }}>
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

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
