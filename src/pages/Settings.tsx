import { useState } from 'react'
import { Save, Lock, Eye, EyeOff, CheckCircle, ShieldCheck, ChevronDown } from 'lucide-react'
import { useStore } from '../store'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title">{title}</div>
        <button className="btn btn-primary btn-sm">
          <Save size={12} /> Save
        </button>
      </div>
      {children}
    </div>
  )
}

function Row({ label, desc, control }: { label: string; desc?: string; control: React.ReactNode }) {
  return (
    <div className="settings-row">
      <div className="settings-row-label">
        <div className="name">{label}</div>
        {desc && <div className="desc">{desc}</div>}
      </div>
      <div style={{ marginLeft: 20, flexShrink: 0 }}>{control}</div>
    </div>
  )
}

/* ── Password strength ────────────────────────────────────────── */

function calcStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Weak',   color: '#E74C3C' }
  if (score <= 3) return { score, label: 'Fair',   color: '#F39C12' }
  return              { score, label: 'Strong', color: '#2ECC8A' }
}

/* ── Change Password Section ──────────────────────────────────── */

function ChangePasswordSection() {
  const [open,     setOpen]     = useState(false)
  const [current,  setCurrent]  = useState('')
  const [next,     setNext]     = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showCur,  setShowCur]  = useState(false)
  const [showNew,  setShowNew]  = useState(false)
  const [showCon,  setShowCon]  = useState(false)
  const [done,     setDone]     = useState(false)
  const [err,      setErr]      = useState('')

  const strength   = calcStrength(next)
  const mismatch   = confirm.length > 0 && next !== confirm
  const canSubmit  = current.length > 0 && next.length >= 8 && next === confirm

  const handleSubmit = () => {
    if (!canSubmit) return
    // mock: treat any non-empty current password as correct
    setDone(true)
    setErr('')
    setCurrent(''); setNext(''); setConfirm('')
    setTimeout(() => setDone(false), 4000)
  }

  const eyeBtn = (show: boolean, toggle: () => void): React.CSSProperties => ({
    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
    color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
  })

  return (
    <div className="settings-section">
      <div
        className="settings-section-header"
        onClick={() => setOpen(v => !v)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Lock size={13} color="var(--gold)" />
          </div>
          <div className="settings-section-title" style={{ marginBottom: 0 }}>Change Password</div>
        </div>
        <ChevronDown
          size={16}
          color="var(--text-muted)"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>

      {open && <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }}>

        {/* Current password */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Current Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              type={showCur ? 'text' : 'password'}
              placeholder="Enter current password"
              value={current}
              onChange={e => { setCurrent(e.target.value); setErr('') }}
              style={{ paddingRight: 36, width: '100%' }}
              autoComplete="current-password"
            />
            <button style={eyeBtn(showCur, () => setShowCur(v => !v))} onClick={() => setShowCur(v => !v)} tabIndex={-1} type="button">
              {showCur ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {err && <div style={{ fontSize: 12, color: '#E74C3C', marginTop: 5 }}>{err}</div>}
        </div>

        <div style={{ height: 1, background: 'var(--border)' }} />

        {/* New password */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              type={showNew ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={next}
              onChange={e => setNext(e.target.value)}
              style={{ paddingRight: 36, width: '100%' }}
              autoComplete="new-password"
            />
            <button style={eyeBtn(showNew, () => setShowNew(v => !v))} onClick={() => setShowNew(v => !v)} tabIndex={-1} type="button">
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {next.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: i <= strength.score ? strength.color : 'var(--border)',
                    transition: 'background 0.25s',
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</div>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Confirm New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              type={showCon ? 'text' : 'password'}
              placeholder="Repeat new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              style={{
                paddingRight: 36, width: '100%',
                borderColor: mismatch ? 'rgba(231,76,60,0.6)' : undefined,
              }}
              autoComplete="new-password"
            />
            <button style={eyeBtn(showCon, () => setShowCon(v => !v))} onClick={() => setShowCon(v => !v)} tabIndex={-1} type="button">
              {showCon ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {mismatch && (
            <div style={{ fontSize: 12, color: '#E74C3C', marginTop: 5 }}>Passwords don't match</div>
          )}
        </div>

        {/* Success banner */}
        {done && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px', borderRadius: 10,
            background: 'rgba(46,204,138,0.08)', border: '1px solid rgba(46,204,138,0.25)',
          }}>
            <CheckCircle size={15} color="var(--emerald)" />
            <span style={{ fontSize: 13, color: 'var(--emerald)', fontWeight: 500 }}>Password updated successfully</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ opacity: canSubmit ? 1 : 0.45, gap: 7 }}
          >
            <ShieldCheck size={14} /> Update Password
          </button>
        </div>
      </div>}
    </div>
  )
}

export default function Settings() {
  const { setProcessingFee } = useStore()
  const [minWithdrawal, setMinWithdrawal] = useState('10000')
  const [diamondRate, setDiamondRate] = useState('35')
  const [coinRate, setCoinRate] = useState('0.99')
  const [processingFeeWeb, setProcessingFeeWeb] = useState('3')
  const [processingFeeApp, setProcessingFeeApp] = useState('3')
  const [autoFlagThreshold, setAutoFlagThreshold] = useState('5')
  const [maxReports, setMaxReports] = useState('10')
  const [explicitContent, setExplicitContent] = useState('flag_and_review')
  const [maxStreamDuration, setMaxStreamDuration] = useState('6')

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Settings</div>
          <div className="subtitle">Platform configuration and policies</div>
        </div>
      </div>

      <ChangePasswordSection />

      {/* Economy */}
      <Section title="Economy">
        <Row
          label="Minimum Withdrawal"
          desc="Minimum diamonds required to request a payout"
          control={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="form-input"
                value={minWithdrawal}
                onChange={e => setMinWithdrawal(e.target.value)}
                type="number"
                style={{ width: 120 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>💎</span>
            </div>
          }
        />
        <Row
          label="Diamond → USD Rate"
          desc="USD payout per 10,000 diamonds (gross) — $3.50 per 1,000"
          control={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>10,000 💎 =</span>
              <input
                className="form-input"
                value={diamondRate}
                onChange={e => setDiamondRate(e.target.value)}
                type="number"
                style={{ width: 80 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>USD</span>
            </div>
          }
        />
        <Row
          label="Coin → USD Rate"
          desc="USD payout per 10,000 coins"
          control={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>10,000 🪙 =</span>
              <input
                className="form-input"
                value={coinRate}
                onChange={e => setCoinRate(e.target.value)}
                type="number"
                style={{ width: 80 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>USD</span>
            </div>
          }
        />
        <Row
          label="Processing Fee — Website"
          desc="Percentage deducted before payout for web withdrawals"
          control={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="form-input"
                value={processingFeeWeb}
                onChange={e => setProcessingFeeWeb(e.target.value)}
                type="number"
                style={{ width: 80 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>%</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  const v = Number(processingFeeWeb)
                  if (!isNaN(v) && v >= 0) setProcessingFee(v)
                }}
              >
                Apply
              </button>
            </div>
          }
        />
        <Row
          label="Processing Fee — In-App"
          desc="Percentage deducted before payout for in-app withdrawals"
          control={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="form-input"
                value={processingFeeApp}
                onChange={e => setProcessingFeeApp(e.target.value)}
                type="number"
                style={{ width: 80 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>%</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  const v = Number(processingFeeApp)
                  if (!isNaN(v) && v >= 0) setProcessingFee(v)
                }}
              >
                Apply
              </button>
            </div>
          }
        />
      </Section>

      {/* Moderation */}
      <Section title="Moderation">
        <Row
          label="Auto-Flag Threshold"
          desc="Number of reports needed to automatically flag a user or content for review"
          control={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="form-input"
                value={autoFlagThreshold}
                onChange={e => setAutoFlagThreshold(e.target.value)}
                type="number"
                style={{ width: 80 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>reports</span>
            </div>
          }
        />
        <Row
          label="Max Reports Before Auto-Review"
          desc="Threshold to escalate to priority queue"
          control={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="form-input"
                value={maxReports}
                onChange={e => setMaxReports(e.target.value)}
                type="number"
                style={{ width: 80 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>reports</span>
            </div>
          }
        />
        <Row
          label="Explicit Content Policy"
          desc="Action taken when explicit content is detected"
          control={
            <select
              className="form-select"
              value={explicitContent}
              onChange={e => setExplicitContent(e.target.value)}
              style={{ width: 200 }}
            >
              <option value="allow">Allow (no action)</option>
              <option value="flag_and_review">Flag and Review</option>
              <option value="auto_terminate">Auto-Terminate Stream</option>
              <option value="auto_ban">Auto-Ban User</option>
            </select>
          }
        />
      </Section>

      {/* Livestream */}
      <Section title="Livestream">
        <Row
          label="Max Stream Duration"
          desc="Maximum continuous stream length before auto-end"
          control={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="form-input"
                value={maxStreamDuration}
                onChange={e => setMaxStreamDuration(e.target.value)}
                type="number"
                style={{ width: 80 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>hours</span>
            </div>
          }
        />
      </Section>

      {/* Legal */}
      <Section title="Legal">
        <Row
          label="Privacy Policy URL"
          control={
            <input
              className="form-input"
              defaultValue="https://loouno.com/privacy"
              style={{ width: 240 }}
            />
          }
        />
        <Row
          label="Terms of Service URL"
          control={
            <input
              className="form-input"
              defaultValue="https://loouno.com/terms"
              style={{ width: 240 }}
            />
          }
        />
      </Section>
    </div>
  )
}
