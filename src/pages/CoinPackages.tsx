import { useState } from 'react'
import { X, Edit2, Trash2 } from 'lucide-react'
import { mockCoinPackages } from '../mockData'
import { useStore } from '../store'
import type { CoinPackage } from '../types'

/* ── Tier modal (add / edit) ──────────────────────────────────── */

interface TierModalProps {
  platform: 'iap' | 'web'
  nextTier: number
  initial?: CoinPackage
  onSave: (p: CoinPackage) => void
  onClose: () => void
}

function TierModal({ platform, nextTier, initial, onSave, onClose }: TierModalProps) {
  const [label,     setLabel]     = useState(initial?.label ?? '')
  const [coins,     setCoins]     = useState(initial ? String(initial.coins) : '')
  const [price,     setPrice]     = useState(initial ? String(initial.price) : '')
  const [bestValue, setBestValue] = useState(initial?.bestValue ?? false)

  const valid = label.trim() !== '' && Number(coins) > 0 && Number(price) > 0

  const handleSave = () => {
    onSave({
      id:           initial?.id ?? `pkg_${platform}_${Date.now()}`,
      tier:         initial?.tier ?? nextTier,
      label:        label.trim(),
      coins:        Number(coins),
      price:        Number(price),
      bonusPercent: 0,
      bestValue,
      enabled:      initial?.enabled ?? true,
      platform,
    })
    onClose()
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <span className="modal-title">
            {initial ? 'Edit Tier' : `Add Tier — ${platform === 'iap' ? 'In-App' : 'Website'}`}
          </span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div className="form-group">
            <label className="form-label">Label</label>
            <input className="form-input" placeholder="e.g. Ultra" value={label}
              onChange={e => setLabel(e.target.value)} autoFocus />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Coins</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🪙</span>
                <input className="form-input" type="number" min="1" placeholder="50000" value={coins}
                  onChange={e => setCoins(e.target.value)} style={{ paddingLeft: 30 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Price (USD)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--emerald)', fontWeight: 700, fontSize: 13 }}>$</span>
                <input className="form-input" type="number" min="0.01" step="0.01" placeholder="199.99" value={price}
                  onChange={e => setPrice(e.target.value)} style={{ paddingLeft: 22 }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Best Value badge</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Highlights this tier in the store</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={bestValue} onChange={e => setBestValue(e.target.checked)} />
              <span className="toggle-track" />
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!valid} style={{ opacity: valid ? 1 : 0.45 }} onClick={handleSave}>
            {initial ? 'Save Changes' : 'Add Tier'}
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Package table ────────────────────────────────────────────── */

function PackageTable({ platform, title, subtitle }: { platform: 'iap' | 'web'; title: string; subtitle: string }) {
  const { toast } = useStore()
  const [pkgs,          setPkgs]          = useState<CoinPackage[]>(mockCoinPackages.filter(p => p.platform === platform))
  const [showAdd,       setShowAdd]       = useState(false)
  const [editPkg,       setEditPkg]       = useState<CoinPackage | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<CoinPackage | null>(null)

  const toggleEnabled   = (id: string) => setPkgs(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  const toggleBestValue = (id: string) => setPkgs(prev => {
    const current = prev.find(p => p.id === id)
    if (!current) return prev
    if (!current.bestValue) return prev.map(p => ({ ...p, bestValue: p.id === id }))
    return prev.map(p => p.id === id ? { ...p, bestValue: false } : p)
  })

  const handleAdd = (pkg: CoinPackage) => {
    setPkgs(prev => [...prev, pkg])
    toast(`Tier "${pkg.label}" added`, 'success')
  }

  const handleEdit = (pkg: CoinPackage) => {
    setPkgs(prev => prev.map(p => p.id === pkg.id ? pkg : p))
    toast(`Tier "${pkg.label}" updated`, 'success')
  }

  const handleDelete = (pkg: CoinPackage) => {
    setPkgs(prev => prev.filter(p => p.id !== pkg.id))
    toast(`Tier "${pkg.label}" deleted`, 'info')
    setConfirmDelete(null)
  }

  return (
    <>
      <div className="section table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">{title}</div>
            <div className="table-subtitle">{subtitle}</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            + Add Tier
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Label</th>
                <th>Coins</th>
                <th>Price</th>
                <th>Best Value</th>
                <th>Enabled</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {pkgs.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.label}</td>
                  <td><span style={{ color: 'var(--amethyst)', fontWeight: 700 }}>{p.coins.toLocaleString()} 🪙</span></td>
                  <td><span style={{ color: 'var(--emerald)', fontWeight: 700 }}>${p.price.toFixed(2)}</span></td>
                  <td>
                    <label className="toggle">
                      <input type="checkbox" checked={p.bestValue} onChange={() => toggleBestValue(p.id)} />
                      <span className="toggle-track" />
                    </label>
                  </td>
                  <td>
                    <label className="toggle">
                      <input type="checkbox" checked={p.enabled} onChange={() => toggleEnabled(p.id)} />
                      <span className="toggle-track" />
                    </label>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => setEditPkg(p)}>
                        <Edit2 size={12} />
                      </button>
                      <button className="btn btn-ghost btn-icon" title="Delete"
                        style={{ color: 'var(--text-muted)' }} onClick={() => setConfirmDelete(p)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <TierModal platform={platform} nextTier={pkgs.length + 1}
          onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {editPkg && (
        <TierModal platform={platform} nextTier={pkgs.length + 1} initial={editPkg}
          onSave={handleEdit} onClose={() => setEditPkg(null)} />
      )}
      {confirmDelete && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmDelete(null)} />
          <div className="modal-dialog" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <span className="modal-title">Delete Tier</span>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Delete tier <strong style={{ color: 'var(--text-primary)' }}>{confirmDelete.label}</strong> (${confirmDelete.price.toFixed(2)} · {confirmDelete.coins.toLocaleString()} 🪙)? This cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function CoinPackages() {
  const [activeTab, setActiveTab] = useState<'iap' | 'web'>('iap')

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Coin Packages</div>
          <div className="subtitle">In-app purchases and website tiers</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="filter-tabs" style={{ display: 'inline-flex' }}>
          <button
            className={`filter-tab${activeTab === 'iap' ? ' active' : ''}`}
            onClick={() => setActiveTab('iap')}
          >
            In-App Purchases (IAP)
          </button>
          <button
            className={`filter-tab${activeTab === 'web' ? ' active' : ''}`}
            onClick={() => setActiveTab('web')}
          >
            Website Purchases
          </button>
        </div>
      </div>

      {activeTab === 'iap' && (
        <PackageTable platform="iap" title="In-App Purchases (IAP)"
          subtitle="Apple App Store & Google Play — standard pricing" />
      )}
      {activeTab === 'web' && (
        <PackageTable platform="web" title="Website Purchases"
          subtitle="Direct website checkout — no platform fee" />
      )}
    </div>
  )
}
