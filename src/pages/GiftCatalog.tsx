import { useState, useRef } from 'react'
import { Edit2, X, Upload } from 'lucide-react'
import { mockGifts } from '../mockData'
import { useStore } from '../store'
import type { Gift, GiftTier } from '../types'

const TIERS: GiftTier[] = ['5A', '5B', '5C', '5D', '5E']

const tierMeta: Record<GiftTier, {
  bg: string; color: string; label: string; shortLabel: string
  range: string; durationRange: string; emoji: string
}> = {
  '5A': { bg: 'rgba(138,138,142,0.12)', color: '#8A8A8E', label: 'Reaction / Meme / Chat', shortLabel: 'Reaction',  range: '10 – 500 coins',          durationRange: '1–2 s',   emoji: '💬' },
  '5B': { bg: 'rgba(52,152,219,0.12)',  color: '#3498DB', label: 'Mid-Tier Animated',      shortLabel: 'Animated',  range: '300 – 3,000 coins',        durationRange: '3–5 s',   emoji: '✨' },
  '5C': { bg: 'rgba(153,102,204,0.12)', color: '#9966CC', label: 'Premium 3D',             shortLabel: 'Premium',   range: '8,000 – 70,000 coins',     durationRange: '6–10 s',  emoji: '🔮' },
  '5D': { bg: 'rgba(212,175,55,0.12)',  color: '#D4AF37', label: 'Cinematic / Whale',      shortLabel: 'Cinematic', range: '90,000 – 150,000 coins',   durationRange: '12–15 s', emoji: '🎬' },
  '5E': { bg: 'rgba(231,76,60,0.12)',   color: '#E74C3C', label: 'VIP / Max Cap',          shortLabel: 'VIP',       range: '175,000 – 300,000 coins',  durationRange: '16–20 s', emoji: '👑' },
}

/* ── Add / Edit modal ─────────────────────────────────────────── */

interface GiftModalProps {
  initial?: Gift | null
  defaultTier?: GiftTier
  onSave: (g: Omit<Gift, 'id'>) => void
  onClose: () => void
}

function GiftModal({ initial, defaultTier = '5A', onSave, onClose }: GiftModalProps) {
  const [animationFileName, setAnimationFileName] = useState<string | null>(initial?.animationFileName ?? null)
  const [name, setName]               = useState(initial?.name ?? '')
  const [coins, setCoins]             = useState(initial?.coins ?? 0)
  const [durationSec, setDurationSec] = useState(initial?.durationSec ?? 1)
  const [tier, setTier]               = useState<GiftTier>(initial?.tier ?? defaultTier)
  const [enabled, setEnabled]         = useState(initial?.enabled ?? true)
  const fileRef = useRef<HTMLInputElement>(null)

  const valid = name.trim() !== '' && coins > 0 && durationSec > 0

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <span className="modal-title">{initial ? 'Edit Gift' : 'Add Gift'}</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="form-group">
            <label className="form-label">Gift Animation</label>
            {animationFileName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {animationFileName}
                </span>
                <button className="btn btn-ghost btn-icon" style={{ width: 22, height: 22, color: 'var(--text-muted)' }}
                  onClick={() => setAnimationFileName(null)}>
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => fileRef.current?.click()}>
                <Upload size={13} /> Upload .glb (3D) or .json (2D Lottie)
              </button>
            )}
            <input ref={fileRef} type="file" accept=".glb,.json" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) setAnimationFileName(f.name); e.target.value = '' }} />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>.glb for 3D, .json for 2D Lottie</div>
          </div>

          <div className="form-group">
            <label className="form-label">Gift Name</label>
            <input className="form-input" placeholder="e.g. Shooting Star" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Price (coins)</label>
              <input className="form-input" type="number" min={1} placeholder="e.g. 5000"
                value={coins || ''} onChange={e => setCoins(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (sec)</label>
              <input className="form-input" type="number" min={1} max={60} placeholder="e.g. 5"
                value={durationSec || ''} onChange={e => setDurationSec(Number(e.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tier</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TIERS.map(t => {
                const m = tierMeta[t]
                const active = tier === t
                return (
                  <button key={t} onClick={() => setTier(t)} style={{
                    padding: '9px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                    background: active ? m.bg : 'var(--bg-surface-2)',
                    border: `1.5px solid ${active ? m.color : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{t} — {m.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.durationRange} · {m.range}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Enabled</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Visible to users in the gift picker</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
              <span className="toggle-track" />
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!valid} style={{ opacity: valid ? 1 : 0.45 }}
            onClick={() => { onSave({ animationFileName, name, coins, durationSec, tier, tierName: tierMeta[tier].label, enabled }); onClose() }}>
            {initial ? 'Save Changes' : 'Add Gift'}
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Gift card ────────────────────────────────────────────────── */

function GiftCard({ gift, onToggle, onEdit }: {
  gift: Gift
  onToggle: (id: string) => void
  onEdit: (gift: Gift) => void
}) {
  const m = tierMeta[gift.tier]
  const ext = gift.animationFileName?.split('.').pop()?.toLowerCase()
  const assetLabel = ext === 'glb' ? '3D' : ext === 'json' ? '2D' : null

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderTop: `3px solid ${m.color}`,
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      opacity: gift.enabled ? 1 : 0.45,
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${m.color}20` }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
    >
      {/* Preview area */}
      <div style={{
        background: m.bg,
        padding: '16px 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        minHeight: 80,
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: 26, lineHeight: 1 }}>{m.emoji}</span>
        {gift.animationFileName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {assetLabel && (
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
                background: `${m.color}25`, color: m.color, letterSpacing: '0.05em',
              }}>{assetLabel}</span>
            )}
            <span style={{
              fontSize: 10, color: 'var(--text-muted)', maxWidth: 100,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {gift.animationFileName}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>No asset</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {gift.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>
          🪙 {gift.coins.toLocaleString()}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {gift.durationSec}s
        </div>
      </div>

      {/* Actions */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <label className="toggle" title={gift.enabled ? 'Disable' : 'Enable'}>
          <input type="checkbox" checked={gift.enabled} onChange={() => onToggle(gift.id)} />
          <span className="toggle-track" />
        </label>
        <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => onEdit(gift)}>
          <Edit2 size={12} />
        </button>
      </div>
    </div>
  )
}

/* ── Main page ────────────────────────────────────────────────── */

export default function GiftCatalog() {
  const { toast } = useStore()
  const [gifts, setGifts]         = useState<Gift[]>(mockGifts)
  const [activeTier, setActiveTier] = useState<GiftTier>('5A')
  const [addOpen, setAddOpen]     = useState(false)
  const [editGift, setEditGift]   = useState<Gift | null>(null)

  const toggleGift = (id: string) =>
    setGifts(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g))

  const handleAdd = (data: Omit<Gift, 'id'>) => {
    setGifts(prev => [...prev, { ...data, id: `g${Date.now()}` }])
    toast(`Gift "${data.name}" added to tier ${data.tier}`, 'success')
  }

  const handleEdit = (id: string, data: Omit<Gift, 'id'>) => {
    setGifts(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
    toast(`Gift "${data.name}" updated`, 'success')
  }

  const activeMeta  = tierMeta[activeTier]
  const tierGifts   = gifts.filter(g => g.tier === activeTier)
  const enabledCount = tierGifts.filter(g => g.enabled).length
  const totalEnabled = gifts.filter(g => g.enabled).length

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Gift Catalog</div>
          <div className="subtitle">Manage virtual gifts, tiers, prices, and animations</div>
        </div>
        <div className="page-header-actions">
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {totalEnabled}/{gifts.length} enabled
          </span>
          <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
            + Add Gift
          </button>
        </div>
      </div>

      {/* ── Tier tabs ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 2 }}>
        {TIERS.map(tier => {
          const m     = tierMeta[tier]
          const count = gifts.filter(g => g.tier === tier).length
          const active = activeTier === tier
          return (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0,
                background: active ? m.bg : 'var(--surface)',
                border: `1.5px solid ${active ? m.color : 'var(--border)'}`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = `${m.color}60` }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{m.emoji}</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: active ? m.color : 'var(--text-primary)', letterSpacing: '0.02em' }}>
                  {tier}
                </span>
                <span style={{ fontSize: 11, color: active ? m.color : 'var(--text-muted)', opacity: active ? 0.8 : 1 }}>
                  {m.shortLabel}
                </span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 10, marginLeft: 2,
                background: active ? `${m.color}25` : 'var(--bg)',
                color: active ? m.color : 'var(--text-muted)',
                border: `1px solid ${active ? `${m.color}40` : 'var(--border)'}`,
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Active tier header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderRadius: 10, marginBottom: 20,
        background: activeMeta.bg, border: `1px solid ${activeMeta.color}30`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>{activeMeta.emoji}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: activeMeta.color }}>
              {activeTier} — {activeMeta.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {activeMeta.range} · {activeMeta.durationRange} · {enabledCount}/{tierGifts.length} enabled
            </div>
          </div>
        </div>
        <button
          className="btn btn-sm"
          style={{
            background: `${activeMeta.color}18`,
            border: `1px solid ${activeMeta.color}40`,
            color: activeMeta.color, fontWeight: 600,
          }}
          onClick={() => setAddOpen(true)}
        >
          + Add to {activeTier}
        </button>
      </div>

      {/* ── Gift grid ── */}
      {tierGifts.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '60px 24px', gap: 12,
          border: `1.5px dashed ${activeMeta.color}40`, borderRadius: 12,
        }}>
          <span style={{ fontSize: 32 }}>{activeMeta.emoji}</span>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>No gifts in this tier yet</div>
          <button
            className="btn btn-sm"
            style={{ background: `${activeMeta.color}18`, border: `1px solid ${activeMeta.color}40`, color: activeMeta.color }}
            onClick={() => setAddOpen(true)}
          >
            + Add first gift
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
          gap: 12,
        }}>
          {tierGifts.map(g => (
            <GiftCard key={g.id} gift={g} onToggle={toggleGift} onEdit={g => setEditGift(g)} />
          ))}
          <button
            onClick={() => setAddOpen(true)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              background: 'transparent',
              border: `1.5px dashed ${activeMeta.color}35`,
              borderRadius: 12, padding: '24px 8px', minHeight: 180,
              cursor: 'pointer', color: 'var(--text-subtle)',
              fontSize: 12, transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = `${activeMeta.color}80`
              el.style.color = activeMeta.color
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = `${activeMeta.color}35`
              el.style.color = 'var(--text-subtle)'
            }}
          >
            <span style={{ fontSize: 22 }}>+</span>
            <span>Add Gift</span>
          </button>
        </div>
      )}

      {addOpen && (
        <GiftModal defaultTier={activeTier} onSave={handleAdd} onClose={() => setAddOpen(false)} />
      )}
      {editGift && (
        <GiftModal
          initial={editGift}
          onSave={data => handleEdit(editGift.id, data)}
          onClose={() => setEditGift(null)}
        />
      )}
    </div>
  )
}
