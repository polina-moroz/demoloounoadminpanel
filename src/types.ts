export type UserRole = 'viewer' | 'creator' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'banned' | 'unverified';
export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted';
export type ReportType = 'stream' | 'user' | 'message';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';
export type StreamStatus = 'live' | 'ended' | 'terminated';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'on_hold';
export type TransactionType = 'coin_purchase' | 'diamond_received' | 'diamond_withdrawal';
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

export interface ReportLogEntry {
  id: string;
  action: 'warned' | 'banned' | 'resolved' | 'dismissed' | 'reopened';
  adminName: string;
  timestamp: string;
  note?: string;
}

export interface Report {
  id: string;
  reporter: string;
  reporterHandle: string;
  type: ReportType;
  target: string;
  targetHandle: string;
  reason: string;
  description?: string;
  reportedAt: string;
  status: ReportStatus;
  log?: ReportLogEntry[];
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

export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'viewer';
export type AdminStatus = 'active' | 'invited' | 'suspended';

export interface AdminMember {
  id: string;
  displayName: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  invitedAt: string;
  joinedAt?: string;
  inviteCode?: string;
  avatarColor: string;
}

export interface ReportReason {
  id: string;
  label: string;
  appliesTo: ReportType | 'all';
  enabled: boolean;
}

export interface WarnMessage {
  id: string;
  label: string;
}

export type WheelPrizeType = 'coins' | 'diamonds' | 'multiplier' | 'miss';

export interface FortuneWheelPrize {
  id: string;
  label: string;
  emoji: string;
  type: WheelPrizeType;
  reward: number;
  probability: number;
  color: string;
  enabled: boolean;
}

export type WheelSegmentType = 'rare' | 'ultra-rare' | 'miss';

export interface WheelSegment {
  id: string;
  type: WheelSegmentType;
  label: string;
  color: string;
  animationFileName: string | null;
}

export type FraudAlertStatus = 'pending' | 'approved' | 'rejected';

export interface FraudAlert {
  id: string;
  withdrawalId: string;
  userId: string;
  user: string;
  userHandle: string;
  email: string;
  country: string;
  diamonds: number;
  estimatedUSD: number;
  kycStatus: KYCStatus;
  requestedAt: string;
  status: FraudAlertStatus;
  avatarColor: string;
  joined: string;
  totalEarned: number;
  totalStreams: number;
  followers: number;
  walletBalance: number;
}
