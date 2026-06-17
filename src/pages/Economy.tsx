import { useState } from 'react'
import { CheckCircle, XCircle, Search, ChevronLeft, ChevronRight, Trash2, Plus, Check, X } from 'lucide-react'
import Badge, { statusLabel } from '../components/Badge'
import { useStore } from '../store'
import { mockTransactions } from '../mockData'
import type { WithdrawalStatus, TransactionType } from '../types'

/* ── Rejection Reasons Editor ────────────────────────────────── */

interface RejectionReason { id: string; name: string; message: string }

const INITIAL_REASONS: RejectionReason[] = [
  { id: 'rr1', name: 'KYC not verified',    message: 'Your withdrawal request has been rejected. Please complete identity verification (KYC) before requesting a payout.' },
  { id: 'rr2', name: 'Suspicious activity', message: 'Your account has been flagged for unusual activity. This withdrawal is on hold pending a manual review by our team.' },
  { id: 'rr3', name: 'Insufficient balance', message: 'Your diamond balance does not meet the minimum withdrawal threshold.' },
  { id: 'rr4', name: 'Policy violation',    message: 'A recent policy violation on your account has resulted in this withdrawal being rejected. Please contact support.' },
]

function RejectionReasonsEditor() {
  const [reasons, setReasons] = useState<RejectionReason[]>(INITIAL_REASONS)
  const [adding, setAdding]   = useState(false)
  const [newName, setNewName] = useState('')
  const [newMsg, setNewMsg]   = useState('')

  const update = (id: string, patch: Partial<RejectionReason>) =>
    setReasons(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))
  const remove = (id: string) => setReasons(prev => prev.filter(r => r.id !== id))
  const add = () => {
    if (!newName.trim() || !newMsg.trim()) return
    setReasons(prev => [...prev, { id: `rr${Date.now()}`, name: newName.trim(), message: newMsg.trim() }])
    setNewName(''); setNewMsg(''); setAdding(false)
  }

  const inputStyle = (bold?: boolean): React.CSSProperties => ({
    background: 'transparent', border: '1px solid transparent', borderRadius: 6,
    padding: '4px 8px', width: '100%', color: 'var(--text-primary)',
    fontSize: bold ? 13 : 12, fontWeight: bold ? 600 : 400,
    fontFamily: 'inherit', lineHeight: 1.5, resize: 'vertical' as const,
    transition: 'border-color 0.15s',
  })

  return (
    <div className="table-wrapper" style={{ marginTop: 24 }}>
      <div className="table-header">
        <div>
          <div className="table-title">Rejection Reason Templates</div>
          <div className="table-subtitle">Shown to admins when rejecting a withdrawal — message is sent to the user</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setAdding(v => !v)}>
          <Plus size={13} /> Add Reason
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 220 }}>Name</th>
              <th>Message (sent to user)</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {reasons.map(r => (
              <tr key={r.id}>
                <td>
                  <input value={r.name} onChange={e => update(r.id, { name: e.target.value })}
                    style={inputStyle(true)}
                    onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'transparent')} />
                </td>
                <td>
                  <textarea value={r.message} onChange={e => update(r.id, { message: e.target.value })} rows={2}
                    style={inputStyle()}
                    onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'transparent')} />
                </td>
                <td>
                  <button className="btn btn-ghost btn-icon" onClick={() => remove(r.id)} title="Delete"
                    style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {adding && (
              <tr style={{ background: 'rgba(212,175,55,0.03)' }}>
                <td>
                  <input className="form-input" placeholder="Reason name" value={newName}
                    onChange={e => setNewName(e.target.value)} autoFocus style={{ fontSize: 13, fontWeight: 600 }} />
                </td>
                <td>
                  <textarea className="form-input" placeholder="Message sent to the user" value={newMsg}
                    onChange={e => setNewMsg(e.target.value)} rows={2}
                    style={{ fontSize: 12, width: '100%', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button className="btn btn-success btn-icon" style={{ width: 24, height: 24 }} onClick={add}
                      disabled={!newName.trim() || !newMsg.trim()} title="Save"><Check size={11} /></button>
                    <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }}
                      onClick={() => { setAdding(false); setNewName(''); setNewMsg('') }} title="Cancel"><X size={11} /></button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-subtle)' }}>
        Name and message fields are editable inline. Changes apply immediately.
      </div>
    </div>
  )
}

const PAGE_SIZE = 20

const typeLabels: Record<string, string> = {
  coin_purchase:     'Coin Purchase',
  diamonds_received: 'Diamonds Received',
  withdrawal:        'Withdrawal',
}

const typeColors: Record<string, string> = {
  coin_purchase:     '#2ECC8A',
  diamonds_received: '#D4AF37',
  withdrawal:        '#3498DB',
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  if (pages <= 1) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 8 }}>
        {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total}
      </span>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        style={{ padding: '4px 8px', opacity: page === 1 ? 0.4 : 1 }}
      >
        <ChevronLeft size={14} />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onChange(p)}
          style={{ padding: '4px 10px', minWidth: 32 }}
        >
          {p}
        </button>
      ))}
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        style={{ padding: '4px 8px', opacity: page === pages ? 0.4 : 1 }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

export default function Economy() {
  const { withdrawals, approveWithdrawal, rejectWithdrawal, processingFee } = useStore()
  const pending = withdrawals.filter(w => w.status === 'pending').length

  /* ── View switcher ── */
  const [activeView, setActiveView] = useState<'withdrawals' | 'transactions'>('withdrawals')

  /* ── Withdrawal filters ── */
  const [wSearch, setWSearch]           = useState('')
  const [wStatus, setWStatus]           = useState<'all' | WithdrawalStatus>('all')
  const [wDiamondsMin, setWDiamondsMin] = useState('')
  const [wDiamondsMax, setWDiamondsMax] = useState('')
  const [wPage, setWPage]               = useState(1)

  /* ── Transaction filters ── */
  const [tSearch, setTSearch] = useState('')
  const [tType, setTType]     = useState<'all' | TransactionType>('all')
  const [tPage, setTPage]     = useState(1)

  /* ── Apply withdrawal filters ── */
  const filteredWithdrawals = withdrawals.filter(w => {
    const q = wSearch.toLowerCase()
    if (q && !w.user.toLowerCase().includes(q) && !w.userHandle.toLowerCase().includes(q)) return false
    if (wStatus !== 'all' && w.status !== wStatus) return false
    if (wDiamondsMin !== '' && w.diamonds < Number(wDiamondsMin)) return false
    if (wDiamondsMax !== '' && w.diamonds > Number(wDiamondsMax)) return false
    return true
  })

  const wTotalPages = Math.ceil(filteredWithdrawals.length / PAGE_SIZE)
  const wPageSafe   = Math.min(wPage, Math.max(1, wTotalPages))
  const pagedWithdrawals = filteredWithdrawals.slice((wPageSafe - 1) * PAGE_SIZE, wPageSafe * PAGE_SIZE)

  /* ── Apply transaction filters ── */
  const filteredTransactions = mockTransactions.filter(t => {
    const q = tSearch.toLowerCase()
    if (q && !t.user.toLowerCase().includes(q) && !t.userHandle.toLowerCase().includes(q)) return false
    if (tType !== 'all' && t.type !== tType) return false
    return true
  })

  const tTotalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE)
  const tPageSafe   = Math.min(tPage, Math.max(1, tTotalPages))
  const pagedTransactions = filteredTransactions.slice((tPageSafe - 1) * PAGE_SIZE, tPageSafe * PAGE_SIZE)

  function resetWPage() { setWPage(1) }
  function resetTPage() { setTPage(1) }

  return (
    <div>
      {/* ── View switcher ── */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setActiveView('withdrawals')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', fontSize: 14, fontWeight: 500,
            color: activeView === 'withdrawals' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeView === 'withdrawals' ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s', display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          Withdrawal Requests
          {pending > 0 && (
            <span style={{
              background: activeView === 'withdrawals' ? 'var(--gold)' : 'var(--border)',
              color: activeView === 'withdrawals' ? '#000' : 'var(--text-muted)',
              borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 600,
            }}>{pending}</span>
          )}
        </button>
        <button
          onClick={() => setActiveView('transactions')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', fontSize: 14, fontWeight: 500,
            color: activeView === 'transactions' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeView === 'transactions' ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s',
          }}
        >
          Transaction Log
        </button>
      </div>

      {/* ── Withdrawal Requests ── */}
      {activeView === 'withdrawals' && <div className="section">
        <div className="table-wrapper">
          <div className="table-header">
            <div>
              <div className="table-title">Withdrawal Requests</div>
            </div>
          </div>

          {/* Withdrawal filters */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="search-input-wrapper">
              <Search size={14} />
              <input
                className="search-input"
                placeholder="Search user…"
                value={wSearch}
                onChange={e => { setWSearch(e.target.value); resetWPage() }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
              <select
                className="form-select"
                style={{ width: 140, padding: '7px 30px 7px 10px' }}
                value={wStatus}
                onChange={e => { setWStatus(e.target.value as 'all' | WithdrawalStatus); resetWPage() }}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diamonds</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min"
                  value={wDiamondsMin}
                  onChange={e => { setWDiamondsMin(e.target.value); resetWPage() }}
                  style={{ width: 90, padding: '7px 10px' }}
                  min={0}
                />
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>–</span>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max"
                  value={wDiamondsMax}
                  onChange={e => { setWDiamondsMax(e.target.value); resetWPage() }}
                  style={{ width: 90, padding: '7px 10px' }}
                  min={0}
                />
              </div>
            </div>

            {(wSearch || wStatus !== 'all' || wDiamondsMin || wDiamondsMax) && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ alignSelf: 'flex-end', fontSize: 12 }}
                onClick={() => { setWSearch(''); setWStatus('all'); setWDiamondsMin(''); setWDiamondsMax(''); setWPage(1) }}
              >
                Clear filters
              </button>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Diamonds</th>
                  <th>Est. USD</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', fontSize: 13 }}>
                      No withdrawal requests match the current filters.
                    </td>
                  </tr>
                ) : pagedWithdrawals.map(w => (
                  <tr key={w.id}>
                    <td>
                      <div className="avatar-row">
                        <div className="avatar" style={{ background: w.avatarColor }}>{w.user[0]}</div>
                        <div>
                          <div className="user-name">{w.user}</div>
                          <div className="user-handle">@{w.userHandle}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{w.diamonds.toLocaleString()} 💎</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>${w.estimatedUSD.toFixed(2)}</span>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        after fee: ${(w.estimatedUSD * (1 - processingFee / 100)).toFixed(2)}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(w.requestedAt).toLocaleDateString()}
                    </td>
                    <td><Badge variant={w.status} dot>{statusLabel(w.status)}</Badge></td>
                    <td>
                      {w.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => approveWithdrawal(w.id)}
                            style={{ opacity: w.kycStatus !== 'approved' ? 0.45 : 1 }}
                            title={w.kycStatus !== 'approved' ? 'KYC not verified' : 'Approve withdrawal'}
                          >
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => rejectWithdrawal(w.id)} title="Reject">
                            <XCircle size={12} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {w.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={wPageSafe} total={filteredWithdrawals.length} onChange={setWPage} />
        </div>

        <RejectionReasonsEditor />
      </div>}

      {/* ── Transaction Log ── */}
      {activeView === 'transactions' && <div className="table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">Transaction Log</div>
            <div className="table-subtitle">Recent platform transactions</div>
          </div>
        </div>

        {/* Transaction filters */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="search-input-wrapper">
            <Search size={14} />
            <input
              className="search-input"
              placeholder="Search user…"
              value={tSearch}
              onChange={e => { setTSearch(e.target.value); resetTPage() }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
            <select
              className="form-select"
              style={{ width: 180, padding: '7px 30px 7px 10px' }}
              value={tType}
              onChange={e => { setTType(e.target.value as 'all' | TransactionType); resetTPage() }}
            >
              <option value="all">All Types</option>
              <option value="coin_purchase">Coin Purchase</option>
              <option value="diamonds_received">Diamonds Received</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </div>

          {(tSearch || tType !== 'all') && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ alignSelf: 'flex-end', fontSize: 12 }}
              onClick={() => { setTSearch(''); setTType('all'); setTPage(1) }}
            >
              Clear filters
            </button>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {pagedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', fontSize: 13 }}>
                    No transactions match the current filters.
                  </td>
                </tr>
              ) : pagedTransactions.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 13 }}>{t.user}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>@{t.userHandle}</div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      color: typeColors[t.type] ?? 'var(--text-muted)',
                      background: `${typeColors[t.type] ?? '#888'}18`,
                      border: `1px solid ${typeColors[t.type] ?? '#888'}30`,
                    }}>
                      {typeLabels[t.type] ?? t.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: t.currency === 'USD' ? 'var(--emerald)' : 'var(--gold)' }}>
                      {t.currency === 'USD'
                        ? `$${t.amount.toFixed(2)}`
                        : `${t.amount.toLocaleString()} ${t.currency === 'coins' ? '🪙' : '💎'}`}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{t.note ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={tPageSafe} total={filteredTransactions.length} onChange={setTPage} />
      </div>}
    </div>
  )
}
