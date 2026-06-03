import { useState, useRef } from 'react'
import { Edit2, X, Upload } from 'lucide-react'
import { mockGifts } from '../mockData'
import { useStore } from '../store'
import type { Gift } from '../types'

const tierMeta: Record<number, { bg: string; color: string; label: string; range: string }> = {
  1: { bg: 'rgba(138,138,142,0.12)', color: '#8A8A8E', label: 'Tier 1 — Chat Gifts',          range: '10 – 500 coins' },
  2: { bg: 'rgba(52,152,219,0.12)',  color: '#3498DB', label: 'Tier 2 — Animated',             range: '1K – 8K coins' },
  3: { bg: 'rgba(153,102,204,0.12)', color: '#9966CC', label: 'Tier 3 — Premium 3D',           range: '10K – 60K coins' },
  4: { bg: 'rgba(212,175,55,0.12)',  color: '#D4AF37', label: 'Tier 4 — Cinematic / Whale',    range: '70K – 100K coins' },
}

/* ── Add / Edit modal ─────────────────────────────────────────── */

interface GiftModalProps {
  initial?: Gift | null
  onSave: (g: Omit<Gift, 'id'>) => void
  onClose: () => void
}

function GiftModal({ initial, onSave, onClose }: GiftModalProps) {
  const [emoji, setEmoji]   = useState(initial?.emoji ?? '')
  const [name, setName]     = useState(initial?.name ?? '')
  const [coins, setCoins]   = useState(initial?.coins ?? 0)
  const [tier, setTier]     = useState<1|2|3|4>(initial?.tier ?? 1)
  const [enabled, setEnabled] = useState(initial?.enabled ?? true)
  const fileRef = useRef<HTMLInputElement>(null)

  const tierNames = { 1: 'Chat Gifts', 2: 'Animated', 3: 'Premium 3D', 4: 'Cinematic / Whale' }

  const valid = emoji.trim() !== '' && name.trim() !== '' && coins > 0

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <span className="modal-title">{initial ? 'Edit Gift' : 'Add Gift'}</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Emoji / image */}
          <div className="form-group">
            <label className="form-label">Emoji or Icon</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 12,
                background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, flexShrink: 0,
              }}>
                {emoji || '?'}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <input
                  className="form-input"
                  placeholder="Paste emoji e.g. 🎁"
                  value={emoji}
                  onChange={e => setEmoji(e.target.value)}
                  style={{ fontSize: 18 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>or upload image</span>
                  <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={13} /> Upload PNG / SVG
                </button>
                <input ref={fileRef} type="file" accept="image/png,image/svg+xml,image/webp" style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) setEmoji(`[${file.name}]`)
                  }}
                />
              </div>
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

          {/* Coins price */}
          <div className="form-group">
            <label className="form-label">Price (coins)</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 16, pointerEvents: 'none',
              }}>🪙</span>
              <input
                className="form-input"
                type="number"
                min={1}
                placeholder="e.g. 5000"
                value={coins || ''}
                onChange={e => setCoins(Number(e.target.value))}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          {/* Tier */}
          <div className="form-group">
            <label className="form-label">Tier</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {([1,2,3,4] as const).map(t => {
                const m = tierMeta[t]
                return (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    style={{
                      padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                      background: tier === t ? m.bg : 'var(--bg-surface-2)',
                      border: `1.5px solid ${tier === t ? m.color : 'var(--border)'}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>Tier {t}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{tierNames[t]}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{m.range}</span>
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
              onSave({ emoji, name, coins, tier, tierName: tierNames[tier], enabled })
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

function GiftCard({
  gift,
  onToggle,
  onEdit,
}: {
  gift: Gift
  onToggle: (id: string) => void
  onEdit: (gift: Gift) => void
}) {
  const m = tierMeta[gift.tier]
  return (
    <div className={`gift-card${!gift.enabled ? ' disabled' : ''}`}>
      <div className="gift-emoji">{gift.emoji}</div>
      <div className="gift-name">{gift.name}</div>
      <div className="gift-price">{gift.coins.toLocaleString()} 🪙</div>
      <span style={{
        fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px',
        padding: '2px 7px', borderRadius: 20,
        background: m.bg, color: m.color, border: `1px solid ${m.color}25`,
      }}>
        Tier {gift.tier}
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
    toast(`Gift "${data.name}" added to Tier ${data.tier}`, 'success')
  }

  const handleEdit = (id: string, data: Omit<Gift, 'id'>) => {
    setGifts(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
    toast(`Gift "${data.name}" updated`, 'success')
  }

  const tiers = [1, 2, 3, 4] as const
  const totalEnabled = gifts.filter(g => g.enabled).length

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Gift Catalog</div>
          <div className="subtitle">Manage virtual gifts, tiers, prices, and visibility</div>
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

      {tiers.map(tier => {
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
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.range}</span>
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
                <span style={{ fontSize: 20 }}>＋</span>
                <span>Add Gift</span>
              </button>
            </div>
          </div>
        )
      })}

      {/* Add modal */}
      {showAddModal && (
        <GiftModal onSave={handleAdd} onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit modal */}
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
