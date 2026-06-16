import { useState } from 'react'
import { Plus, X, Copy, Check, Mail, ShieldCheck, ShieldOff, Trash2, Users, Edit2, KeyRound, RefreshCw, Eye, EyeOff } from 'lucide-react'
import StatCard from '../components/StatCard'
import { useStore } from '../store'
import type { AdminRole, AdminMember } from '../types'

const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
  viewer: 'Viewer',
}

const roleColors: Record<AdminRole, string> = {
  super_admin: '#D4AF37',
  admin: '#9966CC',
  moderator: '#3498DB',
  viewer: '#8A8A8E',
}

const roleDesc: Record<AdminRole, string> = {
  super_admin: 'Full platform control',
  admin: 'Full access, manage team',
  moderator: 'Users, streams, reports',
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

function InviteModal({ onClose, currentAdminRole }: { onClose: () => void; currentAdminRole: AdminRole }) {
  const { inviteAdmin } = useStore()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AdminRole>('moderator')
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [generatedCode, setGeneratedCode] = useState('')
  const [copied, setCopied] = useState(false)

  const canSubmit = fullName.trim().length > 0 && email.trim().length > 0

  const allowedRoles: AdminRole[] = currentAdminRole === 'super_admin'
    ? ['admin', 'moderator', 'viewer']
    : ['moderator', 'viewer']

  const handleSend = () => {
    if (!canSubmit) return
    const code = inviteAdmin(email.trim(), role, fullName.trim())
    setGeneratedCode(code)
    setStep('success')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" placeholder="Jane Smith" value={fullName}
                  onChange={e => setFullName(e.target.value)} autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input className="form-input" type="email" placeholder="teammate@example.com" value={email}
                    onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 36 }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {allowedRoles.map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)} style={{
                      padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                      background: role === r ? `${roleColors[r]}12` : 'var(--bg-surface-2)',
                      border: `1.5px solid ${role === r ? roleColors[r] : 'var(--border)'}`,
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: role === r ? roleColors[r] : 'var(--text-secondary)', marginBottom: 2 }}>
                        {roleLabels[r]}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{roleDesc[r]}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                An invite code will be generated. The recipient uses it at <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>/accept-invite</span> to set their password.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.45 }} onClick={handleSend}>
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
                  Share with <strong style={{ color: 'var(--text-secondary)' }}>{fullName}</strong> ({email}) to activate their account.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-surface-2)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 10, padding: '14px 16px' }}>
                <span style={{ flex: 1, fontFamily: 'monospace', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--gold)' }}>
                  {generatedCode}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={handleCopy} style={{ gap: 5, flexShrink: 0 }}>
                  {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
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

/* ── Edit Member Modal ────────────────────────────────────────── */

function EditMemberModal({ member, onClose }: { member: AdminMember; onClose: () => void }) {
  const { updateAdminMember, toast } = useStore()
  const [displayName, setDisplayName] = useState(member.displayName === '—' ? '' : member.displayName)
  const [email, setEmail] = useState(member.email)

  const valid = email.trim().length > 0

  const handleSave = () => {
    if (!valid) return
    updateAdminMember(member.id, { displayName: displayName.trim() || '—', email: email.trim() })
    toast('Member details updated', 'success')
    onClose()
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <span className="modal-title">Edit Member</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input className="form-input" type="text" placeholder="Jane Smith" value={displayName}
              onChange={e => setDisplayName(e.target.value)} autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input className="form-input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 36 }} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!valid} style={{ opacity: valid ? 1 : 0.45 }} onClick={handleSave}>
            Save Changes
          </button>
        </div>
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

/* ── Access Matrix ────────────────────────────────────────────── */

const MATRIX_ROWS: { label: string; super_admin: string; admin: string; moderator: string; viewer: string }[] = [
  { label: 'Invite / edit / suspend / remove Admins',      super_admin: '+', admin: '-',         moderator: '-', viewer: '-' },
  { label: 'Invite / edit / suspend / remove Moderators and Viewers', super_admin: '+', admin: '+', moderator: '-', viewer: '-' },
  { label: 'Change another member\'s role',                super_admin: '+', admin: '+ (Mod/Viewer only)', moderator: '-', viewer: '-' },
  { label: 'Access all admin pages',                       super_admin: '+', admin: '+',         moderator: '-', viewer: '-' },
  { label: 'Content moderation (users, streams, reports)', super_admin: '+', admin: '+',         moderator: '+', viewer: '-' },
  { label: 'Read-only dashboard access',                   super_admin: '+', admin: '+',         moderator: '+', viewer: '+' },
  { label: 'Manage economy & payouts',                     super_admin: '+', admin: '+',         moderator: '-', viewer: '-' },
  { label: 'Edit gift catalog & coin packages',            super_admin: '+', admin: '+',         moderator: '-', viewer: '-' },
  { label: 'View fraud detection & KYC',                   super_admin: '+', admin: '+',         moderator: '-', viewer: '-' },
]

function AccessMatrix() {
  const cols: { key: AdminRole; label: string; color: string }[] = [
    { key: 'super_admin', label: 'Super Admin', color: '#D4AF37' },
    { key: 'admin',       label: 'Admin',       color: '#9966CC' },
    { key: 'moderator',   label: 'Moderator',   color: '#3498DB' },
    { key: 'viewer',      label: 'Viewer',      color: '#8A8A8E' },
  ]

  return (
    <div className="table-wrapper" style={{ marginTop: 24 }}>
      <div className="table-header">
        <div>
          <div className="table-title">Access Matrix</div>
          <div className="table-subtitle">Permissions by role</div>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ minWidth: 280 }}>Permission</th>
              {cols.map(c => (
                <th key={c.key} style={{ textAlign: 'center', color: c.color, minWidth: 120 }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX_ROWS.map(row => (
              <tr key={row.label}>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.label}</td>
                {cols.map(c => {
                  const val = row[c.key]
                  const isPlus = val.startsWith('+')
                  return (
                    <td key={c.key} style={{ textAlign: 'center' }}>
                      <span style={{
                        fontWeight: 700, fontSize: 13,
                        color: isPlus ? '#2ECC8A' : 'var(--text-subtle)',
                        fontFamily: isPlus ? 'inherit' : 'monospace',
                      }}>
                        {val}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Change Password Modal ────────────────────────────────────── */

function PasswordInput({ label, value, onChange, show, onToggle, placeholder, error, autoFocus }: {
  label: string; value: string; onChange: (v: string) => void
  show: boolean; onToggle: () => void; placeholder: string
  error?: string; autoFocus?: boolean
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="form-input"
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoFocus={autoFocus}
          style={{ paddingRight: 40, borderColor: error ? '#E74C3C' : undefined }}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && <div style={{ fontSize: 11, color: '#E74C3C', marginTop: 4 }}>{error}</div>}
    </div>
  )
}

function ChangePasswordModal({ member, requireCurrent, onClose }: { member: AdminMember; requireCurrent: boolean; onClose: () => void }) {
  const { resetAdminPassword } = useStore()
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const newTooShort = newPass.length > 0 && newPass.length < 8
  const mismatch = confirm.length > 0 && newPass !== confirm
  const currentOk = !requireCurrent || current.length > 0
  const valid = currentOk && newPass.length >= 8 && newPass === confirm

  const handleSave = () => {
    setSubmitted(true)
    if (!valid) return
    resetAdminPassword(member.id, newPass)
    onClose()
  }

  const memberName = member.displayName !== '—' ? member.displayName : member.email

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-dialog" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <span className="modal-title">Change Password</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: member.avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {member.displayName !== '—' ? member.displayName[0] : '?'}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{memberName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>{member.email} · <RoleBadge role={member.role} /></div>
            </div>
          </div>

          {requireCurrent && (
            <PasswordInput
              label="Current Password"
              value={current}
              onChange={setCurrent}
              show={showCurrent}
              onToggle={() => setShowCurrent(v => !v)}
              placeholder="Enter current password"
              error={submitted && !current ? 'Required' : undefined}
              autoFocus
            />
          )}
          <PasswordInput
            label="New Password"
            value={newPass}
            onChange={setNewPass}
            show={showNew}
            onToggle={() => setShowNew(v => !v)}
            placeholder="Min. 8 characters"
            error={newTooShort ? 'Minimum 8 characters' : undefined}
            autoFocus={!requireCurrent}
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirm}
            onChange={setConfirm}
            show={showConfirm}
            onToggle={() => setShowConfirm(v => !v)}
            placeholder="Repeat new password"
            error={mismatch ? 'Passwords do not match' : undefined}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            style={{ opacity: valid ? 1 : 0.45 }}
            onClick={handleSave}
          >
            <KeyRound size={13} /> Change Password
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Main Page ────────────────────────────────────────────────── */

export default function AdminTeam() {
  const { adminTeam, updateAdminRole, removeAdmin, resendAdminInvite, currentAdmin } = useStore()
  const [showInvite, setShowInvite] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState<AdminMember | null>(null)
  const [editMember, setEditMember] = useState<AdminMember | null>(null)
  const [changePasswordMember, setChangePasswordMember] = useState<AdminMember | null>(null)

  const totalActive  = adminTeam.filter(a => a.status === 'active').length
  const totalAdmins  = adminTeam.filter(a => ['super_admin', 'admin'].includes(a.role) && a.status === 'active').length
  const totalMods    = adminTeam.filter(a => a.role === 'moderator' && a.status === 'active').length
  const pendingCount = adminTeam.filter(a => a.status === 'invited').length

  const currentRole = currentAdmin?.role ?? 'viewer'

  const canEditMember = (member: AdminMember) => {
    if (member.id === currentAdmin?.id) return false
    if (member.role === 'super_admin') return false
    if (currentRole === 'admin' && member.role === 'admin') return false
    return currentRole === 'super_admin' || currentRole === 'admin'
  }

  const canChangePassword = (member: AdminMember) => {
    if (currentRole === 'super_admin') return member.role !== 'super_admin' && member.status === 'active'
    return member.id === currentAdmin?.id && member.status === 'active'
  }

  const canChangeRole = (member: AdminMember, toRole: AdminRole) => {
    if (currentRole === 'super_admin') return true
    if (currentRole === 'admin') return toRole !== 'super_admin' && toRole !== 'admin'
    return false
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Admin Team</div>
          <div className="subtitle">Manage admin access, roles, and invitations</div>
        </div>
        <div className="page-header-actions">
          {(currentRole === 'super_admin' || currentRole === 'admin') && (
            <button className="btn btn-primary" onClick={() => setShowInvite(true)}>
              <Plus size={14} /> Invite Member
            </button>
          )}
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Members"   value={String(totalActive)}  sub="Active accounts"    icon={<Users size={20} />} />
        <StatCard label="Admins"          value={String(totalAdmins)}  sub="Super admin + Admin" icon={<ShieldCheck size={20} />} />
        <StatCard label="Moderators"      value={String(totalMods)}    sub="Active moderators"   icon={<ShieldOff size={20} />} />
        <StatCard label="Pending Invites" value={String(pendingCount)} sub="Awaiting activation" icon={<Mail size={20} />} />
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <div>
            <div className="table-title">Team Members</div>
            <div className="table-subtitle">{adminTeam.length} total · {totalActive} active · {pendingCount} pending</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ width: 200 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminTeam.map(member => {
                const isSelf = member.id === currentAdmin?.id
                const isSuper = member.role === 'super_admin'
                const editable = canEditMember(member)
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
                      {(!editable) ? (
                        <RoleBadge role={member.role} />
                      ) : (
                        <select
                          className="form-select"
                          value={member.role}
                          onChange={e => {
                            const r = e.target.value as AdminRole
                            if (canChangeRole(member, r)) updateAdminRole(member.id, r)
                          }}
                          style={{ width: 130, fontSize: 12 }}
                          disabled={member.status === 'invited'}
                        >
                          {(Object.keys(roleLabels) as AdminRole[]).filter(r => r !== 'super_admin').map(r => (
                            <option key={r} value={r} disabled={!canChangeRole(member, r)}>
                              {roleLabels[r]}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td><StatusBadge status={member.status} /></td>

                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString()
                        : <span style={{ color: 'var(--text-subtle)' }}>Not yet</span>}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {editable && (
                          <button className="btn btn-ghost btn-icon" title="Edit name & email"
                            onClick={() => setEditMember(member)}>
                            <Edit2 size={12} />
                          </button>
                        )}
                        {canChangePassword(member) && (
                          <button className="btn btn-ghost btn-icon" title="Change password"
                            onClick={() => setChangePasswordMember(member)}>
                            <KeyRound size={12} />
                          </button>
                        )}
                        {editable && member.status === 'invited' && (
                          <button className="btn btn-ghost btn-sm" title="Resend invite" style={{ gap: 4, fontSize: 11 }}
                            onClick={() => resendAdminInvite(member.id)}>
                            <RefreshCw size={11} /> Resend
                          </button>
                        )}
                        {editable && (
                          <button className="btn btn-ghost btn-icon" onClick={() => setConfirmRemove(member)}
                            title="Remove from team" style={{ color: 'var(--text-muted)' }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                        {!editable && !isSelf && !canChangePassword(member) && (
                          <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
          Role changes take effect immediately. Removed members lose access at next page load.
          {currentRole === 'admin' && <span style={{ color: '#F39C12', marginLeft: 8 }}>You can only manage Moderators and Viewers.</span>}
        </div>
      </div>


      {showInvite && <InviteModal onClose={() => setShowInvite(false)} currentAdminRole={currentRole} />}
      {editMember && <EditMemberModal member={editMember} onClose={() => setEditMember(null)} />}
      {changePasswordMember && (
        <ChangePasswordModal
          member={changePasswordMember}
          requireCurrent={currentRole !== 'super_admin'}
          onClose={() => setChangePasswordMember(null)}
        />
      )}
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
