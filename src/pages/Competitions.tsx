import { useState } from 'react'
import { Trophy, RefreshCw, Megaphone, TrendingUp, TrendingDown, Minus, Play, Square, Plus, Trash2, X } from 'lucide-react'
import { mockLeaderboard, mockPrizeTiers } from '../mockData'
import { useStore } from '../store'
import type { PrizeTier } from '../types'

type ContestPeriod = 'weekly' | 'biweekly' | 'monthly'

const periodLabels: Record<ContestPeriod, string> = {
  weekly:   'Weekly',
  biweekly: 'Bi-Weekly',
  monthly:  'Monthly',
}

const periodDuration: Record<ContestPeriod, string> = {
  weekly:   '7 days',
  biweekly: '14 days',
  monthly:  '30 days',
}

export default function Competitions() {
  const { toast } = useStore()

  const [tiers,          setTiers]          = useState<PrizeTier[]>(mockPrizeTiers)
  const [draftTiers,     setDraftTiers]     = useState<PrizeTier[]>(mockPrizeTiers)
  const [prizeEditing,   setPrizeEditing]   = useState(false)
  const [period,         setPeriod]         = useState<ContestPeriod>('monthly')
  const [contestActive,  setContestActive]  = useState(true)
  const [refreshing,     setRefreshing]     = useState(false)
  const [refreshedAt,    setRefreshedAt]    = useState<string | null>(null)
  const [confirmReset,   setConfirmReset]   = useState(false)
  const [confirmAnnounce, setConfirmAnnounce] = useState(false)

  const resetLabel = period === 'weekly' ? 'Reset Week' : period === 'biweekly' ? 'Reset Period' : 'Reset Month'

  function startEdit() {
    setDraftTiers(tiers.map(t => ({ ...t })))
    setPrizeEditing(true)
  }

  function saveEdit() {
    setTiers(draftTiers)
    setPrizeEditing(false)
    toast('Prize configuration saved', 'success')
  }

  function cancelEdit() {
    setDraftTiers(tiers.map(t => ({ ...t })))
    setPrizeEditing(false)
  }

  function updateDraft(i: number, field: keyof PrizeTier, value: string) {
    setDraftTiers(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t))
  }

  function deleteDraft(i: number) {
    setDraftTiers(prev => prev.filter((_, idx) => idx !== i))
  }

  function addDraft() {
    setDraftTiers(prev => [...prev, { rank: `#${prev.length + 1}`, prize: '', type: 'cash' }])
  }

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      const now = new Date()
      setRefreshedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      toast('Leaderboard refreshed', 'success')
    }, 900)
  }

  function handlePeriodChange(p: ContestPeriod) {
    setPeriod(p)
    toast(`Switched to ${periodLabels[p]} contest`, 'info')
  }

  function handleToggleContest() {
    const next = !contestActive
    setContestActive(next)
    toast(next ? 'Contest started' : 'Contest stopped', next ? 'success' : 'info')
  }

  function handleReset() {
    setConfirmReset(false)
    toast(`${resetLabel} complete — leaderboard cleared`, 'info')
  }

  function handleAnnounce() {
    setConfirmAnnounce(false)
    toast('Winners announced! Notifications sent to all eligible participants.', 'success')
  }

  const displayTiers = prizeEditing ? draftTiers : tiers

  return (
    <div>
      {/* ── Reset confirm ── */}
      {confirmReset && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmReset(false)} />
          <div className="modal-dialog" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <span className="modal-title">{resetLabel}</span>
              <button className="modal-close" onClick={() => setConfirmReset(false)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                This will clear the current leaderboard for the {periodLabels[period].toLowerCase()} contest. This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReset}><RefreshCw size={13} /> {resetLabel}</button>
            </div>
          </div>
        </>
      )}

      {/* ── Announce confirm ── */}
      {confirmAnnounce && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmAnnounce(false)} />
          <div className="modal-dialog" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title">Announce Winners</span>
              <button className="modal-close" onClick={() => setConfirmAnnounce(false)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Send winner notifications to all prize-eligible participants for the current {periodLabels[period].toLowerCase()} contest?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmAnnounce(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAnnounce}><Megaphone size={13} /> Announce Winners</button>
            </div>
          </div>
        </>
      )}

      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Competitions</div>
          <div className="subtitle">{periodLabels[period]} leaderboard and prize configuration</div>
        </div>
        <div className="page-header-actions">
          {/* Period switcher */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
            {(Object.keys(periodLabels) as ContestPeriod[]).map(p => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                style={{
                  fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: 'none',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: period === p ? 'var(--gold)' : 'transparent',
                  color: period === p ? '#000' : 'var(--text-muted)',
                }}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>

          {contestActive ? (
            <button className="btn btn-danger btn-sm" onClick={handleToggleContest}>
              <Square size={12} /> Stop Contest
            </button>
          ) : (
            <button className="btn btn-success btn-sm" onClick={handleToggleContest}>
              <Play size={12} /> Start Contest
            </button>
          )}

          <button className="btn btn-secondary" onClick={() => setConfirmReset(true)}>
            <RefreshCw size={14} /> {resetLabel}
          </button>
          <button className="btn btn-primary" onClick={() => setConfirmAnnounce(true)}>
            <Megaphone size={14} /> Announce Winners
          </button>
        </div>
      </div>

      {/* Competition meta card */}
      <div className="section card">
        <div className="card-header">
          <div>
            <div className="card-title">June 2026 Competition</div>
            <div className="card-subtitle">
              {periodLabels[period]} · {periodDuration[period]}
              {period !== 'monthly' && ' · Auto-resets each cycle'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {contestActive ? (
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: 'rgba(46,204,138,0.12)', color: '#2ECC8A', border: '1px solid rgba(46,204,138,0.2)',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2ECC8A', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                Active
              </span>
            ) : (
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: 'rgba(231,76,60,0.12)', color: '#E74C3C', border: '1px solid rgba(231,76,60,0.2)',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E74C3C', display: 'inline-block' }} />
                Stopped
              </span>
            )}
          </div>
        </div>
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: 6 }}>Total Prize Pool</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--gold)' }}>$2,500</div>
          </div>
          <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: 6 }}>Eligible Competitors</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>247</div>
          </div>
          <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: 6 }}>Days Remaining</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>27</div>
          </div>
        </div>
      </div>

      {/* Two-column: Prize config + Leaderboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Prize config */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Prize Configuration</div>
              <div className="card-subtitle">Editable payout table</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {prizeEditing ? (
                <>
                  <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
                </>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={startEdit}>Edit</button>
              )}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Prize</th>
                  <th>Type</th>
                  {prizeEditing && <th style={{ width: 36 }}></th>}
                </tr>
              </thead>
              <tbody>
                {displayTiers.map((p, i) => (
                  <tr key={i}>
                    <td>
                      {prizeEditing ? (
                        <input className="form-input" value={p.rank}
                          onChange={e => updateDraft(i, 'rank', e.target.value)}
                          style={{ padding: '4px 8px', fontSize: 12, width: 64 }} />
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 13 }}>{p.rank}</span>
                      )}
                    </td>
                    <td>
                      {prizeEditing ? (
                        <input className="form-input" value={p.prize}
                          onChange={e => updateDraft(i, 'prize', e.target.value)}
                          style={{ padding: '4px 8px', fontSize: 12 }} />
                      ) : (
                        <span style={{ color: p.type === 'cash' ? 'var(--emerald)' : 'var(--amethyst)', fontWeight: 700 }}>
                          {p.prize}
                        </span>
                      )}
                    </td>
                    <td>
                      {prizeEditing ? (
                        <select className="form-input" value={p.type}
                          onChange={e => updateDraft(i, 'type', e.target.value as 'cash' | 'cosmetic')}
                          style={{ padding: '4px 8px', fontSize: 12 }}>
                          <option value="cash">Cash</option>
                          <option value="cosmetic">Cosmetic</option>
                        </select>
                      ) : (
                        <span style={{
                          fontSize: 11, padding: '2px 7px', borderRadius: 20, fontWeight: 600,
                          background: p.type === 'cash' ? 'rgba(46,204,138,0.1)' : 'rgba(153,102,204,0.1)',
                          color: p.type === 'cash' ? 'var(--emerald)' : 'var(--amethyst)',
                          border: p.type === 'cash' ? '1px solid rgba(46,204,138,0.2)' : '1px solid rgba(153,102,204,0.2)'
                        }}>
                          {p.type === 'cash' ? 'Cash' : 'Cosmetic'}
                        </span>
                      )}
                    </td>
                    {prizeEditing && (
                      <td>
                        <button className="btn btn-ghost btn-icon" onClick={() => deleteDraft(i)}
                          style={{ color: 'var(--text-muted)' }}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {prizeEditing && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={addDraft}>
                <Plus size={13} /> Add Rank
              </button>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="table-wrapper">
          <div className="table-header">
            <div>
              <div className="table-title">Current Top 10 Leaderboard</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {refreshedAt && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Updated {refreshedAt}</span>
              )}
              <button className="btn btn-ghost btn-sm" onClick={handleRefresh} disabled={refreshing}
                style={{ opacity: refreshing ? 0.6 : 1 }}>
                <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
                Refresh
              </button>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                <Trophy size={13} style={{ display: 'inline', marginRight: 4, color: 'var(--gold)' }} />
                Top 30 eligible for prizes
              </span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Creator</th>
                  <th>Diamonds Received</th>
                  <th>Prize</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {mockLeaderboard.map(entry => {
                  const rankClass = entry.rank <= 3 ? `rank-${entry.rank}` : 'rank-other'
                  return (
                    <tr key={entry.rank}>
                      <td>
                        <div className={`rank-badge ${rankClass}`}>
                          {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                        </div>
                      </td>
                      <td>
                        <div className="avatar-row">
                          <div className="avatar" style={{ background: entry.avatarColor }}>
                            {entry.name[0]}
                          </div>
                          <div>
                            <div className="user-name">{entry.name}</div>
                            <div className="user-handle">@{entry.handle}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                          {entry.diamondsReceived.toLocaleString()} 💎
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>{entry.prize}</span>
                      </td>
                      <td>
                        <div className={`change-arrow change-${entry.change}`}>
                          {entry.change === 'up' && <TrendingUp size={13} />}
                          {entry.change === 'down' && <TrendingDown size={13} />}
                          {entry.change === 'same' && <Minus size={13} />}
                          {entry.change !== 'same' && entry.changeAmount > 0 && (
                            <span>{entry.changeAmount}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
