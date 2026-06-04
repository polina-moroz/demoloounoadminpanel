export type UserRole = 'viewer' | 'creator' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'banned' | 'unverified';
export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted';
export type ReportType = 'stream' | 'user' | 'message';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';
export type StreamStatus = 'live' | 'ended' | 'terminated';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'on_hold';
export type TransactionType = 'coin_purchase' | 'gift_sent' | 'gift_received' | 'withdrawal' | 'refund';
export type CompetitionStatus = 'active' | 'upcoming' | 'ended';
export type NotificationTarget = 'all' | 'creators' | 'viewers' | 'specific';

export interface User {
  id: string;
  displayName: string;
  handle: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  followers: number;
  kyc: KYCStatus;
  country: string;
  walletBalance: number;
  totalEarned: number;
  totalStreams: number;
  avatarColor: string;
  isTopStreamer?: boolean;
  isIPBanned?: boolean;
}

export interface Stream {
  id: string;
  streamer: string;
  streamerHandle: string;
  title: string;
  category: string;
  viewers: number;
  peakViewers: number;
  duration: string;
  diamondsEarned: number;
  status: StreamStatus;
  startedAt: string;
  endedAt?: string;
  avatarColor: string;
}

export interface Report {
  id: string;
  reporter: string;
  reporterHandle: string;
  type: ReportType;
  target: string;
  targetHandle: string;
  reason: string;
  reportedAt: string;
  status: ReportStatus;
}

export interface WithdrawalRequest {
  id: string;
  user: string;
  userHandle: string;
  diamonds: number;
  estimatedUSD: number;
  kycStatus: KYCStatus;
  requestedAt: string;
  holdUntil: string;
  status: WithdrawalStatus;
  avatarColor: string;
}

export interface Transaction {
  id: string;
  user: string;
  userHandle: string;
  type: TransactionType;
  amount: number;
  currency: 'USD' | 'coins' | 'diamonds';
  date: string;
  note?: string;
}

export interface KYCEntry {
  id: string;
  user: string;
  userHandle: string;
  email: string;
  stripeVerificationId: string;
  submittedAt: string;
  status: KYCStatus;
  avatarColor: string;
}

export interface Gift {
  id: string;
  emoji: string;
  name: string;
  coins: number;
  tier: 1 | 2 | 3 | 4;
  tierName: string;
  enabled: boolean;
}

export interface CompetitionEntry {
  rank: number;
  name: string;
  handle: string;
  diamondsReceived: number;
  prize: string;
  change: 'up' | 'down' | 'same';
  changeAmount: number;
  avatarColor: string;
}

export interface PrizeTier {
  rank: string;
  prize: string;
  type: 'cash' | 'cosmetic';
}

export interface CoinPackage {
  id: string;
  tier: number;
  label: string;
  coins: number;
  price: number;
  bonusPercent: number;
  bestValue: boolean;
  enabled: boolean;
  platform: 'iap' | 'web';
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  target: NotificationTarget;
  sentAt: string;
  delivered: number;
  openRate: number;
}

export interface PrestigeXPLevel {
  level: number;
  name: string;
  color: string;
  xpRequired: number;
  perks: string;
}

export interface PrestigeSPTier {
  tier: string;
  subTier: string;
  spRequired: number;
  perks: string;
  color: string;
}

export interface VIPLevel {
  level: number;
  name: string;
  monthlySpend: number;
  badgeColor: string;
  perks: string;
}
