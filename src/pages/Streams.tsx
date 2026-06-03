import { useState } from 'react'
import { XCircle, AlertTriangle } from 'lucide-react'
import Badge, { statusLabel } from '../components/Badge'
import { useStore } from '../store'

export default function Streams() {
  const { streams, terminateStream, warnStreamer } = useStore()
  const [tab, setTab] = useState<'live' | 'past'>('live')

  const liveStreams = streams.filter(s => s.status === 'live')
  const pastStreams = streams.filter(s => s.status !== 'live')

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Streams</div>
          <div className="subtitle">Monitor live and past streaming activity</div>
        </div>
        <div className="page-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E05C6A', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{liveStreams.length} live now</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-tabs mb-20" style={{ display: 'inline-flex' }}>
        <button className={`filter-tab${tab === 'live' ? ' active' : ''}`} onClick={() => setTab('live')}>
          Live Now ({liveStreams.length})
        </button>
        <button className={`filter-tab${tab === 'past' ? ' active' : ''}`} onClick={() => setTab('past')}>
          Past Streams ({pastStreams.length})
        </button>
      </div>

      {tab === 'live' && (
        <div className="table-wrapper">
          <div className="table-header">
            <div>
              <div className="table-title">Live Now</div>
              <div className="table-subtitle">Currently active streams</div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {liveStreams.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No live streams at the moment.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Streamer</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Viewers</th>
                    <th>Duration</th>
                    <th>Diamonds Earned</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {liveStreams.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="avatar-row">
                          <div className="avatar" style={{ background: s.avatarColor }}>{s.streamer[0]}</div>
                          <div>
                            <div className="user-name">{s.streamer}</div>
                            <div className="user-handle">@{s.streamerHandle}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.title}</span>
                          <Badge variant="live" dot>Live</Badge>
                        </div>
                      </td>
                      <td>
                        <span style={{ background: 'var(--bg-surface-2)', padding: '3px 8px', borderRadius: 20, fontSize: 12, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                          {s.category}
                        </span>
                      </td>
                      <td><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{s.viewers.toLocaleString()}</span></td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.duration}</td>
                      <td><span style={{ color: 'var(--gold)', fontWeight: 600 }}>{s.diamondsEarned.toLocaleString()} 💎</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-danger btn-sm" onClick={() => terminateStream(s.id)}>
                            <XCircle size={12} /> Terminate
                          </button>
                          <button className="btn btn-warn btn-sm" onClick={() => warnStreamer(s.id)}>
                            <AlertTriangle size={12} /> Warn
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === 'past' && (
        <div className="table-wrapper">
          <div className="table-header">
            <div>
              <div className="table-title">Past Streams</div>
              <div className="table-subtitle">Ended and terminated streams (no VOD — clips uploaded manually)</div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Streamer</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Peak Viewers</th>
                  <th>Duration</th>
                  <th>Diamonds</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pastStreams.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="avatar-row">
                        <div className="avatar" style={{ background: s.avatarColor }}>{s.streamer[0]}</div>
                        <div>
                          <div className="user-name">{s.streamer}</div>
                          <div className="user-handle">@{s.streamerHandle}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.title}</td>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(s.startedAt).toLocaleDateString()}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{s.peakViewers.toLocaleString()}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.duration}</td>
                    <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{s.diamondsEarned.toLocaleString()} 💎</td>
                    <td><Badge variant={s.status} dot>{statusLabel(s.status)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
