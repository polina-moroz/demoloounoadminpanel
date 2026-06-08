import type {
  User, Stream, Report, WithdrawalRequest, Transaction,
  KYCEntry, Gift, CompetitionEntry, PrizeTier, CoinPackage,
  Notification, PrestigeXPLevel, PrestigeSPTier, VIPLevel, FortuneWheelPrize, AdminMember, ReportReason, FraudAlert, WarnMessage
} from './types';

export const mockUsers: User[] = [
  { id: 'u1', displayName: 'Aria Voss', handle: 'ariavoss', email: 'aria@example.com', role: 'creator', status: 'active', joined: '2025-03-12', followers: 14200, kyc: 'approved', country: 'US', walletBalance: 42000, totalEarned: 182000, totalStreams: 87, avatarColor: '#9966CC', isTopStreamer: true },
  { id: 'u2', displayName: 'Marco Reyes', handle: 'marcoreyes', email: 'marco@example.com', role: 'creator', status: 'active', joined: '2025-04-01', followers: 8750, kyc: 'approved', country: 'MX', walletBalance: 18000, totalEarned: 74000, totalStreams: 43, avatarColor: '#2ECC8A' },
  { id: 'u3', displayName: 'Jade Kim', handle: 'jadekim', email: 'jade@example.com', role: 'viewer', status: 'active', joined: '2025-05-20', followers: 320, kyc: 'not_submitted', country: 'KR', walletBalance: 5500, totalEarned: 0, totalStreams: 0, avatarColor: '#D4AF37' },
  { id: 'u4', displayName: 'Tyler Banks', handle: 'tylerb', email: 'tyler@example.com', role: 'creator', status: 'suspended', joined: '2025-02-15', followers: 3100, kyc: 'approved', country: 'US', walletBalance: 0, totalEarned: 28000, totalStreams: 22, avatarColor: '#C0392B' },
  { id: 'u5', displayName: 'Priya Nair', handle: 'priyanair', email: 'priya@example.com', role: 'viewer', status: 'active', joined: '2025-06-01', followers: 88, kyc: 'pending', country: 'IN', walletBalance: 1200, totalEarned: 0, totalStreams: 0, avatarColor: '#9B111E' },
  { id: 'u6', displayName: 'Carlos Duarte', handle: 'cduarte', email: 'carlos@example.com', role: 'creator', status: 'banned', joined: '2025-01-08', followers: 560, kyc: 'rejected', country: 'BR', walletBalance: 0, totalEarned: 4200, totalStreams: 11, avatarColor: '#48484A', isIPBanned: true },
  { id: 'u7', displayName: 'Sasha Bloom', handle: 'sashabloom', email: 'sasha@example.com', role: 'creator', status: 'active', joined: '2025-03-28', followers: 22100, kyc: 'approved', country: 'DE', walletBalance: 88000, totalEarned: 340000, totalStreams: 134, avatarColor: '#9966CC', isTopStreamer: true },
  { id: 'u8', displayName: 'Finn O\'Brien', handle: 'finno', email: 'finn@example.com', role: 'viewer', status: 'unverified', joined: '2025-05-30', followers: 0, kyc: 'not_submitted', country: 'IE', walletBalance: 0, totalEarned: 0, totalStreams: 0, avatarColor: '#2ECC8A' },
  { id: 'u9', displayName: 'Nour Al-Rashid', handle: 'nourar', email: 'nour@example.com', role: 'creator', status: 'active', joined: '2025-04-14', followers: 6400, kyc: 'approved', country: 'SA', walletBalance: 31000, totalEarned: 120000, totalStreams: 58, avatarColor: '#D4AF37' },
  { id: 'u10', displayName: 'Elena Popov', handle: 'elenapopov', email: 'elena@example.com', role: 'viewer', status: 'active', joined: '2025-05-05', followers: 210, kyc: 'not_submitted', country: 'RU', walletBalance: 800, totalEarned: 0, totalStreams: 0, avatarColor: '#9966CC' },
];

export const mockStreams: Stream[] = [
  { id: 's1', streamer: 'Sasha Bloom', streamerHandle: 'sashabloom', title: 'Late Night Chill Vibes 🌙', category: 'Just Chatting', viewers: 1842, peakViewers: 2100, duration: '2h 14m', diamondsEarned: 48200, status: 'live', startedAt: '2026-06-03T21:00:00Z', avatarColor: '#9966CC' },
  { id: 's2', streamer: 'Aria Voss', streamerHandle: 'ariavoss', title: 'Dance Practice + Q&A', category: 'Performance', viewers: 934, peakViewers: 1200, duration: '1h 07m', diamondsEarned: 22100, status: 'live', startedAt: '2026-06-03T21:45:00Z', avatarColor: '#9966CC' },
  { id: 's3', streamer: 'Nour Al-Rashid', streamerHandle: 'nourar', title: 'Cooking With Nour', category: 'Lifestyle', viewers: 420, peakViewers: 610, duration: '45m', diamondsEarned: 8800, status: 'live', startedAt: '2026-06-03T22:10:00Z', avatarColor: '#D4AF37' },
  { id: 's4', streamer: 'Marco Reyes', streamerHandle: 'marcoreyes', title: 'Guitar Covers All Night', category: 'Music', viewers: 711, peakViewers: 890, duration: '3h 02m', diamondsEarned: 31400, status: 'live', startedAt: '2026-06-03T20:00:00Z', avatarColor: '#2ECC8A' },
  { id: 's5', streamer: 'Sasha Bloom', streamerHandle: 'sashabloom', title: 'Sunday Morning Chat', category: 'Just Chatting', viewers: 0, peakViewers: 3400, duration: '1h 55m', diamondsEarned: 71000, status: 'ended', startedAt: '2026-06-01T10:00:00Z', endedAt: '2026-06-01T11:55:00Z', avatarColor: '#9966CC' },
  { id: 's6', streamer: 'Tyler Banks', streamerHandle: 'tylerb', title: 'Freestyle Rap Session', category: 'Music', viewers: 0, peakViewers: 1100, duration: '58m', diamondsEarned: 14200, status: 'terminated', startedAt: '2026-05-29T18:30:00Z', endedAt: '2026-05-29T19:28:00Z', avatarColor: '#C0392B' },
  { id: 's7', streamer: 'Aria Voss', streamerHandle: 'ariavoss', title: 'Makeup Tutorial GRWM', category: 'Beauty', viewers: 0, peakViewers: 1750, duration: '2h 30m', diamondsEarned: 55000, status: 'ended', startedAt: '2026-05-31T15:00:00Z', endedAt: '2026-05-31T17:30:00Z', avatarColor: '#9966CC' },
  { id: 's8', streamer: 'Marco Reyes', streamerHandle: 'marcoreyes', title: 'VS Battle Night 🥊', category: 'Battle', viewers: 0, peakViewers: 2800, duration: '2h 10m', diamondsEarned: 98400, status: 'ended', startedAt: '2026-05-30T20:00:00Z', endedAt: '2026-05-30T22:10:00Z', avatarColor: '#2ECC8A' },
];

export const mockReports: Report[] = [
  { id: 'r1', reporter: 'jade@example.com', reporterHandle: 'jadekim', type: 'stream', target: 'Tyler Banks', targetHandle: 'tylerb', reason: 'Explicit language and nudity', reportedAt: '2026-06-03T19:12:00Z', status: 'pending' },
  { id: 'r2', reporter: 'elena@example.com', reporterHandle: 'elenapopov', type: 'user', target: 'Carlos Duarte', targetHandle: 'cduarte', reason: 'Harassment in DMs', reportedAt: '2026-06-03T17:40:00Z', status: 'resolved' },
  { id: 'r3', reporter: 'priya@example.com', reporterHandle: 'priyanair', type: 'message', target: 'Tyler Banks', targetHandle: 'tylerb', reason: 'Spam messages in chat', reportedAt: '2026-06-03T16:55:00Z', status: 'pending' },
  { id: 'r4', reporter: 'finn@example.com', reporterHandle: 'finno', type: 'stream', target: 'Aria Voss', targetHandle: 'ariavoss', reason: 'Copyright music playing', reportedAt: '2026-06-02T22:30:00Z', status: 'dismissed' },
  { id: 'r5', reporter: 'marco@example.com', reporterHandle: 'marcoreyes', type: 'user', target: 'Carlos Duarte', targetHandle: 'cduarte', reason: 'Impersonation of a creator', reportedAt: '2026-06-02T14:10:00Z', status: 'resolved' },
  { id: 'r6', reporter: 'aria@example.com', reporterHandle: 'ariavoss', type: 'message', target: 'Finn O\'Brien', targetHandle: 'finno', reason: 'Inappropriate comments', reportedAt: '2026-06-02T11:00:00Z', status: 'pending' },
  { id: 'r7', reporter: 'tyler@example.com', reporterHandle: 'tylerb', type: 'stream', target: 'Sasha Bloom', targetHandle: 'sashabloom', reason: 'False flagging competitor', reportedAt: '2026-06-01T20:00:00Z', status: 'dismissed' },
  { id: 'r8', reporter: 'nour@example.com', reporterHandle: 'nourar', type: 'user', target: 'Priya Nair', targetHandle: 'priyanair', reason: 'Bot account suspicion', reportedAt: '2026-06-01T09:30:00Z', status: 'pending' },
  { id: 'r9', reporter: 'sasha@example.com', reporterHandle: 'sashabloom', type: 'message', target: 'Marco Reyes', targetHandle: 'marcoreyes', reason: 'Soliciting in chat', reportedAt: '2026-05-31T21:15:00Z', status: 'resolved' },
  { id: 'r10', reporter: 'jade@example.com', reporterHandle: 'jadekim', type: 'user', target: 'Elena Popov', targetHandle: 'elenapopov', reason: 'Underage user suspicion', reportedAt: '2026-05-31T18:00:00Z', status: 'pending' },
  { id: 'r11', reporter: 'carlos@example.com', reporterHandle: 'cduarte', type: 'stream', target: 'Nour Al-Rashid', targetHandle: 'nourar', reason: 'Misleading stream title', reportedAt: '2026-05-30T15:45:00Z', status: 'dismissed' },
  { id: 'r12', reporter: 'priya@example.com', reporterHandle: 'priyanair', type: 'message', target: 'Sasha Bloom', targetHandle: 'sashabloom', reason: 'Offensive emote spam', reportedAt: '2026-05-30T12:20:00Z', status: 'resolved' },
];

export const mockWithdrawals: WithdrawalRequest[] = [
  { id: 'w1', user: 'Sasha Bloom', userHandle: 'sashabloom', diamonds: 80000, estimatedUSD: 56, kycStatus: 'approved', requestedAt: '2026-06-03T10:00:00Z', holdUntil: '2026-06-10T10:00:00Z', status: 'pending', avatarColor: '#9966CC' },
  { id: 'w2', user: 'Aria Voss', userHandle: 'ariavoss', diamonds: 50000, estimatedUSD: 35, kycStatus: 'approved', requestedAt: '2026-06-02T14:30:00Z', holdUntil: '2026-06-09T14:30:00Z', status: 'on_hold', avatarColor: '#9966CC' },
  { id: 'w3', user: 'Marco Reyes', userHandle: 'marcoreyes', diamonds: 30000, estimatedUSD: 21, kycStatus: 'approved', requestedAt: '2026-06-01T09:00:00Z', holdUntil: '2026-06-08T09:00:00Z', status: 'approved', avatarColor: '#2ECC8A' },
  { id: 'w4', user: 'Nour Al-Rashid', userHandle: 'nourar', diamonds: 20000, estimatedUSD: 14, kycStatus: 'approved', requestedAt: '2026-06-01T16:15:00Z', holdUntil: '2026-06-08T16:15:00Z', status: 'pending', avatarColor: '#D4AF37' },
  { id: 'w5', user: 'Tyler Banks', userHandle: 'tylerb', diamonds: 15000, estimatedUSD: 10.5, kycStatus: 'approved', requestedAt: '2026-05-29T20:00:00Z', holdUntil: '2026-06-05T20:00:00Z', status: 'rejected', avatarColor: '#C0392B' },
  { id: 'w6', user: 'Aria Voss', userHandle: 'ariavoss', diamonds: 100000, estimatedUSD: 70, kycStatus: 'approved', requestedAt: '2026-05-28T11:00:00Z', holdUntil: '2026-06-04T11:00:00Z', status: 'approved', avatarColor: '#9966CC' },
];

export const mockTransactions: Transaction[] = [
  { id: 't1', user: 'Jade Kim', userHandle: 'jadekim', type: 'coin_purchase', amount: 9.99, currency: 'USD', date: '2026-06-03T20:10:00Z', note: '1,200 coins via App Store' },
  { id: 't2', user: 'Elena Popov', userHandle: 'elenapopov', type: 'coin_purchase', amount: 4.99, currency: 'USD', date: '2026-06-03T19:45:00Z', note: '500 coins via Play Store' },
  { id: 't3', user: 'Priya Nair', userHandle: 'priyanair', type: 'gift_sent', amount: 60000, currency: 'coins', date: '2026-06-03T19:30:00Z', note: 'Dragon gift to Sasha Bloom' },
  { id: 't4', user: 'Sasha Bloom', userHandle: 'sashabloom', type: 'gift_received', amount: 60000, currency: 'diamonds', date: '2026-06-03T19:30:00Z', note: 'Dragon from Priya Nair' },
  { id: 't5', user: 'Sasha Bloom', userHandle: 'sashabloom', type: 'withdrawal', amount: 80000, currency: 'diamonds', date: '2026-06-03T10:00:00Z', note: 'Withdrawal request $56 est.' },
  { id: 't6', user: 'Marco Reyes', userHandle: 'marcoreyes', type: 'withdrawal', amount: 30000, currency: 'diamonds', date: '2026-06-01T09:00:00Z', note: 'Withdrawal approved $21' },
  { id: 't7', user: 'Finn O\'Brien', userHandle: 'finno', type: 'coin_purchase', amount: 0.99, currency: 'USD', date: '2026-06-01T08:00:00Z', note: '100 coins via App Store' },
  { id: 't8', user: 'Jade Kim', userHandle: 'jadekim', type: 'gift_sent', amount: 8000, currency: 'coins', date: '2026-05-31T22:10:00Z', note: 'Trophy gift to Aria Voss' },
  { id: 't9', user: 'Aria Voss', userHandle: 'ariavoss', type: 'gift_received', amount: 8000, currency: 'diamonds', date: '2026-05-31T22:10:00Z', note: 'Trophy from Jade Kim' },
  { id: 't10', user: 'Carlos Duarte', userHandle: 'cduarte', type: 'refund', amount: 19.99, currency: 'USD', date: '2026-05-30T14:00:00Z', note: 'Account banned — purchase refunded' },
  // Extended history for fraud-flagged users
  { id: 'tx1', user: 'Sasha Bloom', userHandle: 'sashabloom', type: 'gift_received', amount: 100000, currency: 'diamonds', date: '2026-05-30T21:00:00Z', note: 'Castle gift from @whalekid during Sunday stream' },
  { id: 'tx2', user: 'Sasha Bloom', userHandle: 'sashabloom', type: 'gift_received', amount: 70000, currency: 'diamonds', date: '2026-05-25T18:30:00Z', note: 'Yacht gift from @topfan99' },
  { id: 'tx3', user: 'Sasha Bloom', userHandle: 'sashabloom', type: 'withdrawal', amount: 200000, currency: 'diamonds', date: '2026-05-20T10:00:00Z', note: 'Withdrawal $140 est. — flagged & rejected' },
  { id: 'tx4', user: 'Aria Voss', userHandle: 'ariavoss', type: 'withdrawal', amount: 100000, currency: 'diamonds', date: '2026-05-28T11:00:00Z', note: 'Withdrawal $70 est. — flagged & approved' },
  { id: 'tx5', user: 'Aria Voss', userHandle: 'ariavoss', type: 'gift_received', amount: 55000, currency: 'diamonds', date: '2026-05-27T20:00:00Z', note: 'Dragon gift during GRWM stream' },
  { id: 'tx6', user: 'Aria Voss', userHandle: 'ariavoss', type: 'gift_received', amount: 22100, currency: 'diamonds', date: '2026-05-20T17:00:00Z', note: 'Multiple gifts — Q&A session' },
  { id: 'tx7', user: 'Nour Al-Rashid', userHandle: 'nourar', type: 'gift_received', amount: 120000, currency: 'diamonds', date: '2026-06-05T20:00:00Z', note: 'Yacht + Castle during cooking stream' },
  { id: 'tx8', user: 'Nour Al-Rashid', userHandle: 'nourar', type: 'withdrawal', amount: 120000, currency: 'diamonds', date: '2026-06-06T09:00:00Z', note: 'Withdrawal $84 est. — flagged' },
  { id: 'tx9', user: 'Nour Al-Rashid', userHandle: 'nourar', type: 'gift_received', amount: 8800, currency: 'diamonds', date: '2026-06-03T22:10:00Z', note: 'Regular viewer gifts during stream' },
  { id: 'tx10', user: 'Nour Al-Rashid', userHandle: 'nourar', type: 'gift_received', amount: 31400, currency: 'diamonds', date: '2026-05-30T20:00:00Z', note: 'VS Battle night gifts' },
];

export const mockKYC: KYCEntry[] = [
  { id: 'k1', user: 'Sasha Bloom', userHandle: 'sashabloom', email: 'sasha@example.com', stripeVerificationId: 'vs_3PaXYZ1234', submittedAt: '2026-05-20T09:00:00Z', status: 'approved', avatarColor: '#9966CC' },
  { id: 'k2', user: 'Aria Voss', userHandle: 'ariavoss', email: 'aria@example.com', stripeVerificationId: 'vs_3QbXYZ5678', submittedAt: '2026-05-22T11:30:00Z', status: 'approved', avatarColor: '#9966CC' },
  { id: 'k3', user: 'Marco Reyes', userHandle: 'marcoreyes', email: 'marco@example.com', stripeVerificationId: 'vs_3RcXYZ9012', submittedAt: '2026-05-25T14:00:00Z', status: 'approved', avatarColor: '#2ECC8A' },
  { id: 'k4', user: 'Nour Al-Rashid', userHandle: 'nourar', email: 'nour@example.com', stripeVerificationId: 'vs_3SdXYZ3456', submittedAt: '2026-06-01T08:00:00Z', status: 'approved', avatarColor: '#D4AF37' },
  { id: 'k5', user: 'Tyler Banks', userHandle: 'tylerb', email: 'tyler@example.com', stripeVerificationId: 'vs_3TeXYZ7890', submittedAt: '2026-05-15T16:00:00Z', status: 'approved', avatarColor: '#C0392B' },
  { id: 'k6', user: 'Priya Nair', userHandle: 'priyanair', email: 'priya@example.com', stripeVerificationId: 'vs_3UfXYZ1234', submittedAt: '2026-06-02T10:00:00Z', status: 'pending', avatarColor: '#9B111E' },
  { id: 'k7', user: 'Carlos Duarte', userHandle: 'cduarte', email: 'carlos@example.com', stripeVerificationId: 'vs_3VgXYZ5678', submittedAt: '2026-04-10T12:00:00Z', status: 'rejected', avatarColor: '#48484A' },
  { id: 'k8', user: 'Elena Popov', userHandle: 'elenapopov', email: 'elena@example.com', stripeVerificationId: 'vs_3WhXYZ9012', submittedAt: '2026-06-03T07:30:00Z', status: 'pending', avatarColor: '#9966CC' },
];

export const mockGifts: Gift[] = [
  // Tier 1
  { id: 'g1', emoji: '❤️', name: 'Heart', coins: 5, tier: 1, tierName: 'Chat Gifts', enabled: true },
  { id: 'g2', emoji: '🌹', name: 'Rose', coins: 10, tier: 1, tierName: 'Chat Gifts', enabled: true },
  { id: 'g3', emoji: '🌟', name: 'Star', coins: 8, tier: 1, tierName: 'Chat Gifts', enabled: true },
  { id: 'g4', emoji: '🔥', name: 'Fire', coins: 25, tier: 1, tierName: 'Chat Gifts', enabled: true },
  { id: 'g5', emoji: '⚡', name: 'Bolt', coins: 35, tier: 1, tierName: 'Chat Gifts', enabled: true },
  { id: 'g6', emoji: '👑', name: 'Crown', coins: 100, tier: 1, tierName: 'Chat Gifts', enabled: true },
  { id: 'g7', emoji: '💎', name: 'Diamond', coins: 500, tier: 1, tierName: 'Chat Gifts', enabled: true },
  // Tier 2
  { id: 'g8', emoji: '🎸', name: 'Guitar', coins: 1500, tier: 2, tierName: 'Animated', enabled: true },
  { id: 'g9', emoji: '🚀', name: 'Rocket', coins: 2000, tier: 2, tierName: 'Animated', enabled: true },
  { id: 'g10', emoji: '🦋', name: 'Butterfly', coins: 3000, tier: 2, tierName: 'Animated', enabled: true },
  { id: 'g11', emoji: '🌈', name: 'Rainbow', coins: 4500, tier: 2, tierName: 'Animated', enabled: true },
  { id: 'g12', emoji: '🏆', name: 'Trophy', coins: 8000, tier: 2, tierName: 'Animated', enabled: true },
  // Tier 3
  { id: 'g13', emoji: '🦁', name: 'Lion', coins: 10000, tier: 3, tierName: 'Premium 3D', enabled: true },
  { id: 'g14', emoji: '🦚', name: 'Peacock', coins: 25000, tier: 3, tierName: 'Premium 3D', enabled: true },
  { id: 'g15', emoji: '👸', name: 'Queen', coins: 50000, tier: 3, tierName: 'Premium 3D', enabled: true },
  { id: 'g16', emoji: '🐉', name: 'Dragon', coins: 60000, tier: 3, tierName: 'Premium 3D', enabled: true },
  // Tier 4
  { id: 'g17', emoji: '🚢', name: 'Yacht', coins: 70000, tier: 4, tierName: 'Cinematic', enabled: true },
  { id: 'g18', emoji: '🌌', name: 'Galaxy', coins: 85000, tier: 4, tierName: 'Cinematic', enabled: false },
  { id: 'g19', emoji: '🏰', name: 'Castle', coins: 100000, tier: 4, tierName: 'Cinematic', enabled: true },
];

export const mockLeaderboard: CompetitionEntry[] = [
  { rank: 1, name: 'Sasha Bloom', handle: 'sashabloom', diamondsReceived: 482000, prize: '$750', change: 'same', changeAmount: 0, avatarColor: '#9966CC' },
  { rank: 2, name: 'Aria Voss', handle: 'ariavoss', diamondsReceived: 341200, prize: '$500', change: 'up', changeAmount: 1, avatarColor: '#9966CC' },
  { rank: 3, name: 'Marco Reyes', handle: 'marcoreyes', diamondsReceived: 298700, prize: '$300', change: 'down', changeAmount: 1, avatarColor: '#2ECC8A' },
  { rank: 4, name: 'Nour Al-Rashid', handle: 'nourar', diamondsReceived: 187400, prize: '$200', change: 'up', changeAmount: 2, avatarColor: '#D4AF37' },
  { rank: 5, name: 'Luna Star', handle: 'lunastar', diamondsReceived: 154200, prize: '$150', change: 'same', changeAmount: 0, avatarColor: '#9B111E' },
  { rank: 6, name: 'Kai Rivers', handle: 'kairivs', diamondsReceived: 132800, prize: '$100', change: 'up', changeAmount: 1, avatarColor: '#2ECC8A' },
  { rank: 7, name: 'Zoe Chen', handle: 'zoechen', diamondsReceived: 118500, prize: '$75', change: 'down', changeAmount: 2, avatarColor: '#9966CC' },
  { rank: 8, name: 'Dex Volta', handle: 'dexvolta', diamondsReceived: 98200, prize: '$50', change: 'up', changeAmount: 3, avatarColor: '#D4AF37' },
  { rank: 9, name: 'Maya Sun', handle: 'mayasun', diamondsReceived: 87100, prize: '$50', change: 'same', changeAmount: 0, avatarColor: '#2ECC8A' },
  { rank: 10, name: 'Rio Blaze', handle: 'rioblaze', diamondsReceived: 76400, prize: '$25', change: 'down', changeAmount: 1, avatarColor: '#C0392B' },
];

export const mockPrizeTiers: PrizeTier[] = [
  { rank: 'Rank 1', prize: '$750', type: 'cash' },
  { rank: 'Rank 2', prize: '$500', type: 'cash' },
  { rank: 'Rank 3', prize: '$300', type: 'cash' },
  { rank: 'Rank 4', prize: '$200', type: 'cash' },
  { rank: 'Rank 5', prize: '$150', type: 'cash' },
  { rank: 'Rank 6', prize: '$100', type: 'cash' },
  { rank: 'Rank 7', prize: '$75', type: 'cash' },
  { rank: 'Ranks 8–10', prize: '$50 each', type: 'cash' },
  { rank: 'Ranks 11–20', prize: '$25 each', type: 'cash' },
  { rank: 'Ranks 21–30', prize: 'Exclusive cosmetics', type: 'cosmetic' },
];

export const mockCoinPackages: CoinPackage[] = [
  // IAP — 6 tiers, $4.99 → $199.99 (Apple/Google IAP)
  { id: 'cp1', tier: 1, label: 'Fan',       coins: 500,   price: 4.99,   bonusPercent: 0, bestValue: false, enabled: true, platform: 'iap' },
  { id: 'cp2', tier: 2, label: 'Supporter', coins: 1200,  price: 9.99,   bonusPercent: 0, bestValue: false, enabled: true, platform: 'iap' },
  { id: 'cp3', tier: 3, label: 'Champion',  coins: 3000,  price: 19.99,  bonusPercent: 0, bestValue: true,  enabled: true, platform: 'iap' },
  { id: 'cp4', tier: 4, label: 'Elite',     coins: 7500,  price: 49.99,  bonusPercent: 0, bestValue: false, enabled: true, platform: 'iap' },
  { id: 'cp5', tier: 5, label: 'Legend',    coins: 20000, price: 99.99,  bonusPercent: 0, bestValue: false, enabled: true, platform: 'iap' },
  { id: 'cp6', tier: 6, label: 'Titan',     coins: 45000, price: 199.99, bonusPercent: 0, bestValue: false, enabled: true, platform: 'iap' },
  // Web — 9 tiers, $4.99 → $4,999.99 (30% more coins vs IAP)
  { id: 'cp7',  tier: 1, label: 'Fan+',       coins: 650,    price: 4.99,    bonusPercent: 30, bestValue: false, enabled: true, platform: 'web' },
  { id: 'cp8',  tier: 2, label: 'Supporter+', coins: 1560,   price: 9.99,    bonusPercent: 30, bestValue: false, enabled: true, platform: 'web' },
  { id: 'cp9',  tier: 3, label: 'Champion+',  coins: 3900,   price: 19.99,   bonusPercent: 30, bestValue: true,  enabled: true, platform: 'web' },
  { id: 'cp10', tier: 4, label: 'Elite+',     coins: 9750,   price: 49.99,   bonusPercent: 30, bestValue: false, enabled: true, platform: 'web' },
  { id: 'cp11', tier: 5, label: 'Legend+',    coins: 26000,  price: 99.99,   bonusPercent: 30, bestValue: false, enabled: true, platform: 'web' },
  { id: 'cp12', tier: 6, label: 'Titan+',     coins: 58500,  price: 199.99,  bonusPercent: 30, bestValue: false, enabled: true, platform: 'web' },
  { id: 'cp13', tier: 7, label: 'Elite Pro',  coins: 325000, price: 999.99,  bonusPercent: 30, bestValue: false, enabled: true, platform: 'web' },
  { id: 'cp14', tier: 8, label: 'VIP+',       coins: 1000000,price: 2999.99, bonusPercent: 30, bestValue: false, enabled: true, platform: 'web' },
  { id: 'cp15', tier: 9, label: 'Whale+',     coins: 1950000,price: 4999.99, bonusPercent: 30, bestValue: false, enabled: true, platform: 'web' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Welcome to Loouno Closed Beta!', body: 'You\'re among the first. Explore the app and let us know what you think.', target: 'all', sentAt: '2026-05-01T10:00:00Z', delivered: 847, openRate: 78.2 },
  { id: 'n2', title: 'June Competition Has Begun 🏆', body: 'The June leaderboard is now live. Stream and collect diamonds to compete for cash prizes!', target: 'creators', sentAt: '2026-06-01T09:00:00Z', delivered: 312, openRate: 64.5 },
  { id: 'n3', title: 'New Gift: Dragon 🐉', body: 'The premium Dragon cinematic gift is now available for 60,000 coins.', target: 'all', sentAt: '2026-05-20T14:00:00Z', delivered: 847, openRate: 55.1 },
  { id: 'n4', title: 'Your KYC has been approved', body: 'You can now withdraw your earned diamonds. Minimum withdrawal is 80,000 💎 (~$56 gross).', target: 'specific', sentAt: '2026-06-02T11:30:00Z', delivered: 1, openRate: 100 },
  { id: 'n5', title: 'App Update Available', body: 'Version 1.0.1 is out with performance improvements and bug fixes.', target: 'all', sentAt: '2026-05-28T16:00:00Z', delivered: 847, openRate: 42.3 },
];

export const mockXPLevels: PrestigeXPLevel[] = [
  { level: 1, name: 'Newcomer', color: '#8A8A8E', xpRequired: 0, perks: 'Access to basic chat reactions' },
  { level: 2, name: 'Regular', color: '#2ECC8A', xpRequired: 500, perks: '+ Custom username color (green)' },
  { level: 3, name: 'Fan', color: '#3498DB', xpRequired: 1500, perks: '+ Fan badge on profile' },
  { level: 4, name: 'Supporter', color: '#2980B9', xpRequired: 3500, perks: '+ Priority in creator Q&A queue' },
  { level: 5, name: 'Devotee', color: '#8E44AD', xpRequired: 7500, perks: '+ Animated chat name' },
  { level: 6, name: 'Elite Fan', color: '#9966CC', xpRequired: 15000, perks: '+ Exclusive Devotee badge frame' },
  { level: 7, name: 'Legend', color: '#F39C12', xpRequired: 30000, perks: '+ Legend chat effect on gifts' },
  { level: 8, name: 'Champion', color: '#E67E22', xpRequired: 55000, perks: '+ Champion ring in profile' },
  { level: 9, name: 'Icon', color: '#E74C3C', xpRequired: 90000, perks: '+ VIP lounge access' },
  { level: 10, name: 'Mythic', color: '#C0392B', xpRequired: 140000, perks: '+ Mythic animated profile border' },
  { level: 11, name: 'Cosmic', color: '#9B111E', xpRequired: 200000, perks: '+ Cosmic entrance effect' },
  { level: 12, name: 'Infinity', color: '#D4AF37', xpRequired: 300000, perks: '+ Infinity gold crown badge' },
];

export const mockSPTiers: PrestigeSPTier[] = [
  { tier: 'Bronze', subTier: 'I', spRequired: 0, perks: 'Basic streamer profile badge', color: '#CD7F32' },
  { tier: 'Bronze', subTier: 'II', spRequired: 1000, perks: '+ Tier badge on stream overlay', color: '#CD7F32' },
  { tier: 'Bronze', subTier: 'III', spRequired: 3000, perks: '+ Access to animated overlays Tier 1', color: '#CD7F32' },
  { tier: 'Silver', subTier: 'I', spRequired: 6000, perks: '+ Silver ring on profile', color: '#A8A9AD' },
  { tier: 'Silver', subTier: 'II', spRequired: 12000, perks: '+ Discovery boost (5%)', color: '#A8A9AD' },
  { tier: 'Silver', subTier: 'III', spRequired: 22000, perks: '+ Priority in search results', color: '#A8A9AD' },
  { tier: 'Gold', subTier: 'I', spRequired: 40000, perks: '+ Gold ring + animated badge', color: '#D4AF37' },
  { tier: 'Gold', subTier: 'II', spRequired: 65000, perks: '+ Discovery boost (15%)', color: '#D4AF37' },
  { tier: 'Gold', subTier: 'III', spRequired: 100000, perks: '+ Featured on Discover page', color: '#D4AF37' },
  { tier: 'Platinum', subTier: 'I', spRequired: 150000, perks: '+ Platinum ring + animated particles', color: '#A0B2C6' },
  { tier: 'Platinum', subTier: 'II', spRequired: 220000, perks: '+ 1 monthly Spotlight slot', color: '#A0B2C6' },
  { tier: 'Platinum', subTier: 'III', spRequired: 310000, perks: '+ Exclusive Platinum emote pack', color: '#A0B2C6' },
  { tier: 'Diamond', subTier: 'I', spRequired: 425000, perks: '+ Diamond ring + full-screen entrance', color: '#B9F2FF' },
  { tier: 'Diamond', subTier: 'II', spRequired: 570000, perks: '+ Priority support + 2 Spotlight slots/mo', color: '#B9F2FF' },
  { tier: 'Diamond', subTier: 'III', spRequired: 750000, perks: '+ Diamond confetti gift effect', color: '#B9F2FF' },
  { tier: 'Amethyst', subTier: 'I', spRequired: 1000000, perks: '+ Amethyst ring + 3D entrance animation', color: '#9966CC' },
  { tier: 'Amethyst', subTier: 'II', spRequired: 1400000, perks: '+ Monthly admin interview feature', color: '#9966CC' },
  { tier: 'Amethyst', subTier: 'III', spRequired: 1900000, perks: '+ Amethyst exclusive gift unlocked', color: '#9966CC' },
  { tier: 'Ruby', subTier: 'I', spRequired: 2500000, perks: '+ Ruby ring + cinematic stream intro', color: '#9B111E' },
  { tier: 'Ruby', subTier: 'II', spRequired: 3500000, perks: '+ Co-branded merch drop eligibility', color: '#9B111E' },
  { tier: 'Ruby', subTier: 'III', spRequired: 5000000, perks: '+ Ruby castle gift unlocked', color: '#9B111E' },
  { tier: 'Celestial', subTier: 'I', spRequired: 8000000, perks: '+ Celestial ring + galaxy entrance', color: '#FFD700' },
  { tier: 'Celestial', subTier: 'II', spRequired: 12000000, perks: '+ Personal creator liaison assigned', color: '#FFD700' },
  { tier: 'Celestial', subTier: 'III', spRequired: 20000000, perks: '+ Celestial galaxy gift + lifetime badge', color: '#FFD700' },
  { tier: 'Sovereign', subTier: '', spRequired: 50000000, perks: '+ Custom platform ring color + lifetime VIP Boss', color: '#D4AF37' },
  { tier: 'Sovereign', subTier: '', spRequired: 50000000, perks: 'Unique on the platform — negotiated perks', color: '#D4AF37' },
];

export const mockVIPLevels: VIPLevel[] = [
  { level: 1, name: 'VIP Blue', monthlySpend: 500, badgeColor: '#3498DB', perks: 'Blue VIP badge, priority chat, exclusive emotes Tier 1' },
  { level: 2, name: 'VIP Gold', monthlySpend: 2000, badgeColor: '#D4AF37', perks: '+ Gold VIP badge, gift effects, exclusive frame' },
  { level: 3, name: 'VIP Platinum', monthlySpend: 5000, badgeColor: '#A0B2C6', perks: '+ Platinum badge, animated entrance, chat sparkles' },
  { level: 4, name: 'VIP Diamond', monthlySpend: 15000, badgeColor: '#B9F2FF', perks: '+ Diamond badge, full-screen entrance, private lounge' },
  { level: 5, name: 'Boss VIP Cosmic', monthlySpend: 0, badgeColor: '#9966CC', perks: 'Top monthly spender — cosmic animated badge + custom platform recognition' },
];

export const mockReportReasons: ReportReason[] = [
  { id: 'rr1',  label: 'Explicit sexual content',        appliesTo: 'all',     enabled: true },
  { id: 'rr2',  label: 'Nudity or adult content',        appliesTo: 'stream',  enabled: true },
  { id: 'rr3',  label: 'Harassment or bullying',         appliesTo: 'all',     enabled: true },
  { id: 'rr4',  label: 'Hate speech or discrimination',  appliesTo: 'all',     enabled: true },
  { id: 'rr5',  label: 'Spam or self-promotion',         appliesTo: 'message', enabled: true },
  { id: 'rr6',  label: 'Copyright infringement',         appliesTo: 'stream',  enabled: true },
  { id: 'rr7',  label: 'Misleading stream title',        appliesTo: 'stream',  enabled: true },
  { id: 'rr8',  label: 'Underage user suspicion',        appliesTo: 'user',    enabled: true },
  { id: 'rr9',  label: 'Impersonation',                  appliesTo: 'user',    enabled: true },
  { id: 'rr10', label: 'Violence or dangerous content',  appliesTo: 'all',     enabled: true },
  { id: 'rr11', label: 'Inappropriate username',         appliesTo: 'user',    enabled: true },
  { id: 'rr12', label: 'Soliciting in chat',             appliesTo: 'message', enabled: false },
];

export const mockAdminTeam: AdminMember[] = [
  { id: 'a1', displayName: 'Cyrus', email: 'cyrus@loouno.com', role: 'super_admin', status: 'active', invitedAt: '2025-12-01T00:00:00Z', joinedAt: '2025-12-01T00:00:00Z', avatarColor: '#D4AF37' },
  { id: 'a2', displayName: 'Polina', email: 'polina_m@dataforest.ai', role: 'admin', status: 'active', invitedAt: '2026-01-15T10:00:00Z', joinedAt: '2026-01-16T09:30:00Z', avatarColor: '#9966CC' },
  { id: 'a3', displayName: 'Alex Chen', email: 'alex.chen@loouno.com', role: 'moderator', status: 'active', invitedAt: '2026-02-10T08:00:00Z', joinedAt: '2026-02-11T14:00:00Z', avatarColor: '#2ECC8A' },
  { id: 'a4', displayName: 'Sofia Romano', email: 'sofia.r@loouno.com', role: 'support', status: 'active', invitedAt: '2026-03-01T11:00:00Z', joinedAt: '2026-03-01T15:00:00Z', avatarColor: '#3498DB' },
  { id: 'a5', displayName: '—', email: 'new.mod@example.com', role: 'moderator', status: 'invited', invitedAt: '2026-06-04T09:00:00Z', inviteCode: 'LOOO-X4R2-9KPW', avatarColor: '#48484A' },
];

export const mockWheelPrizes: FortuneWheelPrize[] = [
  { id: 'wp1', label: 'Try Again',     emoji: '💨', type: 'miss',       reward: 0,     probability: 25, color: '#48484A', enabled: true },
  { id: 'wp2', label: '50 Coins',      emoji: '🪙', type: 'coins',      reward: 50,    probability: 20, color: '#3498DB', enabled: true },
  { id: 'wp3', label: '100 Coins',     emoji: '🪙', type: 'coins',      reward: 100,   probability: 15, color: '#2ECC8A', enabled: true },
  { id: 'wp4', label: '250 Coins',     emoji: '🪙', type: 'coins',      reward: 250,   probability: 12, color: '#1ABC9C', enabled: true },
  { id: 'wp5', label: '500 Coins',     emoji: '🪙', type: 'coins',      reward: 500,   probability: 10, color: '#F39C12', enabled: true },
  { id: 'wp6', label: '1,000 Coins',   emoji: '🪙', type: 'coins',      reward: 1000,  probability: 8,  color: '#E67E22', enabled: true },
  { id: 'wp7', label: '2× Multiplier', emoji: '✨', type: 'multiplier', reward: 2,     probability: 4,  color: '#9966CC', enabled: true },
  { id: 'wp8', label: '5,000 Coins',   emoji: '💰', type: 'coins',      reward: 5000,  probability: 3,  color: '#C0392B', enabled: true },
  { id: 'wp9', label: '50 Diamonds',   emoji: '💎', type: 'diamonds',   reward: 50,    probability: 2,  color: '#D4AF37', enabled: true },
  { id: 'wp10', label: '10,000 Coins', emoji: '💰', type: 'coins',      reward: 10000, probability: 1,  color: '#9B111E', enabled: true },
];

export const revenueData = [
  { day: 'Mon', amount: 280 },
  { day: 'Tue', amount: 420 },
  { day: 'Wed', amount: 310 },
  { day: 'Thu', amount: 590 },
  { day: 'Fri', amount: 480 },
  { day: 'Sat', amount: 720 },
  { day: 'Sun', amount: 340 },
];

export const mockFraudAlerts: FraudAlert[] = [
  {
    id: 'fa1',
    withdrawalId: 'w1',
    userId: 'u7',
    user: 'Sasha Bloom',
    userHandle: 'sashabloom',
    email: 'sasha@example.com',
    country: 'DE',
    diamonds: 80000,
    estimatedUSD: 56,
    kycStatus: 'approved',
    requestedAt: '2026-06-03T10:00:00Z',
    status: 'pending',
    avatarColor: '#9966CC',
    joined: '2025-03-28',
    totalEarned: 340000,
    totalStreams: 134,
    followers: 22100,
    walletBalance: 88000,
  },
  {
    id: 'fa2',
    withdrawalId: 'w6',
    userId: 'u1',
    user: 'Aria Voss',
    userHandle: 'ariavoss',
    email: 'aria@example.com',
    country: 'US',
    diamonds: 100000,
    estimatedUSD: 70,
    kycStatus: 'approved',
    requestedAt: '2026-05-28T11:00:00Z',
    status: 'approved',
    avatarColor: '#9966CC',
    joined: '2025-03-12',
    totalEarned: 182000,
    totalStreams: 87,
    followers: 14200,
    walletBalance: 42000,
  },
  {
    id: 'fa3',
    withdrawalId: 'tx8',
    userId: 'u9',
    user: 'Nour Al-Rashid',
    userHandle: 'nourar',
    email: 'nour@example.com',
    country: 'SA',
    diamonds: 120000,
    estimatedUSD: 84,
    kycStatus: 'approved',
    requestedAt: '2026-06-06T09:00:00Z',
    status: 'pending',
    avatarColor: '#D4AF37',
    joined: '2025-04-14',
    totalEarned: 120000,
    totalStreams: 58,
    followers: 6400,
    walletBalance: 31000,
  },
  {
    id: 'fa4',
    withdrawalId: 'tx3',
    userId: 'u7',
    user: 'Sasha Bloom',
    userHandle: 'sashabloom',
    email: 'sasha@example.com',
    country: 'DE',
    diamonds: 200000,
    estimatedUSD: 140,
    kycStatus: 'approved',
    requestedAt: '2026-05-20T10:00:00Z',
    status: 'rejected',
    avatarColor: '#9966CC',
    joined: '2025-03-28',
    totalEarned: 340000,
    totalStreams: 134,
    followers: 22100,
    walletBalance: 88000,
  },
];

export const mockWarnMessages: WarnMessage[] = [
  { id: 'wm1', label: 'Your content violates our community guidelines. Please review them before streaming again.' },
  { id: 'wm2', label: 'Explicit or adult content is not permitted on this platform.' },
  { id: 'wm3', label: 'Harassment and bullying are strictly prohibited. Further violations may result in a ban.' },
  { id: 'wm4', label: 'Your stream title or description was found to be misleading. Please ensure accuracy.' },
  { id: 'wm5', label: 'Spam or self-promotional content in chat is not allowed.' },
  { id: 'wm6', label: 'Hate speech or discriminatory language will not be tolerated on this platform.' },
  { id: 'wm7', label: 'Soliciting other users is prohibited. This is your final warning before account action.' },
];
