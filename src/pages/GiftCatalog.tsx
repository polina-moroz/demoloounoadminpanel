import { useState, useRef } from 'react'
import { Edit2, X, Upload } from 'lucide-react'
import { mockGifts } from '../mockData'
import { useStore } from '../store'
import type { Gift, GiftTier } from '../types'

const TIERS: GiftTier[] = ['5A', '5B', '5C', '5D', '5E']

const tierMeta: Record<GiftTier, { bg: string; color: string; label: string; range: string; durationRange: string }> = {
  '5A': { bg: 'rgba(138,138,142,0.12)', color: '#8A8A8E', label: '5A — Reaction / Meme / Chat', range: '10 – 500 coins',       durationRange: '1–2 s' },
  '5B': { bg: 'rgba(52,152,219,0.12)',  color: '#3498DB', label: '5B — Mid-Tier Animated',       range: '300 – 3,000 coins',    durationRange: '3–5 s' },
  '5C': { bg: 'rgba(153,102,204,0.12)', color: '#9966CC', label: '5C — Premium 3D',              range: '8,000 – 70,000 coins', durationRange: '6–10 s' },
  '5D': { bg: 'rgba(212,175,55,0.12)',  color: '#D4AF37', label: '5D — Cinematic / Whale',       range: '90,000 – 150,000 coins',durationRange: '12–15 s' },
  '5E': { bg: 'rgba(231,76,60,0.12)',   color: '#E74C3C', label: '5E — VIP / Max Cap',           range: '175,000 – 300,000 coins',durationRange: '16–20 s' },
}

/* ── Add / Edit modal ─────────────────────────────────────────── */

interface GiftModalProps {
  initial?: Gift | null
  onSave: (g: Omit<Gift, 'id'>) => void
  onClose: () => void
}

function GiftModal({ initial, onSave, onClose }: GiftModalProps) {
  const [animationFileName, setAnimationFileName] = useState<string | null>(initial?.animationFileName ?? null)
  const [name, setName]         = useState(initial?.name ?? '')
  const [coins, setCoins]       = useState(initial?.coins ?? 0)
  const [durationSec, setDurationSec] = useState(initial?.durationSec ?? 1)
  const [tier, setTier]         = useState<GiftTier>(initial?.tier ?? '5A')
  const [enabled, setEnabled]   = useState(initial?.enabled ?? true)
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

          {/* Animation asset */}
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
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) setAnimationFileName(file.name)
                e.target.value = ''
              }} />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              .glb for 3D, .json for 2D Lottie
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Gift Name</label>
            <input
              className="form-input"
              placeholder="e.g. Shooting Star"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Coins */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Price (coins)</label>
              <input
                className="form-input"
                type="number"
                min={1}
                placeholder="e.g. 5000"
                value={coins || ''}
                onChange={e => setCoins(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (sec)</label>
              <input
                className="form-input"
                type="number"
                min={1}
                max={60}
                placeholder="e.g. 5"
                value={durationSec || ''}
                onChange={e => setDurationSec(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Tier */}
          <div className="form-group">
            <label className="form-label">Tier</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TIERS.map(t => {
                const m = tierMeta[t]
                return (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    style={{
                      padding: '9px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                      background: tier === t ? m.bg : 'var(--bg-surface-2)',
                      border: `1.5px solid ${tier === t ? m.color : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.durationRange} · {m.range}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Enabled */}
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
          <button
            className="btn btn-primary"
            disabled={!valid}
            style={{ opacity: valid ? 1 : 0.45 }}
            onClick={() => {
              onSave({ animationFileName, name, coins, durationSec, tier, tierName: tierMeta[tier].label, enabled })
              onClose()
            }}
          >
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
  return (
    <div className={`gift-card${!gift.enabled ? ' disabled' : ''}`}>
      <div className="gift-emoji" style={{ fontSize: 11, color: 'var(--text-muted)', wordBreak: 'break-all', minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {gift.animationFileName
          ? <span style={{ fontSize: 10, background: 'var(--bg-surface-2)', padding: '3px 7px', borderRadius: 6, border: '1px solid var(--border)' }}>{gift.animationFileName}</span>
          : <span style={{ color: 'var(--text-subtle)' }}>No asset</span>
        }
      </div>
      <div className="gift-name">{gift.name}</div>
      <div className="gift-price">{gift.coins.toLocaleString()} coins</div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{gift.durationSec}s</div>
      <span style={{
        fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px',
        padding: '2px 7px', borderRadius: 20,
        background: m.bg, color: m.color, border: `1px solid ${m.color}25`,
      }}>
        {gift.tier}
      </span>
      <div className="gift-card-actions">
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
  const [gifts, setGifts] = useState<Gift[]>(mockGifts)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editGift, setEditGift] = useState<Gift | null>(null)

  const toggleGift = (id: string) => {
    setGifts(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g))
  }

  const handleAdd = (data: Omit<Gift, 'id'>) => {
    const newGift: Gift = { ...data, id: `g${Date.now()}` }
    setGifts(prev => [...prev, newGift])
    toast(`Gift "${data.name}" added to tier ${data.tier}`, 'success')
  }

  const handleEdit = (id: string, data: Omit<Gift, 'id'>) => {
    setGifts(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
    toast(`Gift "${data.name}" updated`, 'success')
  }

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
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Gift
          </button>
        </div>
      </div>

      {TIERS.map(tier => {
        const m = tierMeta[tier]
        const tierGifts = gifts.filter(g => g.tier === tier)
        return (
          <div key={tier} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: m.bg, color: m.color, border: `1px solid ${m.color}30`,
              }}>
                {m.label}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.durationRange} · {m.range}</span>
              <span style={{ fontSize: 12, color: 'var(--text-subtle)', marginLeft: 'auto' }}>
                {tierGifts.filter(g => g.enabled).length}/{tierGifts.length} enabled
              </span>
            </div>
            <div className="gift-grid">
              {tierGifts.map(g => (
                <GiftCard
                  key={g.id}
                  gift={g}
                  onToggle={toggleGift}
                  onEdit={g => setEditGift(g)}
                />
              ))}
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                  background: 'transparent',
                  border: '1.5px dashed rgba(212,175,55,0.3)',
                  borderRadius: 12, padding: '16px 8px',
                  cursor: 'pointer', color: 'var(--text-subtle)',
                  fontSize: 11, transition: 'all 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)')}
              >
                <span style={{ fontSize: 20 }}>+</span>
                <span>Add Gift</span>
              </button>
            </div>
          </div>
        )
      })}

      {showAddModal && (
        <GiftModal onSave={handleAdd} onClose={() => setShowAddModal(false)} />
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
