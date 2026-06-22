import { useState } from 'react'
import { XCircle, AlertTriangle, ExternalLink, RefreshCw, ScrollText, Search } from 'lucide-react'
import Badge, { statusLabel } from '../components/Badge'
import WarnModal from '../components/WarnModal'
import WarnMessagesEditor from '../components/WarnMessagesEditor'
import StreamCategoriesEditor from '../components/StreamCategoriesEditor'
import ReportReasonsEditor from '../components/ReportReasonsEditor'
import ActionLogModal from '../components/ActionLogModal'
import { useStore } from '../store'
import type { Stream } from '../types'

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
}

export default function Streams() {
  const { streams, terminateStream, warnStreamer } = useStore()

  const [activeTab, setActiveTab] = useState<'live' | 'past' | 'templates' | 'categories' | 'reasons'>('live')
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null)
  const [warnTarget, setWarnTarget] = useState<Stream | null>(null)
  const [logTarget, setLogTarget] = useState<Stream | null>(null)

  const liveCount = streams.filter(s => s.status === 'live').length

  const tabBase = activeTab === 'live'
    ? streams.filter(s => s.status === 'live')
    : streams.filter(s => s.status === 'ended' || s.status === 'terminated')

  const allCategories = Array.from(new Set(tabBase.map(s => s.category))).sort()

  const visible = tabBase.filter(s => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(s.category)) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!s.streamerHandle.toLowerCase().includes(q) && !s.streamer.toLowerCase().includes(q)) return false
    }
    return true
  })

  function switchTab(tab: 'live' | 'past' | 'templates' | 'categories' | 'reasons') {
    setActiveTab(tab)
    setSelectedCategories([])
    setSearch('')
  }

  return (
    <div>
      {warnTarget && (
        <WarnModal
          targetLabel={`@${warnTarget.streamerHandle} — ${warnTarget.title}`}
          onConfirm={msg => warnStreamer(warnTarget.id, msg)}
          onClose={() => setWarnTarget(null)}
        />
      )}
      {logTarget && (
        <ActionLogModal
          title={`${logTarget.title} — @${logTarget.streamerHandle}`}
          entries={logTarget.log ?? []}
          onClose={() => setLogTarget(null)}
        />
      )}
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Streams</div>
          <div className="subtitle">Monitor live and past streaming activity</div>
        </div>
        <div className="page-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E05C6A', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{liveCount} live now</span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setRefreshedAt(new Date())}
              title="Refresh stream list"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
            {refreshedAt && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Updated {refreshedAt.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        <button
          onClick={() => switchTab('live')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', fontSize: 14, fontWeight: 500,
            color: activeTab === 'live' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'live' ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E05C6A', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          Live Now
          <span style={{
            background: activeTab === 'live' ? 'var(--gold)' : 'var(--border)',
            color: activeTab === 'live' ? '#000' : 'var(--text-muted)',
            borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 600,
          }}>
            {liveCount}
          </span>
        </button>
        <button
          onClick={() => switchTab('past')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', fontSize: 14, fontWeight: 500,
            color: activeTab === 'past' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'past' ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s',
          }}
        >
          Past Streams
        </button>
        <button
          onClick={() => switchTab('templates')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', fontSize: 14, fontWeight: 500,
            color: activeTab === 'templates' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'templates' ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s',
          }}
        >
          Warn Templates
        </button>
        <button
          onClick={() => switchTab('categories')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', fontSize: 14, fontWeight: 500,
            color: activeTab === 'categories' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'categories' ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s',
          }}
        >
          Categories
        </button>
        <button
          onClick={() => switchTab('reasons')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', fontSize: 14, fontWeight: 500,
            color: activeTab === 'reasons' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'reasons' ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s',
          }}
        >
          Report Reasons
        </button>
      </div>

      {activeTab === 'templates' ? (
        <WarnMessagesEditor />
      ) : activeTab === 'categories' ? (
        <StreamCategoriesEditor />
      ) : activeTab === 'reasons' ? (
        <ReportReasonsEditor variant="stream" />
      ) : (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Search</span>
              <div className="search-input-wrapper">
                <Search size={14} />
                <input
                  className="search-input"
                  placeholder="Username…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            {allCategories.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</span>
                <div className="filter-tabs" style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
                  {allCategories.map(cat => (
                    <button
                      key={cat}
                      className={`filter-tab${selectedCategories.includes(cat) ? ' active' : ''}`}
                      onClick={() => setSelectedCategories(prev => toggle(prev, cat))}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(selectedCategories.length > 0 || search) && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ alignSelf: 'flex-end', marginBottom: 2 }}
                onClick={() => { setSelectedCategories([]); setSearch('') }}
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="table-wrapper">
            <div className="table-header">
              <div>
                <div className="table-title">
                  {activeTab === 'live' ? 'Live Streams' : 'Past Streams'} ({visible.length})
                </div>
                <div className="table-subtitle">
                  {selectedCategories.length === 0
                    ? activeTab === 'live' ? 'All active streams' : 'Ended & terminated streams'
                    : selectedCategories.join(', ')}
                </div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              {visible.length === 0 ? (
                <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {activeTab === 'live' ? 'No streams are live right now.' : 'No past streams match the selected filters.'}
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
                      <th>Diamonds</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(s => (
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
                            {s.status === 'live' && <Badge variant="live" dot>Live</Badge>}
                          </div>
                        </td>
                        <td>
                          <span style={{ background: 'var(--bg-surface-2)', padding: '3px 8px', borderRadius: 20, fontSize: 12, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                            {s.category}
                          </span>
                        </td>
                        <td><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{s.viewers.toLocaleString()}</span></td>
                        <td style={{ color: 'var(--text-muted)' }}>{s.duration}</td>
                        <td>
                          <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{s.diamondsEarned.toLocaleString()} 💎</span>
                          {s.status !== 'live' && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {new Date(s.startedAt).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td><Badge variant={s.status} dot>{statusLabel(s.status)}</Badge></td>
                        <td>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-ghost btn-icon"
                              title="View action log"
                              onClick={() => setLogTarget(s)}
                            >
                              <ScrollText size={12} />
                              {(s.log?.length ?? 0) > 0 && (
                                <span style={{ fontSize: 10, marginLeft: 2, color: 'var(--text-muted)' }}>{s.log!.length}</span>
                              )}
                            </button>
                            {s.status === 'live' && (
                              <>
                                <a
                                  href={`https://loouno.com/live/${s.streamerHandle}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-ghost btn-sm"
                                  title="Open stream"
                                >
                                  <ExternalLink size={12} /> View
                                </a>
                                <button className="btn btn-danger btn-sm" onClick={() => terminateStream(s.id)}>
                                  <XCircle size={12} /> Terminate
                                </button>
                                <button className="btn btn-warn btn-sm" onClick={() => setWarnTarget(s)}>
                                  <AlertTriangle size={12} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
