import { useState, useRef } from 'react'
import { Save, Upload, X, ChevronDown, ChevronRight } from 'lucide-react'
import { useStore } from '../store'
import { mockSeasonalWheels } from '../mockData'
import type { WheelSegment, WheelSegmentType, SeasonalWheel, WheelSlot } from '../types'

const SEGMENT_TYPE_META: Record<WheelSegmentType, { label: string; color: string; bg: string; border: string; description: string; coins: number }> = {
  'small_bonus': {
    label: 'Small Bonus',
    color: '#3498DB',
    bg: 'rgba(52,152,219,0.1)',
    border: 'rgba(52,152,219,0.25)',
    description: 'Triggers every 500 platform-wide spins',
    coins: 50000,
  },
  'big_bonus': {
    label: 'Big Bonus',
    color: '#9B66CC',
    bg: 'rgba(155,102,204,0.1)',
    border: 'rgba(155,102,204,0.25)',
    description: 'Triggers every 1,000 platform-wide spins',
    coins: 150000,
  },
  'miss': {
    label: 'Miss',
    color: '#8A8A8E',
    bg: 'rgba(138,138,142,0.08)',
    border: 'rgba(138,138,142,0.2)',
    description: 'No reward — most spins land here',
    coins: 0,
  },
}

const SLOT_KIND_META: Record<WheelSlot['kind'], { label: string; color: string; bg: string; coins: number }> = {
  reward:      { label: 'Reward',      color: '#2ECC8A', bg: 'rgba(46,204,138,0.1)',  coins: 2500  },
  small_bonus: { label: 'Small Bonus', color: '#3498DB', bg: 'rgba(52,152,219,0.1)',  coins: 50000 },
  big_bonus:   { label: 'Big Bonus',   color: '#9B66CC', bg: 'rgba(155,102,204,0.1)', coins: 150000 },
}

const DEFAULT_SEGMENTS: WheelSegment[] = [
  { id: 'ws1', type: 'small_bonus', label: 'Small Bonus Gift', color: '#3498DB', animationFileName: null },
  { id: 'ws2', type: 'small_bonus', label: 'Small Bonus Gift', color: '#2980B9', animationFileName: null },
  { id: 'ws3', type: 'big_bonus',   label: 'Big Bonus Gift',   color: '#9B66CC', animationFileName: null },
  { id: 'ws4', type: 'big_bonus',   label: 'Big Bonus Gift',   color: '#7B52AB', animationFileName: null },
  { id: 'ws5', type: 'miss',        label: 'Miss',             color: '#3A3A40', animationFileName: null },
]

/* ── Milestone segment card ───────────────────────────────────── */

function SegmentCard({ segment, index, onChange }: {
  segment: WheelSegment
  index: number
  onChange: (id: string, updates: Partial<WheelSegment>) => void
}) {
  const meta = SEGMENT_TYPE_META[segment.type]
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ height: 5, background: segment.color }} />
      <div style={{ padding: '16px 18px' }}>
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
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: segment.color, border: '2px solid rgba(255,255,255,0.12)' }} />
            <input type="color" value={segment.color} onChange={e => onChange(segment.id, { color: e.target.value })}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
          </label>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Gift Name</div>
          <input className="form-input" value={segment.label}
            onChange={e => onChange(segment.id, { label: e.target.value })}
            style={{ width: '100%' }} placeholder="Enter gift name" />
        </div>

        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Gift Animation</div>
          {segment.animationFileName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--bg-surface-3, #1A1A20)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {segment.animationFileName}
              </span>
              <button className="btn btn-ghost btn-icon" style={{ width: 20, height: 20, color: 'var(--text-muted)', flexShrink: 0 }}
                onClick={() => onChange(segment.id, { animationFileName: null })}>
                <X size={11} />
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
              onClick={() => fileRef.current?.click()}>
              <Upload size={12} /> Upload Animation
            </button>
          )}
          <input ref={fileRef} type="file" accept=".glb,.json" style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) onChange(segment.id, { animationFileName: file.name })
              e.target.value = ''
            }} />
        </div>
      </div>
    </div>
  )
}

/* ── Seasonal wheel slot editor ───────────────────────────────── */

function SlotRow({ slot, onChangeName, onChangeAsset }: {
  slot: WheelSlot
  onChangeName: (name: string) => void
  onChangeAsset: (fileName: string | null) => void
}) {
  const meta = SLOT_KIND_META[slot.kind]
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.05))' }}>
      <span style={{
        fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, flexShrink: 0,
        textTransform: 'uppercase', letterSpacing: '0.4px',
        background: meta.bg, color: meta.color, border: `1px solid ${meta.color}35`,
      }}>
        {meta.label}
      </span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 70, flexShrink: 0 }}>
        {meta.coins.toLocaleString()} 🪙
      </span>
      <input
        className="form-input"
        value={slot.rewardName}
        onChange={e => onChangeName(e.target.value)}
        style={{ flex: 1, fontSize: 12 }}
        placeholder="Reward name"
      />
      <div style={{ flexShrink: 0 }}>
        {slot.animationFileName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {slot.animationFileName}
            </span>
            <button className="btn btn-ghost btn-icon" style={{ width: 18, height: 18, color: 'var(--text-muted)' }}
              onClick={() => onChangeAsset(null)}>
              <X size={10} />
            </button>
          </div>
        ) : (
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, gap: 4 }} onClick={() => fileRef.current?.click()}>
            <Upload size={11} /> Asset
          </button>
        )}
        <input ref={fileRef} type="file" accept=".glb,.json" style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) onChangeAsset(file.name)
            e.target.value = ''
          }} />
      </div>
    </div>
  )
}

/* ── Seasonal wheel card ──────────────────────────────────────── */

function SeasonalWheelCard({ wheel, onChange }: {
  wheel: SeasonalWheel
  onChange: (id: string, updates: Partial<SeasonalWheel>) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const updateSlot = (slotId: string, updates: Partial<WheelSlot>) => {
    onChange(wheel.id, {
      slots: wheel.slots.map(s => s.id === slotId ? { ...s, ...updates } : s),
    })
  }

  return (
    <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <label className="toggle" onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={wheel.active}
            onChange={e => onChange(wheel.id, { active: e.target.checked })} />
          <span className="toggle-track" />
        </label>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: wheel.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {wheel.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
            {wheel.slots.length} slots · {wheel.active ? 'Active' : 'Inactive'}
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setExpanded(v => !v)}
          style={{ gap: 4, fontSize: 12 }}
        >
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          {expanded ? 'Collapse' : 'Edit slots'}
        </button>
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ paddingTop: 10 }}>
            {wheel.slots.map(slot => (
              <SlotRow
                key={slot.id}
                slot={slot}
                onChangeName={name => updateSlot(slot.id, { rewardName: name })}
                onChangeAsset={fileName => updateSlot(slot.id, { animationFileName: fileName })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main page ────────────────────────────────────────────────── */

export default function FortuneWheel() {
  const { toast } = useStore()
  const [segments, setSegments] = useState<WheelSegment[]>(DEFAULT_SEGMENTS)
  const [wheelEnabled, setWheelEnabled] = useState(true)
  const [rareThreshold, setRareThreshold] = useState(500)
  const [ultraRareThreshold, setUltraRareThreshold] = useState(1000)
  const [seasonalWheels, setSeasonalWheels] = useState<SeasonalWheel[]>(mockSeasonalWheels)

  const thresholdValid = ultraRareThreshold > rareThreshold

  const updateSegment = (id: string, updates: Partial<WheelSegment>) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const updateSeasonalWheel = (id: string, updates: Partial<SeasonalWheel>) => {
    setSeasonalWheels(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }

  const handleSave = () => {
    if (!thresholdValid) {
      toast('Big Bonus threshold must be greater than Small Bonus threshold', 'error')
      return
    }
    toast('Fortune Wheel configuration saved', 'success')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Fortune Wheel</div>
          <div className="subtitle">Platform-wide counter · milestone bonuses · seasonal wheels</div>
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
          The outcome is determined purely by the platform-wide spin counter — not random.
          All other spins are a miss. The viewer who triggers a milestone causes the reward to fire.
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Small Bonus */}
          <div style={{ flex: 1, minWidth: 220, padding: '14px 16px', borderRadius: 10, background: 'rgba(52,152,219,0.07)', border: '1px solid rgba(52,152,219,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(52,152,219,0.15)', color: '#3498DB', border: '1px solid rgba(52,152,219,0.3)' }}>
                Small Bonus
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>50,000 coins</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Every</span>
              <input className="form-input" type="number" min={1} value={rareThreshold}
                onChange={e => setRareThreshold(Number(e.target.value))} style={{ width: 90 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              Spin #{rareThreshold}, #{rareThreshold * 2}, #{rareThreshold * 3}, …
            </div>
          </div>

          {/* Big Bonus */}
          <div style={{ flex: 1, minWidth: 220, padding: '14px 16px', borderRadius: 10, background: 'rgba(155,102,204,0.07)', border: `1px solid ${thresholdValid ? 'rgba(155,102,204,0.2)' : 'rgba(231,76,60,0.4)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(155,102,204,0.15)', color: '#9B66CC', border: '1px solid rgba(155,102,204,0.3)' }}>
                Big Bonus
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>150,000 coins</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Every</span>
              <input className="form-input" type="number" min={1} value={ultraRareThreshold}
                onChange={e => setUltraRareThreshold(Number(e.target.value))}
                style={{ width: 90, borderColor: thresholdValid ? undefined : 'rgba(231,76,60,0.6)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins</span>
            </div>
            <div style={{ fontSize: 11, marginTop: 8, color: thresholdValid ? 'var(--text-muted)' : '#E74C3C' }}>
              {thresholdValid
                ? `Spin #${ultraRareThreshold}, #${ultraRareThreshold * 2}, #${ultraRareThreshold * 3}, …`
                : 'Must be greater than Small Bonus threshold'}
            </div>
          </div>

          {/* Miss info */}
          <div style={{ flex: 1, minWidth: 220, padding: '14px 16px', borderRadius: 10, background: 'rgba(138,138,142,0.06)', border: '1px solid rgba(138,138,142,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(138,138,142,0.12)', color: '#8A8A8E', border: '1px solid rgba(138,138,142,0.2)' }}>
                Miss
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>all other spins</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Spins between milestones land here — the wheel animation plays but no reward is given.
            </div>
          </div>
        </div>
      </div>

      {/* Milestone segments */}
      <div className="table-wrapper" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <div className="table-title">Milestone Slots</div>
          <div className="table-subtitle" style={{ marginTop: 2 }}>
            2 small bonus · 2 big bonus · 1 miss — types are fixed, names and animations are editable
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {segments.map((seg, i) => (
            <SegmentCard key={seg.id} segment={seg} index={i} onChange={updateSegment} />
          ))}
        </div>
      </div>

      {/* Seasonal wheels */}
      <div className="table-wrapper" style={{ padding: '16px 20px' }}>
        <div style={{ marginBottom: 16 }}>
          <div className="table-title">Seasonal Wheels</div>
          <div className="table-subtitle" style={{ marginTop: 2 }}>
            {seasonalWheels.filter(w => w.active).length} active · only one wheel should be active at a time
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {seasonalWheels.map(wheel => (
            <SeasonalWheelCard key={wheel.id} wheel={wheel} onChange={updateSeasonalWheel} />
          ))}
        </div>
        <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Each slot accepts .glb (3D) or .json (2D Lottie) animation assets. Reward slots award 2,500 coins; Small Bonus 50,000; Big Bonus 150,000.
        </div>
      </div>
    </div>
  )
}
