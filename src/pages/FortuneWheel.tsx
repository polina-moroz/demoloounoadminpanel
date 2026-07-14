import { useState } from 'react'
import { Save, Upload, X, ChevronDown, ChevronRight, Plus, Trash2, Pencil } from 'lucide-react'
import { useStore } from '../store'
import { mockSeasonalWheels } from '../mockData'
import type { SeasonalWheel, WheelSlot } from '../types'

const KIND_META: Record<WheelSlot['kind'], { label: string; color: string; bg: string }> = {
  reward:      { label: 'Regular',    color: '#2ECC8A', bg: 'rgba(46,204,138,0.1)'  },
  small_bonus: { label: 'Rare',       color: '#3498DB', bg: 'rgba(52,152,219,0.1)'  },
  big_bonus:   { label: 'Super Rare', color: '#9B66CC', bg: 'rgba(155,102,204,0.1)' },
}

function uid() { return Math.random().toString(36).slice(2, 9) }

function defaultSlots(): WheelSlot[] {
  return [
    { id: uid(), kind: 'reward',      rewardName: '', coins: 0, diamonds: 0 },
    { id: uid(), kind: 'reward',      rewardName: '', coins: 0, diamonds: 0 },
    { id: uid(), kind: 'reward',      rewardName: '', coins: 0, diamonds: 0 },
    { id: uid(), kind: 'small_bonus', rewardName: '', coins: 0, diamonds: 0 },
    { id: uid(), kind: 'big_bonus',   rewardName: '', coins: 0, diamonds: 0 },
  ]
}

/* ── Animation upload ────────────────────────────────────────── */

let _animFieldCounter = 0

function AnimField({ label, fileName, onChange }: {
  label?: string
  fileName: string | null
  onChange: (n: string | null) => void
}) {
  const [id] = useState(() => `anim-field-${++_animFieldCounter}`)
  return (
    <div>
      {label && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>}
      {fileName ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: 'var(--bg-surface-3, #1A1A20)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
          <button className="btn btn-ghost btn-icon" style={{ width: 20, height: 20, color: 'var(--text-muted)', flexShrink: 0 }} onClick={() => onChange(null)}><X size={11} /></button>
        </div>
      ) : (
        <label htmlFor={id} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', fontSize: 12, cursor: 'pointer' }}>
          <Upload size={12} /> Upload
        </label>
      )}
      <input id={id} type="file" accept=".json" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f.name); e.target.value = '' }} />
    </div>
  )
}

/* ── Seasonal slot row ───────────────────────────────────────── */

function SeasonSlotRow({ slot, onUpdate }: {
  slot: WheelSlot
  onUpdate: (u: Partial<WheelSlot>) => void
}) {
  const meta = KIND_META[slot.kind]
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
            <AnimField label="Wheel Animation (full wheel, gifts included)" fileName={wheel.seasonAnimationFileName}
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

/* ── Shared field styles ─────────────────────────────────────── */

function KindBadge({ kind }: { kind: WheelSlot['kind'] }) {
  const m = KIND_META[kind]
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
      textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0,
      background: m.bg, color: m.color, border: `1px solid ${m.color}40`,
    }}>{m.label}</span>
  )
}

/* ── Main page ───────────────────────────────────────────────── */

export default function FortuneWheel() {
  const { toast } = useStore()

  const [giftPrice,       setGiftPrice]       = useState(2500)
  const [smallThreshold,  setSmallThreshold]  = useState(500)
  const [smallDiamonds,   setSmallDiamonds]   = useState(50000)
  const [megaThreshold,   setMegaThreshold]   = useState(1000)
  const [megaDiamonds,    setMegaDiamonds]    = useState(150000)
  const [seasonalWheels,  setSeasonalWheels]  = useState<SeasonalWheel[]>(mockSeasonalWheels)
  const [mainWheelAnim,   setMainWheelAnim]   = useState<string | null>(null)

  const thresholdValid = megaThreshold > smallThreshold

  const updateWheel  = (id: string, u: Partial<SeasonalWheel>) =>
    setSeasonalWheels(prev => prev.map(w => w.id === id ? { ...w, ...u } : w))
  const activateSeason = (id: string) =>
    setSeasonalWheels(prev => prev.map(w => ({ ...w, active: w.id === id })))
  const deleteSeason = (id: string) =>
    setSeasonalWheels(prev => prev.filter(w => w.id !== id))
  const addSeason    = () =>
    setSeasonalWheels(prev => [...prev, { id: uid(), name: 'New Season', active: false, seasonAnimationFileName: null, slots: defaultSlots() }])

  const handleSave = () => {
    if (!thresholdValid) { toast('Mega Bonus threshold must be greater than Small Bonus', 'error'); return }
    toast('Fortune Wheel configuration saved', 'success')
  }

  const activeSeason = seasonalWheels.find(w => w.active)

  const inputRow = (
    label: string,
    kind: WheelSlot['kind'],
    threshold: number,
    setThreshold: (v: number) => void,
    diamonds: number,
    setDiamonds: (v: number) => void,
    invalid?: boolean,
  ) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '12px 0', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.05))' }}>
      <KindBadge kind={kind} />
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Every</span>
      <input
        className="form-input" type="number" min={1} value={threshold}
        onChange={e => setThreshold(Number(e.target.value))}
        style={{ width: 88, borderColor: invalid ? 'rgba(231,76,60,0.6)' : undefined }}
      />
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins →</span>
      <input
        className="form-input" type="number" min={0} value={diamonds}
        onChange={e => setDiamonds(Number(e.target.value))}
        style={{ width: 108 }}
      />
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>diamonds</span>
      {invalid && <span style={{ fontSize: 11, color: '#E74C3C' }}>must be &gt; Small Bonus</span>}
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Fortune Wheel</div>
          <div className="subtitle">Platform-wide gift counter · milestone bonuses · seasonal wheels</div>
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
            Fortune Wheel is one gift with 5 possible outcomes. When the platform-wide gift count hits a milestone, the streamer receives a diamond bonus.
          </div>
        </div>

        {/* Gift Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', marginBottom: 24, background: 'var(--bg-surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', flex: 1 }}>Gift Price</span>
          <input
            className="form-input" type="number" min={0} value={giftPrice}
            onChange={e => setGiftPrice(Number(e.target.value))}
            style={{ width: 108 }}
          />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>coins</span>
        </div>

        {/* Regular × 3 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.05))', marginBottom: 0 }}>
          <KindBadge kind="reward" />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>3 outcomes · no bonus</span>
        </div>

        {/* Small Bonus */}
        {inputRow('Small Bonus', 'small_bonus', smallThreshold, setSmallThreshold, smallDiamonds, setSmallDiamonds)}

        {/* Mega Bonus */}
        {inputRow('Mega Bonus', 'big_bonus', megaThreshold, setMegaThreshold, megaDiamonds, setMegaDiamonds, !thresholdValid)}
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
