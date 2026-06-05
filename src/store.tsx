import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
  mockUsers, mockStreams, mockReports, mockWithdrawals,
  mockKYC, mockNotifications, mockAdminTeam,
} from './mockData'
import type {
  User, Stream, Report, WithdrawalRequest, KYCEntry,
  Notification, UserStatus, WithdrawalStatus, KYCStatus, NotificationTarget,
  AdminMember, AdminRole,
} from './types'

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
  warnUser: (id: string) => void
  setUserStatus: (id: string, status: UserStatus) => void
  promoteTopStreamer: (id: string) => void
  demoteTopStreamer: (id: string) => void
  ipBanUser: (id: string) => void
  adjustWalletBalance: (id: string, delta: number, reason: string) => void

  // stream actions
  terminateStream: (id: string) => void
  warnStreamer: (streamId: string) => void

  // report actions
  resolveReport: (id: string) => void
  dismissReport: (id: string) => void
  banReportTarget: (id: string) => void
  warnReportTarget: (id: string) => void

  // withdrawal actions
  approveWithdrawal: (id: string) => void
  rejectWithdrawal: (id: string) => void
  holdWithdrawal: (id: string) => void

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
  inviteAdmin: (email: string, role: AdminRole) => string
  updateAdminRole: (id: string, role: AdminRole) => void
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
  const [kyc, setKyc] = useState<KYCEntry[]>(mockKYC)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
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

  const warnUser = useCallback((id: string) => {
    const u = users.find(u => u.id === id)
    toast(`Warning sent to @${u?.handle ?? id}`, 'warn')
  }, [users, toast])

  const setUserStatus = useCallback((id: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u))
    const u = users.find(u => u.id === id)
    const label = status === 'active' ? 'reinstated' : status
    toast(`@${u?.handle ?? id} has been ${label}`,
      status === 'banned' ? 'error' : status === 'suspended' ? 'warn' : 'success')
  }, [users, toast])

  const promoteTopStreamer = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isTopStreamer: true } : u))
    const u = users.find(u => u.id === id)
    toast(`@${u?.handle ?? id} promoted to Top Streamer ⭐`, 'success')
  }, [users, toast])

  const demoteTopStreamer = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isTopStreamer: false } : u))
    const u = users.find(u => u.id === id)
    toast(`Top Streamer badge removed from @${u?.handle ?? id}`, 'info')
  }, [users, toast])

  const ipBanUser = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isIPBanned: true, status: 'banned' } : u))
    const u = users.find(u => u.id === id)
    toast(`@${u?.handle ?? id} has been IP banned`, 'error')
  }, [users, toast])

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
      s.id === id ? { ...s, status: 'terminated', viewers: 0 } : s
    ))
    const s = streams.find(s => s.id === id)
    toast(`Stream "${s?.title ?? id}" has been terminated`, 'error')
  }, [streams, toast])

  const warnStreamer = useCallback((streamId: string) => {
    const s = streams.find(s => s.id === streamId)
    toast(`Warning sent to @${s?.streamerHandle ?? streamId}`, 'warn')
  }, [streams, toast])

  /* ── report helpers ── */
  const resolveReport = useCallback((id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r))
    toast('Report resolved', 'success')
  }, [toast])

  const dismissReport = useCallback((id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'dismissed' } : r))
    toast('Report dismissed', 'info')
  }, [toast])

  const banReportTarget = useCallback((id: string) => {
    const r = reports.find(r => r.id === id)
    if (r) {
      setUsers(prev => prev.map(u =>
        u.handle === r.targetHandle ? { ...u, status: 'banned' } : u
      ))
      setReports(prev => prev.map(rep => rep.id === id ? { ...rep, status: 'resolved' } : rep))
      toast(`@${r.targetHandle} has been banned`, 'error')
    }
  }, [reports, toast])

  const warnReportTarget = useCallback((id: string) => {
    const r = reports.find(r => r.id === id)
    if (r) {
      setReports(prev => prev.map(rep => rep.id === id ? { ...rep, status: 'resolved' } : rep))
      toast(`Warning sent to @${r.targetHandle}`, 'warn')
    }
  }, [reports, toast])

  /* ── withdrawal helpers ── */
  const setWithdrawalStatus = (id: string, status: WithdrawalStatus) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w))
  }

  const approveWithdrawal = useCallback((id: string) => {
    const w = withdrawals.find(w => w.id === id)
    if (w && w.kycStatus !== 'approved') {
      toast('Cannot approve: KYC not verified', 'error'); return
    }
    setWithdrawalStatus(id, 'approved')
    toast('Withdrawal approved ✓', 'success')
  }, [withdrawals, toast])

  const rejectWithdrawal = useCallback((id: string) => {
    setWithdrawalStatus(id, 'rejected')
    toast('Withdrawal rejected', 'error')
  }, [toast])

  const holdWithdrawal = useCallback((id: string) => {
    setWithdrawalStatus(id, 'on_hold')
    toast('Withdrawal placed on hold', 'warn')
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
  const inviteAdmin = useCallback((email: string, role: AdminRole): string => {
    const code = generateInviteCode()
    const newMember: AdminMember = {
      id: `a${Date.now()}`,
      displayName: '—',
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
      resolveReport, dismissReport, banReportTarget, warnReportTarget,
      approveWithdrawal, rejectWithdrawal, holdWithdrawal,
      approveKYC, rejectKYC, requestMoreInfoKYC,
      sendNotification,
      isAuthenticated, currentAdmin, login, logout,
      adminTeam, inviteAdmin, updateAdminRole, suspendAdmin, reinstateAdmin, removeAdmin, acceptInvite,
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
