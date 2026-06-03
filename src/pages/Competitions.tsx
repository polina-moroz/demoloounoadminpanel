import { useState } from 'react'
import { Trophy, RefreshCw, Download, Megaphone, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { mockLeaderboard, mockPrizeTiers } from '../mockData'

export default function Competitions() {
  const [prizeEditing, setPrizeEditing] = useState(false)

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Competitions</div>
          <div className="subtitle">Monthly leaderboard and prize configuration</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><RefreshCw size={14} /> Reset Month</button>
          <button className="btn btn-secondary"><Download size={14} /> Export CSV</button>
          <button className="btn btn-primary"><Megaphone size={14} /> Announce Winners</button>
        </div>
      </div>

      {/* Competition meta card */}
      <div className="section card">
        <div className="card-header">
          <div>
            <div className="card-title">June 2026 Competition</div>
            <div className="card-subtitle">Jun 1 – Jun 30, 2026</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: 'rgba(46,204,138,0.12)', color: '#2ECC8A', border: '1px solid rgba(46,204,138,0.2)',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2ECC8A', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              Active
            </span>
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
            <button
              className={`btn btn-sm ${prizeEditing ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPrizeEditing(!prizeEditing)}
            >
              {prizeEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Prize</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {mockPrizeTiers.map((p, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 13 }}>{p.rank}</td>
                    <td>
                      {prizeEditing ? (
                        <input
                          className="form-input"
                          defaultValue={p.prize}
                          style={{ padding: '4px 8px', fontSize: 12 }}
                        />
                      ) : (
                        <span style={{ color: p.type === 'cash' ? 'var(--emerald)' : 'var(--amethyst)', fontWeight: 700 }}>
                          {p.prize}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{
                        fontSize: 11, padding: '2px 7px', borderRadius: 20, fontWeight: 600,
                        background: p.type === 'cash' ? 'rgba(46,204,138,0.1)' : 'rgba(153,102,204,0.1)',
                        color: p.type === 'cash' ? 'var(--emerald)' : 'var(--amethyst)',
                        border: p.type === 'cash' ? '1px solid rgba(46,204,138,0.2)' : '1px solid rgba(153,102,204,0.2)'
                      }}>
                        {p.type === 'cash' ? 'Cash' : 'Cosmetic'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="table-wrapper">
          <div className="table-header">
            <div>
              <div className="table-title">Current Top 10 Leaderboard</div>
              <div className="table-subtitle">Updated in real-time based on diamonds received</div>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <Trophy size={13} style={{ display: 'inline', marginRight: 4, color: 'var(--gold)' }} />
              Top 30 eligible for prizes
            </span>
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
