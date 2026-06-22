import { useState } from 'react'
import { Trash2, Plus, Check, X } from 'lucide-react'
import { useStore } from '../store'

export default function StreamCategoriesEditor() {
  const { streamCategories, addStreamCategory, updateStreamCategory, removeStreamCategory } = useStore()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    addStreamCategory(newName.trim())
    setNewName('')
    setAdding(false)
  }

  return (
    <div className="table-wrapper" style={{ marginTop: 24 }}>
      <div className="table-header">
        <div>
          <div className="table-title">Stream Categories</div>
          <div className="table-subtitle">
            Categories streamers can select when going live
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setAdding(v => !v)}>
          <Plus size={13} /> Add Category
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {streamCategories.map(cat => (
              <tr key={cat.id}>
                <td>
                  <input
                    className="form-input"
                    value={cat.name}
                    onChange={e => updateStreamCategory(cat.id, { name: e.target.value })}
                    style={{
                      background: 'transparent', border: '1px solid transparent',
                      fontSize: 13, padding: '4px 8px', borderRadius: 6,
                      width: '100%', color: 'var(--text-primary)',
                      transition: 'border-color 0.15s', fontWeight: 600,
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--border-gold, rgba(212,175,55,0.5))')}
                    onBlur={e => (e.target.style.borderColor = 'transparent')}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => removeStreamCategory(cat.id)}
                    title="Delete category"
                    style={{ color: 'var(--text-muted)' }}
                  >
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
                    placeholder="Category name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAdding(false); setNewName('') } }}
                    style={{ fontSize: 13, fontWeight: 600 }}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button
                      className="btn btn-success btn-icon"
                      style={{ width: 24, height: 24 }}
                      onClick={handleAdd}
                      disabled={!newName.trim()}
                      title="Save"
                    >
                      <Check size={11} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      style={{ width: 24, height: 24 }}
                      onClick={() => { setAdding(false); setNewName('') }}
                      title="Cancel"
                    >
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
        Name is editable inline.
      </div>
    </div>
  )
}
