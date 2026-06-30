import type {
  User, Stream, Report, WithdrawalRequest, Transaction,
  KYCEntry, Gift, CompetitionEntry, PrizeTier, CoinPackage,
  Notification, PrestigeXPLevel, PrestigeCPTier, VIPLevel, Perk,
  AdminMember, ReportReason, FraudAlert, WarnMessage, SeasonalWheel, ActionLogEntry, StreamCategory,
} from './types';

export const mockUsers: User[] = [
  { id: 'u1',  displayName: 'Aria Voss',      handle: 'ariavoss',    email: 'aria@example.com',  role: 'viewer', status: 'active',    joined: '2025-03-12', followers: 14200, kyc: 'approved',       country: 'US', walletBalance: 42000,  totalEarned: 182000, totalStreams: 87,  avatarColor: '#9966CC', isTopStreamer: true },
  { id: 'u2',  displayName: 'Marco Reyes',    handle: 'marcoreyes',  email: 'marco@example.com', role: 'viewer', status: 'active',    joined: '2025-04-01', followers: 8750,  kyc: 'approved',       country: 'MX', walletBalance: 18000,  totalEarned: 74000,  totalStreams: 43,  avatarColor: '#2ECC8A', isTopStreamer: true },
  { id: 'u3',  displayName: 'Jade Kim',       handle: 'jadekim',     email: 'jade@example.com',  role: 'viewer', status: 'active',    joined: '2025-05-20', followers: 320,   kyc: 'not_submitted',  country: 'KR', walletBalance: 5500,   totalEarned: 0,      totalStreams: 0,   avatarColor: '#D4AF37' },
  { id: 'u4',  displayName: 'Tyler Banks',    handle: 'tylerb',      email: 'tyler@example.com', role: 'viewer', status: 'suspended', joined: '2025-02-15', followers: 3100,  kyc: 'approved',       country: 'US', walletBalance: 0,      totalEarned: 28000,  totalStreams: 22,  avatarColor: '#C0392B', isTopStreamer: true, log: [{ id: 'ul1', action: 'warned', adminName: 'Super Admin', timestamp: '2026-05-28T10:00:00Z', note: 'Spam in Chat' }, { id: 'ul2', action: 'suspended', adminName: 'Super Admin', timestamp: '2026-05-29T20:00:00Z', note: 'Repeated policy violations' }] as ActionLogEntry[] },
  { id: 'u5',  displayName: 'Priya Nair',     handle: 'priyanair',   email: 'priya@example.com', role: 'viewer', status: 'active',    joined: '2025-06-01', followers: 88,    kyc: 'pending',        country: 'IN', walletBalance: 1200,   totalEarned: 0,      totalStreams: 0,   avatarColor: '#9B111E' },
  { id: 'u6',  displayName: 'Carlos Duarte',  handle: 'cduarte',     email: 'carlos@example.com',role: 'viewer', status: 'banned',    joined: '2025-01-08', followers: 560,   kyc: 'rejected',       country: 'BR', walletBalance: 0,      totalEarned: 4200,   totalStreams: 11,  avatarColor: '#48484A', isIPBanned: true },
  { id: 'u7',  displayName: 'Sasha Bloom',    handle: 'sashabloom',  email: 'sasha@example.com', role: 'viewer', status: 'active',    joined: '2025-03-28', followers: 22100, kyc: 'approved',       country: 'DE', walletBalance: 88000,  totalEarned: 340000, totalStreams: 134, avatarColor: '#9966CC', isTopStreamer: true },
  { id: 'u8',  displayName: "Finn O'Brien",   handle: 'finno',       email: 'finn@example.com',  role: 'viewer', status: 'active', joined: '2025-05-30', followers: 0,    kyc: 'not_submitted',  country: 'IE', walletBalance: 0,      totalEarned: 0,      totalStreams: 0,   avatarColor: '#2ECC8A' },
  { id: 'u9',  displayName: 'Nour Al-Rashid', handle: 'nourar',      email: 'nour@example.com',  role: 'viewer', status: 'active',    joined: '2025-04-14', followers: 6400,  kyc: 'approved',       country: 'SA', walletBalance: 31000,  totalEarned: 120000, totalStreams: 58,  avatarColor: '#D4AF37', isTopStreamer: true },
  { id: 'u10', displayName: 'Elena Popov',    handle: 'elenapopov',  email: 'elena@example.com', role: 'viewer', status: 'active',    joined: '2025-05-05', followers: 210,   kyc: 'not_submitted',  country: 'RU', walletBalance: 800,    totalEarned: 0,      totalStreams: 0,   avatarColor: '#9966CC' },
];

export const mockStreams: Stream[] = [
  { id: 's1', streamer: 'Sasha Bloom',    streamerHandle: 'sashabloom', title: 'Late Night Chill Vibes',    category: 'Just Chatting', viewers: 1842, peakViewers: 2100, duration: '2h 14m', diamondsEarned: 48200,  status: 'live',       startedAt: '2026-06-03T21:00:00Z', avatarColor: '#9966CC' },
  { id: 's2', streamer: 'Aria Voss',      streamerHandle: 'ariavoss',   title: 'Dance Practice + Q&A',      category: 'Performance',   viewers: 934,  peakViewers: 1200, duration: '1h 07m', diamondsEarned: 22100,  status: 'live',       startedAt: '2026-06-03T21:45:00Z', avatarColor: '#9966CC' },
  { id: 's3', streamer: 'Nour Al-Rashid', streamerHandle: 'nourar',     title: 'Cooking With Nour',         category: 'Lifestyle',     viewers: 420,  peakViewers: 610,  duration: '45m',    diamondsEarned: 8800,   status: 'live',       startedAt: '2026-06-03T22:10:00Z', avatarColor: '#D4AF37' },
  { id: 's4', streamer: 'Marco Reyes',    streamerHandle: 'marcoreyes', title: 'Guitar Covers All Night',   category: 'Music',         viewers: 711,  peakViewers: 890,  duration: '3h 02m', diamondsEarned: 31400,  status: 'live',       startedAt: '2026-06-03T20:00:00Z', avatarColor: '#2ECC8A' },
  { id: 's5', streamer: 'Sasha Bloom',    streamerHandle: 'sashabloom', title: 'Sunday Morning Chat',       category: 'Just Chatting', viewers: 0,    peakViewers: 3400, duration: '1h 55m', diamondsEarned: 71000,  status: 'ended',      startedAt: '2026-06-01T10:00:00Z', endedAt: '2026-06-01T11:55:00Z', avatarColor: '#9966CC' },
  { id: 's6', streamer: 'Tyler Banks',    streamerHandle: 'tylerb',     title: 'Freestyle Rap Session',     category: 'Music',         viewers: 0,    peakViewers: 1100, duration: '58m',    diamondsEarned: 14200,  status: 'terminated', startedAt: '2026-05-29T18:30:00Z', endedAt: '2026-05-29T19:28:00Z', avatarColor: '#C0392B', log: [{ id: 'sl1', action: 'warned', adminName: 'Super Admin', timestamp: '2026-05-29T18:45:00Z', note: 'Community Guidelines Violation' }, { id: 'sl2', action: 'terminated', adminName: 'Super Admin', timestamp: '2026-05-29T19:28:00Z', note: 'Repeated violation after warning' }] as ActionLogEntry[] },
  { id: 's7', streamer: 'Aria Voss',      streamerHandle: 'ariavoss',   title: 'Makeup Tutorial GRWM',      category: 'Beauty',        viewers: 0,    peakViewers: 1750, duration: '2h 30m', diamondsEarned: 55000,  status: 'ended',      startedAt: '2026-05-31T15:00:00Z', endedAt: '2026-05-31T17:30:00Z', avatarColor: '#9966CC' },
  { id: 's8', streamer: 'Marco Reyes',    streamerHandle: 'marcoreyes', title: 'VS Battle Night',           category: 'Battle',        viewers: 0,    peakViewers: 2800, duration: '2h 10m', diamondsEarned: 98400,  status: 'ended',      startedAt: '2026-05-30T20:00:00Z', endedAt: '2026-05-30T22:10:00Z', avatarColor: '#2ECC8A' },
];

export const mockStreamCategories: StreamCategory[] = [
  { id: 'cat1', name: 'Just Chatting', enabled: true },
  { id: 'cat2', name: 'Performance',   enabled: true },
  { id: 'cat3', name: 'Lifestyle',     enabled: true },
  { id: 'cat4', name: 'Music',         enabled: true },
  { id: 'cat5', name: 'Beauty',        enabled: true },
  { id: 'cat6', name: 'Battle',        enabled: true },
];

export const mockReports: Report[] = [
  { id: 'r1',  reporter: 'jade@example.com',   reporterHandle: 'jadekim',    type: 'stream',  target: 'Tyler Banks',    targetHandle: 'tylerb',      reason: 'Explicit Content',                      description: 'During the stream the user repeatedly used extreme profanity and briefly exposed themselves to the camera around the 47-minute mark. Several viewers left comments flagging the moment.',  reportedAt: '2026-06-03T19:12:00Z', status: 'pending' },
  { id: 'r2',  reporter: 'elena@example.com',  reporterHandle: 'elenapopov', type: 'user',    target: 'Carlos Duarte',  targetHandle: 'cduarte',     reason: 'Harassment or Bullying',                description: 'Reporter received a series of unsolicited DMs containing threats and insults after declining to follow the user. Screenshots were attached in the original report.',                      reportedAt: '2026-06-03T17:40:00Z', status: 'resolved' },
  { id: 'r3',  reporter: 'priya@example.com',  reporterHandle: 'priyanair',  type: 'message', target: 'Tyler Banks',    targetHandle: 'tylerb',      reason: 'Spam in Chat',                          description: 'The user flooded a live stream chat with repeated identical promotional messages linking to an external site. Approximately 40 messages were sent within 3 minutes.',                   reportedAt: '2026-06-03T16:55:00Z', status: 'pending' },
  { id: 'r4',  reporter: 'finn@example.com',   reporterHandle: 'finno',      type: 'stream',  target: 'Aria Voss',      targetHandle: 'ariavoss',    reason: 'Community Guidelines Violation',        description: 'The entire 2.5-hour stream used commercially licensed background music without apparent permission. Reporter noted this has happened in at least two previous streams.',               reportedAt: '2026-06-02T22:30:00Z', status: 'dismissed' },
  { id: 'r5',  reporter: 'marco@example.com',  reporterHandle: 'marcoreyes', type: 'user',    target: 'Carlos Duarte',  targetHandle: 'cduarte',     reason: 'Community Guidelines Violation',        description: 'The account profile photo and display name closely mimic a verified creator. Several users reportedly mistook the account for the real creator and sent gifts.',                       reportedAt: '2026-06-02T14:10:00Z', status: 'resolved' },
  { id: 'r6',  reporter: 'aria@example.com',   reporterHandle: 'ariavoss',   type: 'message', target: "Finn O'Brien",   targetHandle: 'finno',       reason: 'Harassment or Bullying',                description: 'User posted several sexually suggestive comments directed at the streamer in the live chat. The streamer manually deleted some but the user continued posting.',                       reportedAt: '2026-06-02T11:00:00Z', status: 'pending' },
  { id: 'r7',  reporter: 'tyler@example.com',  reporterHandle: 'tylerb',     type: 'stream',  target: 'Sasha Bloom',    targetHandle: 'sashabloom',  reason: 'Misleading Content',                    description: "Reporter believes this report was submitted in bad faith to disrupt a competing streamer's broadcast. The reported stream contained no policy-violating content.",                    reportedAt: '2026-06-01T20:00:00Z', status: 'dismissed' },
  { id: 'r8',  reporter: 'nour@example.com',   reporterHandle: 'nourar',     type: 'user',    target: 'Priya Nair',     targetHandle: 'priyanair',   reason: 'Community Guidelines Violation',        description: 'The account shows unusual activity patterns: 800 follows added within 15 minutes, comment posts at a rate inconsistent with human input. The account was created 4 days ago.',          reportedAt: '2026-06-01T09:30:00Z', status: 'pending' },
  { id: 'r9',  reporter: 'sasha@example.com',  reporterHandle: 'sashabloom', type: 'message', target: 'Marco Reyes',    targetHandle: 'marcoreyes',  reason: 'Solicitation â€” Final Warning',          description: 'User posted repeated messages asking viewers to send payments to an external platform in exchange for exclusive content. Included a link to a third-party payment page.',               reportedAt: '2026-05-31T21:15:00Z', status: 'resolved' },
  { id: 'r10', reporter: 'jade@example.com',   reporterHandle: 'jadekim',    type: 'user',    target: 'Elena Popov',    targetHandle: 'elenapopov',  reason: 'Community Guidelines Violation',        description: "The user's profile indicates they are 14 years old. They have been present in 18+ tagged streams. Reporter noted the profile birthday was entered as 2011. KYC has not been completed.", reportedAt: '2026-05-31T18:00:00Z', status: 'pending' },
  { id: 'r11', reporter: 'carlos@example.com', reporterHandle: 'cduarte',    type: 'stream',  target: 'Nour Al-Rashid', targetHandle: 'nourar',      reason: 'Misleading Content',                    description: 'Stream was titled "GIVEAWAY â€” 10,000 coins to random viewer!" but no giveaway took place. The streamer dismissed complaints and ended the stream without acknowledgment.',             reportedAt: '2026-05-30T15:45:00Z', status: 'dismissed' },
  { id: 'r12', reporter: 'priya@example.com',  reporterHandle: 'priyanair',  type: 'message', target: 'Sasha Bloom',    targetHandle: 'sashabloom',  reason: 'Hate Speech',                           description: 'User combined platform emotes in sequences that formed offensive phrases. The combinations circumvent the standard text filter. Multiple other viewers flagged the same behaviour.',    reportedAt: '2026-05-30T12:20:00Z', status: 'resolved' },
];

export const mockWithdrawals: WithdrawalRequest[] = [
  { id: 'w1',  user: 'Sasha Bloom',    userHandle: 'sashabloom',  diamonds: 80000,  estimatedUSD: 280,    kycStatus: 'approved', requestedAt: '2026-06-03T10:00:00Z', holdUntil: '2026-06-10T10:00:00Z', status: 'pending',  avatarColor: '#9966CC' },
  { id: 'w2',  user: 'Aria Voss',      userHandle: 'ariavoss',    diamonds: 50000,  estimatedUSD: 175,    kycStatus: 'approved', requestedAt: '2026-06-02T14:30:00Z', holdUntil: '2026-06-09T14:30:00Z', status: 'pending',  avatarColor: '#9966CC' },
  { id: 'w3',  user: 'Marco Reyes',    userHandle: 'marcoreyes',  diamonds: 30000,  estimatedUSD: 105,    kycStatus: 'approved', requestedAt: '2026-06-01T09:00:00Z', holdUntil: '2026-06-08T09:00:00Z', status: 'approved', avatarColor: '#2ECC8A', reviewedBy: 'Anna K.',    reviewedAt: '2026-06-02T10:15:00Z' },
  { id: 'w4',  user: 'Nour Al-Rashid', userHandle: 'nourar',      diamonds: 20000,  estimatedUSD: 70,     kycStatus: 'approved', requestedAt: '2026-06-01T16:15:00Z', holdUntil: '2026-06-08T16:15:00Z', status: 'pending',  avatarColor: '#D4AF37' },
  { id: 'w5',  user: 'Tyler Banks',    userHandle: 'tylerb',      diamonds: 15000,  estimatedUSD: 52.50,  kycStatus: 'approved', requestedAt: '2026-05-29T20:00:00Z', holdUntil: '2026-06-05T20:00:00Z', status: 'rejected', avatarColor: '#C0392B', reviewedBy: 'Polina M.',  reviewedAt: '2026-05-30T09:40:00Z' },
  { id: 'w6',  user: 'Aria Voss',      userHandle: 'ariavoss',    diamonds: 100000, estimatedUSD: 350,    kycStatus: 'approved', requestedAt: '2026-05-28T11:00:00Z', holdUntil: '2026-06-04T11:00:00Z', status: 'approved', avatarColor: '#9966CC', reviewedBy: 'Dmitri V.',  reviewedAt: '2026-05-29T14:20:00Z' },
  { id: 'w7',  user: 'Luna Star',      userHandle: 'lunastar',    diamonds: 45000,  estimatedUSD: 157.50, kycStatus: 'approved', requestedAt: '2026-05-27T08:00:00Z', holdUntil: '2026-06-03T08:00:00Z', status: 'approved', avatarColor: '#9B111E', reviewedBy: 'Anna K.',    reviewedAt: '2026-05-28T11:05:00Z' },
  { id: 'w8',  user: 'Kai Rivers',     userHandle: 'kairivs',     diamonds: 22000,  estimatedUSD: 77,     kycStatus: 'approved', requestedAt: '2026-05-26T17:30:00Z', holdUntil: '2026-06-02T17:30:00Z', status: 'pending',  avatarColor: '#2ECC8A' },
  { id: 'w9',  user: 'Zoe Chen',       userHandle: 'zoechen',     diamonds: 60000,  estimatedUSD: 210,    kycStatus: 'approved', requestedAt: '2026-05-25T12:00:00Z', holdUntil: '2026-06-01T12:00:00Z', status: 'rejected', avatarColor: '#9966CC', reviewedBy: 'Polina M.',  reviewedAt: '2026-05-26T16:30:00Z' },
  { id: 'w10', user: 'Dex Volta',      userHandle: 'dexvolta',    diamonds: 35000,  estimatedUSD: 122.50, kycStatus: 'approved', requestedAt: '2026-05-24T09:45:00Z', holdUntil: '2026-05-31T09:45:00Z', status: 'approved', avatarColor: '#D4AF37', reviewedBy: 'Dmitri V.',  reviewedAt: '2026-05-25T10:00:00Z' },
  { id: 'w11', user: 'Maya Sun',       userHandle: 'mayasun',     diamonds: 12000,  estimatedUSD: 42,     kycStatus: 'pending',  requestedAt: '2026-05-23T15:20:00Z', holdUntil: '2026-05-30T15:20:00Z', status: 'pending',  avatarColor: '#2ECC8A' },
  { id: 'w12', user: 'Rio Blaze',      userHandle: 'rioblaze',    diamonds: 18000,  estimatedUSD: 63,     kycStatus: 'approved', requestedAt: '2026-05-22T11:00:00Z', holdUntil: '2026-05-29T11:00:00Z', status: 'approved', avatarColor: '#C0392B', reviewedBy: 'Anna K.',    reviewedAt: '2026-05-23T13:45:00Z' },
  { id: 'w13', user: 'Priya Nair',     userHandle: 'priyanair',   diamonds: 55000,  estimatedUSD: 192.50, kycStatus: 'approved', requestedAt: '2026-05-21T14:00:00Z', holdUntil: '2026-05-28T14:00:00Z', status: 'rejected', avatarColor: '#9B111E', reviewedBy: 'Dmitri V.',  reviewedAt: '2026-05-22T09:10:00Z' },
  { id: 'w14', user: 'Carlos Duarte',  userHandle: 'cduarte',     diamonds: 25000,  estimatedUSD: 87.50,  kycStatus: 'rejected', requestedAt: '2026-05-20T10:30:00Z', holdUntil: '2026-05-27T10:30:00Z', status: 'rejected', avatarColor: '#48484A', reviewedBy: 'Polina M.',  reviewedAt: '2026-05-21T08:55:00Z' },
  { id: 'w15', user: 'Elena Popov',    userHandle: 'elenapopov',  diamonds: 40000,  estimatedUSD: 140,    kycStatus: 'approved', requestedAt: '2026-05-19T16:00:00Z', holdUntil: '2026-05-26T16:00:00Z', status: 'approved', avatarColor: '#9966CC', reviewedBy: 'Anna K.',    reviewedAt: '2026-05-20T17:20:00Z' },
  { id: 'w16', user: 'Jade Kim',       userHandle: 'jadekim',     diamonds: 10000,  estimatedUSD: 35,     kycStatus: 'approved', requestedAt: '2026-05-18T09:00:00Z', holdUntil: '2026-05-25T09:00:00Z', status: 'approved', avatarColor: '#D4AF37', reviewedBy: 'Dmitri V.',  reviewedAt: '2026-05-19T10:30:00Z' },
  { id: 'w17', user: 'Finn O\'Brien',  userHandle: 'finno',       diamonds: 75000,  estimatedUSD: 262.50, kycStatus: 'approved', requestedAt: '2026-05-17T13:30:00Z', holdUntil: '2026-05-24T13:30:00Z', status: 'pending',  avatarColor: '#3498DB' },
  { id: 'w18', user: 'Sasha Bloom',    userHandle: 'sashabloom',  diamonds: 120000, estimatedUSD: 420,    kycStatus: 'approved', requestedAt: '2026-05-16T08:00:00Z', holdUntil: '2026-05-23T08:00:00Z', status: 'approved', avatarColor: '#9966CC', reviewedBy: 'Polina M.',  reviewedAt: '2026-05-17T11:00:00Z' },
  { id: 'w19', user: 'Marco Reyes',    userHandle: 'marcoreyes',  diamonds: 11000,  estimatedUSD: 38.50,  kycStatus: 'approved', requestedAt: '2026-05-15T18:45:00Z', holdUntil: '2026-05-22T18:45:00Z', status: 'rejected', avatarColor: '#2ECC8A', reviewedBy: 'Anna K.',    reviewedAt: '2026-05-16T09:00:00Z' },
  { id: 'w20', user: 'Nour Al-Rashid', userHandle: 'nourar',      diamonds: 90000,  estimatedUSD: 315,    kycStatus: 'approved', requestedAt: '2026-05-14T11:15:00Z', holdUntil: '2026-05-21T11:15:00Z', status: 'approved', avatarColor: '#D4AF37', reviewedBy: 'Dmitri V.',  reviewedAt: '2026-05-15T14:50:00Z' },
  { id: 'w21', user: 'Luna Star',      userHandle: 'lunastar',    diamonds: 33000,  estimatedUSD: 115.50, kycStatus: 'approved', requestedAt: '2026-05-13T14:00:00Z', holdUntil: '2026-05-20T14:00:00Z', status: 'pending',  avatarColor: '#9B111E' },
  { id: 'w22', user: 'Kai Rivers',     userHandle: 'kairivs',     diamonds: 48000,  estimatedUSD: 168,    kycStatus: 'approved', requestedAt: '2026-05-12T09:30:00Z', holdUntil: '2026-05-19T09:30:00Z', status: 'approved', avatarColor: '#2ECC8A', reviewedBy: 'Polina M.',  reviewedAt: '2026-05-13T10:15:00Z' },
];

export const mockTransactions: Transaction[] = [
  { id: 't1',  user: 'Jade Kim',       userHandle: 'jadekim',    type: 'coin_purchase',    amount: 9.99,   currency: 'USD',      date: '2026-06-03T20:10:00Z', note: '2,000 coins via App Store' },
  { id: 't2',  user: 'Elena Popov',    userHandle: 'elenapopov', type: 'coin_purchase',    amount: 9.99,   currency: 'USD',      date: '2026-06-03T19:45:00Z', note: '1,400 coins via Play Store' },
  { id: 't4',  user: 'Sasha Bloom',    userHandle: 'sashabloom', type: 'diamonds_received', amount: 60000,  currency: 'diamonds', date: '2026-06-03T19:30:00Z', note: 'Diamond Storm gift from @priyanair' },
  { id: 't5',  user: 'Sasha Bloom',    userHandle: 'sashabloom', type: 'withdrawal',        amount: 80000,  currency: 'diamonds', date: '2026-06-03T10:00:00Z', note: 'Withdrawal request Â· est. $280' },
  { id: 't6',  user: 'Marco Reyes',    userHandle: 'marcoreyes', type: 'withdrawal',        amount: 30000,  currency: 'diamonds', date: '2026-06-01T09:00:00Z', note: 'Withdrawal approved Â· $105' },
  { id: 't7',  user: "Finn O'Brien",   userHandle: 'finno',      type: 'coin_purchase',    amount: 9.99,   currency: 'USD',      date: '2026-06-01T08:00:00Z', note: '1,400 coins via App Store' },
  { id: 't9',  user: 'Aria Voss',      userHandle: 'ariavoss',   type: 'diamonds_received', amount: 8000,   currency: 'diamonds', date: '2026-05-31T22:10:00Z', note: 'Rocket gift from @jadekim' },
  { id: 'tx1', user: 'Sasha Bloom',    userHandle: 'sashabloom', type: 'diamonds_received', amount: 100000, currency: 'diamonds', date: '2026-05-30T21:00:00Z', note: 'Cosmic Castle gift from @whalekid during Sunday stream' },
  { id: 'tx2', user: 'Sasha Bloom',    userHandle: 'sashabloom', type: 'diamonds_received', amount: 70000,  currency: 'diamonds', date: '2026-05-25T18:30:00Z', note: 'Royal Yacht gift from @topfan99' },
  { id: 'tx3', user: 'Sasha Bloom',    userHandle: 'sashabloom', type: 'withdrawal',        amount: 200000, currency: 'diamonds', date: '2026-05-20T10:00:00Z', note: 'Withdrawal est. $700 â€” flagged & rejected' },
  { id: 'tx4', user: 'Aria Voss',      userHandle: 'ariavoss',   type: 'withdrawal',        amount: 100000, currency: 'diamonds', date: '2026-05-28T11:00:00Z', note: 'Withdrawal est. $350 â€” flagged & approved' },
  { id: 'tx5', user: 'Aria Voss',      userHandle: 'ariavoss',   type: 'diamonds_received', amount: 55000,  currency: 'diamonds', date: '2026-05-27T20:00:00Z', note: 'Royal Fortress gift during GRWM stream' },
  { id: 'tx6', user: 'Aria Voss',      userHandle: 'ariavoss',   type: 'diamonds_received', amount: 22100,  currency: 'diamonds', date: '2026-05-20T17:00:00Z', note: 'Multiple gifts â€” Q&A session' },
  { id: 'tx7', user: 'Nour Al-Rashid', userHandle: 'nourar',     type: 'diamonds_received', amount: 120000, currency: 'diamonds', date: '2026-06-05T20:00:00Z', note: 'Nebula Nova + Cosmic Castle during cooking stream' },
  { id: 'tx8', user: 'Nour Al-Rashid', userHandle: 'nourar',     type: 'withdrawal',        amount: 120000, currency: 'diamonds', date: '2026-06-06T09:00:00Z', note: 'Withdrawal est. $420 â€” flagged' },
  { id: 'tx9', user: 'Nour Al-Rashid', userHandle: 'nourar',     type: 'diamonds_received', amount: 8800,   currency: 'diamonds', date: '2026-06-03T22:10:00Z', note: 'Regular viewer gifts during stream' },
  { id: 'tx10',user: 'Nour Al-Rashid', userHandle: 'nourar',     type: 'diamonds_received', amount: 31400,  currency: 'diamonds', date: '2026-05-30T20:00:00Z', note: 'VS Battle night gifts' },
  { id: 'tx11',user: 'Jade Kim',       userHandle: 'jadekim',    type: 'coin_purchase',    amount: 19.99,  currency: 'USD',      date: '2026-05-28T14:00:00Z', note: '4,000 coins via App Store' },
  { id: 'tx12',user: 'Elena Popov',    userHandle: 'elenapopov', type: 'coin_purchase',    amount: 9.99,   currency: 'USD',      date: '2026-05-25T11:00:00Z', note: '1,400 coins via Play Store' },
];

export const mockKYC: KYCEntry[] = [
  { id: 'k1', user: 'Sasha Bloom',    userHandle: 'sashabloom', email: 'sasha@example.com',  stripeVerificationId: 'vs_3PaXYZ1234', submittedAt: '2026-05-20T09:00:00Z', status: 'approved', avatarColor: '#9966CC' },
  { id: 'k2', user: 'Aria Voss',      userHandle: 'ariavoss',   email: 'aria@example.com',   stripeVerificationId: 'vs_3QbXYZ5678', submittedAt: '2026-05-22T11:30:00Z', status: 'approved', avatarColor: '#9966CC' },
  { id: 'k3', user: 'Marco Reyes',    userHandle: 'marcoreyes', email: 'marco@example.com',  stripeVerificationId: 'vs_3RcXYZ9012', submittedAt: '2026-05-25T14:00:00Z', status: 'approved', avatarColor: '#2ECC8A' },
  { id: 'k4', user: 'Nour Al-Rashid', userHandle: 'nourar',     email: 'nour@example.com',   stripeVerificationId: 'vs_3SdXYZ3456', submittedAt: '2026-06-01T08:00:00Z', status: 'approved', avatarColor: '#D4AF37' },
  { id: 'k5', user: 'Tyler Banks',    userHandle: 'tylerb',     email: 'tyler@example.com',  stripeVerificationId: 'vs_3TeXYZ7890', submittedAt: '2026-05-15T16:00:00Z', status: 'approved', avatarColor: '#C0392B' },
  { id: 'k6', user: 'Priya Nair',     userHandle: 'priyanair',  email: 'priya@example.com',  stripeVerificationId: 'vs_3UfXYZ1234', submittedAt: '2026-06-02T10:00:00Z', status: 'pending',  avatarColor: '#9B111E' },
  { id: 'k7', user: 'Carlos Duarte',  userHandle: 'cduarte',    email: 'carlos@example.com', stripeVerificationId: 'vs_3VgXYZ5678', submittedAt: '2026-04-10T12:00:00Z', status: 'rejected', avatarColor: '#48484A' },
  { id: 'k8', user: 'Elena Popov',    userHandle: 'elenapopov', email: 'elena@example.com',  stripeVerificationId: 'vs_3WhXYZ9012', submittedAt: '2026-06-03T07:30:00Z', status: 'pending',  avatarColor: '#9966CC' },
];

export const mockGifts: Gift[] = [
  // 5A â€” Reaction / Meme / Chat (1â€“2s, 10â€“500 coins)
  { id: 'g1',  animationFileName: 'thumbs_up.json',    name: 'Thumbs Up',     coins: 10,  tier: '5A', tierName: 'Reaction / Meme', durationSec: 1,  enabled: true  },
  { id: 'g2',  animationFileName: 'heart.json',         name: 'Heart',         coins: 25,  tier: '5A', tierName: 'Reaction / Meme', durationSec: 1,  enabled: true  },
  { id: 'g3',  animationFileName: 'clap.json',          name: 'Clap',          coins: 50,  tier: '5A', tierName: 'Reaction / Meme', durationSec: 2,  enabled: true  },
  { id: 'g4',  animationFileName: 'lol.json',           name: 'LOL',           coins: 100, tier: '5A', tierName: 'Reaction / Meme', durationSec: 2,  enabled: true  },
  { id: 'g5',  animationFileName: 'fire.json',          name: 'Fire',          coins: 250, tier: '5A', tierName: 'Reaction / Meme', durationSec: 2,  enabled: true  },
  { id: 'g6',  animationFileName: 'diamond_spark.json', name: 'Diamond Spark', coins: 500, tier: '5A', tierName: 'Reaction / Meme', durationSec: 2,  enabled: true  },
  // 5B â€” Mid-Tier (3â€“5s, 300â€“3,000 coins)
  { id: 'g7',  animationFileName: 'rocket.glb',         name: 'Rocket',        coins: 300,  tier: '5B', tierName: 'Mid-Tier', durationSec: 3,  enabled: true  },
  { id: 'g8',  animationFileName: 'confetti.glb',       name: 'Confetti',      coins: 800,  tier: '5B', tierName: 'Mid-Tier', durationSec: 4,  enabled: true  },
  { id: 'g9',  animationFileName: 'shooting_star.glb',  name: 'Shooting Star', coins: 1500, tier: '5B', tierName: 'Mid-Tier', durationSec: 4,  enabled: true  },
  { id: 'g10', animationFileName: 'crystal_ball.glb',   name: 'Crystal Ball',  coins: 3000, tier: '5B', tierName: 'Mid-Tier', durationSec: 5,  enabled: true  },
  // 5C â€” Premium 3D (6â€“10s, 8,000â€“70,000 coins)
  { id: 'g11', animationFileName: 'golden_dragon.glb',  name: 'Golden Dragon',   coins: 8000,  tier: '5C', tierName: 'Premium 3D', durationSec: 6,  enabled: true  },
  { id: 'g12', animationFileName: 'rainbow_phoenix.glb',name: 'Rainbow Phoenix',  coins: 20000, tier: '5C', tierName: 'Premium 3D', durationSec: 8,  enabled: true  },
  { id: 'g13', animationFileName: 'crystal_palace.glb', name: 'Crystal Palace',   coins: 45000, tier: '5C', tierName: 'Premium 3D', durationSec: 9,  enabled: true  },
  { id: 'g14', animationFileName: 'royal_yacht.glb',    name: 'Royal Yacht',      coins: 70000, tier: '5C', tierName: 'Premium 3D', durationSec: 10, enabled: true  },
  // 5D â€” Cinematic / Whale (12â€“15s, 90,000â€“150,000 coins)
  { id: 'g15', animationFileName: 'diamond_storm.glb',  name: 'Diamond Storm',    coins: 90000,  tier: '5D', tierName: 'Cinematic / Whale', durationSec: 12, enabled: true  },
  { id: 'g16', animationFileName: 'galactic_explosion.glb', name: 'Galactic Explosion', coins: 120000, tier: '5D', tierName: 'Cinematic / Whale', durationSec: 14, enabled: true  },
  { id: 'g17', animationFileName: 'cosmic_castle.glb',  name: 'Cosmic Castle',    coins: 150000, tier: '5D', tierName: 'Cinematic / Whale', durationSec: 15, enabled: false },
  // 5E â€” VIP / Max Cap (16â€“20s, 175,000â€“300,000 coins)
  { id: 'g18', animationFileName: 'royal_fortress.glb', name: 'Royal Fortress',   coins: 175000, tier: '5E', tierName: 'VIP / Max Cap', durationSec: 16, enabled: true  },
  { id: 'g19', animationFileName: 'nebula_nova.glb',    name: 'Nebula Nova',      coins: 200000, tier: '5E', tierName: 'VIP / Max Cap', durationSec: 18, enabled: true  },
  { id: 'g20', animationFileName: 'infinity_crown.glb', name: 'Infinity Crown',   coins: 300000, tier: '5E', tierName: 'VIP / Max Cap', durationSec: 20, enabled: true  },
];

export const mockLeaderboard: CompetitionEntry[] = [
  { rank: 1,  name: 'Sasha Bloom',    handle: 'sashabloom', diamondsReceived: 482000, prize: '750,000 ðŸ’Ž',  change: 'same', changeAmount: 0, avatarColor: '#9966CC' },
  { rank: 2,  name: 'Aria Voss',      handle: 'ariavoss',   diamondsReceived: 341200, prize: '500,000 ðŸ’Ž',  change: 'up',   changeAmount: 1, avatarColor: '#9966CC' },
  { rank: 3,  name: 'Marco Reyes',    handle: 'marcoreyes', diamondsReceived: 298700, prize: '300,000 ðŸ’Ž',  change: 'down', changeAmount: 1, avatarColor: '#2ECC8A' },
  { rank: 4,  name: 'Nour Al-Rashid', handle: 'nourar',     diamondsReceived: 187400, prize: '200,000 ðŸ’Ž',  change: 'up',   changeAmount: 2, avatarColor: '#D4AF37' },
  { rank: 5,  name: 'Luna Star',      handle: 'lunastar',   diamondsReceived: 154200, prize: '150,000 ðŸ’Ž',  change: 'same', changeAmount: 0, avatarColor: '#9B111E' },
  { rank: 6,  name: 'Kai Rivers',     handle: 'kairivs',    diamondsReceived: 132800, prize: '100,000 ðŸ’Ž',  change: 'up',   changeAmount: 1, avatarColor: '#2ECC8A' },
  { rank: 7,  name: 'Zoe Chen',       handle: 'zoechen',    diamondsReceived: 118500, prize: '75,000 ðŸ’Ž',   change: 'down', changeAmount: 2, avatarColor: '#9966CC' },
  { rank: 8,  name: 'Dex Volta',      handle: 'dexvolta',   diamondsReceived: 98200,  prize: '50,000 ðŸ’Ž',   change: 'up',   changeAmount: 3, avatarColor: '#D4AF37' },
  { rank: 9,  name: 'Maya Sun',       handle: 'mayasun',    diamondsReceived: 87100,  prize: '50,000 ðŸ’Ž',   change: 'same', changeAmount: 0, avatarColor: '#2ECC8A' },
  { rank: 10, name: 'Rio Blaze',      handle: 'rioblaze',   diamondsReceived: 76400,  prize: '25,000 ðŸ’Ž',   change: 'down', changeAmount: 1, avatarColor: '#C0392B' },
];

export const mockPrizeTiers: PrizeTier[] = [
  { prize: '750,000 ðŸ’Ž' },
  { prize: '500,000 ðŸ’Ž' },
  { prize: '300,000 ðŸ’Ž' },
  { prize: '200,000 ðŸ’Ž' },
  { prize: '150,000 ðŸ’Ž' },
  { prize: '100,000 ðŸ’Ž' },
  { prize: '75,000 ðŸ’Ž' },
  { prize: '50,000 ðŸ’Ž' },
  { prize: '25,000 ðŸ’Ž' },
];

// Website: 10 tiers
// In-App: 6 tiers (up to $499.99)
export const mockCoinPackages: CoinPackage[] = [
  { id: 'iap1', tier: 1, label: 'Starter',    coins: 1400,    price: 9.99,    bonusPercent: 0, bestValue: false, enabled: true, platform: 'iap' },
  { id: 'iap2', tier: 2, label: 'Fan',        coins: 2800,    price: 19.99,   bonusPercent: 0, bestValue: false, enabled: true, platform: 'iap' },
  { id: 'iap3', tier: 3, label: 'Supporter',  coins: 7000,    price: 49.99,   bonusPercent: 0, bestValue: true,  enabled: true, platform: 'iap' },
  { id: 'iap4', tier: 4, label: 'Champion',   coins: 14000,   price: 99.99,   bonusPercent: 0, bestValue: false, enabled: true, platform: 'iap' },
  { id: 'iap5', tier: 5, label: 'Elite',      coins: 35000,   price: 249.99,  bonusPercent: 0, bestValue: false, enabled: true, platform: 'iap' },
  { id: 'iap6', tier: 6, label: 'Legend',     coins: 70000,   price: 499.99,  bonusPercent: 0, bestValue: false, enabled: true, platform: 'iap' },
  { id: 'web1', tier: 1, label: 'Starter',    coins: 2000,    price: 9.99,    bonusPercent: 0, bestValue: false, enabled: true, platform: 'web' },
  { id: 'web2', tier: 2, label: 'Fan',        coins: 4000,    price: 19.99,   bonusPercent: 0, bestValue: false, enabled: true, platform: 'web' },
  { id: 'web3', tier: 3, label: 'Supporter',  coins: 10000,   price: 49.99,   bonusPercent: 0, bestValue: true,  enabled: true, platform: 'web' },
  { id: 'web4', tier: 4, label: 'Champion',   coins: 20000,   price: 99.99,   bonusPercent: 0, bestValue: false, enabled: true, platform: 'web' },
  { id: 'web5', tier: 5, label: 'Elite',      coins: 50000,   price: 249.99,  bonusPercent: 0, bestValue: false, enabled: true, platform: 'web' },
  { id: 'web6', tier: 6, label: 'Legend',     coins: 100000,  price: 499.99,  bonusPercent: 0, bestValue: false, enabled: true, platform: 'web' },
  { id: 'web7', tier: 7, label: 'Titan',      coins: 200000,  price: 999.99,  bonusPercent: 0, bestValue: false, enabled: true, platform: 'web' },
  { id: 'web8', tier: 8, label: 'Whale',      coins: 400000,  price: 1999.99, bonusPercent: 0, bestValue: false, enabled: true, platform: 'web' },
  { id: 'web9', tier: 9, label: 'Mega Whale', coins: 800000,  price: 3999.99, bonusPercent: 0, bestValue: false, enabled: true, platform: 'web' },
  { id: 'web10',tier: 10,label: 'Ultimate',   coins: 1000000, price: 4999.99, bonusPercent: 0, bestValue: false, enabled: true, platform: 'web' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Welcome to Loouno Closed Beta!',  body: "You're among the first. Explore the app and let us know what you think.", target: 'all',      sentAt: '2026-05-01T10:00:00Z', delivered: 847, openRate: 78.2 },
  { id: 'n2', title: 'June Competition Has Begun',       body: 'The June leaderboard is now live. Stream and collect diamonds to compete for cash prizes!', target: 'creators', sentAt: '2026-06-01T09:00:00Z', delivered: 312, openRate: 64.5 },
  { id: 'n3', title: 'New Gift: Infinity Crown',         body: 'The ultimate VIP gift is now available for 300,000 coins.', target: 'all',      sentAt: '2026-05-20T14:00:00Z', delivered: 847, openRate: 55.1 },
  { id: 'n4', title: 'Your KYC has been approved',       body: 'You can now withdraw your earned diamonds. Minimum withdrawal is 10,000 diamonds.', target: 'specific', sentAt: '2026-06-02T11:30:00Z', delivered: 1,   openRate: 100 },
  { id: 'n5', title: 'App Update Available',             body: 'Version 1.0.1 is out with performance improvements and bug fixes.', target: 'all',      sentAt: '2026-05-28T16:00:00Z', delivered: 847, openRate: 42.3 },
];

export const mockXPLevels: PrestigeXPLevel[] = [
  { id: 'xp1',  level: 1,   levelRange: '1â€“20',    name: 'Beginner',  color: '#94A3B8', xpRequired: 0,        iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'other', label: 'Basic chat reactions and viewer badge' }] },
  { id: 'xp2',  level: 21,  levelRange: '21â€“39',   name: 'Rising',    color: '#22C55E', xpRequired: 25000,    iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'other', label: 'Custom username color' }] },
  { id: 'xp3',  level: 40,  levelRange: '40â€“59',   name: 'Active',    color: '#3B82F6', xpRequired: 100000,   iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'other', label: 'Fan badge on profile' }] },
  { id: 'xp4',  level: 60,  levelRange: '60â€“79',   name: 'Popular',   color: '#8B5CF6', xpRequired: 300000,   iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'other', label: 'Priority in creator Q&A queue' }] },
  { id: 'xp5',  level: 80,  levelRange: '80â€“99',   name: 'Elite',     color: '#EF4444', xpRequired: 750000,   iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'other', label: 'Animated chat name' }] },
  { id: 'xp6',  level: 100, levelRange: '100â€“129', name: 'Star',      color: '#F97316', xpRequired: 2000000,  iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'other', label: 'Exclusive Star chat effect on gifts' }] },
  { id: 'xp7',  level: 130, levelRange: '130â€“159', name: 'Icon',      color: '#EC4899', xpRequired: 4000000,  iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'other', label: 'Icon badge frame' }] },
  { id: 'xp8',  level: 160, levelRange: '160â€“199', name: 'Legend',    color: '#FACC15', xpRequired: 8000000,  iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'full_screen_entrance' }] },
  { id: 'xp9',  level: 200, levelRange: '200â€“249', name: 'Prestige',  color: '#14B8A6', xpRequired: 14000000, iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'animated_badge' }] },
  { id: 'xp10', level: 250, levelRange: '250â€“299', name: 'Superstar', color: '#111827', xpRequired: 25000000, iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'full_screen_entrance' }] },
  { id: 'xp11', level: 300, levelRange: '300â€“349', name: 'Royal',     color: '#00E5FF', xpRequired: 38000000, iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'other', label: 'Royal cosmic chat effect' }] },
  { id: 'xp12', level: 350, levelRange: '350â€“400', name: 'Infinity',  color: '#7C3AED', xpRequired: 60000000, iconFileName: null, entranceAnimationFileName: null, perks: [{ type: 'animated_badge' }, { type: 'other', label: 'Negotiated perks' }] },
];

export const mockCPTiers: PrestigeCPTier[] = [
  // Bronze
  { id: 'cp1',  tier: 'Bronze',          subTier: 'I',   cpFrom: 0,           cpTo: 18750,       color: '#CD7F32', ringColor: '#CD7F32', iconFileName: null, perks: [{ type: 'other', label: 'Basic streamer badge on profile' }] },
  { id: 'cp2',  tier: 'Bronze',          subTier: 'II',  cpFrom: 18751,       cpTo: 37500,       color: '#CD7F32', ringColor: '#CD7F32', iconFileName: null, perks: [{ type: 'animated_badge' }, { type: 'other', label: 'Tier badge on stream overlay' }] },
  { id: 'cp3',  tier: 'Bronze',          subTier: 'III', cpFrom: 37501,       cpTo: 56250,       color: '#CD7F32', ringColor: '#CD7F32', iconFileName: null, perks: [{ type: 'other', label: 'Access to animated overlays Tier 1' }] },
  { id: 'cp4',  tier: 'Bronze',          subTier: 'IV',  cpFrom: 56251,       cpTo: 75000,       color: '#CD7F32', ringColor: '#CD7F32', iconFileName: null, perks: [{ type: 'discovery_boost', value: 2 }] },
  // Silver
  { id: 'cp5',  tier: 'Silver',          subTier: 'I',   cpFrom: 75001,       cpTo: 143750,      color: '#C0C0C0', ringColor: '#C0C0C0', iconFileName: null, perks: [{ type: 'other', label: 'Silver ring on profile' }] },
  { id: 'cp6',  tier: 'Silver',          subTier: 'II',  cpFrom: 143751,      cpTo: 212500,      color: '#C0C0C0', ringColor: '#C0C0C0', iconFileName: null, perks: [{ type: 'discovery_boost', value: 5 }] },
  { id: 'cp7',  tier: 'Silver',          subTier: 'III', cpFrom: 212501,      cpTo: 281250,      color: '#C0C0C0', ringColor: '#C0C0C0', iconFileName: null, perks: [{ type: 'other', label: 'Priority in search results' }] },
  { id: 'cp8',  tier: 'Silver',          subTier: 'IV',  cpFrom: 281251,      cpTo: 350000,      color: '#C0C0C0', ringColor: '#C0C0C0', iconFileName: null, perks: [{ type: 'exclusive_emote_pack' }] },
  // Gold
  { id: 'cp9',  tier: 'Gold',            subTier: 'I',   cpFrom: 350001,      cpTo: 512500,      color: '#D4AF37', ringColor: '#D4AF37', iconFileName: null, perks: [{ type: 'animated_badge' }] },
  { id: 'cp10', tier: 'Gold',            subTier: 'II',  cpFrom: 512501,      cpTo: 675000,      color: '#D4AF37', ringColor: '#D4AF37', iconFileName: null, perks: [{ type: 'discovery_boost', value: 15 }] },
  { id: 'cp11', tier: 'Gold',            subTier: 'III', cpFrom: 675001,      cpTo: 837500,      color: '#D4AF37', ringColor: '#D4AF37', iconFileName: null, perks: [{ type: 'featured_on_discover' }] },
  { id: 'cp12', tier: 'Gold',            subTier: 'IV',  cpFrom: 837501,      cpTo: 1000000,     color: '#D4AF37', ringColor: '#D4AF37', iconFileName: null, perks: [{ type: 'exclusive_emote_pack' }] },
  // Platinum
  { id: 'cp13', tier: 'Platinum',        subTier: 'I',   cpFrom: 1000001,     cpTo: 1500000,     color: '#E5E4E2', ringColor: '#E5E4E2', iconFileName: null, perks: [{ type: 'animated_badge' }] },
  { id: 'cp14', tier: 'Platinum',        subTier: 'II',  cpFrom: 1500001,     cpTo: 2000000,     color: '#E5E4E2', ringColor: '#E5E4E2', iconFileName: null, perks: [{ type: 'spotlight_slots', value: 1 }] },
  { id: 'cp15', tier: 'Platinum',        subTier: 'III', cpFrom: 2000001,     cpTo: 2500000,     color: '#E5E4E2', ringColor: '#E5E4E2', iconFileName: null, perks: [{ type: 'exclusive_emote_pack' }] },
  { id: 'cp16', tier: 'Platinum',        subTier: 'IV',  cpFrom: 2500001,     cpTo: 3000000,     color: '#E5E4E2', ringColor: '#E5E4E2', iconFileName: null, perks: [{ type: 'discovery_boost', value: 25 }] },
  // Sapphire
  { id: 'cp17', tier: 'Sapphire',        subTier: 'I',   cpFrom: 3000001,     cpTo: 4750000,     color: '#0F52BA', ringColor: '#0F52BA', iconFileName: null, perks: [{ type: 'full_screen_entrance' }] },
  { id: 'cp18', tier: 'Sapphire',        subTier: 'II',  cpFrom: 4750001,     cpTo: 6500000,     color: '#0F52BA', ringColor: '#0F52BA', iconFileName: null, perks: [{ type: 'priority_support' }, { type: 'spotlight_slots', value: 2 }] },
  { id: 'cp19', tier: 'Sapphire',        subTier: 'III', cpFrom: 6500001,     cpTo: 8250000,     color: '#0F52BA', ringColor: '#0F52BA', iconFileName: null, perks: [{ type: 'exclusive_gift' }] },
  { id: 'cp20', tier: 'Sapphire',        subTier: 'IV',  cpFrom: 8250001,     cpTo: 10000000,    color: '#0F52BA', ringColor: '#0F52BA', iconFileName: null, perks: [{ type: 'other', label: 'Co-branded merch drop eligibility' }] },
  // Ruby
  { id: 'cp21', tier: 'Ruby',            subTier: 'I',   cpFrom: 10000001,    cpTo: 13750000,    color: '#E0115F', ringColor: '#E0115F', iconFileName: null, perks: [{ type: 'full_screen_entrance' }, { type: 'other', label: 'Cinematic stream intro' }] },
  { id: 'cp22', tier: 'Ruby',            subTier: 'II',  cpFrom: 13750001,    cpTo: 17500000,    color: '#E0115F', ringColor: '#E0115F', iconFileName: null, perks: [{ type: 'exclusive_gift' }] },
  { id: 'cp23', tier: 'Ruby',            subTier: 'III', cpFrom: 17500001,    cpTo: 21250000,    color: '#E0115F', ringColor: '#E0115F', iconFileName: null, perks: [{ type: 'other', label: 'Monthly admin interview feature' }] },
  { id: 'cp24', tier: 'Ruby',            subTier: 'IV',  cpFrom: 21250001,    cpTo: 25000000,    color: '#E0115F', ringColor: '#E0115F', iconFileName: null, perks: [{ type: 'account_manager' }] },
  // Amethyst
  { id: 'cp25', tier: 'Amethyst',        subTier: 'I',   cpFrom: 25000001,    cpTo: 31250000,    color: '#9966CC', ringColor: '#9966CC', iconFileName: null, perks: [{ type: 'full_screen_entrance' }] },
  { id: 'cp26', tier: 'Amethyst',        subTier: 'II',  cpFrom: 31250001,    cpTo: 37500000,    color: '#9966CC', ringColor: '#9966CC', iconFileName: null, perks: [{ type: 'discovery_boost', value: 40 }] },
  { id: 'cp27', tier: 'Amethyst',        subTier: 'III', cpFrom: 37500001,    cpTo: 43750000,    color: '#9966CC', ringColor: '#9966CC', iconFileName: null, perks: [{ type: 'exclusive_gift' }] },
  { id: 'cp28', tier: 'Amethyst',        subTier: 'IV',  cpFrom: 43750001,    cpTo: 50000000,    color: '#9966CC', ringColor: '#9966CC', iconFileName: null, perks: [{ type: 'exclusive_emote_pack' }, { type: 'other', label: 'VIP lounge access' }] },
  // Diamond
  { id: 'cp29', tier: 'Diamond',         subTier: 'I',   cpFrom: 50000001,    cpTo: 58750000,    color: '#B9F2FF', ringColor: '#B9F2FF', iconFileName: null, perks: [{ type: 'full_screen_entrance' }] },
  { id: 'cp30', tier: 'Diamond',         subTier: 'II',  cpFrom: 58750001,    cpTo: 67500000,    color: '#B9F2FF', ringColor: '#B9F2FF', iconFileName: null, perks: [{ type: 'spotlight_slots', value: 3 }, { type: 'priority_support' }] },
  { id: 'cp31', tier: 'Diamond',         subTier: 'III', cpFrom: 67500001,    cpTo: 76250000,    color: '#B9F2FF', ringColor: '#B9F2FF', iconFileName: null, perks: [{ type: 'exclusive_gift' }] },
  { id: 'cp32', tier: 'Diamond',         subTier: 'IV',  cpFrom: 76250001,    cpTo: 85000000,    color: '#B9F2FF', ringColor: '#B9F2FF', iconFileName: null, perks: [{ type: 'other', label: 'Co-branded platform feature' }] },
  // Black Diamond
  { id: 'cp33', tier: 'Black Diamond',   subTier: 'I',   cpFrom: 85000001,    cpTo: 95000000,    color: '#1E293B', ringColor: '#1E293B', iconFileName: null, perks: [{ type: 'full_screen_entrance' }] },
  { id: 'cp34', tier: 'Black Diamond',   subTier: 'II',  cpFrom: 95000001,    cpTo: 105000000,   color: '#1E293B', ringColor: '#1E293B', iconFileName: null, perks: [{ type: 'account_manager' }] },
  { id: 'cp35', tier: 'Black Diamond',   subTier: 'III', cpFrom: 105000001,   cpTo: 115000000,   color: '#1E293B', ringColor: '#1E293B', iconFileName: null, perks: [{ type: 'other', label: 'Platform billboard feature' }] },
  { id: 'cp36', tier: 'Black Diamond',   subTier: 'IV',  cpFrom: 115000001,   cpTo: 125000000,   color: '#1E293B', ringColor: '#1E293B', iconFileName: null, perks: [{ type: 'exclusive_gift' }] },
  // Crown Gold
  { id: 'cp37', tier: 'Crown Gold',      subTier: 'I',   cpFrom: 125000001,   cpTo: 137500000,   color: '#C99700', ringColor: '#C99700', iconFileName: null, perks: [{ type: 'full_screen_entrance' }] },
  { id: 'cp38', tier: 'Crown Gold',      subTier: 'II',  cpFrom: 137500001,   cpTo: 150000000,   color: '#C99700', ringColor: '#C99700', iconFileName: null, perks: [{ type: 'featured_on_discover' }, { type: 'other', label: 'Lifetime featured placement' }] },
  { id: 'cp39', tier: 'Crown Gold',      subTier: 'III', cpFrom: 150000001,   cpTo: 162500000,   color: '#C99700', ringColor: '#C99700', iconFileName: null, perks: [{ type: 'other', label: 'Crown Gold exclusive merch collaboration' }] },
  { id: 'cp40', tier: 'Crown Gold',      subTier: 'IV',  cpFrom: 162500001,   cpTo: 175000000,   color: '#C99700', ringColor: '#C99700', iconFileName: null, perks: [{ type: 'account_manager' }, { type: 'spotlight_slots', value: 1 }] },
  // Imperial Opal
  { id: 'cp41', tier: 'Imperial Opal',   subTier: 'I',   cpFrom: 175000001,   cpTo: 193750000,   color: '#A78BFA', ringColor: '#A78BFA', iconFileName: null, perks: [{ type: 'full_screen_entrance' }] },
  { id: 'cp42', tier: 'Imperial Opal',   subTier: 'II',  cpFrom: 193750001,   cpTo: 212500000,   color: '#A78BFA', ringColor: '#A78BFA', iconFileName: null, perks: [{ type: 'other', label: 'Co-branded platform events' }] },
  { id: 'cp43', tier: 'Imperial Opal',   subTier: 'III', cpFrom: 212500001,   cpTo: 231250000,   color: '#A78BFA', ringColor: '#A78BFA', iconFileName: null, perks: [{ type: 'exclusive_gift' }] },
  { id: 'cp44', tier: 'Imperial Opal',   subTier: 'IV',  cpFrom: 231250001,   cpTo: 250000000,   color: '#A78BFA', ringColor: '#A78BFA', iconFileName: null, perks: [{ type: 'custom_ring_color' }] },
  // Eclipse Diamond
  { id: 'cp45', tier: 'Eclipse Diamond', subTier: 'I',   cpFrom: 250000001,   cpTo: 275000000,   color: '#4B5563', ringColor: '#4B5563', iconFileName: null, perks: [{ type: 'full_screen_entrance' }] },
  { id: 'cp46', tier: 'Eclipse Diamond', subTier: 'II',  cpFrom: 275000001,   cpTo: 300000000,   color: '#4B5563', ringColor: '#4B5563', iconFileName: null, perks: [{ type: 'other', label: 'Lifetime VIP platform partner status' }] },
  { id: 'cp47', tier: 'Eclipse Diamond', subTier: 'III', cpFrom: 300000001,   cpTo: 325000000,   color: '#4B5563', ringColor: '#4B5563', iconFileName: null, perks: [{ type: 'exclusive_gift' }] },
  { id: 'cp48', tier: 'Eclipse Diamond', subTier: 'IV',  cpFrom: 325000001,   cpTo: 350000000,   color: '#4B5563', ringColor: '#4B5563', iconFileName: null, perks: [{ type: 'featured_on_discover' }, { type: 'other', label: 'Dedicated creator page on homepage' }] },
  // Loouno Crown
  { id: 'cp49', tier: 'Loouno Crown',    subTier: 'I',   cpFrom: 350000001,   cpTo: 450000000,   color: '#FACC15', ringColor: '#FACC15', iconFileName: null, perks: [{ type: 'full_screen_entrance' }] },
  { id: 'cp50', tier: 'Loouno Crown',    subTier: 'II',  cpFrom: 450000001,   cpTo: 550000000,   color: '#FACC15', ringColor: '#FACC15', iconFileName: null, perks: [{ type: 'custom_ring_color' }] },
  { id: 'cp51', tier: 'Loouno Crown',    subTier: 'III', cpFrom: 550000001,   cpTo: 650000000,   color: '#FACC15', ringColor: '#FACC15', iconFileName: null, perks: [{ type: 'other', label: 'Lifetime VIP Boss + fully negotiated perks' }] },
  { id: 'cp52', tier: 'Loouno Crown',    subTier: 'IV',  cpFrom: 650000001,   cpTo: 750000000,   color: '#FACC15', ringColor: '#FACC15', iconFileName: null, perks: [{ type: 'other', label: 'Unique on the platform â€” maximum recognition' }] },
];

export const mockVIPLevels: VIPLevel[] = [
  { id: 'vip1', level: 1, name: 'VIP 1', minSpend: 500,   maxSpend: 999,  badgeColor: '#94A3B8', ringColor: '#94A3B8', iconFileName: null, perks: [{ type: 'exclusive_emote_pack' }, { type: 'other', label: 'VIP badge, priority chat' }] },
  { id: 'vip2', level: 2, name: 'VIP 2', minSpend: 1000,  maxSpend: 2499, badgeColor: '#FACC15', ringColor: '#FACC15', iconFileName: null, perks: [{ type: 'exclusive_gift' }, { type: 'animated_badge' }] },
  { id: 'vip3', level: 3, name: 'VIP 3', minSpend: 2500,  maxSpend: 4999, badgeColor: '#E5E7EB', ringColor: '#E5E7EB', iconFileName: null, perks: [{ type: 'animated_badge' }, { type: 'full_screen_entrance' }, { type: 'other', label: 'Chat sparkles' }] },
  { id: 'vip4', level: 4, name: 'VIP 4', minSpend: 5000,  maxSpend: 9999, badgeColor: '#22D3EE', ringColor: '#22D3EE', iconFileName: null, perks: [{ type: 'full_screen_entrance' }, { type: 'other', label: 'Private lounge access' }] },
  { id: 'vip5', level: 5, name: 'VIP 5', minSpend: 10000, maxSpend: null, badgeColor: '#111827', ringColor: '#111827', iconFileName: null, perks: [{ type: 'full_screen_entrance' }, { type: 'custom_ring_color' }, { type: 'other', label: 'Custom platform recognition' }] },
];

export const mockReportReasons: ReportReason[] = [
  { id: 'rr1',  label: 'Explicit sexual content',        appliesTo: 'all',     enabled: true  },
  { id: 'rr2',  label: 'Nudity or adult content',        appliesTo: 'stream',  enabled: true  },
  { id: 'rr3',  label: 'Harassment or bullying',         appliesTo: 'all',     enabled: true  },
  { id: 'rr4',  label: 'Hate speech or discrimination',  appliesTo: 'all',     enabled: true  },
  { id: 'rr5',  label: 'Spam or self-promotion',         appliesTo: 'message', enabled: true  },
  { id: 'rr6',  label: 'Copyright infringement',         appliesTo: 'stream',  enabled: true  },
  { id: 'rr7',  label: 'Misleading stream title',        appliesTo: 'stream',  enabled: true  },
  { id: 'rr8',  label: 'Underage user suspicion',        appliesTo: 'user',    enabled: true  },
  { id: 'rr9',  label: 'Impersonation',                  appliesTo: 'user',    enabled: true  },
  { id: 'rr10', label: 'Violence or dangerous content',  appliesTo: 'all',     enabled: true  },
  { id: 'rr11', label: 'Inappropriate username',         appliesTo: 'user',    enabled: true  },
  { id: 'rr12', label: 'Soliciting in chat',             appliesTo: 'message', enabled: false },
];

export const mockAdminTeam: AdminMember[] = [
  { id: 'a1', displayName: 'Cyrus',       email: 'cyrus@loouno.com',          role: 'super_admin', status: 'active',  invitedAt: '2025-12-01T00:00:00Z', joinedAt: '2025-12-01T00:00:00Z', avatarColor: '#D4AF37' },
  { id: 'a2', displayName: 'Polina',      email: 'polina_m@dataforest.ai',    role: 'admin',       status: 'active',  invitedAt: '2026-01-15T10:00:00Z', joinedAt: '2026-01-16T09:30:00Z', avatarColor: '#9966CC' },
  { id: 'a3', displayName: 'Alex Chen',   email: 'alex.chen@loouno.com',      role: 'moderator',   status: 'active',  invitedAt: '2026-02-10T08:00:00Z', joinedAt: '2026-02-11T14:00:00Z', avatarColor: '#2ECC8A' },
  { id: 'a4', displayName: 'Sofia Romano',email: 'sofia.r@loouno.com',        role: 'viewer',      status: 'active',  invitedAt: '2026-03-01T11:00:00Z', joinedAt: '2026-03-01T15:00:00Z', avatarColor: '#3498DB' },
  { id: 'a5', displayName: 'â€”',           email: 'new.mod@example.com',       role: 'moderator',   status: 'invited', invitedAt: '2026-06-04T09:00:00Z', inviteCode: 'LOOO-X4R2-9KPW',     avatarColor: '#48484A' },
];

export const mockSeasonalWheels: SeasonalWheel[] = [
  {
    id: 'sw1', name: 'Summer', active: true, seasonAnimationFileName: null,
    slots: [
      { id: 'sw1s1', kind: 'reward',      rewardName: 'Neon Sunglasses',    coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw1s2', kind: 'reward',      rewardName: 'Sliced Watermelon',  coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw1s3', kind: 'reward',      rewardName: 'River Tube',         coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw1s4', kind: 'small_bonus', rewardName: 'Golden Jet Ski',     coins: 50000,  diamonds: 0, animationFileName: null },
      { id: 'sw1s5', kind: 'big_bonus',   rewardName: 'Diamond Sandcastle', coins: 150000, diamonds: 0, animationFileName: null },
    ],
  },
  {
    id: 'sw2', name: 'Thanksgiving', active: false, seasonAnimationFileName: null,
    slots: [
      { id: 'sw2s1', kind: 'reward',      rewardName: 'Pumpkin Pie',        coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw2s2', kind: 'reward',      rewardName: 'Turkey Leg',         coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw2s3', kind: 'reward',      rewardName: 'Falling Leaves',     coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw2s4', kind: 'small_bonus', rewardName: 'Golden Cornucopia',  coins: 50000,  diamonds: 0, animationFileName: null },
      { id: 'sw2s5', kind: 'big_bonus',   rewardName: 'Diamond Turkey',     coins: 150000, diamonds: 0, animationFileName: null },
    ],
  },
  {
    id: 'sw3', name: 'Christmas', active: false, seasonAnimationFileName: null,
    slots: [
      { id: 'sw3s1', kind: 'reward',      rewardName: 'Candy Cane',              coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw3s2', kind: 'reward',      rewardName: 'Snowball',                coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw3s3', kind: 'reward',      rewardName: 'Stocking',                coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw3s4', kind: 'small_bonus', rewardName: 'Gold Sleigh',             coins: 50000,  diamonds: 0, animationFileName: null },
      { id: 'sw3s5', kind: 'big_bonus',   rewardName: 'Diamond Christmas Tree',  coins: 150000, diamonds: 0, animationFileName: null },
    ],
  },
  {
    id: 'sw4', name: 'Halloween', active: false, seasonAnimationFileName: null,
    slots: [
      { id: 'sw4s1', kind: 'reward',      rewardName: 'Ghost Boo',               coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw4s2', kind: 'reward',      rewardName: 'Exploding Bomb',          coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw4s3', kind: 'reward',      rewardName: 'Scream Mask',             coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw4s4', kind: 'small_bonus', rewardName: 'Golden Grim Reaper',      coins: 50000,  diamonds: 0, animationFileName: null },
      { id: 'sw4s5', kind: 'big_bonus',   rewardName: 'Diamond Haunted Mansion', coins: 150000, diamonds: 0, animationFileName: null },
    ],
  },
  {
    id: 'sw5', name: 'Valentine', active: false, seasonAnimationFileName: null,
    slots: [
      { id: 'sw5s1', kind: 'reward',      rewardName: 'Heart Eyes',              coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw5s2', kind: 'reward',      rewardName: 'Kiss Blow',               coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw5s3', kind: 'reward',      rewardName: 'Bouquet Drop',            coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw5s4', kind: 'small_bonus', rewardName: 'Golden Teddy Bear',       coins: 50000,  diamonds: 0, animationFileName: null },
      { id: 'sw5s5', kind: 'big_bonus',   rewardName: 'Diamond Proposal Ring',   coins: 150000, diamonds: 0, animationFileName: null },
    ],
  },
  {
    id: 'sw6', name: 'Lunar New Year', active: false, seasonAnimationFileName: null,
    slots: [
      { id: 'sw6s1', kind: 'reward',      rewardName: 'Lion Dance',              coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw6s2', kind: 'reward',      rewardName: 'Red Envelope',            coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw6s3', kind: 'reward',      rewardName: 'Firecracker',             coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw6s4', kind: 'small_bonus', rewardName: 'Golden Lion Dance',       coins: 50000,  diamonds: 0, animationFileName: null },
      { id: 'sw6s5', kind: 'big_bonus',   rewardName: 'Diamond Imperial Dragon', coins: 150000, diamonds: 0, animationFileName: null },
    ],
  },
  {
    id: 'sw7', name: 'Sports', active: false, seasonAnimationFileName: null,
    slots: [
      { id: 'sw7s1', kind: 'reward',      rewardName: 'Foam Finger',              coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw7s2', kind: 'reward',      rewardName: 'Stadium Lights',           coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw7s3', kind: 'reward',      rewardName: 'Touchdown',                coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw7s4', kind: 'small_bonus', rewardName: 'Golden Goalpost',          coins: 50000,  diamonds: 0, animationFileName: null },
      { id: 'sw7s5', kind: 'big_bonus',   rewardName: 'Diamond Championship Ring',coins: 150000, diamonds: 0, animationFileName: null },
    ],
  },
  {
    id: 'sw8', name: 'Baseball', active: false, seasonAnimationFileName: null,
    slots: [
      { id: 'sw8s1', kind: 'reward',      rewardName: 'Baseball Cap',      coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw8s2', kind: 'reward',      rewardName: 'Hot Dog',           coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw8s3', kind: 'reward',      rewardName: 'Home Run',          coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw8s4', kind: 'small_bonus', rewardName: 'Golden Bat',        coins: 50000,  diamonds: 0, animationFileName: null },
      { id: 'sw8s5', kind: 'big_bonus',   rewardName: 'Diamond Grand Slam',coins: 150000, diamonds: 0, animationFileName: null },
    ],
  },
  {
    id: 'sw9', name: 'Military', active: false, seasonAnimationFileName: null,
    slots: [
      { id: 'sw9s1', kind: 'reward',      rewardName: 'Dog Tags',      coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw9s2', kind: 'reward',      rewardName: 'Salute',        coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw9s3', kind: 'reward',      rewardName: 'Jet Flyover',   coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw9s4', kind: 'small_bonus', rewardName: 'Golden Eagle',  coins: 50000,  diamonds: 0, animationFileName: null },
      { id: 'sw9s5', kind: 'big_bonus',   rewardName: 'Diamond Shield',coins: 150000, diamonds: 0, animationFileName: null },
    ],
  },
  {
    id: 'sw10', name: "St. Patrick's", active: false, seasonAnimationFileName: null,
    slots: [
      { id: 'sw10s1', kind: 'reward',      rewardName: 'Shamrock',               coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw10s2', kind: 'reward',      rewardName: 'Lucky Horseshoe',        coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw10s3', kind: 'reward',      rewardName: 'Leprechaun Hat',         coins: 2500,   diamonds: 0, animationFileName: null },
      { id: 'sw10s4', kind: 'small_bonus', rewardName: 'Golden Pot of Gold',     coins: 50000,  diamonds: 0, animationFileName: null },
      { id: 'sw10s5', kind: 'big_bonus',   rewardName: 'Diamond Clover Crown',   coins: 150000, diamonds: 0, animationFileName: null },
    ],
  },
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
    id: 'fa1', withdrawalId: 'w1',  userId: 'u7',
    user: 'Sasha Bloom',    userHandle: 'sashabloom', email: 'sasha@example.com', country: 'DE',
    diamonds: 80000,  estimatedUSD: 280,  kycStatus: 'approved', requestedAt: '2026-06-03T10:00:00Z',
    status: 'pending',  avatarColor: '#9966CC', joined: '2025-03-28', totalEarned: 340000, totalStreams: 134, followers: 22100, walletBalance: 88000,
  },
  {
    id: 'fa2', withdrawalId: 'w6',  userId: 'u1',
    user: 'Aria Voss',      userHandle: 'ariavoss',   email: 'aria@example.com',  country: 'US',
    diamonds: 100000, estimatedUSD: 350,  kycStatus: 'approved', requestedAt: '2026-05-28T11:00:00Z',
    status: 'approved', avatarColor: '#9966CC', joined: '2025-03-12', totalEarned: 182000, totalStreams: 87,  followers: 14200, walletBalance: 42000,
  },
  {
    id: 'fa3', withdrawalId: 'tx8', userId: 'u9',
    user: 'Nour Al-Rashid', userHandle: 'nourar',     email: 'nour@example.com',  country: 'SA',
    diamonds: 120000, estimatedUSD: 420,  kycStatus: 'approved', requestedAt: '2026-06-06T09:00:00Z',
    status: 'pending',  avatarColor: '#D4AF37', joined: '2025-04-14', totalEarned: 120000, totalStreams: 58,  followers: 6400,  walletBalance: 31000,
  },
  {
    id: 'fa4', withdrawalId: 'tx3', userId: 'u7',
    user: 'Sasha Bloom',    userHandle: 'sashabloom', email: 'sasha@example.com', country: 'DE',
    diamonds: 200000, estimatedUSD: 700,  kycStatus: 'approved', requestedAt: '2026-05-20T10:00:00Z',
    status: 'rejected', avatarColor: '#9966CC', joined: '2025-03-28', totalEarned: 340000, totalStreams: 134, followers: 22100, walletBalance: 88000,
  },
];

export const mockWarnMessages: WarnMessage[] = [
  { id: 'wm1', title: 'Community Guidelines Violation', message: 'Your content violates our community guidelines. Please review them before streaming again.' },
  { id: 'wm2', title: 'Explicit Content', message: 'Explicit or adult content is not permitted on this platform.' },
  { id: 'wm3', title: 'Harassment or Bullying', message: 'Harassment and bullying are strictly prohibited. Further violations may result in a ban.' },
  { id: 'wm4', title: 'Misleading Content', message: 'Your stream title or description was found to be misleading. Please ensure accuracy.' },
  { id: 'wm5', title: 'Spam in Chat', message: 'Spam or self-promotional content in chat is not allowed.' },
  { id: 'wm6', title: 'Hate Speech', message: 'Hate speech or discriminatory language will not be tolerated on this platform.' },
  { id: 'wm7', title: 'Solicitation â€” Final Warning', message: 'Soliciting other users is prohibited. This is your final warning before account action.' },
];
