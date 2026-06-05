import { useState } from 'react'
import { Plus, X, Copy, Check, Mail, ShieldOff, ShieldCheck, Trash2, Users } from 'lucide-react'
import StatCard from '../components/StatCard'
import { useStore } from '../store'
import type { AdminRole, AdminMember } from '../types'

const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
  support: 'Support',
  viewer: 'Viewer',
}

const roleColors: Record<AdminRole, string> = {
  super_admin: '#D4AF37',
  admin: '#9966CC',
  moderator: '#3498DB',
  support: '#2ECC8A',
  viewer: '#8A8A8E',
}

const roleDesc: Record<AdminRole, string> = {
  super_admin: 'Full platform control',
  admin: 'Full access, manage team',
  moderator: 'Users, streams, reports',
  support: 'Read-only + KYC review',
  viewer: 'Read-only access',
}

function RoleBadge({ role }: { role: AdminRole }) {
  const color = roleColors[role]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      color, background: `${color}18`, border: `1px solid ${color}35`,
      whiteSpace: 'nowrap',
    }}>
      {roleLabels[role]}
    </span>
  )
}

function StatusBadge({ status }: { status: AdminMember['status'] }) {
  const map = {
    active:    { color: '#2ECC8A', label: 'Active' },
    invited:   { color: '#F39C12', label: 'Pending invite' },
    suspended: { color: '#E74C3C', label: 'Suspended' },
  }
  const { color, label } = map[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      color, background: `${color}18`, border: `1px solid ${color}30`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {label}
    </span>
  )
}

/* ── Invite Modal ─────────────────────────────────────────────── */

function InviteModal({ onClose }: { onClose: () => void }) {
  const { inviteAdmin } = useStore()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AdminRole>('moderator')
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [generatedCode, setGeneratedCode] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSend = () => {
    if (!email.trim()) return
    const code = inviteAdmin(email.trim(), role)
    setGeneratedCode(code)
    setStep('success')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const assignableRoles = (Object.keys(roleLabels) as AdminRole[]).filter(r => r !== 'super_admin')

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <span className="modal-title">{step === 'form' ? 'Invite Team Member' : 'Invite Code Generated'}</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        {step === 'form' ? (
          <>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    className="form-input"
                    type="email"
                    placeholder="teammate@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ paddingLeft: 36 }}
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {assignableRoles.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      style={{
                        padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                        background: role === r ? `${roleColors[r]}12` : 'var(--bg-surface-2)',
                        border: `1.5px solid ${role === r ? roleColors[r] : 'var(--border)'}`,
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: role === r ? roleColors[r] : 'var(--text-secondary)', marginBottom: 2 }}>
                        {roleLabels[r]}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{roleDesc[r]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                An invite code will be generated. The recipient uses it at <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>/accept-invite</span> to set their password. In production this would be sent by email automatically.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={!email.trim()}
                style={{ opacity: email.trim() ? 1 : 0.45 }}
                onClick={handleSend}
              >
                <Mail size={13} /> Generate & Send Invite
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ textAlign: 'center', padding: '4px 0' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'rgba(46,204,138,0.1)', border: '2px solid var(--emerald)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px',
                }}>
                  <Check size={24} color="var(--emerald)" />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Invite code generated</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Share this code with <strong style={{ color: 'var(--text-secondary)' }}>{email}</strong>. They can use it at <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>/accept-invite</span> to activate their account.
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--bg-surface-2)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: 10, padding: '14px 16px',
              }}>
                <span style={{ flex: 1, fontFamily: 'monospace', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--gold)' }}>
                  {generatedCode}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={handleCopy} style={{ gap: 5, flexShrink: 0 }}>
                  {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)', lineHeight: 1.5 }}>
                This invite appears as <strong style={{ color: 'var(--text-secondary)' }}>Pending</strong> in the team table until the recipient activates their account. The code expires when used.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

/* ── Confirm Remove Modal ─────────────────────────────────────── */

function ConfirmRemoveModal({ member, onConfirm, onClose }: {
  member: AdminMember
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <span className="modal-title">Remove Member</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Remove <strong style={{ color: 'var(--text-primary)' }}>{member.displayName === '—' ? member.email : member.displayName}</strong> from the admin team? They will immediately lose access to the panel.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { onConfirm(); onClose() }}>
            <Trash2 size={13} /> Remove
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Main Page ────────────────────────────────────────────────── */

export default function AdminTeam() {
  const { adminTeam, updateAdminRole, suspendAdmin, reinstateAdmin, removeAdmin, currentAdmin } = useStore()
  const [showInvite, setShowInvite] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState<AdminMember | null>(null)

  const totalActive  = adminTeam.filter(a => a.status === 'active').length
  const totalAdmins  = adminTeam.filter(a => ['super_admin', 'admin'].includes(a.role) && a.status === 'active').length
  const totalMods    = adminTeam.filter(a => a.role === 'moderator' && a.status === 'active').length
  const pendingCount = adminTeam.filter(a => a.status === 'invited').length

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Admin Team</div>
          <div className="subtitle">Manage admin access, roles, and invitations</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowInvite(true)}>
            <Plus size={14} /> Invite Member
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Members"   value={String(totalActive)}  sub="Active accounts"   icon={<Users size={20} />} />
        <StatCard label="Admins"          value={String(totalAdmins)}  sub="Super admin + Admin"  icon={<ShieldCheck size={20} />} />
        <StatCard label="Moderators"      value={String(totalMods)}   sub="Active moderators"  icon={<ShieldOff size={20} />} />
        <StatCard label="Pending Invites" value={String(pendingCount)} sub="Awaiting activation" icon={<Mail size={20} />} />
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">Team Members</div>
            <div className="table-subtitle">{adminTeam.length} total · {totalActive} active · {pendingCount} pending</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowInvite(true)}>
            <Plus size={13} /> Invite
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Invite Code</th>
                <th>Joined</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminTeam.map(member => {
                const isSelf = member.id === currentAdmin?.id
                const isSuper = member.role === 'super_admin'
                return (
                  <tr key={member.id} style={{ opacity: member.status === 'suspended' ? 0.6 : 1 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: member.avatarColor,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                        }}>
                          {member.displayName === '—' ? '?' : member.displayName[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {member.displayName === '—' ? <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Pending</span> : member.displayName}
                            {isSelf && <span style={{ fontSize: 10, color: 'var(--gold)', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', padding: '1px 6px', borderRadius: 10 }}>You</span>}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{member.email}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      {isSuper || isSelf ? (
                        <RoleBadge role={member.role} />
                      ) : (
                        <select
                          className="form-select"
                          value={member.role}
                          onChange={e => updateAdminRole(member.id, e.target.value as AdminRole)}
                          style={{ width: 130, fontSize: 12 }}
                          disabled={member.status === 'invited'}
                        >
                          {(Object.keys(roleLabels) as AdminRole[]).filter(r => r !== 'super_admin').map(r => (
                            <option key={r} value={r}>{roleLabels[r]}</option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td><StatusBadge status={member.status} /></td>

                    <td>
                      {member.inviteCode ? (
                        <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--gold)', letterSpacing: '0.04em' }}>
                          {member.inviteCode}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-subtle)', fontSize: 12 }}>—</span>
                      )}
                    </td>

                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString()
                        : <span style={{ color: 'var(--text-subtle)' }}>Not yet</span>}
                    </td>

                    <td>
                      {isSelf || isSuper ? (
                        <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>—</span>
                      ) : (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {member.status === 'active' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => suspendAdmin(member.id)}
                              title="Suspend access"
                            >
                              <ShieldOff size={12} /> Suspend
                            </button>
                          )}
                          {member.status === 'suspended' && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => reinstateAdmin(member.id)}
                              title="Reinstate access"
                            >
                              <ShieldCheck size={12} /> Reinstate
                            </button>
                          )}
                          <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => setConfirmRemove(member)}
                            title="Remove from team"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
          Role changes and suspensions take effect immediately. Removed members lose access at next page load.
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      {confirmRemove && (
        <ConfirmRemoveModal
          member={confirmRemove}
          onConfirm={() => removeAdmin(confirmRemove.id)}
          onClose={() => setConfirmRemove(null)}
        />
      )}
    </div>
  )
}
