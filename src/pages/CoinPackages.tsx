import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { mockCoinPackages } from '../mockData'
import { useStore } from '../store'
import type { CoinPackage } from '../types'

/* ── Add Tier modal ───────────────────────────────────────────── */

interface AddTierModalProps {
  platform: 'iap' | 'web'
  nextTier: number
  onSave: (p: CoinPackage) => void
  onClose: () => void
}

function AddTierModal({ platform, nextTier, onSave, onClose }: AddTierModalProps) {
  const [label, setLabel]         = useState('')
  const [coins, setCoins]         = useState('')
  const [price, setPrice]         = useState('')
  const [bonus, setBonus]         = useState('0')
  const [bestValue, setBestValue] = useState(false)

  const valid = label.trim() !== '' && Number(coins) > 0 && Number(price) > 0

  const handleSave = () => {
    onSave({
      id: `pkg_${platform}_${Date.now()}`,
      tier: nextTier,
      label: label.trim(),
      coins: Number(coins),
      price: Number(price),
      bonusPercent: Number(bonus),
      bestValue,
      enabled: true,
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
            Add Tier — {platform === 'iap' ? 'In-App' : 'Website'}
          </span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div className="form-group">
            <label className="form-label">Label</label>
            <input className="form-input" placeholder="e.g. Ultra" value={label} onChange={e => setLabel(e.target.value)} />
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

          <div className="form-group">
            <label className="form-label">Bonus Coins %</label>
            <input className="form-input" type="number" min="0" placeholder="0" value={bonus}
              onChange={e => setBonus(e.target.value)} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Bonus coins for this tier (0 = none)
            </span>
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
            Add Tier
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Package table ────────────────────────────────────────────── */

function PackageTable({ platform, title, subtitle }: { platform: 'iap' | 'web'; title: string; subtitle: string }) {
  const { toast } = useStore()
  const initial = mockCoinPackages.filter(p => p.platform === platform)
  const [pkgs, setPkgs] = useState<CoinPackage[]>(initial)
  const [showModal, setShowModal] = useState(false)

  const toggleEnabled   = (id: string) => setPkgs(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  const toggleBestValue = (id: string) => setPkgs(prev => prev.map(p => p.id === id ? { ...p, bestValue: !p.bestValue } : p))

  const handleAdd = (pkg: CoinPackage) => {
    setPkgs(prev => [...prev, pkg])
    toast(`Tier "${pkg.label}" added`, 'success')
  }

  return (
    <>
      <div className="section table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">{title}</div>
            <div className="table-subtitle">{subtitle}</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            + Add Tier
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Tier</th>
                <th>Label</th>
                <th>Coins</th>
                <th>Price</th>
                <th>Bonus %</th>
                <th>Best Value</th>
                <th>Enabled</th>
              </tr>
            </thead>
            <tbody>
              {pkgs.map(p => (
                <tr key={p.id}>
                  <td>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)',
                      fontSize: 11, fontWeight: 700, color: 'var(--gold)',
                    }}>
                      {p.tier}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.label}</td>
                  <td><span style={{ color: 'var(--amethyst)', fontWeight: 700 }}>{p.coins.toLocaleString()} 🪙</span></td>
                  <td><span style={{ color: 'var(--emerald)', fontWeight: 700 }}>${p.price.toFixed(2)}</span></td>
                  <td>
                    {p.bonusPercent > 0 ? (
                      <span style={{
                        padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: 'rgba(46,204,138,0.1)', color: 'var(--emerald)',
                        border: '1px solid rgba(46,204,138,0.2)',
                      }}>+{p.bonusPercent}%</span>
                    ) : (
                      <span style={{ color: 'var(--text-subtle)' }}>—</span>
                    )}
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddTierModal
          platform={platform}
          nextTier={pkgs.length + 1}
          onSave={handleAdd}
          onClose={() => setShowModal(false)}
        />
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

      <div className="callout callout-info">
        <Info size={15} />
        <div>
          <strong>Website packages</strong> are processed directly — no App Store or Play Store cut.
          Maximum single website purchase is <strong>$4,999.99</strong>. Bulk orders above $5,000 must be arranged manually.
        </div>
      </div>

      {activeTab === 'iap' && (
        <PackageTable
          platform="iap"
          title="In-App Purchases (IAP)"
          subtitle="Apple App Store & Google Play — standard pricing"
        />
      )}
      {activeTab === 'web' && (
        <PackageTable
          platform="web"
          title="Website Purchases"
          subtitle="Direct website checkout — no platform fee"
        />
      )}
    </div>
  )
}
