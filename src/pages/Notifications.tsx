import { useState } from 'react'
import { Send } from 'lucide-react'
import { useStore } from '../store'
import type { NotificationTarget } from '../types'

const targetLabels: Record<NotificationTarget, string> = {
  all: 'All Users',
  creators: 'Creators Only',
  viewers: 'Viewers Only',
  specific: 'Specific User',
}

function PhoneMockup({ title, body }: { title: string; body: string }) {
  return (
    <div className="phone-mockup">
      <div className="phone-mockup-screen">
        <div className="phone-notch" />
        <div style={{ padding: '6px 0 0' }}>
          {(title || body) ? (
            <div className="phone-notification-card">
              <div className="phone-notification-app">
                <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--gold)', display: 'inline-block' }} />
                LOOUNO
              </div>
              <div className="phone-notification-title">{title || 'Notification title'}</div>
              <div className="phone-notification-body">{body || 'Notification preview appears here...'}</div>
            </div>
          ) : (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-subtle)', fontSize: 11 }}>
              Preview will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Notifications() {
  const { notifications, sendNotification } = useStore()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [target, setTarget] = useState<NotificationTarget>('all')
  const [scheduled, setScheduled] = useState(false)

  const handleSend = () => {
    if (!title.trim() || !body.trim()) return
    sendNotification(title.trim(), body.trim(), target)
    setTitle('')
    setBody('')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Notifications</div>
          <div className="subtitle">Compose and send push notifications</div>
        </div>
      </div>

      {/* Compose section */}
      <div className="section">
        <div className="two-col-layout">
          {/* Compose form */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Compose Notification</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    className="form-input"
                    placeholder="e.g. June Competition Has Begun 🏆"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={80}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
                    {title.length}/80
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Body</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Write your notification message..."
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    maxLength={200}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
                    {body.length}/200
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <select
                    className="form-select"
                    value={target}
                    onChange={e => setTarget(e.target.value as NotificationTarget)}
                  >
                    <option value="all">All Users ({847})</option>
                    <option value="creators">Creators Only ({312})</option>
                    <option value="viewers">Viewers Only ({535})</option>
                    <option value="specific">Specific User</option>
                  </select>
                </div>

                {target === 'specific' && (
                  <div className="form-group">
                    <label className="form-label">User Handle</label>
                    <input className="form-input" placeholder="@username" />
                  </div>
                )}

                {/* Schedule toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Schedule for later</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Set a date and time to send</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={scheduled} onChange={e => setScheduled(e.target.checked)} />
                    <span className="toggle-track" />
                  </label>
                </div>

                {scheduled && (
                  <div className="form-group">
                    <label className="form-label">Schedule Date & Time</label>
                    <input className="form-input" type="datetime-local" />
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', marginTop: 4, opacity: (!title.trim() || !body.trim()) ? 0.45 : 1 }}
                  onClick={handleSend}
                  disabled={!title.trim() || !body.trim()}
                >
                  <Send size={14} />
                  {scheduled ? 'Schedule Notification' : 'Send Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Phone mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Preview
            </div>
            <PhoneMockup title={title} body={body} />
            {target !== 'specific' && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                Sending to <strong style={{ color: 'var(--text-primary)' }}>{targetLabels[target]}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent notifications table */}
      <div className="table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">Recent Notifications</div>
            <div className="table-subtitle">Sent history and engagement stats</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Target</th>
                <th>Sent At</th>
                <th>Delivered</th>
                <th>Open Rate</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600, maxWidth: 260 }}>
                    {n.title}
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: 'var(--bg-surface-2)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border)'
                    }}>
                      {targetLabels[n.target]}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(n.sentAt).toLocaleDateString()}<br />
                    <span style={{ fontSize: 11 }}>{new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {n.delivered.toLocaleString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        flex: 1, height: 6, borderRadius: 3,
                        background: 'var(--bg-surface-2)', overflow: 'hidden', minWidth: 60
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          width: `${n.openRate}%`,
                          background: n.openRate >= 60 ? 'var(--emerald)' : n.openRate >= 40 ? 'var(--gold)' : 'var(--ruby-bright)'
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: n.openRate >= 60 ? 'var(--emerald)' : n.openRate >= 40 ? 'var(--gold)' : 'var(--ruby-bright)', minWidth: 36 }}>
                        {n.openRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
