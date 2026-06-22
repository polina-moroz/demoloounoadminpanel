import { useState, useRef } from 'react'
import { Save, Upload, X, ChevronDown, ChevronRight, Plus, Trash2, Pencil } from 'lucide-react'
import { useStore } from '../store'
import { mockSeasonalWheels } from '../mockData'
import type { SeasonalWheel, WheelSlot } from '../types'

const KIND_META: Record<WheelSlot['kind'], { label: string; color: string; bg: string }> = {
  reward:      { label: 'Regular',     color: '#2ECC8A', bg: 'rgba(46,204,138,0.1)'  },
  small_bonus: { label: 'Small Bonus', color: '#3498DB', bg: 'rgba(52,152,219,0.1)'  },
  big_bonus:   { label: 'Mega Bonus',  color: '#9B66CC', bg: 'rgba(155,102,204,0.1)' },
}

const DEFAULT_MILESTONE: WheelSlot[] = [
  { id: 'ms1', kind: 'reward',      rewardName: '', coins: 2500,   diamonds: 0, animationFileName: null },
  { id: 'ms2', kind: 'reward',      rewardName: '', coins: 2500,   diamonds: 0, animationFileName: null },
  { id: 'ms3', kind: 'reward',      rewardName: '', coins: 2500,   diamonds: 0, animationFileName: null },
  { id: 'ms4', kind: 'small_bonus', rewardName: '', coins: 50000,  diamonds: 0, animationFileName: null },
  { id: 'ms5', kind: 'big_bonus',   rewardName: '', coins: 150000, diamonds: 0, animationFileName: null },
]

function uid() { return Math.random().toString(36).slice(2, 9) }

function defaultSlots(): WheelSlot[] {
  return [
    { id: uid(), kind: 'reward',      rewardName: '', coins: 2500,   diamonds: 0, animationFileName: null },
    { id: uid(), kind: 'reward',      rewardName: '', coins: 2500,   diamonds: 0, animationFileName: null },
    { id: uid(), kind: 'reward',      rewardName: '', coins: 2500,   diamonds: 0, animationFileName: null },
    { id: uid(), kind: 'small_bonus', rewardName: '', coins: 50000,  diamonds: 0, animationFileName: null },
    { id: uid(), kind: 'big_bonus',   rewardName: '', coins: 150000, diamonds: 0, animationFileName: null },
  ]
}

/* ── Click-to-edit number ────────────────────────────────────── */

function InlineNum({ value, fixed, onChange }: {
  value: number
  fixed?: boolean
  onChange?: (v: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  if (fixed || !onChange) {
    return <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{value.toLocaleString()}</span>
  }
  if (editing) {
    return (
      <input
        className="form-input"
        type="number" min={0}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { onChange(Number(draft) || 0); setEditing(false) }}
        onKeyDown={e => {
          if (e.key === 'Enter') { onChange(Number(draft) || 0); setEditing(false) }
          if (e.key === 'Escape') setEditing(false)
        }}
        style={{ width: 76, fontSize: 12, padding: '2px 6px', height: 26 }}
        autoFocus
      />
    )
  }
  return (
    <span
      onClick={() => { setDraft(String(value)); setEditing(true) }}
      title="Click to edit"
      style={{
        fontSize: 12, color: 'var(--text-primary)', cursor: 'text',
        borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: 1,
      }}
    >
      {value.toLocaleString()}
    </span>
  )
}

/* ── Animation upload ────────────────────────────────────────── */

function AnimField({ label, fileName, onChange }: {
  label?: string
  fileName: string | null
  onChange: (n: string | null) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div>
      {label && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>}
      {fileName ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: 'var(--bg-surface-3, #1A1A20)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
          <button className="btn btn-ghost btn-icon" style={{ width: 20, height: 20, color: 'var(--text-muted)', flexShrink: 0 }} onClick={() => onChange(null)}><X size={11} /></button>
        </div>
      ) : (
        <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', fontSize: 12 }} onClick={() => ref.current?.click()}>
          <Upload size={12} /> Upload
        </button>
      )}
      <input ref={ref} type="file" accept=".json" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f.name); e.target.value = '' }} />
    </div>
  )
}

/* ── Milestone slot row ──────────────────────────────────────── */

function MilestoneRow({ slot, fixedCoins, onChange }: {
  slot: WheelSlot
  fixedCoins: boolean
  onChange: (u: Partial<WheelSlot>) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.05))' }}>
      <input
        className="form-input"
        value={slot.rewardName}
        onChange={e => onChange({ rewardName: e.target.value })}
        style={{ flex: 1, fontSize: 12 }}
        placeholder="Gift name"
      />

      {/* anim */}
      <div style={{ flexShrink: 0 }}>
        {slot.animationFileName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slot.animationFileName}</span>
            <button className="btn btn-ghost btn-icon" style={{ width: 18, height: 18, color: 'var(--text-muted)' }} onClick={() => onChange({ animationFileName: null })}><X size={10} /></button>
          </div>
        ) : (
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, gap: 4 }} onClick={() => ref.current?.click()}>
            <Upload size={11} /> Anim
          </button>
        )}
        <input ref={ref} type="file" accept=".json" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) onChange({ animationFileName: f.name }); e.target.value = '' }} />
      </div>

      {/* prices inline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 13 }}>🪙</span>
        <InlineNum value={slot.coins} fixed={fixedCoins} onChange={fixedCoins ? undefined : v => onChange({ coins: v })} />
        <span style={{ fontSize: 13, marginLeft: 6 }}>💎</span>
        <InlineNum value={slot.diamonds} onChange={v => onChange({ diamonds: v })} />
      </div>
    </div>
  )
}

/* ── Seasonal slot row (name + anim only, no prices) ─────────── */

function SeasonSlotRow({ slot, onUpdate }: {
  slot: WheelSlot
  onUpdate: (u: Partial<WheelSlot>) => void
}) {
  const meta = KIND_META[slot.kind]
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.05))' }}>
      <span style={{
        fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, flexShrink: 0,
        textTransform: 'uppercase', letterSpacing: '0.4px',
        background: meta.bg, color: meta.color, border: `1px solid ${meta.color}35`,
      }}>{meta.label}</span>
      <input
        className="form-input"
        value={slot.rewardName}
        onChange={e => onUpdate({ rewardName: e.target.value })}
        style={{ flex: 1, fontSize: 12 }}
        placeholder="Gift name"
      />
      <div style={{ flexShrink: 0 }}>
        {slot.animationFileName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slot.animationFileName}</span>
            <button className="btn btn-ghost btn-icon" style={{ width: 18, height: 18, color: 'var(--text-muted)' }} onClick={() => onUpdate({ animationFileName: null })}><X size={10} /></button>
          </div>
        ) : (
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, gap: 4 }} onClick={() => ref.current?.click()}>
            <Upload size={11} /> Anim
          </button>
        )}
        <input ref={ref} type="file" accept=".json" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) onUpdate({ animationFileName: f.name }); e.target.value = '' }} />
      </div>
    </div>
  )
}

/* ── Seasonal wheel card ─────────────────────────────────────── */

function SeasonalWheelCard({ wheel, onChange, onDelete, onActivate }: {
  wheel: SeasonalWheel
  onChange: (id: string, u: Partial<SeasonalWheel>) => void
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
          <input type="checkbox" checked={wheel.active} onChange={() => { if (!wheel.active) onActivate(wheel.id) }} />
          <span className="toggle-track" />
        </label>

        {editingName ? (
          <input className="form-input" value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setNameVal(wheel.name); setEditingName(false) } }}
            style={{ flex: 1, fontSize: 13, fontWeight: 700 }} autoFocus />
        ) : (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: wheel.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{wheel.name}</div>
            <div style={{ fontSize: 11, color: wheel.active ? '#2ECC8A' : 'var(--text-muted)', marginTop: 1 }}>{wheel.active ? 'Active' : 'Inactive'}</div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28, color: 'var(--text-muted)' }} onClick={() => setEditingName(true)}><Pencil size={13} /></button>
          <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(v => !v)} style={{ gap: 4, fontSize: 12 }}>
            {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            {expanded ? 'Collapse' : 'Edit'}
          </button>
          <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28, color: '#E74C3C' }} onClick={() => onDelete(wheel.id)}><Trash2 size={13} /></button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ paddingTop: 12, marginBottom: 14 }}>
            <AnimField label="Season Animation" fileName={wheel.seasonAnimationFileName}
              onChange={name => onChange(wheel.id, { seasonAnimationFileName: name })} />
          </div>
          {wheel.slots.map(slot => (
            <SeasonSlotRow key={slot.id} slot={slot} onUpdate={u => updateSlot(slot.id, u)} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────── */

export default function FortuneWheel() {
  const { toast } = useStore()
  const [milestoneSlots, setMilestoneSlots] = useState<WheelSlot[]>(DEFAULT_MILESTONE)
  const [smallThreshold, setSmallThreshold] = useState(500)
  const [megaThreshold, setMegaThreshold] = useState(1000)
  const [seasonalWheels, setSeasonalWheels] = useState<SeasonalWheel[]>(mockSeasonalWheels)
  const [mainWheelAnim, setMainWheelAnim] = useState<string | null>(null)

  const thresholdValid = megaThreshold > smallThreshold

  const updateMilestone = (id: string, u: Partial<WheelSlot>) =>
    setMilestoneSlots(prev => prev.map(s => s.id === id ? { ...s, ...u } : s))

  const updateWheel = (id: string, u: Partial<SeasonalWheel>) =>
    setSeasonalWheels(prev => prev.map(w => w.id === id ? { ...w, ...u } : w))

  const activateSeason = (id: string) =>
    setSeasonalWheels(prev => prev.map(w => ({ ...w, active: w.id === id })))

  const deleteSeason = (id: string) =>
    setSeasonalWheels(prev => prev.filter(w => w.id !== id))

  const addSeason = () =>
    setSeasonalWheels(prev => [...prev, { id: uid(), name: 'New Season', active: false, seasonAnimationFileName: null, slots: defaultSlots() }])

  const handleSave = () => {
    if (!thresholdValid) { toast('Mega Bonus threshold must be greater than Small Bonus', 'error'); return }
    toast('Fortune Wheel configuration saved', 'success')
  }

  const rewardSlots    = milestoneSlots.filter(s => s.kind === 'reward')
  const smallBonusSlot = milestoneSlots.find(s => s.kind === 'small_bonus')!
  const megaBonusSlot  = milestoneSlots.find(s => s.kind === 'big_bonus')!
  const activeSeason   = seasonalWheels.find(w => w.active)

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Fortune Wheel</div>
          <div className="subtitle">Platform-wide counter · milestone bonuses · seasonal wheels</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleSave}><Save size={13} /> Save Config</button>
        </div>
      </div>

      {/* ── Milestone Slots ── */}
      <div className="table-wrapper" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <div className="table-title">Milestone Slots</div>
          <div className="table-subtitle" style={{ marginTop: 2 }}>
            Outcome determined by platform-wide spin counter — not random. Click 💎 value to edit inline.
          </div>
        </div>

        {/* Regular */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(46,204,138,0.1)', color: '#2ECC8A', border: '1px solid rgba(46,204,138,0.25)' }}>Regular</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>3 slots · 2,500 coins fixed</span>
          </div>
          {rewardSlots.map(slot => (
            <MilestoneRow key={slot.id} slot={slot} fixedCoins onChange={u => updateMilestone(slot.id, u)} />
          ))}
        </div>

        {/* Small Bonus */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(52,152,219,0.1)', color: '#3498DB', border: '1px solid rgba(52,152,219,0.25)' }}>Small Bonus</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Every</span>
              <input className="form-input" type="number" min={1} value={smallThreshold}
                onChange={e => setSmallThreshold(Number(e.target.value))} style={{ width: 80 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins</span>
            </div>
          </div>
          <MilestoneRow slot={smallBonusSlot} fixedCoins={false} onChange={u => updateMilestone(smallBonusSlot.id, u)} />
        </div>

        {/* Mega Bonus */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(155,102,204,0.1)', color: '#9B66CC', border: `1px solid ${thresholdValid ? 'rgba(155,102,204,0.25)' : 'rgba(231,76,60,0.5)'}` }}>Mega Bonus</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Every</span>
              <input className="form-input" type="number" min={1} value={megaThreshold}
                onChange={e => setMegaThreshold(Number(e.target.value))}
                style={{ width: 80, borderColor: thresholdValid ? undefined : 'rgba(231,76,60,0.6)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins</span>
            </div>
            {!thresholdValid && <span style={{ fontSize: 11, color: '#E74C3C' }}>must be &gt; Small Bonus</span>}
          </div>
          <MilestoneRow slot={megaBonusSlot} fixedCoins={false} onChange={u => updateMilestone(megaBonusSlot.id, u)} />
        </div>
      </div>

      {/* ── Seasonal Wheels ── */}
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
          <AnimField label="Main Wheel Animation (spinning base)" fileName={mainWheelAnim} onChange={setMainWheelAnim} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {seasonalWheels.map(wheel => (
            <SeasonalWheelCard key={wheel.id} wheel={wheel}
              onChange={updateWheel} onDelete={deleteSeason} onActivate={activateSeason} />
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
