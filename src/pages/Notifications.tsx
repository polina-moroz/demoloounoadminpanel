import { useState, useRef, useEffect } from 'react'
import { Send, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '../store'
import type { NotificationTarget } from '../types'

const targetLabels: Record<NotificationTarget, string> = {
  all:      'All Users',
  creators: 'Creators Only',
  viewers:  'Viewers Only',
  specific: 'Specific User',
}

/* ── Phone preview ───────────────────────────────────────────── */

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

/* ── Date-time picker ────────────────────────────────────────── */

const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEK_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function pad(n: number) { return String(n).padStart(2, '0') }

function fmtDisplay(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '' :
    `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function DateTimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const now  = new Date()
  const init = value ? new Date(value) : null

  const [open, setOpen] = useState(false)
  const [vy, setVy] = useState(init?.getFullYear() ?? now.getFullYear())
  const [vm, setVm] = useState(init?.getMonth()    ?? now.getMonth())
  const [sd, setSd] = useState<number | null>(init?.getDate()     ?? null)
  const [sm, setSm] = useState<number | null>(init?.getMonth()    ?? null)
  const [sy, setSy] = useState<number | null>(init?.getFullYear() ?? null)
  const [hr, setHr] = useState(init?.getHours()   ?? 12)
  const [mn, setMn] = useState(init?.getMinutes() ?? 0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const daysInMonth = new Date(vy, vm + 1, 0).getDate()
  const firstDow    = new Date(vy, vm, 1).getDay()

  const prevM = () => { if (vm === 0) { setVm(11); setVy(y => y - 1) } else setVm(m => m - 1) }
  const nextM = () => { if (vm === 11) { setVm(0);  setVy(y => y + 1) } else setVm(m => m + 1) }

  const emit = (day: number, h: number, m: number, month = vm, year = vy) =>
    onChange(`${year}-${pad(month + 1)}-${pad(day)}T${pad(h)}:${pad(m)}`)

  const pickDay = (day: number) => {
    setSd(day); setSm(vm); setSy(vy)
    emit(day, hr, mn)
  }

  const pickTime = (h: number, m: number) => {
    setHr(h); setMn(m)
    if (sd !== null && sm !== null && sy !== null) emit(sd, h, m, sm, sy)
  }

  const isSel   = (day: number) => sd === day && sm === vm && sy === vy
  const isToday = (day: number) => day === now.getDate() && vm === now.getMonth() && vy === now.getFullYear()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        className="form-input"
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', userSelect: 'none' }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 13 }}>
          {fmtDisplay(value) || 'Select date & time…'}
        </span>
        <Calendar size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      </div>

      {open && (
        <div style={{
          position: 'absolute', zIndex: 200, top: 'calc(100% + 6px)', left: 0,
          background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '14px 16px', width: 280,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28 }} onClick={prevM}><ChevronLeft size={14} /></button>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{MONTHS[vm]} {vy}</span>
            <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28 }} onClick={nextM}><ChevronRight size={14} /></button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
            {WEEK_DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-subtle)', padding: '2px 0' }}>{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 12 }}>
            {Array.from({ length: firstDow }).map((_, i) => <div key={`g${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
              <button key={day} onClick={() => pickDay(day)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                aspectRatio: '1', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: isSel(day) ? 700 : 400,
                background: isSel(day) ? 'var(--gold)' : isToday(day) ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: isSel(day) ? '#000' : isToday(day) ? 'var(--gold)' : 'var(--text-primary)',
                transition: 'background 0.12s',
              }}>{day}</button>
            ))}
          </div>

          {/* Time selectors */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 32 }}>Time</span>
            <select className="form-select" style={{ flex: 1, fontSize: 13 }} value={hr}
              onChange={e => pickTime(Number(e.target.value), mn)}>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{pad(i)}</option>
              ))}
            </select>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>:</span>
            <select className="form-select" style={{ flex: 1, fontSize: 13 }} value={mn}
              onChange={e => pickTime(hr, Number(e.target.value))}>
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
                <option key={m} value={m}>{pad(m)}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────── */

export default function Notifications() {
  const { notifications, sendNotification } = useStore()
  const [title,      setTitle]      = useState('')
  const [body,       setBody]       = useState('')
  const [target,     setTarget]     = useState<NotificationTarget>('all')
  const [scheduled,  setScheduled]  = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')

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
                    placeholder="e.g. June Competition Has Begun"
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
                    <option value="all">All Users</option>
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
                    <DateTimePicker value={scheduleAt} onChange={setScheduleAt} />
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

          {/* Phone preview */}
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
                      border: '1px solid var(--border)',
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
                        background: 'var(--bg-surface-2)', overflow: 'hidden', minWidth: 60,
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          width: `${n.openRate}%`,
                          background: n.openRate >= 60 ? 'var(--emerald)' : n.openRate >= 40 ? 'var(--gold)' : 'var(--ruby-bright)',
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
