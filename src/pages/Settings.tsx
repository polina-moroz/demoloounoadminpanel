import { useState } from 'react'
import { Save } from 'lucide-react'

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

export default function Settings() {
  const [appVersion, setAppVersion] = useState('1.0.0')
  const [ageGate, setAgeGate] = useState('18')
  const [minWithdrawal, setMinWithdrawal] = useState('10000')
  const [diamondRate, setDiamondRate] = useState('7')
  const [processingFee, setProcessingFee] = useState('3')
  const [holdDays, setHoldDays] = useState('7')
  const [autoFlagThreshold, setAutoFlagThreshold] = useState('5')
  const [maxReports, setMaxReports] = useState('10')
  const [explicitContent, setExplicitContent] = useState('flag_and_review')
  const [maxStreamDuration, setMaxStreamDuration] = useState('6')
  const [allowVsBattle, setAllowVsBattle] = useState(true)
  const [allowMultiGuest, setAllowMultiGuest] = useState(true)
  const [minAgeEnforced, setMinAgeEnforced] = useState(true)

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="title">Settings</div>
          <div className="subtitle">Platform configuration and policies</div>
        </div>
      </div>

      {/* Platform */}
      <Section title="Platform">
        <Row
          label="App Version"
          desc="Current live app version string"
          control={
            <input
              className="form-input"
              value={appVersion}
              onChange={e => setAppVersion(e.target.value)}
              style={{ width: 120 }}
            />
          }
        />
        <Row
          label="Phase"
          desc="Current platform availability phase"
          control={
            <select className="form-select" defaultValue="closed_testing" style={{ width: 180 }}>
              <option value="closed_testing">Closed Testing</option>
              <option value="open_beta">Open Beta</option>
              <option value="public">Public</option>
            </select>
          }
        />
        <Row
          label="Age Gate"
          desc="Minimum age required to register"
          control={
            <select
              className="form-select"
              value={ageGate}
              onChange={e => setAgeGate(e.target.value)}
              style={{ width: 120 }}
            >
              <option value="17">17+</option>
              <option value="18">18+</option>
              <option value="21">21+</option>
            </select>
          }
        />
        <Row
          label="Enforce Age Gate"
          desc="Require date of birth on signup"
          control={
            <label className="toggle">
              <input type="checkbox" checked={minAgeEnforced} onChange={e => setMinAgeEnforced(e.target.checked)} />
              <span className="toggle-track" />
            </label>
          }
        />
      </Section>

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
          desc="USD payout per 10,000 diamonds (gross)"
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
          label="Processing Fee"
          desc="Percentage deducted before payout"
          control={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="form-input"
                value={processingFee}
                onChange={e => setProcessingFee(e.target.value)}
                type="number"
                style={{ width: 80 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>%</span>
            </div>
          }
        />
        <Row
          label="Withdrawal Hold Period"
          desc="Days before a withdrawal can be approved after request"
          control={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="form-input"
                value={holdDays}
                onChange={e => setHoldDays(e.target.value)}
                type="number"
                style={{ width: 80 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>days</span>
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
        <Row
          label="VS Battle Mode"
          desc="Allow creators to challenge each other to diamond battles"
          control={
            <label className="toggle">
              <input type="checkbox" checked={allowVsBattle} onChange={e => setAllowVsBattle(e.target.checked)} />
              <span className="toggle-track" />
            </label>
          }
        />
        <Row
          label="Multi-Guest Mode"
          desc="Allow multiple guests to join a single stream simultaneously"
          control={
            <label className="toggle">
              <input type="checkbox" checked={allowMultiGuest} onChange={e => setAllowMultiGuest(e.target.checked)} />
              <span className="toggle-track" />
            </label>
          }
        />
        <Row
          label="Stream Storage / VOD"
          desc="Streams are not stored automatically — clips must be uploaded manually by creators"
          control={
            <span style={{ fontSize: 12, padding: '3px 9px', borderRadius: 20, background: 'rgba(138,138,142,0.1)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              No VOD
            </span>
          }
        />
      </Section>

      {/* Legal */}
      <Section title="Legal">
        <Row
          label="Governing Law"
          desc="Jurisdiction for Terms of Service and disputes"
          control={
            <select className="form-select" defaultValue="texas" style={{ width: 200 }}>
              <option value="texas">Texas, United States</option>
              <option value="delaware">Delaware, United States</option>
              <option value="california">California, United States</option>
            </select>
          }
        />
        <Row
          label="Attorney Review Status"
          desc="Current status of legal document review"
          control={
            <select className="form-select" defaultValue="in_review" style={{ width: 200 }}>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="needs_update">Needs Update</option>
            </select>
          }
        />
        <Row
          label="Legal Framework Version"
          desc="Version of Terms of Service and Privacy Policy in effect"
          control={
            <input
              className="form-input"
              defaultValue="1.0.0-beta"
              style={{ width: 140 }}
            />
          }
        />
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
