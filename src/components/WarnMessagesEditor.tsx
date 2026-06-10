import { useState } from 'react'
import { Trash2, Plus, Check, X } from 'lucide-react'
import { useStore } from '../store'

export default function WarnMessagesEditor() {
  const { warnMessages, addWarnMessage, updateWarnMessage, removeWarnMessage } = useStore()
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newMessage, setNewMessage] = useState('')

  const handleAdd = () => {
    if (!newTitle.trim() || !newMessage.trim()) return
    addWarnMessage(newTitle.trim(), newMessage.trim())
    setNewTitle('')
    setNewMessage('')
    setAdding(false)
  }

  return (
    <div className="table-wrapper" style={{ marginTop: 24 }}>
      <div className="table-header">
        <div>
          <div className="table-title">Warn Message Templates</div>
          <div className="table-subtitle">
            Templates shown to admins when sending a warning — users receive the message as a notification
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setAdding(v => !v)}>
          <Plus size={13} /> Add Template
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 220 }}>Title</th>
              <th>Message (user notification)</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {warnMessages.map(msg => (
              <tr key={msg.id}>
                <td>
                  <input
                    className="form-input"
                    value={msg.title}
                    onChange={e => updateWarnMessage(msg.id, { title: e.target.value })}
                    style={{ background: 'transparent', border: '1px solid transparent', fontSize: 13, padding: '4px 8px', borderRadius: 6, width: '100%', color: 'var(--text-primary)', transition: 'border-color 0.15s', fontWeight: 600 }}
                    onFocus={e => (e.target.style.borderColor = 'var(--border-gold, rgba(212,175,55,0.5))')}
                    onBlur={e => (e.target.style.borderColor = 'transparent')}
                  />
                </td>
                <td>
                  <textarea
                    className="form-input"
                    value={msg.message}
                    onChange={e => updateWarnMessage(msg.id, { message: e.target.value })}
                    rows={2}
                    style={{ background: 'transparent', border: '1px solid transparent', fontSize: 12, padding: '4px 8px', borderRadius: 6, width: '100%', color: 'var(--text-secondary)', resize: 'vertical', transition: 'border-color 0.15s', fontFamily: 'inherit', lineHeight: 1.5 }}
                    onFocus={e => (e.target.style.borderColor = 'var(--border-gold, rgba(212,175,55,0.5))')}
                    onBlur={e => (e.target.style.borderColor = 'transparent')}
                  />
                </td>
                <td>
                  <button className="btn btn-ghost btn-icon" onClick={() => removeWarnMessage(msg.id)} title="Delete template" style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}

            {adding && (
              <tr style={{ background: 'rgba(212,175,55,0.03)' }}>
                <td>
                  <input
                    className="form-input"
                    placeholder="Template title"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    autoFocus
                    style={{ fontSize: 13, fontWeight: 600 }}
                  />
                </td>
                <td>
                  <textarea
                    className="form-input"
                    placeholder="Message the user will receive in their notification"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    rows={2}
                    style={{ fontSize: 12, width: '100%', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button className="btn btn-success btn-icon" style={{ width: 24, height: 24 }} onClick={handleAdd}
                      disabled={!newTitle.trim() || !newMessage.trim()} title="Save">
                      <Check size={11} />
                    </button>
                    <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setAdding(false); setNewTitle(''); setNewMessage('') }} title="Cancel">
                      <X size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-subtle)' }}>
        Title and message fields are editable inline. Changes apply immediately. Used in Users, Reports, and Streams pages.
      </div>
    </div>
  )
}
