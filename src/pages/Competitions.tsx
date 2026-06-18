import { useState } from 'react'
import { Trophy, RefreshCw, TrendingUp, TrendingDown, Minus, Play, Square, Plus, Trash2, X, Calendar, Users, Award } from 'lucide-react'
import { mockLeaderboard, mockPrizeTiers } from '../mockData'
import { useStore } from '../store'
import type { PrizeTier, CompetitionEntry } from '../types'

type ContestPeriod = 'weekly' | 'biweekly' | 'monthly'
type MainTab = 'active' | 'past'

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

const periodDesc: Record<ContestPeriod, string> = {
  weekly:   'Resets every Monday',
  biweekly: 'Resets every 2 weeks',
  monthly:  'Resets on the 1st of each month',
}

interface PastContest {
  id: string
  period: ContestPeriod
  label: string
  startDate: string
  endDate: string
  participants: number
  prizePool: string
  winners: Array<{ rank: number; name: string; handle: string; prize: string; avatarColor: string; diamonds: number }>
}

const MOCK_PAST: PastContest[] = [
  {
    id: 'past1', period: 'monthly', label: 'May 2026 Competition',
    startDate: 'May 1, 2026', endDate: 'May 31, 2026',
    participants: 231, prizePool: '$2,500',
    winners: [
      { rank: 1,  name: 'Sasha Bloom',    handle: 'sashabloom', prize: '$750',              avatarColor: '#9966CC', diamonds: 510400 },
      { rank: 2,  name: 'Aria Voss',      handle: 'ariavoss',   prize: '$500',              avatarColor: '#9966CC', diamonds: 389200 },
      { rank: 3,  name: 'Marco Reyes',    handle: 'marcoreyes', prize: '$300',              avatarColor: '#2ECC8A', diamonds: 310100 },
      { rank: 4,  name: 'Nour Al-Rashid', handle: 'nourar',     prize: '$200',              avatarColor: '#D4AF37', diamonds: 198300 },
      { rank: 5,  name: 'Luna Star',      handle: 'lunastar',   prize: '$150',              avatarColor: '#9B111E', diamonds: 162400 },
      { rank: 6,  name: 'Kai Rivers',     handle: 'kairivs',    prize: '$100',              avatarColor: '#2ECC8A', diamonds: 139700 },
      { rank: 7,  name: 'Zoe Chen',       handle: 'zoechen',    prize: '$75',               avatarColor: '#9966CC', diamonds: 121500 },
      { rank: 8,  name: 'Dex Volta',      handle: 'dexvolta',   prize: '$50',               avatarColor: '#D4AF37', diamonds: 104200 },
      { rank: 9,  name: 'Maya Sun',       handle: 'mayasun',    prize: '$50',               avatarColor: '#2ECC8A', diamonds: 91800 },
      { rank: 10, name: 'Rio Blaze',      handle: 'rioblaze',   prize: '$50',               avatarColor: '#C0392B', diamonds: 79100 },
      { rank: 11, name: 'Ivy Moon',       handle: 'ivymoon',    prize: '$25',               avatarColor: '#3498DB', diamonds: 67400 },
      { rank: 12, name: 'Finn Chase',     handle: 'finnchase',  prize: '$25',               avatarColor: '#E67E22', diamonds: 58900 },
    ],
  },
  {
    id: 'past2', period: 'monthly', label: 'April 2026 Competition',
    startDate: 'Apr 1, 2026', endDate: 'Apr 30, 2026',
    participants: 198, prizePool: '$2,500',
    winners: [
      { rank: 1,  name: 'Luna Star',      handle: 'lunastar',   prize: '$750',              avatarColor: '#9B111E', diamonds: 475000 },
      { rank: 2,  name: 'Zoe Chen',       handle: 'zoechen',    prize: '$500',              avatarColor: '#9966CC', diamonds: 362000 },
      { rank: 3,  name: 'Dex Volta',      handle: 'dexvolta',   prize: '$300',              avatarColor: '#D4AF37', diamonds: 288000 },
      { rank: 4,  name: 'Sasha Bloom',    handle: 'sashabloom', prize: '$200',              avatarColor: '#9966CC', diamonds: 201400 },
      { rank: 5,  name: 'Rio Blaze',      handle: 'rioblaze',   prize: '$150',              avatarColor: '#C0392B', diamonds: 173200 },
      { rank: 6,  name: 'Marco Reyes',    handle: 'marcoreyes', prize: '$100',              avatarColor: '#2ECC8A', diamonds: 144800 },
      { rank: 7,  name: 'Aria Voss',      handle: 'ariavoss',   prize: '$75',               avatarColor: '#9966CC', diamonds: 118600 },
      { rank: 8,  name: 'Kai Rivers',     handle: 'kairivs',    prize: '$50',               avatarColor: '#2ECC8A', diamonds: 97300 },
      { rank: 9,  name: 'Maya Sun',       handle: 'mayasun',    prize: '$50',               avatarColor: '#2ECC8A', diamonds: 84100 },
      { rank: 10, name: 'Finn Chase',     handle: 'finnchase',  prize: '$50',               avatarColor: '#E67E22', diamonds: 71500 },
    ],
  },
]

/* ── Prize row ────────────────────────────────────────────────── */

function rankColor(rank: string): string {
  if (rank === 'Rank 1') return '#D4AF37'
  if (rank === 'Rank 2') return '#A8A9AD'
  if (rank === 'Rank 3') return '#CD7F32'
  return 'var(--text-secondary)'
}

function PrizeList({ tiers, editing, onUpdate, onDelete, onAdd }: {
  tiers: PrizeTier[]
  editing: boolean
  onUpdate: (i: number, field: keyof PrizeTier, value: string) => void
  onDelete: (i: number) => void
  onAdd: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {tiers.map((p, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
          borderBottom: i < tiers.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          {editing ? (
            <>
              <input className="form-input" value={p.rank}
                onChange={e => onUpdate(i, 'rank', e.target.value)}
                style={{ width: 96, padding: '5px 8px', fontSize: 12 }} />
              <input className="form-input" value={p.prize}
                onChange={e => onUpdate(i, 'prize', e.target.value)}
                style={{ width: 120, padding: '5px 8px', fontSize: 12 }} />
              <select className="form-input" value={p.type}
                onChange={e => onUpdate(i, 'type', e.target.value as 'cash' | 'cosmetic')}
                style={{ width: 108, padding: '5px 8px', fontSize: 12 }}>
                <option value="cash">Cash</option>
                <option value="cosmetic">Cosmetic</option>
              </select>
              <button className="btn btn-ghost btn-icon" onClick={() => onDelete(i)}
                style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                <Trash2 size={13} />
              </button>
            </>
          ) : (
            <>
              <span style={{
                fontSize: 12, fontWeight: 700, minWidth: 96,
                color: rankColor(p.rank),
              }}>{p.rank}</span>
              <span style={{
                flex: 1, fontSize: 13, fontWeight: 700,
                color: p.type === 'cash' ? 'var(--emerald)' : 'var(--amethyst)',
              }}>{p.prize}</span>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600, flexShrink: 0,
                background: p.type === 'cash' ? 'rgba(46,204,138,0.1)' : 'rgba(153,102,204,0.1)',
                color: p.type === 'cash' ? 'var(--emerald)' : 'var(--amethyst)',
                border: p.type === 'cash' ? '1px solid rgba(46,204,138,0.2)' : '1px solid rgba(153,102,204,0.2)',
              }}>{p.type === 'cash' ? 'Cash' : 'Cosmetic'}</span>
            </>
          )}
        </div>
      ))}
      {editing && (
        <div style={{ padding: '10px 16px', borderTop: tiers.length > 0 ? '1px solid var(--border)' : 'none' }}>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={onAdd}>
            <Plus size={13} /> Add Rank
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Main component ───────────────────────────────────────────── */

export default function Competitions() {
  const { toast } = useStore()

  const [mainTab,       setMainTab]       = useState<MainTab>('active')
  const [contestActive, setContestActive] = useState(true)
  const [period,        setPeriod]        = useState<ContestPeriod>('monthly')
  const [newPeriod,     setNewPeriod]     = useState<ContestPeriod>('monthly')
  const [tiers,         setTiers]         = useState<PrizeTier[]>(mockPrizeTiers)
  const [draftTiers,    setDraftTiers]    = useState<PrizeTier[]>(mockPrizeTiers)
  const [prizeEditing,  setPrizeEditing]  = useState(false)
  const [confirmStop,   setConfirmStop]   = useState(false)
  const [refreshing,    setRefreshing]    = useState(false)
  const [refreshedAt,   setRefreshedAt]   = useState<string | null>(null)
  const [innerTab,      setInnerTab]      = useState<'leaderboard' | 'prizes'>('leaderboard')
  const [pastContests,  setPastContests]  = useState<PastContest[]>(MOCK_PAST)
  const [prizesApproved, setPrizesApproved] = useState(false)
  const [expandedIds,   setExpandedIds]   = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function startEdit() { setDraftTiers(tiers.map(t => ({ ...t }))); setPrizeEditing(true) }
  function saveEdit()  { setTiers(draftTiers); setPrizeEditing(false); toast('Prize configuration saved', 'success') }
  function cancelEdit(){ setDraftTiers(tiers.map(t => ({ ...t }))); setPrizeEditing(false) }

  function updateDraft(i: number, field: keyof PrizeTier, value: string) {
    setDraftTiers(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t))
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

  function handleStopContest() {
    const ended: PastContest = {
      id: `past_${Date.now()}`,
      period,
      label: `June 2026 ${periodLabels[period]} Competition`,
      startDate: 'Jun 1, 2026',
      endDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      participants: 247,
      prizePool: '$2,500',
      winners: mockLeaderboard.slice(0, 10).map(e => ({
        rank: e.rank, name: e.name, handle: e.handle,
        prize: e.prize, avatarColor: e.avatarColor, diamonds: e.diamondsReceived,
      })),
    }
    setPastContests(prev => [ended, ...prev])
    setContestActive(false)
    setConfirmStop(false)
    setPrizesApproved(false)
    setMainTab('past')
    toast('Contest ended — results archived to Past Contests', 'info')
  }

  function handleStartContest() {
    setPeriod(newPeriod)
    setContestActive(true)
    setMainTab('active')
    toast(`${periodLabels[newPeriod]} contest started!`, 'success')
  }

  const displayTiers = prizeEditing ? draftTiers : tiers

  return (
    <div>
      {/* ── Stop confirm ── */}
      {confirmStop && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmStop(false)} />
          <div className="modal-dialog" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title">End Contest</span>
              <button className="modal-close" onClick={() => setConfirmStop(false)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Are you sure you want to end the <strong style={{ color: 'var(--text-primary)' }}>June 2026 {periodLabels[period]} Competition</strong>?
                Results will be finalized and archived to Past Contests.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmStop(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleStopContest}>
                <Square size={13} /> End Contest
              </button>
            </div>
          </div>
        </>
      )}

      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Competitions</div>
          <div className="subtitle">Manage contests, prize configuration, and leaderboards</div>
        </div>
        {contestActive && mainTab === 'active' && (
          <div className="page-header-actions">
            <button className="btn btn-danger btn-sm" onClick={() => setConfirmStop(true)}>
              <Square size={12} /> Stop Contest
            </button>
          </div>
        )}
      </div>

      {/* ── Main tabs ── */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setMainTab('active')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px 16px', fontSize: 14, fontWeight: 500,
          color: mainTab === 'active' ? 'var(--text-primary)' : 'var(--text-muted)',
          borderBottom: mainTab === 'active' ? '2px solid var(--gold)' : '2px solid transparent',
          marginBottom: -1, transition: 'color 0.15s',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {contestActive ? (
            <>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2ECC8A', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              Active Contest
            </>
          ) : 'Start New Contest'}
        </button>
        <button onClick={() => setMainTab('past')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px 16px', fontSize: 14, fontWeight: 500,
          color: mainTab === 'past' ? 'var(--text-primary)' : 'var(--text-muted)',
          borderBottom: mainTab === 'past' ? '2px solid var(--gold)' : '2px solid transparent',
          marginBottom: -1, transition: 'color 0.15s',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          Past Contests
          {pastContests.length > 0 && (
            <span style={{
              background: mainTab === 'past' ? 'var(--gold)' : 'var(--border)',
              color: mainTab === 'past' ? '#000' : 'var(--text-muted)',
              borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 600,
            }}>{pastContests.length}</span>
          )}
        </button>
      </div>

      {/* ── Active / Start New tab ── */}
      {mainTab === 'active' && (
        <>
          {contestActive ? (
            <>
              {/* Compact meta bar */}
              <div className="card section">
                <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>June 2026 Competition</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{periodLabels[period]} · {periodDuration[period]}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: 'rgba(46,204,138,0.12)', color: '#2ECC8A', border: '1px solid rgba(46,204,138,0.2)' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2ECC8A', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                      Active
                    </span>
                    {([['Prize Pool', '$2,500', 'var(--gold)'], ['Competitors', '247', 'var(--text-primary)'], ['Days Left', '27', 'var(--text-primary)']] as [string,string,string][]).map(([label, value, color]) => (
                      <div key={label} style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inner tabs */}
              <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
                {([['leaderboard', 'Current Top 10'], ['prizes', 'Prize Configuration']] as const).map(([tab, label]) => (
                  <button key={tab} onClick={() => setInnerTab(tab)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '7px 16px', fontSize: 13, fontWeight: 500,
                    color: innerTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                    borderBottom: innerTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
                    marginBottom: -1, transition: 'color 0.15s',
                  }}>{label}</button>
                ))}
              </div>

              {innerTab === 'leaderboard' && (
                <div className="table-wrapper">
                  <div className="table-header">
                    <div className="table-title">Current Top 10 Leaderboard</div>
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
                        Top 30 eligible
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
                                  <div className="avatar" style={{ background: entry.avatarColor }}>{entry.name[0]}</div>
                                  <div>
                                    <div className="user-name">{entry.name}</div>
                                    <div className="user-handle">@{entry.handle}</div>
                                  </div>
                                </div>
                              </td>
                              <td><span style={{ color: 'var(--gold)', fontWeight: 700 }}>{entry.diamondsReceived.toLocaleString()} 💎</span></td>
                              <td><span style={{ color: 'var(--emerald)', fontWeight: 700 }}>{entry.prize}</span></td>
                              <td>
                                <div className={`change-arrow change-${entry.change}`}>
                                  {entry.change === 'up'   && <TrendingUp size={13} />}
                                  {entry.change === 'down' && <TrendingDown size={13} />}
                                  {entry.change === 'same' && <Minus size={13} />}
                                  {entry.change !== 'same' && entry.changeAmount > 0 && <span>{entry.changeAmount}</span>}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {innerTab === 'prizes' && (
                <div className="card" style={{ maxWidth: 420 }}>
                  <PrizeList
                    tiers={tiers}
                    editing={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                    onAdd={() => {}}
                  />
                </div>
              )}
            </>
          ) : (
            /* Start New Contest */
            <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Duration — compact inline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Duration</span>
                <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                  {(Object.keys(periodLabels) as ContestPeriod[]).map(p => (
                    <button key={p} onClick={() => setNewPeriod(p)} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      background: newPeriod === p ? 'rgba(212,175,55,0.07)' : 'var(--bg-surface-2)',
                      border: `1.5px solid ${newPeriod === p ? 'var(--gold)' : 'var(--border)'}`,
                      color: newPeriod === p ? 'var(--gold)' : 'var(--text-secondary)',
                      transition: 'all 0.15s',
                    }}>
                      <Calendar size={12} />
                      {periodLabels[p]}
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>({periodDuration[p]})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prize configuration */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Prize Configuration</div>
                    <div className="card-subtitle">Configure payouts before starting the contest</div>
                  </div>
                  {prizesApproved ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: 'rgba(46,204,138,0.1)', color: '#2ECC8A', border: '1px solid rgba(46,204,138,0.2)' }}>
                        Approved ✓
                      </span>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setPrizesApproved(false); setDraftTiers(tiers.map(t => ({ ...t }))) }}>
                        Re-edit
                      </button>
                    </div>
                  ) : null}
                </div>
                <PrizeList
                  tiers={prizesApproved ? tiers : draftTiers}
                  editing={!prizesApproved}
                  onUpdate={updateDraft}
                  onDelete={i => setDraftTiers(prev => prev.filter((_, idx) => idx !== i))}
                  onAdd={() => setDraftTiers(prev => [...prev, { rank: `Rank ${prev.length + 1}`, prize: '', type: 'cash' }])}
                />
                {!prizesApproved && (
                  <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
                    <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => { setTiers(draftTiers); setPrizesApproved(true) }}>
                      Approve Prize Configuration
                    </button>
                  </div>
                )}
              </div>

              {/* Start button */}
              <div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px 0', opacity: prizesApproved ? 1 : 0.45 }}
                  disabled={!prizesApproved}
                  onClick={handleStartContest}
                  title={!prizesApproved ? 'Approve Prize Configuration first' : undefined}>
                  <Play size={14} /> Start {periodLabels[newPeriod]} Contest
                </button>
                {!prizesApproved && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
                    Approve the prize configuration to continue
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Past contests tab ── */}
      {mainTab === 'past' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pastContests.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No past contests yet.
            </div>
          ) : pastContests.map(contest => {
            const expanded = expandedIds.has(contest.id)
            const top3 = contest.winners.slice(0, 3)
            return (
              <div key={contest.id} className="card">
                {/* Header — clickable */}
                <div className="card-header" onClick={() => toggleExpand(contest.id)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border)',
                    }}>{periodLabels[contest.period]}</span>
                    <div>
                      <div className="card-title" style={{ marginBottom: 1 }}>{contest.label}</div>
                      <div className="card-subtitle">{contest.startDate} — {contest.endDate}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Prize Pool</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)' }}>{contest.prizePool}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Participants</div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{contest.participants}</div>
                    </div>
                    <span style={{
                      fontSize: 18, color: 'var(--text-muted)', lineHeight: 1,
                      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      display: 'inline-block',
                    }}>›</span>
                  </div>
                </div>

                {/* Top 3 podium — always visible */}
                <div style={{ padding: '0 20px 20px', display: 'flex', gap: 12 }}>
                  {top3.map(w => (
                    <div key={w.rank} style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 14px', borderRadius: 10,
                      background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
                    }}>
                      <span style={{ fontSize: 20 }}>{['🥇', '🥈', '🥉'][w.rank - 1]}</span>
                      <div className="avatar" style={{ background: w.avatarColor, width: 28, height: 28, fontSize: 12 }}>{w.name[0]}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.diamonds.toLocaleString()} 💎</div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--emerald)', flexShrink: 0 }}>{w.prize}</span>
                    </div>
                  ))}
                </div>

                {/* Expanded: full winners table */}
                {expanded && (
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <div style={{ padding: '12px 20px 6px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      All Prize Winners ({contest.winners.length})
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Creator</th>
                          <th>Diamonds</th>
                          <th>Prize</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contest.winners.map(w => (
                          <tr key={w.rank}>
                            <td>
                              <div className={w.rank <= 3 ? `rank-badge rank-${w.rank}` : 'rank-badge rank-other'}>
                                {w.rank <= 3 ? ['🥇', '🥈', '🥉'][w.rank - 1] : w.rank}
                              </div>
                            </td>
                            <td>
                              <div className="avatar-row">
                                <div className="avatar" style={{ background: w.avatarColor }}>{w.name[0]}</div>
                                <div>
                                  <div className="user-name">{w.name}</div>
                                  <div className="user-handle">@{w.handle}</div>
                                </div>
                              </div>
                            </td>
                            <td><span style={{ color: 'var(--gold)', fontWeight: 700 }}>{w.diamonds.toLocaleString()} 💎</span></td>
                            <td><span style={{ color: 'var(--emerald)', fontWeight: 700 }}>{w.prize}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}

        </div>
      )}
    </div>
  )
}
