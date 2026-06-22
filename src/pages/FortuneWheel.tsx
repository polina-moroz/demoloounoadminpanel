import { useState, useRef } from 'react'
import { Save, Upload, X, ChevronDown, ChevronRight, Plus, Trash2, Pencil } from 'lucide-react'
import { useStore } from '../store'
import { mockSeasonalWheels } from '../mockData'
import type { WheelSegment, WheelSegmentType, SeasonalWheel, WheelSlot } from '../types'

const SEGMENT_TYPE_META: Record<WheelSegmentType, { label: string; color: string; bg: string; border: string }> = {
  small_bonus: { label: 'Small Bonus', color: '#3498DB', bg: 'rgba(52,152,219,0.1)',   border: 'rgba(52,152,219,0.25)'  },
  big_bonus:   { label: 'Mega Bonus',  color: '#9B66CC', bg: 'rgba(155,102,204,0.1)', border: 'rgba(155,102,204,0.25)' },
}

const SLOT_KIND_META: Record<WheelSlot['kind'], { label: string; color: string; bg: string }> = {
  reward:      { label: 'Reward',      color: '#2ECC8A', bg: 'rgba(46,204,138,0.1)'  },
  small_bonus: { label: 'Small Bonus', color: '#3498DB', bg: 'rgba(52,152,219,0.1)'  },
  big_bonus:   { label: 'Mega Bonus',  color: '#9B66CC', bg: 'rgba(155,102,204,0.1)' },
}

const DEFAULT_SEGMENTS: WheelSegment[] = [
  { id: 'ws1', type: 'small_bonus', label: 'Small Bonus Gift', coins: 50000,  diamonds: 0, animationFileName: null },
  { id: 'ws2', type: 'small_bonus', label: 'Small Bonus Gift', coins: 50000,  diamonds: 0, animationFileName: null },
  { id: 'ws3', type: 'big_bonus',   label: 'Mega Bonus Gift',  coins: 150000, diamonds: 0, animationFileName: null },
  { id: 'ws4', type: 'big_bonus',   label: 'Mega Bonus Gift',  coins: 150000, diamonds: 0, animationFileName: null },
]

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function defaultSlots(): WheelSlot[] {
  return [
    { id: uid(), kind: 'reward',      rewardName: '', coins: 2500,   diamonds: 0, animationFileName: null },
    { id: uid(), kind: 'reward',      rewardName: '', coins: 2500,   diamonds: 0, animationFileName: null },
    { id: uid(), kind: 'reward',      rewardName: '', coins: 2500,   diamonds: 0, animationFileName: null },
    { id: uid(), kind: 'small_bonus', rewardName: '', coins: 50000,  diamonds: 0, animationFileName: null },
    { id: uid(), kind: 'big_bonus',   rewardName: '', coins: 150000, diamonds: 0, animationFileName: null },
  ]
}

/* ── Reusable animation upload field ─────────────────────────── */

function AnimField({ label, fileName, onChange }: {
  label: string
  fileName: string | null
  onChange: (name: string | null) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div>
      {label && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>}
      {fileName ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: 'var(--bg-surface-3, #1A1A20)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {fileName}
          </span>
          <button className="btn btn-ghost btn-icon" style={{ width: 20, height: 20, color: 'var(--text-muted)', flexShrink: 0 }}
            onClick={() => onChange(null)}>
            <X size={11} />
          </button>
        </div>
      ) : (
        <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', fontSize: 12 }}
          onClick={() => ref.current?.click()}>
          <Upload size={12} /> Upload
        </button>
      )}
      <input ref={ref} type="file" accept=".json" style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onChange(file.name)
          e.target.value = ''
        }} />
    </div>
  )
}

/* ── Milestone segment card ───────────────────────────────────── */

function SegmentCard({ segment, index, onChange }: {
  segment: WheelSegment
  index: number
  onChange: (id: string, updates: Partial<WheelSegment>) => void
}) {
  const meta = SEGMENT_TYPE_META[segment.type]

  return (
    <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
          textTransform: 'uppercase', letterSpacing: '0.5px',
          background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
        }}>
          {meta.label}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Slot {index + 1}</span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Gift Name</div>
        <input className="form-input" value={segment.label}
          onChange={e => onChange(segment.id, { label: e.target.value })}
          style={{ width: '100%' }} placeholder="Enter gift name" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Coins 🪙</div>
          <input className="form-input" type="number" min={0} value={segment.coins}
            onChange={e => onChange(segment.id, { coins: Number(e.target.value) })}
            style={{ width: '100%' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Diamonds 💎</div>
          <input className="form-input" type="number" min={0} value={segment.diamonds}
            onChange={e => onChange(segment.id, { diamonds: Number(e.target.value) })}
            style={{ width: '100%' }} />
        </div>
      </div>

      <AnimField label="Gift Animation" fileName={segment.animationFileName}
        onChange={name => onChange(segment.id, { animationFileName: name })} />
    </div>
  )
}

/* ── Seasonal wheel slot row ──────────────────────────────────── */

function SlotRow({ slot, onUpdate }: {
  slot: WheelSlot
  onUpdate: (updates: Partial<WheelSlot>) => void
}) {
  const meta = SLOT_KIND_META[slot.kind]
  const isReward = slot.kind === 'reward'
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.05))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, flexShrink: 0,
          textTransform: 'uppercase', letterSpacing: '0.4px',
          background: meta.bg, color: meta.color, border: `1px solid ${meta.color}35`,
        }}>
          {meta.label}
        </span>
        <input
          className="form-input"
          value={slot.rewardName}
          onChange={e => onUpdate({ rewardName: e.target.value })}
          style={{ flex: 1, fontSize: 12 }}
          placeholder="Reward name"
        />
        <div style={{ flexShrink: 0 }}>
          {slot.animationFileName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {slot.animationFileName}
              </span>
              <button className="btn btn-ghost btn-icon" style={{ width: 18, height: 18, color: 'var(--text-muted)' }}
                onClick={() => onUpdate({ animationFileName: null })}>
                <X size={10} />
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, gap: 4 }} onClick={() => ref.current?.click()}>
              <Upload size={11} /> Anim
            </button>
          )}
          <input ref={ref} type="file" accept=".json" style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) onUpdate({ animationFileName: file.name })
              e.target.value = ''
            }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, paddingLeft: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>🪙</span>
          {isReward ? (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{slot.coins.toLocaleString()}</span>
          ) : (
            <input className="form-input" type="number" min={0} value={slot.coins}
              onChange={e => onUpdate({ coins: Number(e.target.value) })}
              style={{ width: 90, fontSize: 12 }} />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>💎</span>
          <input className="form-input" type="number" min={0} value={slot.diamonds}
            onChange={e => onUpdate({ diamonds: Number(e.target.value) })}
            style={{ width: 90, fontSize: 12 }} />
        </div>
      </div>
    </div>
  )
}

/* ── Seasonal wheel card ──────────────────────────────────────── */

function SeasonalWheelCard({ wheel, onChange, onDelete, onActivate }: {
  wheel: SeasonalWheel
  onChange: (id: string, updates: Partial<SeasonalWheel>) => void
  onDelete: (id: string) => void
  onActivate: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal] = useState(wheel.name)

  const commitName = () => {
    if (nameVal.trim()) onChange(wheel.id, { name: nameVal.trim() })
    else setNameVal(wheel.name)
    setEditingName(false)
  }

  const updateSlot = (slotId: string, updates: Partial<WheelSlot>) =>
    onChange(wheel.id, { slots: wheel.slots.map(s => s.id === slotId ? { ...s, ...updates } : s) })

  return (
    <div style={{ background: 'var(--bg-surface-2)', border: `1px solid ${wheel.active ? 'rgba(46,204,138,0.35)' : 'var(--border)'}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <label className="toggle" onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={wheel.active}
            onChange={() => { if (!wheel.active) onActivate(wheel.id) }} />
          <span className="toggle-track" />
        </label>

        {editingName ? (
          <input
            className="form-input"
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => {
              if (e.key === 'Enter') commitName()
              if (e.key === 'Escape') { setNameVal(wheel.name); setEditingName(false) }
            }}
            style={{ flex: 1, fontSize: 13, fontWeight: 700 }}
            autoFocus
          />
        ) : (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: wheel.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {wheel.name}
            </div>
            <div style={{ fontSize: 11, color: wheel.active ? '#2ECC8A' : 'var(--text-muted)', marginTop: 1 }}>
              {wheel.active ? 'Active' : 'Inactive'}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28, color: 'var(--text-muted)' }}
            title="Rename" onClick={() => setEditingName(true)}>
            <Pencil size={13} />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(v => !v)} style={{ gap: 4, fontSize: 12 }}>
            {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            {expanded ? 'Collapse' : 'Edit'}
          </button>
          <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28, color: '#E74C3C' }}
            title="Delete season" onClick={() => onDelete(wheel.id)}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ paddingTop: 12, marginBottom: 14 }}>
            <AnimField
              label="Season Animation"
              fileName={wheel.seasonAnimationFileName}
              onChange={name => onChange(wheel.id, { seasonAnimationFileName: name })}
            />
          </div>
          {wheel.slots.map(slot => (
            <SlotRow key={slot.id} slot={slot} onUpdate={updates => updateSlot(slot.id, updates)} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main page ────────────────────────────────────────────────── */

export default function FortuneWheel() {
  const { toast } = useStore()
  const [segments, setSegments] = useState<WheelSegment[]>(DEFAULT_SEGMENTS)
  const [rareThreshold, setRareThreshold] = useState(500)
  const [megaThreshold, setMegaThreshold] = useState(1000)
  const [seasonalWheels, setSeasonalWheels] = useState<SeasonalWheel[]>(mockSeasonalWheels)
  const [mainWheelAnim, setMainWheelAnim] = useState<string | null>(null)

  const thresholdValid = megaThreshold > rareThreshold

  const updateSegment = (id: string, updates: Partial<WheelSegment>) =>
    setSegments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))

  const updateWheel = (id: string, updates: Partial<SeasonalWheel>) =>
    setSeasonalWheels(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))

  const activateSeason = (id: string) =>
    setSeasonalWheels(prev => prev.map(w => ({ ...w, active: w.id === id })))

  const deleteSeason = (id: string) =>
    setSeasonalWheels(prev => prev.filter(w => w.id !== id))

  const addSeason = () => {
    setSeasonalWheels(prev => [...prev, {
      id: uid(),
      name: 'New Season',
      active: false,
      seasonAnimationFileName: null,
      slots: defaultSlots(),
    }])
  }

  const handleSave = () => {
    if (!thresholdValid) {
      toast('Mega Bonus threshold must be greater than Small Bonus threshold', 'error')
      return
    }
    toast('Fortune Wheel configuration saved', 'success')
  }

  const activeSeason = seasonalWheels.find(w => w.active)

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

      {/* Milestone Bonuses */}
      <div className="table-wrapper" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Milestone Bonuses
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>
          The outcome is determined by the platform-wide spin counter — not random. The viewer who triggers a milestone causes the reward to fire.
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220, padding: '14px 16px', borderRadius: 10, background: 'rgba(52,152,219,0.07)', border: '1px solid rgba(52,152,219,0.2)' }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(52,152,219,0.15)', color: '#3498DB', border: '1px solid rgba(52,152,219,0.3)', display: 'inline-block', marginBottom: 12 }}>
              Small Bonus
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Every</span>
              <input className="form-input" type="number" min={1} value={rareThreshold}
                onChange={e => setRareThreshold(Number(e.target.value))} style={{ width: 90 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Spin #{rareThreshold}, #{rareThreshold * 2}, #{rareThreshold * 3}, …
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 220, padding: '14px 16px', borderRadius: 10, background: 'rgba(155,102,204,0.07)', border: `1px solid ${thresholdValid ? 'rgba(155,102,204,0.2)' : 'rgba(231,76,60,0.4)'}` }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(155,102,204,0.15)', color: '#9B66CC', border: '1px solid rgba(155,102,204,0.3)', display: 'inline-block', marginBottom: 12 }}>
              Mega Bonus
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Every</span>
              <input className="form-input" type="number" min={1} value={megaThreshold}
                onChange={e => setMegaThreshold(Number(e.target.value))}
                style={{ width: 90, borderColor: thresholdValid ? undefined : 'rgba(231,76,60,0.6)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins</span>
            </div>
            <div style={{ fontSize: 11, color: thresholdValid ? 'var(--text-muted)' : '#E74C3C' }}>
              {thresholdValid
                ? `Spin #${megaThreshold}, #${megaThreshold * 2}, #${megaThreshold * 3}, …`
                : 'Must be greater than Small Bonus threshold'}
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Slots */}
      <div className="table-wrapper" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <div className="table-title">Milestone Slots</div>
          <div className="table-subtitle" style={{ marginTop: 2 }}>
            2 small bonus · 2 mega bonus — names, amounts and animations are editable
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {segments.map((seg, i) => (
            <SegmentCard key={seg.id} segment={seg} index={i} onChange={updateSegment} />
          ))}
        </div>
      </div>

      {/* Seasonal Wheels */}
      <div className="table-wrapper" style={{ padding: '16px 20px' }}>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div className="table-title">Seasonal Wheels</div>
            <div className="table-subtitle" style={{ marginTop: 2 }}>
              {activeSeason ? `${activeSeason.name} is active` : 'No active season'}
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={addSeason} style={{ gap: 6, flexShrink: 0 }}>
            <Plus size={13} /> Add Season
          </button>
        </div>

        <div style={{ marginBottom: 16, padding: '14px 16px', background: 'var(--bg-surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <AnimField
            label="Main Wheel Animation (spinning base)"
            fileName={mainWheelAnim}
            onChange={setMainWheelAnim}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {seasonalWheels.map(wheel => (
            <SeasonalWheelCard
              key={wheel.id}
              wheel={wheel}
              onChange={updateWheel}
              onDelete={deleteSeason}
              onActivate={activateSeason}
            />
          ))}
          {seasonalWheels.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No seasons yet — click "Add Season" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
