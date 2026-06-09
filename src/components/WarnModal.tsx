import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { useStore } from '../store'

interface Props {
  targetLabel: string
  onConfirm: (message: string) => void
  onClose: () => void
}

export default function WarnModal({ targetLabel, onConfirm, onClose }: Props) {
  const { warnMessages } = useStore()
  const [selected, setSelected] = useState<string | null>(null)

  const handleSend = () => {
    if (!selected) return
    onConfirm(selected)
    onClose()
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 400 }} onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 500 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(243,156,18,0.12)', border: '1px solid rgba(243,156,18,0.25)',
            }}>
              <AlertTriangle size={14} color="#F39C12" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Send Warning</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{targetLabel}</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="modal-body">
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            Select a warning message to send:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {warnMessages.map(msg => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg.label)}
                style={{
                  textAlign: 'left', padding: '10px 14px', borderRadius: 8, border: 'none',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: selected === msg.label
                    ? 'rgba(243,156,18,0.1)'
                    : 'var(--bg-surface-2)',
                  outline: selected === msg.label
                    ? '1.5px solid rgba(243,156,18,0.45)'
                    : '1px solid var(--border)',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  border: selected === msg.label ? '5px solid #F39C12' : '2px solid var(--border)',
                  background: 'transparent',
                  transition: 'border 0.15s',
                }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {msg.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{
          padding: '14px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'flex-end', gap: 8,
        }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-warn btn-sm"
            onClick={handleSend}
            disabled={!selected}
            style={{ opacity: selected ? 1 : 0.45 }}
          >
            <AlertTriangle size={12} /> Send Warning
          </button>
        </div>
      </div>
    </div>
  )
}
