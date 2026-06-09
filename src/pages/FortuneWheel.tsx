import { useState } from 'react'
import { Save, Plus, Trash2, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react'
import { mockWheelPrizes } from '../mockData'
import { useStore } from '../store'
import type { FortuneWheelPrize, WheelPrizeType } from '../types'

const typeLabels: Record<WheelPrizeType, string> = {
  coins:      '🪙 Coins',
  diamonds:   '💎 Diamonds',
  multiplier: '✨ Multiplier',
  miss:       '💨 Miss',
}

function ProbabilityBar({ prizes }: { prizes: FortuneWheelPrize[] }) {
  const active = prizes.filter(p => p.enabled && p.probability > 0)
  const total = active.reduce((s, p) => s + p.probability, 0)
  if (total === 0) return (
    <div style={{ width: '100%', height: 12, borderRadius: 6, background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }} />
  )
  return (
    <div style={{ width: '100%', height: 12, borderRadius: 6, overflow: 'hidden', display: 'flex', background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
      {active.map(p => (
        <div
          key={p.id}
          title={`${p.label}: ${p.probability}%`}
          style={{ width: `${(p.probability / total) * 100}%`, background: p.color, transition: 'width 0.2s' }}
        />
      ))}
    </div>
  )
}

const MAX_SEGMENTS = 5

export default function FortuneWheel() {
  const { toast } = useStore()
  const [prizes, setPrizes] = useState<FortuneWheelPrize[]>(mockWheelPrizes.slice(0, MAX_SEGMENTS))
  const [wheelEnabled, setWheelEnabled] = useState(true)
  const [spinCost, setSpinCost] = useState(100)
  const [smallBonusThreshold, setSmallBonusThreshold] = useState(500)
  const [largeBonusThreshold, setLargeBonusThreshold] = useState(1000)

  const activeTotal = prizes.filter(p => p.enabled).reduce((s, p) => s + p.probability, 0)
  const isValid = activeTotal === 100

  const updatePrize = (id: string, updates: Partial<FortuneWheelPrize>) => {
    setPrizes(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const removePrize = (id: string) => {
    setPrizes(prev => prev.filter(p => p.id !== id))
  }

  const addPrize = () => {
    if (prizes.length >= MAX_SEGMENTS) {
      toast(`Fortune wheel is fixed at ${MAX_SEGMENTS} segments`, 'warn')
      return
    }
    const newPrize: FortuneWheelPrize = {
      id: `wp${Date.now()}`,
      label: 'New Prize',
      emoji: '🎁',
      type: 'coins',
      reward: 0,
      probability: 0,
      color: '#3498DB',
      enabled: true,
    }
    setPrizes(prev => [...prev, newPrize])
  }

  const autoBalance = () => {
    const enabledPrizes = prizes.filter(p => p.enabled)
    if (enabledPrizes.length === 0) return
    const base = Math.floor(100 / enabledPrizes.length)
    const remainder = 100 - base * enabledPrizes.length
    let i = 0
    setPrizes(prev => prev.map(p => {
      if (!p.enabled) return p
      const prob = base + (i < remainder ? 1 : 0)
      i++
      return { ...p, probability: prob }
    }))
    toast('Probabilities auto-balanced to 100%', 'info')
  }

  const handleSave = () => {
    if (!isValid) {
      toast(`Probabilities sum to ${activeTotal}% — must equal 100%`, 'error')
      return
    }
    toast('Fortune Wheel configuration saved', 'success')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Fortune Wheel</div>
          <div className="subtitle">Configure {MAX_SEGMENTS} prize segments, drop probabilities, and milestone bonuses</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-ghost btn-sm" onClick={autoBalance}>
            <RotateCcw size={13} /> Auto-Balance
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ opacity: isValid ? 1 : 0.55 }}
            title={isValid ? 'Save configuration' : `Probabilities sum to ${activeTotal}% — must equal 100%`}
          >
            <Save size={13} /> Save Config
          </button>
        </div>
      </div>

      {/* Global settings */}
      <div className="table-wrapper" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Global Settings
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label className="toggle">
              <input type="checkbox" checked={wheelEnabled} onChange={e => setWheelEnabled(e.target.checked)} />
              <span className="toggle-track" />
            </label>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Wheel Active</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Feature visible to users</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Spin Cost</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                className="form-input"
                type="number"
                min={0}
                value={spinCost}
                onChange={e => setSpinCost(Number(e.target.value))}
                style={{ width: 90 }}
              />
              <span style={{ fontSize: 14 }}>🪙</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13 }}>∞</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Unlimited Spins</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No cooldown or daily limit</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13 }}>⬡</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{MAX_SEGMENTS} Segments Fixed</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Wheel always has {MAX_SEGMENTS} prizes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone bonuses */}
      <div className="table-wrapper" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Milestone Bonuses
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          When total spin milestones are reached, the streamer who triggered that spin receives a bonus gift.
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Small Bonus — every N spins</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                className="form-input"
                type="number"
                min={1}
                value={smallBonusThreshold}
                onChange={e => setSmallBonusThreshold(Number(e.target.value))}
                style={{ width: 100 }}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              e.g. spin #{smallBonusThreshold}, #{smallBonusThreshold * 2}, …
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Large Bonus — every N spins</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                className="form-input"
                type="number"
                min={1}
                value={largeBonusThreshold}
                onChange={e => setLargeBonusThreshold(Number(e.target.value))}
                style={{ width: 100 }}
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>spins</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              e.g. spin #{largeBonusThreshold}, #{largeBonusThreshold * 2}, …
            </div>
          </div>

          {largeBonusThreshold > 0 && smallBonusThreshold > 0 && largeBonusThreshold <= smallBonusThreshold && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#E74C3C', fontWeight: 600 }}>
              ⚠ Large bonus threshold should be greater than small bonus threshold
            </div>
          )}
        </div>
      </div>

      {/* Probability distribution */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Probability Distribution</span>
          {isValid ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--emerald)', fontWeight: 600 }}>
              <CheckCircle size={14} /> 100% — valid
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#E74C3C', fontWeight: 600 }}>
              <AlertTriangle size={14} /> {activeTotal}% — must equal 100%
            </span>
          )}
        </div>
        <ProbabilityBar prizes={prizes} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 8 }}>
          {prizes.filter(p => p.enabled).map(p => (
            <span key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: 'inline-block', flexShrink: 0 }} />
              {p.label} {p.probability}%
            </span>
          ))}
        </div>
      </div>

      {/* Prize table */}
      <div className="table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">Prize Segments</div>
            <div className="table-subtitle">{prizes.length} segments · {prizes.filter(p => p.enabled).length} active</div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={addPrize}
            disabled={prizes.length >= MAX_SEGMENTS}
            title={prizes.length >= MAX_SEGMENTS ? `Max ${MAX_SEGMENTS} segments` : 'Add segment'}
            style={{ opacity: prizes.length >= MAX_SEGMENTS ? 0.4 : 1 }}
          >
            <Plus size={13} /> Add Segment
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>Color</th>
                <th>Label</th>
                <th>Type</th>
                <th>Reward</th>
                <th style={{ width: 130 }}>Probability</th>
                <th style={{ width: 80 }}>Enabled</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {prizes.map(prize => (
                <tr key={prize.id} style={{ opacity: prize.enabled ? 1 : 0.45 }}>
                  <td>
                    <label style={{ cursor: 'pointer', display: 'block', position: 'relative' }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: prize.color,
                        border: '1.5px solid rgba(255,255,255,0.12)',
                        cursor: 'pointer',
                      }} />
                      <input
                        type="color"
                        value={prize.color}
                        onChange={e => updatePrize(prize.id, { color: e.target.value })}
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, top: 0, left: 0 }}
                      />
                    </label>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input
                        className="form-input"
                        value={prize.emoji}
                        onChange={e => updatePrize(prize.id, { emoji: e.target.value })}
                        style={{ width: 46, textAlign: 'center', fontSize: 16, padding: '4px 6px' }}
                      />
                      <input
                        className="form-input"
                        value={prize.label}
                        onChange={e => updatePrize(prize.id, { label: e.target.value })}
                        style={{ width: 140 }}
                      />
                    </div>
                  </td>

                  <td>
                    <select
                      className="form-select"
                      value={prize.type}
                      onChange={e => updatePrize(prize.id, { type: e.target.value as WheelPrizeType })}
                      style={{ width: 140 }}
                    >
                      {(Object.keys(typeLabels) as WheelPrizeType[]).map(t => (
                        <option key={t} value={t}>{typeLabels[t]}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    {prize.type === 'miss' ? (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          className="form-input"
                          type="number"
                          min={0}
                          value={prize.reward}
                          onChange={e => updatePrize(prize.id, { reward: Number(e.target.value) })}
                          style={{ width: 100 }}
                        />
                        <span style={{ fontSize: 13 }}>
                          {prize.type === 'coins' ? '🪙' : prize.type === 'diamonds' ? '💎' : '×'}
                        </span>
                      </div>
                    )}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        className="form-input"
                        type="number"
                        min={0}
                        max={100}
                        value={prize.probability}
                        onChange={e => updatePrize(prize.id, { probability: Math.max(0, Math.min(100, Number(e.target.value))) })}
                        style={{ width: 70 }}
                      />
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>%</span>
                    </div>
                  </td>

                  <td>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={prize.enabled}
                        onChange={e => updatePrize(prize.id, { enabled: e.target.checked })}
                      />
                      <span className="toggle-track" />
                    </label>
                  </td>

                  <td>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => removePrize(prize.id)}
                      title="Remove segment"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 16,
        }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Active: {prizes.filter(p => p.enabled).length} segments
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: isValid ? 'var(--emerald)' : '#E74C3C' }}>
            Total: {activeTotal}%
          </span>
          {!isValid && (
            <span style={{ fontSize: 12, color: '#E74C3C' }}>
              {activeTotal < 100 ? `+${100 - activeTotal}% missing` : `-${activeTotal - 100}% excess`}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
