import { useState, useRef } from 'react'
import { Edit2, X, Upload, Search, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { mockGifts } from '../mockData'
import { useStore } from '../store'
import type { Gift } from '../types'

/* ── Custom tier ──────────────────────────────────────────────── */

interface CustomTier {
  id: string
  name: string
  minCoins: number
}

const INITIAL_TIERS: CustomTier[] = [
  { id: '5A', name: 'Reaction / Meme',   minCoins: 10     },
  { id: '5B', name: 'Mid-Tier Animated', minCoins: 300    },
  { id: '5C', name: 'Premium 3D',        minCoins: 8000   },
  { id: '5D', name: 'Cinematic',         minCoins: 90000  },
  { id: '5E', name: 'VIP / Max Cap',     minCoins: 175000 },
]

/* ── Tier modal (add / edit) ──────────────────────────────────── */

function TierModal({ initial, onSave, onClose }: {
  initial?: CustomTier | null
  onSave: (t: Omit<CustomTier, 'id'>) => void
  onClose: () => void
}) {
  const [name,     setName]     = useState(initial?.name ?? '')
  const [minCoins, setMinCoins] = useState(String(initial?.minCoins ?? ''))

  const valid = name.trim().length > 0 && minCoins !== '' && Number(minCoins) >= 0

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <span className="modal-title">{initial ? 'Edit Tier' : 'Add Tier'}</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="form-group">
            <label className="form-label">Tier Name</label>
            <input className="form-input" placeholder="e.g. Premium 3D" value={name}
              onChange={e => setName(e.target.value)} autoFocus />
          </div>

          <div className="form-group">
            <label className="form-label">Min Coins</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🪙</span>
              <input className="form-input" type="number" min="0" placeholder="e.g. 5000" value={minCoins}
                onChange={e => setMinCoins(e.target.value)} style={{ paddingLeft: 30 }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
              Minimum coin price for gifts in this tier
            </span>
          </div>

        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!valid} style={{ opacity: valid ? 1 : 0.45 }}
            onClick={() => { onSave({ name: name.trim(), minCoins: Number(minCoins) }); onClose() }}>
            {initial ? 'Save Changes' : 'Add Tier'}
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Gift modal (add / edit) ──────────────────────────────────── */

interface GiftModalProps {
  initial?: Gift | null
  tierId: string
  tierName: string
  onSave: (g: Omit<Gift, 'id'>) => void
  onClose: () => void
}

function GiftModal({ initial, tierId, tierName, onSave, onClose }: GiftModalProps) {
  const [animationFileName, setAnimationFileName] = useState<string | null>(initial?.animationFileName ?? null)
  const [name,    setName]    = useState(initial?.name ?? '')
  const [coins,   setCoins]   = useState(initial?.coins ?? 0)
  const [enabled, setEnabled] = useState(initial?.enabled ?? true)
  const fileRef = useRef<HTMLInputElement>(null)

  const valid = name.trim() !== '' && coins > 0

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
            <input className="form-input" placeholder="e.g. Shooting Star" value={name}
              onChange={e => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Price (coins)</label>
            <input className="form-input" type="number" min={1} placeholder="e.g. 5000"
              value={coins || ''} onChange={e => setCoins(Number(e.target.value))} />
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
            onClick={() => {
              onSave({ animationFileName, name, coins, durationSec: initial?.durationSec ?? 3, tier: tierId, tierName, enabled })
              onClose()
            }}>
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
  const ext        = gift.animationFileName?.split('.').pop()?.toLowerCase()
  const assetLabel = ext === 'glb' ? '3D' : ext === 'json' ? '2D' : null

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderTop: '3px solid var(--border)', borderRadius: 12, overflow: 'hidden',
      display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.15s',
      opacity: gift.enabled ? 1 : 0.45,
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
    >
      <div style={{
        background: 'var(--bg-surface-2)', padding: '16px 12px 12px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 8, minHeight: 80, justifyContent: 'center',
      }}>
        {gift.animationFileName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {assetLabel && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)', letterSpacing: '0.05em' }}>{assetLabel}</span>
            )}
            <span style={{ fontSize: 10, color: 'var(--text-muted)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {gift.animationFileName}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>No asset</span>
        )}
      </div>

      <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{gift.name}</div>
        <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>🪙 {gift.coins.toLocaleString()}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{gift.durationSec}s</div>
      </div>

      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

const PAGE_SIZE = 8

/* ── Main page ────────────────────────────────────────────────── */

export default function GiftCatalog() {
  const { toast } = useStore()
  const [gifts,        setGifts]        = useState<Gift[]>(mockGifts)
  const [tiers,        setTiers]        = useState<CustomTier[]>(INITIAL_TIERS)
  const [activeTierId, setActiveTierId] = useState<string>(INITIAL_TIERS[0].id)
  const [search,       setSearch]       = useState('')
  const [page,         setPage]         = useState(1)
  const [addGiftOpen,  setAddGiftOpen]  = useState(false)
  const [editGift,     setEditGift]     = useState<Gift | null>(null)
  const [addTierOpen,  setAddTierOpen]  = useState(false)
  const [editTier,     setEditTier]     = useState<CustomTier | null>(null)
  const [confirmDeleteTier, setConfirmDeleteTier] = useState<CustomTier | null>(null)

  const activeTier  = tiers.find(t => t.id === activeTierId)
  const tierGifts   = gifts.filter(g => g.tier === activeTierId)
  const filtered    = search.trim()
    ? tierGifts.filter(g => g.name.toLowerCase().includes(search.toLowerCase().trim()))
    : tierGifts
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe    = Math.min(page, totalPages)
  const paged       = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)
  const totalEnabled = gifts.filter(g => g.enabled).length

  const toggleGift = (id: string) =>
    setGifts(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g))

  const handleAddGift = (data: Omit<Gift, 'id'>) => {
    setGifts(prev => [...prev, { ...data, id: `g${Date.now()}` }])
    toast(`Gift "${data.name}" added`, 'success')
  }

  const handleEditGift = (id: string, data: Omit<Gift, 'id'>) => {
    setGifts(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
    toast(`Gift "${data.name}" updated`, 'success')
  }

  const handleAddTier = (data: Omit<CustomTier, 'id'>) => {
    const id = `tier_${Date.now()}`
    setTiers(prev => [...prev, { ...data, id }])
    setActiveTierId(id)
    toast(`Tier "${data.name}" added`, 'success')
  }

  const handleEditTier = (id: string, data: Omit<CustomTier, 'id'>) => {
    setTiers(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
    toast(`Tier "${data.name}" updated`, 'success')
  }

  const handleDeleteTier = (tier: CustomTier) => {
    const giftCount = gifts.filter(g => g.tier === tier.id).length
    setGifts(prev => prev.filter(g => g.tier !== tier.id))
    setTiers(prev => {
      const remaining = prev.filter(t => t.id !== tier.id)
      if (activeTierId === tier.id && remaining.length > 0) setActiveTierId(remaining[0].id)
      return remaining
    })
    toast(`Tier "${tier.name}" deleted${giftCount > 0 ? ` (${giftCount} gift${giftCount > 1 ? 's' : ''} removed)` : ''}`, 'info')
    setConfirmDeleteTier(null)
  }

  function switchTier(id: string) { setActiveTierId(id); setSearch(''); setPage(1) }

  const addCardStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: 'transparent', border: '1.5px dashed var(--border)', borderRadius: 12,
    padding: '24px 8px', minHeight: 180, cursor: 'pointer', color: 'var(--text-subtle)',
    fontSize: 12, transition: 'all 0.15s',
  }

  return (
    <div>
      {/* ── Delete tier confirm ── */}
      {confirmDeleteTier && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmDeleteTier(null)} />
          <div className="modal-dialog" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title">Delete Tier</span>
              <button className="modal-close" onClick={() => setConfirmDeleteTier(null)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Delete tier <strong style={{ color: 'var(--text-primary)' }}>{confirmDeleteTier.name}</strong>?
                {gifts.filter(g => g.tier === confirmDeleteTier.id).length > 0 && (
                  <span style={{ color: '#E74C3C' }}>{' '}This will also remove {gifts.filter(g => g.tier === confirmDeleteTier.id).length} gift{gifts.filter(g => g.tier === confirmDeleteTier.id).length > 1 ? 's' : ''} in this tier.</span>
                )}
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmDeleteTier(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeleteTier(confirmDeleteTier)}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </>
      )}

      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Gift Catalog</div>
          <div className="subtitle">Manage virtual gifts, tiers, prices, and animations</div>
        </div>
        <div className="page-header-actions">
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{totalEnabled}/{gifts.length} enabled</span>
        </div>
      </div>

      {/* ── Tier tabs ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 2, alignItems: 'center' }}>
        {tiers.map(tier => {
          const active = activeTierId === tier.id
          const count  = gifts.filter(g => g.tier === tier.id).length
          return (
            <button key={tier.id} onClick={() => switchTier(tier.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              background: active ? 'rgba(212,175,55,0.08)' : 'var(--surface)',
              border: `1.5px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-muted)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: active ? 'var(--gold)' : 'var(--text-primary)' }}>
                  {tier.name}
                </span>
                <span style={{ fontSize: 11, color: active ? 'var(--gold)' : 'var(--text-muted)', opacity: 0.85 }}>
                  {tier.minCoins > 0 ? `${tier.minCoins.toLocaleString()}+ 🪙` : 'Any price'}
                </span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 10, marginLeft: 2,
                background: active ? 'rgba(212,175,55,0.15)' : 'var(--bg)',
                color: active ? 'var(--gold)' : 'var(--text-muted)',
                border: `1px solid ${active ? 'rgba(212,175,55,0.3)' : 'var(--border)'}`,
              }}>{count}</span>
            </button>
          )
        })}

        <button onClick={() => setAddTierOpen(true)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
          flexShrink: 0, whiteSpace: 'nowrap', background: 'transparent',
          border: '1.5px dashed var(--border)', color: 'var(--text-muted)',
          fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)' }}
        >
          <Plus size={13} /> Add Tier
        </button>
      </div>

      {tiers.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          No tiers yet. Click <strong>Add Tier</strong> to create your first tier.
        </div>
      ) : activeTier ? (
        <>
          {/* ── Active tier header ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderRadius: 10, marginBottom: 20,
            background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{activeTier.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {activeTier.minCoins > 0 ? `${activeTier.minCoins.toLocaleString()}+ coins required` : 'Any price'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditTier(activeTier)}>
                <Edit2 size={12} /> Edit
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDeleteTier(activeTier)}
                style={{ color: 'var(--text-muted)' }}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>

          {/* ── Search ── */}
          <div style={{ marginBottom: 16 }}>
            <div className="search-input-wrapper" style={{ maxWidth: 280 }}>
              <Search size={14} />
              <input className="search-input" placeholder={`Search in ${activeTier.name}…`}
                value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
              {search && (
                <button onClick={() => { setSearch(''); setPage(1) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, display: 'flex' }}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* ── Gift grid ── */}
          {tierGifts.length === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 12 }}>
              <button onClick={() => setAddGiftOpen(true)} style={addCardStyle}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-subtle)' }}>
                <span style={{ fontSize: 22 }}>+</span>
                <span>Add Gift</span>
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No gifts match "{search}"
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 12 }}>
                {pageSafe === 1 && (
                  <button onClick={() => setAddGiftOpen(true)} style={addCardStyle}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-subtle)' }}>
                    <span style={{ fontSize: 22 }}>+</span>
                    <span>Add Gift</span>
                  </button>
                )}
                {paged.map(g => (
                  <GiftCard key={g.id} gift={g}
                    onToggle={toggleGift}
                    onEdit={g => setEditGift(g)} />
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {(pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p - 1)} disabled={pageSafe === 1}
                      style={{ padding: '4px 8px', opacity: pageSafe === 1 ? 0.4 : 1 }}>
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)} style={{
                        padding: '4px 10px', minWidth: 32, borderRadius: 6, fontSize: 12,
                        fontWeight: p === pageSafe ? 700 : 400, cursor: 'pointer', border: 'none',
                        background: p === pageSafe ? 'rgba(212,175,55,0.15)' : 'var(--bg)',
                        color: p === pageSafe ? 'var(--gold)' : 'var(--text-muted)',
                        outline: p === pageSafe ? '1.5px solid rgba(212,175,55,0.4)' : 'none',
                      }}>{p}</button>
                    ))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p + 1)} disabled={pageSafe === totalPages}
                      style={{ padding: '4px 8px', opacity: pageSafe === totalPages ? 0.4 : 1 }}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : null}

      {/* ── Modals ── */}
      {addGiftOpen && (
        <GiftModal tierId={activeTierId} tierName={activeTier?.name ?? ''} onSave={handleAddGift} onClose={() => setAddGiftOpen(false)} />
      )}
      {editGift && (
        <GiftModal tierId={editGift.tier} tierName={editGift.tierName} initial={editGift} onSave={data => handleEditGift(editGift.id, data)} onClose={() => setEditGift(null)} />
      )}
      {addTierOpen && (
        <TierModal onSave={handleAddTier} onClose={() => setAddTierOpen(false)} />
      )}
      {editTier && (
        <TierModal initial={editTier}
          onSave={data => handleEditTier(editTier.id, data)} onClose={() => setEditTier(null)} />
      )}
    </div>
  )
}
