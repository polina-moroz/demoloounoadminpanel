import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
  mockUsers, mockStreams, mockReports, mockWithdrawals,
  mockKYC, mockNotifications, mockAdminTeam, mockReportReasons, mockFraudAlerts, mockWarnMessages,
} from './mockData'
import type {
  User, Stream, Report, WithdrawalRequest, KYCEntry,
  Notification, UserStatus, WithdrawalStatus, KYCStatus, NotificationTarget,
  AdminMember, AdminRole, ReportReason, ReportType, FraudAlert, WarnMessage, ReportLogEntry, ActionLogEntry,
} from './types'

// Processing fee default (%)
const DEFAULT_PROCESSING_FEE = 3

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `LOOO-${seg()}-${seg()}`
}

/* ── Toast ─────────────────────────────────────────────────────── */

export type ToastVariant = 'success' | 'error' | 'warn' | 'info'

export interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

/* ── Store shape ────────────────────────────────────────────────── */

interface StoreCtx {
  // data
  users: User[]
  streams: Stream[]
  reports: Report[]
  withdrawals: WithdrawalRequest[]
  kyc: KYCEntry[]
  notifications: Notification[]

  // user actions
  warnUser: (id: string, message?: string) => void
  setUserStatus: (id: string, status: UserStatus) => void
  promoteTopStreamer: (id: string) => void
  demoteTopStreamer: (id: string) => void
  ipBanUser: (id: string) => void
  adjustWalletBalance: (id: string, delta: number, reason: string) => void

  // stream actions
  terminateStream: (id: string) => void
  warnStreamer: (streamId: string, warnTitle: string) => void

  // report actions
  resolveReport: (id: string) => void
  dismissReport: (id: string) => void
  reopenReport: (id: string) => void
  banReportTarget: (id: string) => void
  warnReportTarget: (id: string, message?: string) => void

  // warn messages
  warnMessages: WarnMessage[]
  addWarnMessage: (title: string, message: string) => void
  updateWarnMessage: (id: string, updates: Partial<Pick<WarnMessage, 'title' | 'message'>>) => void
  removeWarnMessage: (id: string) => void

  // report reasons
  reportReasons: ReportReason[]
  addReportReason: (label: string, appliesTo: ReportType | 'all') => void
  updateReportReason: (id: string, updates: Partial<ReportReason>) => void
  removeReportReason: (id: string) => void

  // withdrawal actions
  approveWithdrawal: (id: string) => void
  rejectWithdrawal: (id: string) => void
  holdWithdrawal: (id: string) => void

  // fraud detection
  fraudAlerts: FraudAlert[]
  fraudThresholdUSD: number
  approveFraudAlert: (id: string) => void
  rejectFraudAlert: (id: string) => void
  setFraudThreshold: (usd: number) => void

  // economy settings
  processingFee: number
  setProcessingFee: (pct: number) => void

  // kyc actions
  approveKYC: (id: string) => void
  rejectKYC: (id: string) => void
  requestMoreInfoKYC: (id: string) => void

  // notification actions
  sendNotification: (title: string, body: string, target: NotificationTarget) => void

  // auth
  isAuthenticated: boolean
  currentAdmin: AdminMember | null
  login: (email: string, password: string) => boolean
  logout: () => void

  // admin team
  adminTeam: AdminMember[]
  inviteAdmin: (email: string, role: AdminRole, fullName: string) => string
  updateAdminRole: (id: string, role: AdminRole) => void
  updateAdminMember: (id: string, updates: Partial<Pick<AdminMember, 'displayName' | 'email'>>) => void
  resetAdminPassword: (id: string, newPassword: string) => void
  resendAdminInvite: (id: string) => void
  suspendAdmin: (id: string) => void
  reinstateAdmin: (id: string) => void
  removeAdmin: (id: string) => void
  acceptInvite: (code: string) => boolean

  // toast
  toasts: ToastItem[]
  toast: (message: string, variant?: ToastVariant) => void
  dismissToast: (id: number) => void
}

const Ctx = createContext<StoreCtx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [streams, setStreams] = useState<Stream[]>(mockStreams)
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawals)
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(mockFraudAlerts)
  const [fraudThresholdUSD, setFraudThresholdUSD] = useState(50)
  const [processingFee, setProcessingFeeState] = useState(DEFAULT_PROCESSING_FEE)
  const [kyc, setKyc] = useState<KYCEntry[]>(mockKYC)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [reportReasons, setReportReasons] = useState<ReportReason[]>(mockReportReasons)
  const [warnMessages, setWarnMessages] = useState<WarnMessage[]>(mockWarnMessages)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [toastId, setToastId] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<AdminMember | null>(null)
  const [adminTeam, setAdminTeam] = useState<AdminMember[]>(mockAdminTeam)

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = toastId + 1
    setToastId(id)
    setToasts(prev => [...prev, { id, message, variant }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [toastId])

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  /* ── user helpers ── */
  const syncUserKyc = (userHandle: string, kycStatus: KYCStatus) => {
    setUsers(prev => prev.map(u =>
      u.handle === userHandle ? { ...u, kyc: kycStatus } : u
    ))
  }

  const warnUser = useCallback((id: string, message?: string) => {
    const u = users.find(u => u.id === id)
    setUsers(prev => prev.map(usr =>
      usr.id === id
        ? { ...usr, log: [...(usr.log ?? []), newLogEntry('warned', message)] }
        : usr
    ))
    const note = message ? `: "${message.slice(0, 60)}${message.length > 60 ? '…' : ''}"` : ''
    toast(`Warning sent to @${u?.handle ?? id}${note}`, 'warn')
  }, [users, currentAdmin, toast])

  const setUserStatus = useCallback((id: string, status: UserStatus) => {
    const action = status === 'active' ? 'reinstated' : status
    setUsers(prev => prev.map(u =>
      u.id === id
        ? { ...u, status, log: [...(u.log ?? []), newLogEntry(action)] }
        : u
    ))
    const u = users.find(u => u.id === id)
    toast(`@${u?.handle ?? id} has been ${action}`,
      status === 'banned' ? 'error' : status === 'suspended' ? 'warn' : 'success')
  }, [users, currentAdmin, toast])

  const promoteTopStreamer = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isTopStreamer: true } : u))
    const u = users.find(u => u.id === id)
    toast(`@${u?.handle ?? id} granted Star Badge ⭐`, 'success')
  }, [users, toast])

  const demoteTopStreamer = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isTopStreamer: false } : u))
    const u = users.find(u => u.id === id)
    toast(`Star Badge removed from @${u?.handle ?? id}`, 'info')
  }, [users, toast])

  const ipBanUser = useCallback((id: string) => {
    setUsers(prev => prev.map(u =>
      u.id === id
        ? { ...u, isIPBanned: true, status: 'banned', log: [...(u.log ?? []), newLogEntry('ip_banned')] }
        : u
    ))
    const u = users.find(u => u.id === id)
    toast(`@${u?.handle ?? id} has been IP banned`, 'error')
  }, [users, currentAdmin, toast])

  const adjustWalletBalance = useCallback((id: string, delta: number, reason: string) => {
    const u = users.find(u => u.id === id)
    if (!u) return
    const newBalance = Math.max(0, u.walletBalance + delta)
    setUsers(prev => prev.map(usr => usr.id === id ? { ...usr, walletBalance: newBalance } : usr))
    const sign = delta >= 0 ? '+' : ''
    const note = reason ? ` (${reason})` : ''
    toast(`@${u.handle}: balance ${sign}${delta.toLocaleString()} 💎${note}`, delta >= 0 ? 'success' : 'warn')
  }, [users, toast])

  /* ── stream helpers ── */
  const terminateStream = useCallback((id: string) => {
    setStreams(prev => prev.map(s =>
      s.id === id
        ? { ...s, status: 'terminated', viewers: 0, log: [...(s.log ?? []), newLogEntry('terminated')] }
        : s
    ))
    const s = streams.find(s => s.id === id)
    toast(`Stream "${s?.title ?? id}" has been terminated`, 'error')
  }, [streams, currentAdmin, toast])

  const warnStreamer = useCallback((streamId: string, warnTitle: string) => {
    setStreams(prev => prev.map(s =>
      s.id === streamId
        ? { ...s, log: [...(s.log ?? []), newLogEntry('warned', warnTitle)] }
        : s
    ))
    const s = streams.find(s => s.id === streamId)
    toast(`Warning "${warnTitle}" sent to @${s?.streamerHandle ?? streamId}`, 'warn')
  }, [streams, currentAdmin, toast])

  /* ── action log helper ── */
  const newLogEntry = (action: string, note?: string): ActionLogEntry => ({
    id: `log${Date.now()}${Math.random().toString(36).slice(2)}`,
    action,
    adminName: currentAdmin?.displayName ?? 'Admin',
    timestamp: new Date().toISOString(),
    note,
  })

  /* ── report helpers ── */
  const addReportLog = (prev: Report[], id: string, entry: Omit<ReportLogEntry, 'id'>): Report[] =>
    prev.map(r => r.id === id ? { ...r, log: [...(r.log ?? []), { ...entry, id: `log${Date.now()}${Math.random()}` }] } : r)

  const resolveReport = useCallback((id: string) => {
    setReports(prev => addReportLog(
      prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r),
      id, { action: 'resolved', adminName: currentAdmin?.displayName ?? 'Admin', timestamp: new Date().toISOString() }
    ))
    toast('Report resolved', 'success')
  }, [currentAdmin, toast])

  const dismissReport = useCallback((id: string) => {
    setReports(prev => addReportLog(
      prev.map(r => r.id === id ? { ...r, status: 'dismissed' } : r),
      id, { action: 'dismissed', adminName: currentAdmin?.displayName ?? 'Admin', timestamp: new Date().toISOString() }
    ))
    toast('Report dismissed', 'info')
  }, [currentAdmin, toast])

  const reopenReport = useCallback((id: string) => {
    setReports(prev => addReportLog(
      prev.map(r => r.id === id ? { ...r, status: 'pending' } : r),
      id, { action: 'reopened', adminName: currentAdmin?.displayName ?? 'Admin', timestamp: new Date().toISOString() }
    ))
    toast('Report reopened', 'info')
  }, [currentAdmin, toast])

  const banReportTarget = useCallback((id: string) => {
    const r = reports.find(r => r.id === id)
    if (r) {
      setUsers(prev => prev.map(u =>
        u.handle === r.targetHandle ? { ...u, status: 'banned' } : u
      ))
      setReports(prev => addReportLog(
        prev.map(rep => rep.id === id ? { ...rep, status: 'resolved' } : rep),
        id, { action: 'banned', adminName: currentAdmin?.displayName ?? 'Admin', timestamp: new Date().toISOString(), note: `@${r.targetHandle} banned` }
      ))
      toast(`@${r.targetHandle} has been banned`, 'error')
    }
  }, [reports, currentAdmin, toast])

  const warnReportTarget = useCallback((id: string, message?: string) => {
    const r = reports.find(r => r.id === id)
    if (r) {
      setReports(prev => addReportLog(
        prev.map(rep => rep.id === id ? { ...rep, status: 'resolved' } : rep),
        id, { action: 'warned', adminName: currentAdmin?.displayName ?? 'Admin', timestamp: new Date().toISOString(), note: message }
      ))
      toast(`Warning sent to @${r.targetHandle}`, 'warn')
    }
  }, [reports, currentAdmin, toast])

  /* ── report reason helpers ── */
  const addReportReason = useCallback((label: string, appliesTo: ReportType | 'all') => {
    const trimmed = label.trim()
    if (!trimmed) return
    setReportReasons(prev => [...prev, { id: `rr${Date.now()}`, label: trimmed, appliesTo, enabled: true }])
    toast(`Reason "${trimmed}" added`, 'success')
  }, [toast])

  const updateReportReason = useCallback((id: string, updates: Partial<ReportReason>) => {
    setReportReasons(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
  }, [])

  const removeReportReason = useCallback((id: string) => {
    const r = reportReasons.find(r => r.id === id)
    setReportReasons(prev => prev.filter(r => r.id !== id))
    toast(`Reason "${r?.label ?? ''}" removed`, 'info')
  }, [reportReasons, toast])

  /* ── warn message helpers ── */
  const addWarnMessage = useCallback((title: string, message: string) => {
    const t = title.trim(); const m = message.trim()
    if (!t || !m) return
    setWarnMessages(prev => [...prev, { id: `wm${Date.now()}`, title: t, message: m }])
    toast(`Warning template "${t}" added`, 'success')
  }, [toast])

  const updateWarnMessage = useCallback((id: string, updates: Partial<Pick<WarnMessage, 'title' | 'message'>>) => {
    setWarnMessages(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }, [])

  const removeWarnMessage = useCallback((id: string) => {
    const w = warnMessages.find(w => w.id === id)
    setWarnMessages(prev => prev.filter(w => w.id !== id))
    toast(`Template "${w?.title ?? ''}" removed`, 'info')
  }, [warnMessages, toast])

  /* ── withdrawal helpers ── */
  const setWithdrawalStatus = (id: string, status: WithdrawalStatus, reviewedBy?: string) => {
    const reviewedAt = new Date().toISOString()
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status, reviewedBy, reviewedAt } : w))
  }

  const approveWithdrawal = useCallback((id: string) => {
    const w = withdrawals.find(w => w.id === id)
    if (w && w.kycStatus !== 'approved') {
      toast('Cannot approve: KYC not verified', 'error'); return
    }
    setWithdrawalStatus(id, 'approved', currentAdmin?.displayName ?? 'Admin')
    toast('Withdrawal approved ✓', 'success')
  }, [withdrawals, currentAdmin, toast])

  const rejectWithdrawal = useCallback((id: string) => {
    setWithdrawalStatus(id, 'rejected', currentAdmin?.displayName ?? 'Admin')
    toast('Withdrawal rejected', 'error')
  }, [currentAdmin, toast])

  const holdWithdrawal = useCallback((id: string) => {
    setWithdrawalStatus(id, 'on_hold')
    toast('Withdrawal placed on hold', 'warn')
  }, [toast])

  /* ── fraud detection helpers ── */
  const approveFraudAlert = useCallback((id: string) => {
    const a = fraudAlerts.find(a => a.id === id)
    setFraudAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a))
    if (a?.withdrawalId) {
      setWithdrawals(prev => prev.map(w => w.id === a.withdrawalId ? { ...w, status: 'approved' } : w))
    }
    toast(`Fraud alert cleared — withdrawal approved for @${a?.userHandle ?? id}`, 'success')
  }, [fraudAlerts, toast])

  const rejectFraudAlert = useCallback((id: string) => {
    const a = fraudAlerts.find(a => a.id === id)
    setFraudAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
    if (a?.withdrawalId) {
      setWithdrawals(prev => prev.map(w => w.id === a.withdrawalId ? { ...w, status: 'rejected' } : w))
    }
    toast(`Fraud alert rejected — withdrawal denied for @${a?.userHandle ?? id}`, 'error')
  }, [fraudAlerts, toast])

  const setFraudThreshold = useCallback((usd: number) => {
    setFraudThresholdUSD(usd)
    toast(`Fraud threshold updated to $${usd} USD`, 'success')
  }, [toast])

  const setProcessingFee = useCallback((pct: number) => {
    setProcessingFeeState(pct)
    toast(`Processing fee updated to ${pct}%`, 'success')
  }, [toast])

  /* ── kyc helpers ── */
  const approveKYC = useCallback((id: string) => {
    const k = kyc.find(k => k.id === id)
    setKyc(prev => prev.map(k => k.id === id ? { ...k, status: 'approved' } : k))
    if (k) syncUserKyc(k.userHandle, 'approved')
    toast('KYC approved — creator can now withdraw', 'success')
  }, [kyc, toast])

  const rejectKYC = useCallback((id: string) => {
    const k = kyc.find(k => k.id === id)
    setKyc(prev => prev.map(k => k.id === id ? { ...k, status: 'rejected' } : k))
    if (k) syncUserKyc(k.userHandle, 'rejected')
    toast('KYC rejected', 'error')
  }, [kyc, toast])

  const requestMoreInfoKYC = useCallback((id: string) => {
    const k = kyc.find(k => k.id === id)
    setKyc(prev => prev.map(k => k.id === id ? { ...k, status: 'pending' } : k))
    toast(`More info requested from @${k?.userHandle ?? id}`, 'warn')
  }, [kyc, toast])

  /* ── auth helpers ── */
  const login = useCallback((email: string, password: string): boolean => {
    if (!email.trim() || !password.trim()) return false
    const match = adminTeam.find(m =>
      m.email.toLowerCase() === email.toLowerCase().trim() && m.status === 'active'
    )
    const fallback = adminTeam.find(m => m.role === 'super_admin') ?? adminTeam[0]
    const admin = match ?? fallback ?? null
    setCurrentAdmin(admin)
    setIsAuthenticated(true)
    return true
  }, [adminTeam])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setCurrentAdmin(null)
  }, [])

  /* ── admin team helpers ── */
  const inviteAdmin = useCallback((email: string, role: AdminRole, fullName: string): string => {
    const code = generateInviteCode()
    const newMember: AdminMember = {
      id: `a${Date.now()}`,
      displayName: fullName.trim() || '—',
      email,
      role,
      status: 'invited',
      invitedAt: new Date().toISOString(),
      inviteCode: code,
      avatarColor: '#48484A',
    }
    setAdminTeam(prev => [...prev, newMember])
    toast(`Invite sent to ${email} (mocked — no email actually sent)`, 'success')
    return code
  }, [toast])

  const updateAdminRole = useCallback((id: string, role: AdminRole) => {
    setAdminTeam(prev => prev.map(a => a.id === id ? { ...a, role } : a))
    toast('Role updated', 'success')
  }, [toast])

  const updateAdminMember = useCallback((id: string, updates: Partial<Pick<AdminMember, 'displayName' | 'email'>>) => {
    setAdminTeam(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
    setCurrentAdmin(prev => prev?.id === id ? { ...prev, ...updates } : prev)
    toast('Member updated', 'success')
  }, [toast])

  const resetAdminPassword = useCallback((id: string, _newPassword: string) => {
    const a = adminTeam.find(a => a.id === id)
    toast(`Password changed for ${a?.displayName !== '—' ? a?.displayName : a?.email ?? id}`, 'success')
  }, [adminTeam, toast])

  const resendAdminInvite = useCallback((id: string) => {
    const a = adminTeam.find(a => a.id === id)
    toast(`Invite resent to ${a?.email ?? id}`, 'success')
  }, [adminTeam, toast])

  const suspendAdmin = useCallback((id: string) => {
    const a = adminTeam.find(a => a.id === id)
    setAdminTeam(prev => prev.map(a => a.id === id ? { ...a, status: 'suspended' } : a))
    toast(`${a?.displayName ?? 'Member'} suspended`, 'warn')
  }, [adminTeam, toast])

  const reinstateAdmin = useCallback((id: string) => {
    const a = adminTeam.find(a => a.id === id)
    setAdminTeam(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a))
    toast(`${a?.displayName ?? 'Member'} reinstated`, 'success')
  }, [adminTeam, toast])

  const removeAdmin = useCallback((id: string) => {
    const a = adminTeam.find(a => a.id === id)
    setAdminTeam(prev => prev.filter(a => a.id !== id))
    toast(`${a?.displayName ?? 'Member'} removed from team`, 'info')
  }, [adminTeam, toast])

  const acceptInvite = useCallback((code: string): boolean => {
    const member = adminTeam.find(m => m.inviteCode === code && m.status === 'invited')
    if (!member) return false
    setAdminTeam(prev => prev.map(m =>
      m.id === member.id
        ? { ...m, status: 'active', inviteCode: undefined, joinedAt: new Date().toISOString() }
        : m
    ))
    return true
  }, [adminTeam])

  /* ── notification helpers ── */
  const sendNotification = useCallback((title: string, body: string, target: NotificationTarget) => {
    const newNotif: Notification = {
      id: `n${Date.now()}`,
      title,
      body,
      target,
      sentAt: new Date().toISOString(),
      delivered: target === 'all' ? 12841 : target === 'creators' ? 2140 : 10701,
      openRate: Math.round(18 + Math.random() * 24),
    }
    setNotifications(prev => [newNotif, ...prev])
    toast(`Notification "${title}" sent to ${target === 'all' ? 'all users' : target}`, 'success')
  }, [toast])

  return (
    <Ctx.Provider value={{
      users, streams, reports, withdrawals, kyc, notifications,
      warnUser, setUserStatus, promoteTopStreamer, demoteTopStreamer, ipBanUser, adjustWalletBalance,
      terminateStream, warnStreamer,
      resolveReport, dismissReport, reopenReport, banReportTarget, warnReportTarget,
      warnMessages, addWarnMessage, updateWarnMessage, removeWarnMessage,
      reportReasons, addReportReason, updateReportReason, removeReportReason,
      approveWithdrawal, rejectWithdrawal, holdWithdrawal,
      fraudAlerts, fraudThresholdUSD, approveFraudAlert, rejectFraudAlert, setFraudThreshold,
      processingFee, setProcessingFee,
      approveKYC, rejectKYC, requestMoreInfoKYC,
      sendNotification,
      isAuthenticated, currentAdmin, login, logout,
      adminTeam, inviteAdmin, updateAdminRole, updateAdminMember, resetAdminPassword, resendAdminInvite,
      suspendAdmin, reinstateAdmin, removeAdmin, acceptInvite,
      toasts, toast, dismissToast,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
