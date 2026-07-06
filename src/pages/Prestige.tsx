import { useState } from 'react'
import { Edit2, X, Plus, Trash2, Upload } from 'lucide-react'
import { mockXPLevels, mockCPTiers, mockVIPLevels } from '../mockData'
import { useStore } from '../store'
import type { PrestigeXPLevel, PrestigeCPTier, VIPLevel, Perk } from '../types'

type Tab = 'xp' | 'cp' | 'vip'

function uid() { return Math.random().toString(36).slice(2, 9) }

/* ── FileUpload ───────────────────────────────────────────────── */

let _fuC = 0
function FileUpload({ label, fileName, accept, onChange }: {
  label: string; fileName: string | null; accept: string; onChange: (n: string | null) => void
}) {
  const [id] = useState(() => `fu-${++_fuC}`)
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">{label}</label>
      {fileName ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
          <button className="btn btn-ghost btn-icon" style={{ width: 20, height: 20, color: 'var(--text-muted)' }} onClick={() => onChange(null)}><X size={11} /></button>
        </div>
      ) : (
        <label htmlFor={id} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', cursor: 'pointer' }}>
          <Upload size={13} /> Upload
        </label>
      )}
      <input id={id} type="file" accept={accept} style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f.name); e.target.value = '' }} />
    </div>
  )
}

/* ── Shared modal wrapper ─────────────────────────────────────── */

function Modal({ title, onClose, onSave, children }: {
  title: string; onClose: () => void; onSave: () => void; children: React.ReactNode
}) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

/* ── Shared modal field helpers ───────────────────────────────── */

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <FieldRow label={label}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width: 36, height: 36, border: 'none', padding: 3, borderRadius: 6, background: 'var(--bg-surface-2)', cursor: 'pointer' }} />
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="form-input" style={{ fontFamily: 'monospace', width: 90 }} />
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: value, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
      </div>
    </FieldRow>
  )
}

/* ── XP edit modal ────────────────────────────────────────────── */

function XPModal({ level, onSave, onClose }: {
  level: PrestigeXPLevel
  onSave: (updated: PrestigeXPLevel) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<PrestigeXPLevel>({ ...level })
  const set = (patch: Partial<PrestigeXPLevel>) => setDraft(d => ({ ...d, ...patch }))

  return (
    <Modal title={`Edit — ${draft.name}`} onClose={onClose} onSave={() => onSave(draft)}>
      <FieldRow label="Name">
        <input className="form-input" value={draft.name} onChange={e => set({ name: e.target.value })} />
      </FieldRow>
      <FieldRow label="Level Range">
        <input className="form-input" value={draft.levelRange} onChange={e => set({ levelRange: e.target.value })} placeholder="e.g. 1–20" />
      </FieldRow>
      <FieldRow label="XP Threshold">
        <input className="form-input" type="number" min={0} value={draft.xpRequired} onChange={e => set({ xpRequired: Number(e.target.value) })} />
      </FieldRow>
      <ColorField label="Ring Color" value={draft.color} onChange={v => set({ color: v })} />
      <FileUpload label="Icon (image)" fileName={draft.iconFileName} accept="image/*" onChange={v => set({ iconFileName: v })} />
      <FileUpload label="Entrance Animation (.json)" fileName={draft.entranceAnimationFileName} accept=".json" onChange={v => set({ entranceAnimationFileName: v })} />
    </Modal>
  )
}

/* ── CP sub-tier edit modal ───────────────────────────────────── */

function CPModal({ entry, onSave, onClose }: {
  entry: PrestigeCPTier
  onSave: (updated: PrestigeCPTier) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<PrestigeCPTier>({ ...entry })
  const set = (patch: Partial<PrestigeCPTier>) => setDraft(d => ({ ...d, ...patch }))
  const title = `${draft.tier} ${draft.subTier}`

  return (
    <Modal title={`Edit — ${title}`} onClose={onClose} onSave={() => onSave(draft)}>
      <FieldRow label="Sub-Tier Label">
        <input className="form-input" value={draft.subTier} onChange={e => set({ subTier: e.target.value })} />
      </FieldRow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FieldRow label="CP From">
          <input className="form-input" type="number" min={0} value={draft.cpFrom} onChange={e => set({ cpFrom: Number(e.target.value) })} />
        </FieldRow>
        <FieldRow label="CP To">
          <input className="form-input" type="number" min={0} value={draft.cpTo} onChange={e => set({ cpTo: Number(e.target.value) })} />
        </FieldRow>
      </div>
      <ColorField label="Ring Color" value={draft.ringColor} onChange={v => set({ ringColor: v })} />
      <FileUpload label="Icon (creator badge)" fileName={draft.iconFileName} accept="image/*" onChange={v => set({ iconFileName: v })} />
    </Modal>
  )
}

/* ── VIP edit modal ───────────────────────────────────────────── */

function VIPModal({ level, onSave, onClose }: {
  level: VIPLevel
  onSave: (updated: VIPLevel) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<VIPLevel>({ ...level })
  const set = (patch: Partial<VIPLevel>) => setDraft(d => ({ ...d, ...patch }))

  return (
    <Modal title={`Edit — ${draft.name}`} onClose={onClose} onSave={() => onSave(draft)}>
      <FieldRow label="Name">
        <input className="form-input" value={draft.name} onChange={e => set({ name: e.target.value })} />
      </FieldRow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FieldRow label="Min Monthly Spend (USD)">
          <input className="form-input" type="number" min={0} value={draft.minSpend} onChange={e => set({ minSpend: Number(e.target.value) })} />
        </FieldRow>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Max Monthly Spend (USD)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {draft.maxSpend === null ? (
              <span style={{ fontSize: 13, color: 'var(--amethyst)', fontWeight: 700 }}>No cap</span>
            ) : (
              <input className="form-input" type="number" min={0} value={draft.maxSpend} onChange={e => set({ maxSpend: Number(e.target.value) })} style={{ flex: 1 }} />
            )}
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, flexShrink: 0 }}
              onClick={() => set({ maxSpend: draft.maxSpend === null ? 0 : null })}>
              {draft.maxSpend === null ? 'Set cap' : 'Remove cap'}
            </button>
          </div>
        </div>
      </div>
      <ColorField label="Badge Color" value={draft.badgeColor} onChange={v => set({ badgeColor: v })} />
      <ColorField label="Ring Color" value={draft.ringColor} onChange={v => set({ ringColor: v })} />
      <FileUpload label="Icon (VIP badge)" fileName={draft.iconFileName} accept="image/*" onChange={v => set({ iconFileName: v })} />
    </Modal>
  )
}

/* ── Swatch ───────────────────────────────────────────────────── */

function Swatch({ color }: { color: string }) {
  return (
    <div style={{ width: 18, height: 18, borderRadius: '50%', background: color, border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />
  )
}

/* ── XP Tab ───────────────────────────────────────────────────── */

function XPTab() {
  const { toast } = useStore()
  const [levels, setLevels] = useState<PrestigeXPLevel[]>(mockXPLevels)
  const [editing, setEditing] = useState<PrestigeXPLevel | null>(null)

  const save = (updated: PrestigeXPLevel) => {
    setLevels(prev => prev.map(l => l.id === updated.id ? updated : l))
    setEditing(null)
    toast('XP level saved', 'success')
  }

  const remove = (id: string) => setLevels(prev => prev.filter(l => l.id !== id))

  const addLevel = () => setLevels(prev => [...prev, {
    id: uid(), level: 0, levelRange: '0–0', name: 'New Level',
    color: '#94A3B8', xpRequired: 0, iconFileName: null, entranceAnimationFileName: null, perks: [],
  }])

  return (
    <div>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          1 gifted coin = 1 XP. Only gifted coins count — buying coins alone does not create XP.
          12 prestige tiers, each spanning a level range.
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Level Range</th>
              <th>Name</th>
              <th>XP Threshold</th>
              <th>Ring</th>
              <th style={{ width: 90 }}></th>
            </tr>
          </thead>
          <tbody>
            {levels.map(lvl => (
              <tr key={lvl.id}>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: 12,
                    background: `${lvl.color}20`, border: `1.5px solid ${lvl.color}`,
                    fontSize: 11, fontWeight: 700, color: lvl.color, whiteSpace: 'nowrap',
                  }}>{lvl.levelRange}</span>
                </td>
                <td style={{ color: lvl.color, fontWeight: 700 }}>{lvl.name}</td>
                <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {lvl.xpRequired.toLocaleString()}
                </td>
                <td><Swatch color={lvl.color} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 12 }}
                      onClick={() => setEditing(lvl)}>
                      <Edit2 size={12} /> Edit
                    </button>
                    <button className="btn btn-ghost btn-icon" style={{ color: '#E74C3C' }}
                      onClick={() => remove(lvl.id)} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
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

      {editing && (
        <XPModal level={editing} onSave={save} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}

/* ── CP Tab ───────────────────────────────────────────────────── */

type CPGroup = {
  tier: string; color: string;
  entries: Array<PrestigeCPTier & { flatIdx: number }>;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

function CPTab() {
  const { toast } = useStore()
  const [tiers, setTiers] = useState<PrestigeCPTier[]>(mockCPTiers)
  const [editing, setEditing] = useState<PrestigeCPTier | null>(null)

  const groups = tiers.reduce<CPGroup[]>((acc, t, idx) => {
    const last = acc[acc.length - 1]
    if (last && last.tier === t.tier) {
      last.entries.push({ ...t, flatIdx: idx })
    } else {
      acc.push({ tier: t.tier, color: t.color, entries: [{ ...t, flatIdx: idx }] })
    }
    return acc
  }, [])

  const saveEntry = (updated: PrestigeCPTier) => {
    setTiers(prev => prev.map(t => t.id === updated.id ? updated : t))
    setEditing(null)
    toast('CP tier saved', 'success')
  }

  const updateTierName = (oldName: string, newName: string) => {
    setTiers(prev => prev.map(t => t.tier === oldName ? { ...t, tier: newName } : t))
  }

  const updateTierColor = (tierName: string, color: string) => {
    setTiers(prev => prev.map(t => t.tier === tierName ? { ...t, color } : t))
  }

  const removeEntry = (id: string) => setTiers(prev => prev.filter(t => t.id !== id))

  const removeTier = (tierName: string) => {
    if (window.confirm(`Delete entire "${tierName}" tier and all its sub-tiers?`)) {
      setTiers(prev => prev.filter(t => t.tier !== tierName))
    }
  }

  const addSubTier = (group: CPGroup) => {
    const sub = ROMAN[group.entries.length] ?? String(group.entries.length + 1)
    const ref = group.entries[group.entries.length - 1]
    const newEntry: PrestigeCPTier = {
      id: uid(), tier: group.tier, subTier: sub,
      cpFrom: 0, cpTo: 0, color: ref.color, ringColor: ref.ringColor,
      iconFileName: ref.iconFileName, perks: [],
    }
    setTiers(prev => {
      const next = [...prev]
      next.splice(ref.flatIdx + 1, 0, newEntry)
      return next
    })
  }

  const addTier = () => {
    const base = { tier: 'New Tier', color: '#94A3B8', ringColor: '#94A3B8', iconFileName: null as null, perks: [] as Perk[] }
    setTiers(prev => [...prev, ...['I', 'II', 'III', 'IV'].map(sub => ({ ...base, id: uid(), subTier: sub, cpFrom: 0, cpTo: 0 }))])
  }

  return (
    <div>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          1 received diamond / eligible received gift value = 1 CP; amount-based; cashing out does not reduce lifetime CP.
        </div>
      </div>
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {groups.map(group => (
          <div key={group.tier} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            {/* Tier header */}
            <div style={{ padding: '10px 14px', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)' }}>
              <Swatch color={group.color} />
              <TierNameEdit name={group.tier} color={group.color} onName={n => updateTierName(group.tier, n)} onColor={c => updateTierColor(group.tier, c)} />
              <div style={{ marginLeft: 'auto' }}>
                <button className="btn btn-ghost btn-sm" style={{ color: '#E74C3C', gap: 4, fontSize: 11 }}
                  onClick={() => removeTier(group.tier)}>
                  <Trash2 size={12} /> Delete tier
                </button>
              </div>
            </div>

            {/* Sub-tier rows */}
            <table style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ fontSize: 11, padding: '6px 14px', width: 60 }}>Sub-Tier</th>
                  <th style={{ fontSize: 11, padding: '6px 14px' }}>CP Range</th>
                  <th style={{ fontSize: 11, padding: '6px 14px', width: 40 }}>Ring</th>
                  <th style={{ fontSize: 11, padding: '6px 14px', width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {group.entries.map(entry => (
                  <tr key={entry.id}>
                    <td style={{ padding: '8px 14px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: entry.color }}>{entry.subTier}</span>
                    </td>
                    <td style={{ padding: '8px 14px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
                      {entry.cpFrom.toLocaleString()} – {entry.cpTo.toLocaleString()}
                    </td>
                    <td style={{ padding: '8px 14px' }}><Swatch color={entry.ringColor} /></td>
                    <td style={{ padding: '8px 14px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 12 }}
                          onClick={() => setEditing(entry)}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="btn btn-ghost btn-icon" style={{ color: '#E74C3C' }}
                          onClick={() => removeEntry(entry.id)} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 11 }} onClick={() => addSubTier(group)}>
                <Plus size={11} /> Add Sub Level
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

      {editing && (
        <CPModal entry={editing} onSave={saveEntry} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}

/* ── Tier name + color inline edit in CP header ───────────────── */

function TierNameEdit({ name, color, onName, onColor }: {
  name: string; color: string; onName: (v: string) => void; onColor: (v: string) => void
}) {
  const [editingName, setEditingName] = useState(false)
  const [draft, setDraft] = useState(name)

  const commit = () => { onName(draft.trim() || name); setEditingName(false) }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
      {editingName ? (
        <input
          autoFocus className="form-input"
          style={{ fontSize: 13, fontWeight: 700, color, padding: '3px 8px', width: 160 }}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(name); setEditingName(false) } }}
        />
      ) : (
        <span
          style={{ fontSize: 14, fontWeight: 700, color, cursor: 'text' }}
          onClick={() => { setDraft(name); setEditingName(true) }}
          title="Click to rename"
        >{name}</span>
      )}
      <input
        type="color" value={color} title="Tier color"
        onChange={e => onColor(e.target.value)}
        style={{ width: 22, height: 22, border: 'none', padding: 2, borderRadius: 4, background: 'transparent', cursor: 'pointer' }}
      />
    </div>
  )
}

/* ── VIP Tab ──────────────────────────────────────────────────── */

function VIPTab() {
  const { toast } = useStore()
  const [levels, setLevels] = useState<VIPLevel[]>(mockVIPLevels)
  const [editing, setEditing] = useState<VIPLevel | null>(null)

  const save = (updated: VIPLevel) => {
    setLevels(prev => prev.map(l => l.id === updated.id ? updated : l))
    setEditing(null)
    toast('VIP level saved', 'success')
  }

  const remove = (id: string) => setLevels(prev => prev.filter(l => l.id !== id))

  const addLevel = () => setLevels(prev => [...prev, {
    id: uid(), level: prev.length + 1, name: `VIP ${prev.length + 1}`,
    minSpend: 0, maxSpend: null, badgeColor: '#94A3B8', ringColor: '#94A3B8',
    iconFileName: null, perks: [],
  }])

  return (
    <div>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          VIP status is based on monthly eligible spend and resets monthly. 5 levels — VIP 1 ($500+) through VIP 5 ($10,000+).
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
              <th>Monthly Spend (USD)</th>
              <th>Color</th>
              <th style={{ width: 90 }}></th>
            </tr>
          </thead>
          <tbody>
            {levels.map(vip => (
              <tr key={vip.id}>
                <td>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: `${vip.badgeColor}20`, border: `2px solid ${vip.badgeColor}`,
                    fontSize: 11, fontWeight: 700, color: vip.badgeColor,
                  }}>{vip.level}</span>
                </td>
                <td style={{ color: vip.badgeColor, fontWeight: 700 }}>{vip.name}</td>
                <td style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 13 }}>
                  ${vip.minSpend.toLocaleString()} – {vip.maxSpend === null ? '∞' : `$${vip.maxSpend.toLocaleString()}`}
                </td>
                <td><Swatch color={vip.badgeColor} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 12 }}
                      onClick={() => setEditing(vip)}>
                      <Edit2 size={12} /> Edit
                    </button>
                    <button className="btn btn-ghost btn-icon" style={{ color: '#E74C3C' }}
                      onClick={() => remove(vip.id)} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
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

      {editing && (
        <VIPModal level={editing} onSave={save} onClose={() => setEditing(null)} />
      )}
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
          <button className="btn btn-primary btn-sm" onClick={() => toast('Configuration saved', 'success')}>
            Save
          </button>
        </div>
      </div>

      <div className="card">
        <div className="prestige-tabs">
          {([
            { key: 'xp'  as Tab, label: 'XP — Viewer Levels'  },
            { key: 'cp'  as Tab, label: 'CP — Creator Tiers'  },
            { key: 'vip' as Tab, label: 'VIP — Spender Levels' },
          ]).map(t => (
            <button
              key={t.key}
              className={`prestige-tab${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >{t.label}</button>
          ))}
        </div>

        {tab === 'xp'  && <XPTab />}
        {tab === 'cp'  && <CPTab />}
        {tab === 'vip' && <VIPTab />}
      </div>
    </div>
  )
}
