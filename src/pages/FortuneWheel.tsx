import { useState, useRef } from 'react'
import { Save, Upload, X } from 'lucide-react'
import { useStore } from '../store'
import type { WheelSegment, WheelSegmentType } from '../types'

const SEGMENT_TYPE_META: Record<WheelSegmentType, { label: string; color: string; bg: string; border: string; description: string }> = {
  'rare': {
    label: 'Rare',
    color: '#3498DB',
    bg: 'rgba(52,152,219,0.1)',
    border: 'rgba(52,152,219,0.25)',
    description: 'Triggers every rare milestone',
  },
  'ultra-rare': {
    label: 'Ultra-Rare',
    color: '#9B66CC',
    bg: 'rgba(155,102,204,0.1)',
    border: 'rgba(155,102,204,0.25)',
    description: 'Triggers every ultra-rare milestone',
  },
  'miss': {
    label: 'Miss',
    color: '#8A8A8E',
    bg: 'rgba(138,138,142,0.08)',
    border: 'rgba(138,138,142,0.2)',
    description: 'No reward — most spins land here',
  },
}

const DEFAULT_SEGMENTS: WheelSegment[] = [
  { id: 'ws1', type: 'rare',       label: 'Rare Gift',       color: '#3498DB', animationFileName: null },
  { id: 'ws2', type: 'rare',       label: 'Rare Gift',       color: '#2980B9', animationFileName: null },
  { id: 'ws3', type: 'ultra-rare', label: 'Ultra-Rare Gift', color: '#9B66CC', animationFileName: null },
  { id: 'ws4', type: 'ultra-rare', label: 'Ultra-Rare Gift', color: '#7B52AB', animationFileName: null },
  { id: 'ws5', type: 'miss',       label: 'Miss',            color: '#3A3A40', animationFileName: null },
]

function SegmentCard({
  segment,
  index,
  onChange,
}: {
  segment: WheelSegment
  index: number
  onChange: (id: string, updates: Partial<WheelSegment>) => void
}) {
  const meta = SEGMENT_TYPE_META[segment.type]
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div style={{
      background: 'var(--bg-surface-2)',
      border: `1px solid var(--border)`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Colour strip */}
      <div style={{ height: 5, background: segment.color }} />

      <div style={{ padding: '16px 18px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
              textTransform: 'uppercase', letterSpacing: '0.5px',
              background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
            }}>
              {meta.label}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Slot {index + 1}</span>
          </div>
          {/* Colour picker */}
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: segment.color,
              border: '2px solid rgba(255,255,255,0.12)',
            }} />
            <input
              type="color"
              value={segment.color}
              onChange={e => onChange(segment.id, { color: e.target.value })}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
            />
          </label>
        </div>

        {/* Label */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Gift Name</div>
          <input
            className="form-input"
            value={segment.label}
            onChange={e => onChange(segment.id, { label: e.target.value })}
            style={{ width: '100%' }}
            placeholder="Enter gift name"
          />
        </div>

        {/* Animation upload */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>
            Gift Animation
          </div>
          {segment.animationFileName ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: 8,
              background: 'var(--bg-surface-3, #1A1A20)', border: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 13 }}>🎞</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {segment.animationFileName}
              </span>
              <button
                className="btn btn-ghost btn-icon"
                style={{ width: 20, height: 20, color: 'var(--text-muted)', flexShrink: 0 }}
                onClick={() => onChange(segment.id, { animationFileName: null })}
                title="Remove animation"
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={12} /> Upload GIF / Lottie
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".gif,.json,.lottie"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) onChange(segment.id, { animationFileName: file.name })
              e.target.value = ''
            }}
          />
          <div style={{ fontSize: 10, color: 'var(--text-subtle, #555)', marginTop: 5 }}>
            Accepted: .gif · .json (Lottie) · .lottie
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FortuneWheel() {
  const { toast } = useStore()
  const [segments, setSegments] = useState<WheelSegment[]>(DEFAULT_SEGMENTS)
  const [wheelEnabled, setWheelEnabled] = useState(true)
  const [rareThreshold, setRareThreshold] = useState(500)
  const [ultraRareThreshold, setUltraRareThreshold] = useState(1000)

  const thresholdValid = ultraRareThreshold > rareThreshold

  const updateSegment = (id: string, updates: Partial<WheelSegment>) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const handleSave = () => {
    if (!thresholdValid) {
      toast('Ultra-rare threshold must be greater than rare threshold', 'error')
      return
    }
    toast('Fortune Wheel configuration saved', 'success')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Fortune Wheel</div>
          <div className="subtitle">5 fixed segments · counter-based milestones · no probability system</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={13} /> Save Config
          </button>
        </div>
      </div>

      {/* Global settings */}
      <div className="table-wrapper" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Global Settings
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label className="toggle">
              <input type="checkbox" checked={wheelEnabled} onChange={e => setWheelEnabled(e.target.checked)} />
              <span className="toggle-track" />
            </label>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Wheel Active</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Feature visible to users</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 16 }}>∞</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Unlimited Spins</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No cooldown · 1 spin = 1 donation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone bonuses */}
      <div className="table-wrapper" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Milestone Bonuses
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>
          The outcome is not random — it is determined purely by the spin counter on the streamer's wheel.
          All other spins are a miss. The viewer who triggers a milestone spin causes the streamer to receive the bonus gift.
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Rare */}
          <div style={{
            flex: 1, minWidth: 220, padding: '14px 16px', borderRadius: 10,
            background: 'rgba(52,152,219,0.07)', border: '1px solid rgba(52,152,219,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                textTransform: 'uppercase', letterSpacing: '0.5px',
                background: 'rgba(52,152,219,0.15)', color: '#3498DB', border: '1px solid rgba(52,152,219,0.3)',
              }}>Rare</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>bonus threshold</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Every</span>
              <input
                className="form-input"
                type="number"
                min={1}
                value={rareThreshold}
                onChange={e => setRareThreshold(Number(e.target.value))}
                style={{ width: 90 }}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              Spin #{rareThreshold}, #{rareThreshold * 2}, #{rareThreshold * 3}, …
            </div>
          </div>

          {/* Ultra-Rare */}
          <div style={{
            flex: 1, minWidth: 220, padding: '14px 16px', borderRadius: 10,
            background: 'rgba(155,102,204,0.07)', border: `1px solid ${thresholdValid ? 'rgba(155,102,204,0.2)' : 'rgba(231,76,60,0.4)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                textTransform: 'uppercase', letterSpacing: '0.5px',
                background: 'rgba(155,102,204,0.15)', color: '#9B66CC', border: '1px solid rgba(155,102,204,0.3)',
              }}>Ultra-Rare</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>bonus threshold</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Every</span>
              <input
                className="form-input"
                type="number"
                min={1}
                value={ultraRareThreshold}
                onChange={e => setUltraRareThreshold(Number(e.target.value))}
                style={{ width: 90, borderColor: thresholdValid ? undefined : 'rgba(231,76,60,0.6)' }}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins</span>
            </div>
            <div style={{ fontSize: 11, marginTop: 8, color: thresholdValid ? 'var(--text-muted)' : '#E74C3C' }}>
              {thresholdValid
                ? `Spin #${ultraRareThreshold}, #${ultraRareThreshold * 2}, #${ultraRareThreshold * 3}, …`
                : '⚠ Must be greater than the rare threshold'}
            </div>
          </div>

          {/* Miss info */}
          <div style={{
            flex: 1, minWidth: 220, padding: '14px 16px', borderRadius: 10,
            background: 'rgba(138,138,142,0.06)', border: '1px solid rgba(138,138,142,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                textTransform: 'uppercase', letterSpacing: '0.5px',
                background: 'rgba(138,138,142,0.12)', color: '#8A8A8E', border: '1px solid rgba(138,138,142,0.2)',
              }}>Miss</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>all other spins</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Spins {rareThreshold - 1 > 0 ? `#1–#${rareThreshold - 1}` : ''} between milestones land here.
              No reward is given — the wheel animation plays and lands on a miss segment.
            </div>
          </div>
        </div>
      </div>

      {/* Segments */}
      <div className="table-wrapper" style={{ padding: '16px 20px' }}>
        <div style={{ marginBottom: 16 }}>
          <div className="table-title">Wheel Segments</div>
          <div className="table-subtitle" style={{ marginTop: 2 }}>
            2 rare · 2 ultra-rare · 1 miss — types are fixed, labels and animations are editable
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {segments.map((seg, i) => (
            <SegmentCard key={seg.id} segment={seg} index={i} onChange={updateSegment} />
          ))}
        </div>
      </div>
    </div>
  )
}
