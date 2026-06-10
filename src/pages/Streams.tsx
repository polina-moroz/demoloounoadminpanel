import { useState } from 'react'
import { XCircle, AlertTriangle, ExternalLink, RefreshCw, ScrollText } from 'lucide-react'
import Badge, { statusLabel } from '../components/Badge'
import WarnModal from '../components/WarnModal'
import WarnMessagesEditor from '../components/WarnMessagesEditor'
import ActionLogModal from '../components/ActionLogModal'
import { useStore } from '../store'
import type { Stream, StreamStatus } from '../types'

const STATUS_OPTIONS: { key: StreamStatus; label: string }[] = [
  { key: 'live',       label: 'Live Now' },
  { key: 'ended',      label: 'Ended' },
  { key: 'terminated', label: 'Terminated' },
]

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
}

export default function Streams() {
  const { streams, terminateStream, warnStreamer } = useStore()

  const [selectedStatuses, setSelectedStatuses] = useState<StreamStatus[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null)
  const [warnTarget, setWarnTarget] = useState<Stream | null>(null)
  const [logTarget, setLogTarget] = useState<Stream | null>(null)

  const liveCount = streams.filter(s => s.status === 'live').length
  const allCategories = Array.from(new Set(streams.map(s => s.category))).sort()

  const visible = streams.filter(s => {
    const statusOk = selectedStatuses.length === 0 || selectedStatuses.includes(s.status)
    const catOk    = selectedCategories.length === 0 || selectedCategories.includes(s.category)
    return statusOk && catOk
  })

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

      {/* Multi-picker filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</span>
          <div className="filter-tabs" style={{ display: 'inline-flex' }}>
            {STATUS_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                className={`filter-tab${selectedStatuses.includes(key) ? ' active' : ''}`}
                onClick={() => setSelectedStatuses(prev => toggle(prev, key))}
              >
                {key === 'live' && (
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: selectedStatuses.includes(key) ? '#fff' : '#E05C6A', display: 'inline-block', marginRight: 5, flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                )}
                {label}
              </button>
            ))}
          </div>
        </div>

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

        {(selectedStatuses.length > 0 || selectedCategories.length > 0) && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ alignSelf: 'flex-end', marginBottom: 2 }}
            onClick={() => { setSelectedStatuses([]); setSelectedCategories([]) }}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">Streams ({visible.length})</div>
            <div className="table-subtitle">
              {selectedStatuses.length === 0 && selectedCategories.length === 0
                ? 'All streams'
                : [
                    selectedStatuses.length > 0 && selectedStatuses.map(s => STATUS_OPTIONS.find(o => o.key === s)?.label).join(', '),
                    selectedCategories.length > 0 && selectedCategories.join(', '),
                  ].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {visible.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No streams match the selected filters.
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

      <WarnMessagesEditor />
    </div>
  )
}
