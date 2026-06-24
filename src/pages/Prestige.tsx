import { useState } from 'react'
import { Edit2, Check, X, Plus, Trash2, Upload } from 'lucide-react'
import { mockXPLevels, mockCPTiers, mockVIPLevels } from '../mockData'
import { useStore } from '../store'
import type { PrestigeXPLevel, PrestigeCPTier, VIPLevel, Perk, PerkType } from '../types'

type Tab = 'xp' | 'cp' | 'vip'

function uid() { return Math.random().toString(36).slice(2, 9) }

/* ── Inline editable cell ─────────────────────────────────────── */

function EditableCell({
  value,
  type = 'text',
  onSave,
  style,
}: {
  value: string | number
  type?: 'text' | 'number'
  onSave: (v: string) => void
  style?: React.CSSProperties
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))

  const commit = () => {
    onSave(draft)
    setEditing(false)
  }
  const cancel = () => {
    setDraft(String(value))
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <input
          autoFocus
          type={type}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }}
          style={{
            background: 'var(--bg-surface-2)', border: '1.5px solid var(--gold)',
            borderRadius: 6, padding: '4px 8px', color: 'var(--text-primary)',
            fontSize: 13, width: type === 'number' ? 100 : 180,
            fontFamily: 'inherit', outline: 'none',
            ...style,
          }}
        />
        <button className="btn btn-success btn-icon" style={{ width: 24, height: 24 }} onClick={commit} title="Save">
          <Check size={11} />
        </button>
        <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }} onClick={cancel} title="Cancel">
          <X size={11} />
        </button>
      </div>
    )
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        cursor: 'text', display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 6px', borderRadius: 6,
        transition: 'background 0.12s',
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.07)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {value}
      <Edit2 size={10} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
    </span>
  )
}

/* ── FileUpload ───────────────────────────────────────────────── */

let _fuCounter = 0
function FileUpload({ label, fileName, accept, onChange }: {
  label?: string; fileName: string | null; accept: string; onChange: (n: string | null) => void
}) {
  const [id] = useState(() => `fu-${++_fuCounter}`)
  return (
    <div>
      {label && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>}
      {fileName ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>{fileName}</span>
          <button className="btn btn-ghost btn-icon" style={{ width: 16, height: 16, color: 'var(--text-muted)' }} onClick={() => onChange(null)}><X size={10} /></button>
        </div>
      ) : (
        <label htmlFor={id} className="btn btn-ghost btn-sm" style={{ fontSize: 10, cursor: 'pointer', gap: 3 }}>
          <Upload size={10} /> Upload
        </label>
      )}
      <input id={id} type="file" accept={accept} style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f.name); e.target.value = '' }} />
    </div>
  )
}

/* ── ColorPickerCell ──────────────────────────────────────────── */

function ColorPickerCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: 26, height: 26, border: 'none', padding: 2, borderRadius: 4, background: 'var(--bg-surface-2)', cursor: 'pointer' }} />
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        className="form-input"
        style={{ fontFamily: 'monospace', fontSize: 11, width: 74, padding: '3px 5px' }} />
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: value, flexShrink: 0, border: '1px solid rgba(255,255,255,0.15)' }} />
    </div>
  )
}

/* ── PerkEditor ───────────────────────────────────────────────── */

const PERK_META: Record<PerkType, { label: string; hasValue: boolean; suffix?: string }> = {
  discovery_boost:      { label: 'Discovery Boost',       hasValue: true,  suffix: '%' },
  spotlight_slots:      { label: 'Spotlight Slots / mo',  hasValue: true,  suffix: '' },
  exclusive_emote_pack: { label: 'Exclusive Emote Pack',  hasValue: false },
  exclusive_gift:       { label: 'Exclusive Gift',        hasValue: false },
  priority_support:     { label: 'Priority Support',      hasValue: false },
  featured_on_discover: { label: 'Featured on Discover',  hasValue: false },
  animated_badge:       { label: 'Animated Badge',        hasValue: false },
  full_screen_entrance: { label: 'Full-Screen Entrance',  hasValue: false },
  account_manager:      { label: 'Account Manager',       hasValue: false },
  custom_ring_color:    { label: 'Custom Ring Color',     hasValue: false },
  chat_effect:          { label: 'Chat Effect',           hasValue: false },
  nameplate:            { label: 'Nameplate',             hasValue: false },
  other:                { label: 'Other (note)',           hasValue: false },
}

function PerkEditor({ perks, onChange }: { perks: Perk[]; onChange: (p: Perk[]) => void }) {
  const add = () => onChange([...perks, { type: 'other' as PerkType }])
  const remove = (i: number) => onChange(perks.filter((_, idx) => idx !== i))
  const upd = (i: number, patch: Partial<Perk>) =>
    onChange(perks.map((p, idx) => idx === i ? { ...p, ...patch } : p))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 220 }}>
      {perks.map((p, i) => {
        const meta = PERK_META[p.type]
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <select value={p.type} className="form-select"
              style={{ fontSize: 11, padding: '2px 4px', flex: '0 0 auto', maxWidth: 160 }}
              onChange={e => upd(i, { type: e.target.value as PerkType, value: undefined, label: undefined })}>
              {(Object.keys(PERK_META) as PerkType[]).map(k => (
                <option key={k} value={k}>{PERK_META[k].label}</option>
              ))}
            </select>
            {meta.hasValue && (
              <input type="number" value={p.value ?? ''} placeholder="val"
                className="form-input"
                style={{ width: 50, fontSize: 11, padding: '2px 4px' }}
                onChange={e => upd(i, { value: Number(e.target.value) })} />
            )}
            {p.type === 'other' && (
              <input type="text" value={p.label ?? ''} placeholder="note…"
                className="form-input"
                style={{ width: 130, fontSize: 11, padding: '2px 4px' }}
                onChange={e => upd(i, { label: e.target.value })} />
            )}
            <button className="btn btn-ghost btn-icon"
              style={{ width: 16, height: 16, color: '#E74C3C', flexShrink: 0 }}
              onClick={() => remove(i)}><X size={9} /></button>
          </div>
        )
      })}
      <button className="btn btn-ghost btn-sm"
        style={{ fontSize: 10, alignSelf: 'flex-start', gap: 3, marginTop: 2 }}
        onClick={add}>
        <Plus size={10} /> perk
      </button>
    </div>
  )
}

/* ── XP Tab ───────────────────────────────────────────────────── */

function XPTab() {
  const { toast } = useStore()
  const [levels, setLevels] = useState<PrestigeXPLevel[]>(mockXPLevels)

  const updateField = (idx: number, field: keyof PrestigeXPLevel, raw: string) => {
    setLevels(prev => {
      const next = [...prev]
      next[idx] = {
        ...next[idx],
        [field]: field === 'xpRequired' || field === 'level' ? Number(raw) : raw,
      }
      return next
    })
    toast('XP level updated', 'success')
  }

  const updatePerks = (idx: number, perks: Perk[]) => {
    setLevels(prev => prev.map((l, i) => i === idx ? { ...l, perks } : l))
  }

  const updateColor = (idx: number, color: string) => {
    setLevels(prev => prev.map((l, i) => i === idx ? { ...l, color } : l))
  }

  const updateFile = (idx: number, field: 'iconFileName' | 'entranceAnimationFileName', val: string | null) => {
    setLevels(prev => prev.map((l, i) => i === idx ? { ...l, [field]: val } : l))
  }

  const removeLevel = (idx: number) => {
    setLevels(prev => prev.filter((_, i) => i !== idx))
  }

  const addLevel = () => {
    setLevels(prev => [...prev, {
      id: uid(), level: 0, levelRange: '0–0', name: 'New Level', color: '#94A3B8',
      xpRequired: 0, iconFileName: null, entranceAnimationFileName: null, perks: []
    }])
  }

  return (
    <div>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          1 gifted coin = 1 XP. Only gifted coins count — buying coins alone does not create XP.
          12 prestige tiers — each spans a level range.
          Click any cell to edit.
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Level Range</th>
              <th>Name</th>
              <th>XP Threshold</th>
              <th>Ring Color</th>
              <th>Icon</th>
              <th>Entrance Anim</th>
              <th>Perks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {levels.map((lvl, i) => (
              <tr key={lvl.id}>
                <td>
                  <EditableCell value={lvl.levelRange} onSave={v => updateField(i, 'levelRange', v)} />
                </td>
                <td>
                  <EditableCell value={lvl.name} onSave={v => updateField(i, 'name', v)}
                    style={{ color: lvl.color, fontWeight: 700 }} />
                </td>
                <td>
                  <EditableCell value={lvl.xpRequired === 0 ? '0' : lvl.xpRequired} type="number"
                    onSave={v => updateField(i, 'xpRequired', v)}
                    style={{ color: 'var(--text-secondary)', fontWeight: 600 }} />
                </td>
                <td>
                  <ColorPickerCell value={lvl.color} onChange={v => updateColor(i, v)} />
                </td>
                <td>
                  <FileUpload fileName={lvl.iconFileName} accept="image/*"
                    onChange={v => updateFile(i, 'iconFileName', v)} />
                </td>
                <td>
                  <FileUpload fileName={lvl.entranceAnimationFileName} accept=".json"
                    onChange={v => updateFile(i, 'entranceAnimationFileName', v)} />
                </td>
                <td>
                  <PerkEditor perks={lvl.perks} onChange={p => updatePerks(i, p)} />
                </td>
                <td>
                  <button className="btn btn-ghost btn-icon" style={{ color: '#E74C3C' }}
                    onClick={() => removeLevel(i)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-ghost btn-sm" style={{ gap: 5 }} onClick={addLevel}>
          <Plus size={13} /> Add Level
        </button>
      </div>
    </div>
  )
}

/* ── CP Tab ───────────────────────────────────────────────────── */

type CPGroup = {
  tier: string; color: string; ringColor: string;
  iconFileName: string | null; entranceAnimationFileName: string | null;
  entries: Array<PrestigeCPTier & { flatIdx: number }>;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

function CPTab() {
  const { toast } = useStore()
  const [tiers, setTiers] = useState<PrestigeCPTier[]>(mockCPTiers)

  const groups = tiers.reduce<CPGroup[]>((acc, t, idx) => {
    const last = acc[acc.length - 1]
    if (last && last.tier === t.tier) {
      last.entries.push({ ...t, flatIdx: idx })
    } else {
      acc.push({ tier: t.tier, color: t.color, ringColor: t.ringColor, iconFileName: t.iconFileName, entranceAnimationFileName: t.entranceAnimationFileName, entries: [{ ...t, flatIdx: idx }] })
    }
    return acc
  }, [])

  const updateEntry = (flatIdx: number, patch: Partial<PrestigeCPTier>) => {
    setTiers(prev => prev.map((t, i) => i === flatIdx ? { ...t, ...patch } : t))
    toast('CP tier updated', 'success')
  }

  const updateGroupFields = (tierName: string, patch: Partial<Pick<PrestigeCPTier, 'tier' | 'color' | 'ringColor' | 'iconFileName' | 'entranceAnimationFileName'>>) => {
    setTiers(prev => prev.map(t => t.tier === tierName ? { ...t, ...patch } : t))
  }

  const removeEntry = (flatIdx: number) => {
    setTiers(prev => prev.filter((_, i) => i !== flatIdx))
  }

  const removeTier = (tierName: string) => {
    if (window.confirm(`Delete entire "${tierName}" tier?`)) {
      setTiers(prev => prev.filter(t => t.tier !== tierName))
    }
  }

  const addSubTier = (group: CPGroup) => {
    const nextRoman = ROMAN_NUMERALS[group.entries.length] ?? String(group.entries.length + 1)
    const newEntry: PrestigeCPTier = {
      id: uid(), tier: group.tier, subTier: nextRoman,
      cpFrom: 0, cpTo: 0,
      color: group.color, ringColor: group.ringColor,
      iconFileName: group.iconFileName, entranceAnimationFileName: group.entranceAnimationFileName,
      perks: [],
    }
    // Insert after last entry of this group
    const lastFlatIdx = group.entries[group.entries.length - 1].flatIdx
    setTiers(prev => {
      const next = [...prev]
      next.splice(lastFlatIdx + 1, 0, newEntry)
      return next
    })
  }

  const addTier = () => {
    const base = { tier: 'New Tier', color: '#94A3B8', ringColor: '#94A3B8', iconFileName: null as null, entranceAnimationFileName: null as null, perks: [] as Perk[] }
    const newEntries: PrestigeCPTier[] = ['I', 'II', 'III', 'IV'].map(sub => ({ ...base, id: uid(), subTier: sub, cpFrom: 0, cpTo: 0 }))
    setTiers(prev => [...prev, ...newEntries])
  }

  return (
    <div>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          1 received diamond / eligible received gift value = 1 CP; amount-based; cashing out does not reduce lifetime CP.
        </div>
      </div>
      <div style={{ overflowX: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map(group => (
          <div key={group.tier} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            {/* Group header */}
            <div style={{ padding: '10px 14px', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: group.color, border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />
              <EditableCell
                value={group.tier}
                onSave={v => updateGroupFields(group.tier, { tier: v })}
                style={{ fontWeight: 700, color: group.color, fontSize: 14 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Ring:</span>
                <ColorPickerCell value={group.ringColor} onChange={v => updateGroupFields(group.tier, { ringColor: v })} />
              </div>
              <FileUpload label="Icon" fileName={group.iconFileName} accept="image/*"
                onChange={v => updateGroupFields(group.tier, { iconFileName: v })} />
              <FileUpload label="Entrance" fileName={group.entranceAnimationFileName} accept=".json"
                onChange={v => updateGroupFields(group.tier, { entranceAnimationFileName: v })} />
              <div style={{ marginLeft: 'auto' }}>
                <button className="btn btn-ghost btn-sm" style={{ color: '#E74C3C', gap: 4, fontSize: 11 }}
                  onClick={() => removeTier(group.tier)}>
                  <Trash2 size={12} /> Delete tier
                </button>
              </div>
            </div>
            {/* Sub-tier mini table */}
            <table style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ fontSize: 11, padding: '6px 12px' }}>Sub-Tier</th>
                  <th style={{ fontSize: 11, padding: '6px 12px' }}>CP From</th>
                  <th style={{ fontSize: 11, padding: '6px 12px' }}>CP To</th>
                  <th style={{ fontSize: 11, padding: '6px 12px' }}>Perks</th>
                  <th style={{ fontSize: 11, padding: '6px 12px' }}></th>
                </tr>
              </thead>
              <tbody>
                {group.entries.map(entry => (
                  <tr key={entry.id}>
                    <td style={{ padding: '6px 12px' }}>
                      <EditableCell value={entry.subTier}
                        onSave={v => updateEntry(entry.flatIdx, { subTier: v })}
                        style={{ color: 'var(--text-muted)', fontSize: 12 }} />
                    </td>
                    <td style={{ padding: '6px 12px' }}>
                      <EditableCell value={entry.cpFrom} type="number"
                        onSave={v => updateEntry(entry.flatIdx, { cpFrom: Number(v) })}
                        style={{ color: 'var(--text-secondary)', fontWeight: 600 }} />
                    </td>
                    <td style={{ padding: '6px 12px' }}>
                      <EditableCell value={entry.cpTo} type="number"
                        onSave={v => updateEntry(entry.flatIdx, { cpTo: Number(v) })}
                        style={{ color: 'var(--text-secondary)', fontWeight: 600 }} />
                    </td>
                    <td style={{ padding: '6px 12px' }}>
                      <PerkEditor perks={entry.perks}
                        onChange={p => updateEntry(entry.flatIdx, { perks: p })} />
                    </td>
                    <td style={{ padding: '6px 12px' }}>
                      <button className="btn btn-ghost btn-icon" style={{ color: '#E74C3C' }}
                        onClick={() => removeEntry(entry.flatIdx)} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 11 }} onClick={() => addSubTier(group)}>
                <Plus size={11} /> Add sub-tier
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-ghost btn-sm" style={{ gap: 5 }} onClick={addTier}>
          <Plus size={13} /> Add Tier
        </button>
      </div>
    </div>
  )
}

/* ── VIP Tab ──────────────────────────────────────────────────── */

function VIPTab() {
  const { toast } = useStore()
  const [levels, setLevels] = useState<VIPLevel[]>(mockVIPLevels)

  const updateField = (idx: number, field: keyof VIPLevel, raw: string) => {
    setLevels(prev => {
      const next = [...prev]
      next[idx] = {
        ...next[idx],
        [field]: (field === 'minSpend' || field === 'maxSpend' || field === 'level') ? Number(raw) : raw,
      }
      return next
    })
    toast('VIP level updated', 'success')
  }

  const updatePerks = (idx: number, perks: Perk[]) => {
    setLevels(prev => prev.map((l, i) => i === idx ? { ...l, perks } : l))
  }

  const updateBadgeColor = (idx: number, color: string) => {
    setLevels(prev => prev.map((l, i) => i === idx ? { ...l, badgeColor: color } : l))
  }

  const updateRingColor = (idx: number, color: string) => {
    setLevels(prev => prev.map((l, i) => i === idx ? { ...l, ringColor: color } : l))
  }

  const updateFile = (idx: number, field: 'iconFileName' | 'entranceAnimationFileName', val: string | null) => {
    setLevels(prev => prev.map((l, i) => i === idx ? { ...l, [field]: val } : l))
  }

  const toggleCap = (idx: number) => {
    setLevels(prev => prev.map((l, i) => i === idx
      ? { ...l, maxSpend: l.maxSpend === null ? 0 : null }
      : l
    ))
  }

  const removeLevel = (idx: number) => {
    setLevels(prev => prev.filter((_, i) => i !== idx))
  }

  const addLevel = () => {
    setLevels(prev => [...prev, {
      id: uid(), level: prev.length + 1, name: `VIP ${prev.length + 1}`,
      minSpend: 0, maxSpend: null,
      badgeColor: '#94A3B8', ringColor: '#94A3B8',
      iconFileName: null, entranceAnimationFileName: null, perks: []
    }])
  }

  return (
    <div>
      {/* OPEN QUESTION: confirm what counts toward VIP — coin purchases (USD), gifting value, or both. */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          VIP status is based on monthly eligible spend and resets monthly.
          5 levels — VIP 1 ($500+) through VIP 5 ($10,000+). Click any cell to edit.
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 4 }}>
          Monthly eligible spend in USD — resets monthly
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Name</th>
              <th>Badge Color</th>
              <th>Ring Color</th>
              <th>Min Monthly Spend (USD)</th>
              <th>Max Monthly Spend (USD)</th>
              <th>Icon</th>
              <th>Entrance Anim</th>
              <th>Perks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {levels.map((vip, i) => (
              <tr key={vip.id}>
                <td>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: `${vip.badgeColor}20`, border: `2px solid ${vip.badgeColor}`,
                    fontSize: 11, fontWeight: 700, color: vip.badgeColor,
                  }}>
                    {vip.level}
                  </span>
                </td>
                <td>
                  <EditableCell value={vip.name} onSave={v => updateField(i, 'name', v)}
                    style={{ color: vip.badgeColor, fontWeight: 700 }} />
                </td>
                <td>
                  <ColorPickerCell value={vip.badgeColor} onChange={v => updateBadgeColor(i, v)} />
                </td>
                <td>
                  <ColorPickerCell value={vip.ringColor} onChange={v => updateRingColor(i, v)} />
                </td>
                <td>
                  <EditableCell value={vip.minSpend} type="number" onSave={v => updateField(i, 'minSpend', v)}
                    style={{ color: 'var(--gold)', fontWeight: 700 }} />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {vip.maxSpend === null ? (
                      <span style={{ color: 'var(--amethyst)', fontWeight: 700, fontSize: 12 }}>No cap</span>
                    ) : (
                      <EditableCell value={vip.maxSpend} type="number" onSave={v => updateField(i, 'maxSpend', v)}
                        style={{ color: 'var(--text-secondary)', fontWeight: 600 }} />
                    )}
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => toggleCap(i)}>
                      {vip.maxSpend === null ? 'Set cap' : 'Remove cap'}
                    </button>
                  </div>
                </td>
                <td>
                  <FileUpload fileName={vip.iconFileName} accept="image/*"
                    onChange={v => updateFile(i, 'iconFileName', v)} />
                </td>
                <td>
                  <FileUpload fileName={vip.entranceAnimationFileName} accept=".json"
                    onChange={v => updateFile(i, 'entranceAnimationFileName', v)} />
                </td>
                <td>
                  <PerkEditor perks={vip.perks} onChange={p => updatePerks(i, p)} />
                </td>
                <td>
                  <button className="btn btn-ghost btn-icon" style={{ color: '#E74C3C' }}
                    onClick={() => removeLevel(i)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-ghost btn-sm" style={{ gap: 5 }} onClick={addLevel}>
          <Plus size={13} /> Add VIP Level
        </button>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function Prestige() {
  const { toast } = useStore()
  const [tab, setTab] = useState<Tab>('xp')

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">XP &amp; Levels</div>
          <div className="subtitle">XP viewer levels · CP creator tiers · VIP spenders</div>
        </div>
        <div className="page-header-actions">
          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Edit2 size={11} /> Click any cell to edit
          </span>
          <button className="btn btn-primary btn-sm" onClick={() => toast('Configuration saved', 'success')}>
            Save
          </button>
        </div>
      </div>

      <div className="card">
        <div className="prestige-tabs">
          {([
            { key: 'xp'  as Tab, label: 'XP — Viewer Levels' },
            { key: 'cp'  as Tab, label: 'CP — Creator Tiers' },
            { key: 'vip' as Tab, label: 'VIP — Spender Levels' },
          ]).map(t => (
            <button
              key={t.key}
              className={`prestige-tab${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'xp'  && <XPTab />}
        {tab === 'cp'  && <CPTab />}
        {tab === 'vip' && <VIPTab />}
      </div>
    </div>
  )
}
