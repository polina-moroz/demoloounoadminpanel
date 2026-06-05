import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function AcceptInvite() {
  const { acceptInvite } = useStore()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!code.trim()) { setError('Please enter your invite code'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    const ok = acceptInvite(code.trim().toUpperCase())
    if (!ok) {
      setError('Invalid or expired invite code — check for typos or ask for a new invite')
      return
    }
    setDone(true)
  }

  const card: React.CSSProperties = {
    width: '100%', maxWidth: 420,
    background: 'var(--bg-surface-1)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '36px 32px',
    boxShadow: 'var(--shadow-modal)',
  }

  const wrap: React.CSSProperties = {
    minHeight: '100vh',
    background: 'var(--bg-body)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  }

  if (done) {
    return (
      <div style={wrap}>
        <div style={{ ...card, textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(46,204,138,0.1)', border: '2px solid var(--emerald)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <CheckCircle size={26} color="var(--emerald)" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Account activated!</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
            Your password has been set. You can now sign in to the admin panel.
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', height: 42, fontSize: 14 }}
            onClick={() => navigate('/login')}
          >
            Go to Sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={wrap}>
      <div style={card}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            border: '2px solid var(--gold)', background: 'rgba(212,175,55,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: 'var(--gold)', flexShrink: 0,
          }}>L</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Loouno</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Admin Panel</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Accept Invite</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Enter the invite code from your email and set a password to activate your account.
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Invite Code</label>
            <input
              className="form-input"
              placeholder="LOOO-XXXX-XXXX"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
              style={{ letterSpacing: '0.06em', fontFamily: 'monospace', fontSize: 14 }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: 0, display: 'flex',
                }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setError('') }}
            />
          </div>

          {error && (
            <div style={{
              fontSize: 12, color: '#E74C3C', padding: '8px 12px',
              background: 'rgba(231,76,60,0.08)', borderRadius: 6,
              border: '1px solid rgba(231,76,60,0.2)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: 42, marginTop: 4, fontSize: 14, fontWeight: 600 }}
          >
            Activate Account
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'var(--text-subtle)' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--gold)' }}>Sign in</a>
        </div>
      </div>
    </div>
  )
}
