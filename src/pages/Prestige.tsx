import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { mockXPLevels, mockCPTiers, mockVIPLevels } from '../mockData'
import { useStore } from '../store'
import type { PrestigeXPLevel, PrestigeCPTier, VIPLevel } from '../types'

type Tab = 'xp' | 'cp' | 'vip'

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

/* ── XP Tab ───────────────────────────────────────────────────── */

function XPTab() {
  const { toast } = useStore()
  const [levels, setLevels] = useState<PrestigeXPLevel[]>(mockXPLevels)

  const update = (idx: number, field: keyof PrestigeXPLevel, raw: string) => {
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

  return (
    <div>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Viewers earn XP by watching streams, sending gifts, and engaging.
          12 prestige tiers — each spans a level range.
          Click any cell to edit. Press <kbd style={{ background: 'var(--bg-surface-2)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>Enter</kbd> to save.
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Levels</th>
              <th>Ring Color</th>
              <th>Name</th>
              <th>Total XP Threshold</th>
              <th>Perks</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((lvl, i) => (
              <tr key={i}>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: 12, display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: `${lvl.color}20`, border: `2px solid ${lvl.color}`,
                    fontSize: 11, fontWeight: 700, color: lvl.color, whiteSpace: 'nowrap',
                  }}>
                    {lvl.levelRange ?? String(lvl.level)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <EditableCell
                      value={lvl.color}
                      onSave={v => update(i, 'color', v)}
                      style={{ fontFamily: 'monospace', fontSize: 12 }}
                    />
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: lvl.color, flexShrink: 0 }} />
                  </div>
                </td>
                <td>
                  <EditableCell value={lvl.name} onSave={v => update(i, 'name', v)}
                    style={{ color: lvl.color, fontWeight: 700 }} />
                </td>
                <td>
                  <EditableCell value={lvl.xpRequired === 0 ? '0' : lvl.xpRequired} type="number"
                    onSave={v => update(i, 'xpRequired', v)}
                    style={{ color: 'var(--text-secondary)', fontWeight: 600 }} />
                </td>
                <td>
                  <EditableCell value={lvl.perks} onSave={v => update(i, 'perks', v)}
                    style={{ color: 'var(--text-muted)', fontSize: 12 }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── CP Tab ───────────────────────────────────────────────────── */

function CPTab() {
  const { toast } = useStore()
  const [tiers, setTiers] = useState<PrestigeCPTier[]>(mockCPTiers)

  const update = (idx: number, field: keyof PrestigeCPTier, raw: string) => {
    setTiers(prev => {
      const next = [...prev]
      next[idx] = {
        ...next[idx],
        [field]: field === 'cpRequired' ? Number(raw) : raw,
      }
      return next
    })
    toast('CP tier updated', 'success')
  }

  return (
    <div>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Creators earn CP (Creator Points) from diamonds received. 13 main tiers (Bronze → Loouno Crown), each with 4 Roman sub-tiers I–IV — 52 entries total.
          Click any cell to edit.
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th>Sub-Tier</th>
              <th>Color</th>
              <th>CP Required</th>
              <th>Perks</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((cp, i) => (
              <tr key={i}>
                <td>
                  <EditableCell value={cp.tier} onSave={v => update(i, 'tier', v)}
                    style={{ color: cp.color, fontWeight: 700 }} />
                </td>
                <td>
                  <EditableCell value={cp.subTier || '—'} onSave={v => update(i, 'subTier', v)}
                    style={{ color: 'var(--text-muted)', fontSize: 12 }} />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <EditableCell value={cp.color} onSave={v => update(i, 'color', v)}
                      style={{ fontFamily: 'monospace', fontSize: 12 }} />
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: cp.color, flexShrink: 0 }} />
                  </div>
                </td>
                <td>
                  <EditableCell value={cp.cpRequired} type="number" onSave={v => update(i, 'cpRequired', v)}
                    style={{ color: 'var(--text-secondary)', fontWeight: 600 }} />
                </td>
                <td>
                  <EditableCell value={cp.perks} onSave={v => update(i, 'perks', v)}
                    style={{ color: 'var(--text-muted)', fontSize: 12 }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── VIP Tab ──────────────────────────────────────────────────── */

function VIPTab() {
  const { toast } = useStore()
  const [levels, setLevels] = useState<VIPLevel[]>(mockVIPLevels)

  const update = (idx: number, field: keyof VIPLevel, raw: string) => {
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

  return (
    <div>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          VIP status based on cumulative spend. 5 levels — VIP 1 ($500+) through VIP 5 ($10,000+).
          Click any cell to edit.
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Name</th>
              <th>Badge Color</th>
              <th>Min Spend (USD)</th>
              <th>Max Spend (USD)</th>
              <th>Perks</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((vip, i) => (
              <tr key={vip.level}>
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
                  <EditableCell value={vip.name} onSave={v => update(i, 'name', v)}
                    style={{ color: vip.badgeColor, fontWeight: 700 }} />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <EditableCell value={vip.badgeColor} onSave={v => update(i, 'badgeColor', v)}
                      style={{ fontFamily: 'monospace', fontSize: 12 }} />
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: vip.badgeColor, flexShrink: 0 }} />
                  </div>
                </td>
                <td>
                  <EditableCell value={vip.minSpend} type="number" onSave={v => update(i, 'minSpend', v)}
                    style={{ color: 'var(--gold)', fontWeight: 700 }} />
                </td>
                <td>
                  {vip.maxSpend === null ? (
                    <span style={{ color: 'var(--amethyst)', fontWeight: 700, fontSize: 12 }}>No cap</span>
                  ) : (
                    <EditableCell value={vip.maxSpend} type="number" onSave={v => update(i, 'maxSpend', v)}
                      style={{ color: 'var(--text-secondary)', fontWeight: 600 }} />
                  )}
                </td>
                <td>
                  <EditableCell value={vip.perks} onSave={v => update(i, 'perks', v)}
                    style={{ color: 'var(--text-muted)', fontSize: 12 }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function Prestige() {
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
