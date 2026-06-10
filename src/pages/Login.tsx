import { useState } from 'react'
import { useStore } from '../store'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

type LoginMode = 'signin' | 'forgot' | 'forgot_sent'

export default function Login() {
  const { login, toast } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<LoginMode>('signin')
  const [forgotEmail, setForgotEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setTimeout(() => {
      login(email, password)
      setLoading(false)
    }, 500)
  }

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail.trim()) return
    setMode('forgot_sent')
    toast('Password reset link sent', 'success')
  }

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 400,
    background: 'var(--bg-surface-1)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '36px 32px',
    boxShadow: 'var(--shadow-modal)',
  }

  const Logo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
      <div style={{
        width: 42, height: 42, borderRadius: '50%',
        border: '2px solid var(--gold)',
        background: 'rgba(212,175,55,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 700, color: 'var(--gold)',
        flexShrink: 0,
      }}>L</div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Loouno</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Admin Panel</div>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-body)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {mode === 'signin' && (
        <div style={cardStyle}>
          <Logo />
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Sign in</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Enter your credentials to access the dashboard</div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@loouno.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 0, display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
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
              disabled={loading}
              style={{ width: '100%', height: 42, marginTop: 4, fontSize: 14, fontWeight: 600, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <button
              onClick={() => setMode('forgot')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontSize: 12 }}
            >
              Forgot password?
            </button>
          </div>

          <div style={{
            marginTop: 16, padding: '10px 14px',
            background: 'rgba(212,175,55,0.04)',
            border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: 8,
            fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5,
          }}>
            Demo mode — any non-empty credentials are accepted. Type your email to log in as your account.
          </div>

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'var(--text-subtle)' }}>
            Got an invite? <a href="/accept-invite" style={{ color: 'var(--gold)' }}>Accept invite</a>
          </div>
        </div>
      )}

      {mode === 'forgot' && (
        <div style={cardStyle}>
          <Logo />
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Reset password</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Enter your email and we will send a reset link</div>
          </div>

          <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@loouno.com"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!forgotEmail.trim()}
              style={{ width: '100%', height: 42, fontSize: 14, fontWeight: 600, opacity: forgotEmail.trim() ? 1 : 0.45 }}
            >
              Send Reset Link
            </button>
          </form>

          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <button
              onClick={() => setMode('signin')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5 }}
            >
              <ArrowLeft size={12} /> Back to sign in
            </button>
          </div>
        </div>
      )}

      {mode === 'forgot_sent' && (
        <div style={cardStyle}>
          <Logo />
          <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(46,204,138,0.1)', border: '2px solid var(--emerald)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
              fontSize: 24,
            }}>
              ✓
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Check your email</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              A password reset link has been sent to<br />
              <strong style={{ color: 'var(--text-secondary)' }}>{forgotEmail}</strong>
            </div>
          </div>

          <button
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', height: 40 }}
            onClick={() => { setMode('signin'); setForgotEmail('') }}
          >
            <ArrowLeft size={13} /> Back to sign in
          </button>
        </div>
      )}
    </div>
  )
}
