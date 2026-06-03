import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'
import { useStore } from '../store'
import type { ToastVariant } from '../store'

const icons: Record<ToastVariant, JSX.Element> = {
  success: <CheckCircle size={15} />,
  error:   <XCircle size={15} />,
  warn:    <AlertTriangle size={15} />,
  info:    <Info size={15} />,
}

const colors: Record<ToastVariant, { bg: string; color: string; border: string }> = {
  success: { bg: 'rgba(46,204,138,0.12)',  color: '#2ECC8A', border: 'rgba(46,204,138,0.25)' },
  error:   { bg: 'rgba(192,57,43,0.12)',   color: '#E05C6A', border: 'rgba(192,57,43,0.25)' },
  warn:    { bg: 'rgba(243,156,18,0.12)',  color: '#F39C12', border: 'rgba(243,156,18,0.25)' },
  info:    { bg: 'rgba(52,152,219,0.12)',  color: '#5DADE2', border: 'rgba(52,152,219,0.25)' },
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useStore()

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      display: 'flex', flexDirection: 'column', gap: 8,
      zIndex: 9999, pointerEvents: 'none',
    }}>
      {toasts.map(t => {
        const c = colors[t.variant]
        return (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#1C1C22',
            border: `1px solid ${c.border}`,
            borderLeft: `3px solid ${c.color}`,
            borderRadius: 10,
            padding: '11px 14px',
            fontSize: 13, color: '#fff',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            minWidth: 280, maxWidth: 380,
            pointerEvents: 'all',
            animation: 'toastIn 0.22s ease',
          }}>
            <span style={{ color: c.color, flexShrink: 0 }}>{icons[t.variant]}</span>
            <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
            <button
              onClick={() => dismissToast(t.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, flexShrink: 0 }}
            >
              <X size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
