import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { useStore } from '../store'
import type { WarnMessageType } from '../types'

interface Props {
  targetLabel: string
  context: Exclude<WarnMessageType, 'all'>
  onConfirm: (warnTitle: string) => void
  onClose: () => void
}

export default function WarnModal({ targetLabel, context, onConfirm, onClose }: Props) {
  const { warnMessages } = useStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const applicableMessages = warnMessages.filter(m => m.appliesTo === context || m.appliesTo === 'all')

  const handleSend = () => {
    const msg = applicableMessages.find(m => m.id === selectedId)
    if (!msg) return
    onConfirm(msg.title)
    onClose()
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 400 }} onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(243,156,18,0.12)', border: '1px solid rgba(243,156,18,0.25)' }}>
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
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Select a warning template to send:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {applicableMessages.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '12px 0' }}>
                No warning templates available for this type yet.
              </div>
            ) : applicableMessages.map(msg => (
              <button
                key={msg.id}
                onClick={() => setSelectedId(msg.id)}
                style={{
                  textAlign: 'left', padding: '10px 14px', borderRadius: 8, border: 'none',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: selectedId === msg.id ? 'rgba(243,156,18,0.1)' : 'var(--bg-surface-2)',
                  outline: selectedId === msg.id ? '1.5px solid rgba(243,156,18,0.45)' : '1px solid var(--border)',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
              >
                <span style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 3, border: selectedId === msg.id ? '5px solid #F39C12' : '2px solid var(--border)', background: 'transparent', transition: 'border 0.15s' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selectedId === msg.id ? '#F39C12' : 'var(--text-primary)', marginBottom: 2 }}>{msg.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{msg.message}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-warn btn-sm" onClick={handleSend} disabled={!selectedId} style={{ opacity: selectedId ? 1 : 0.45 }}>
            <AlertTriangle size={12} /> Send Warning
          </button>
        </div>
      </div>
    </div>
  )
}
