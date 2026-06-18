import type { CSSProperties } from 'react'

interface BadgeProps {
  variant: string;
  children: React.ReactNode;
  dot?: boolean;
  style?: CSSProperties;
}

export default function Badge({ variant, children, dot = true, style }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`} style={style}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  )
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Active',
    suspended: 'Suspended',
    banned: 'Banned',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    not_submitted: 'Not Submitted',
    live: 'Live',
    ended: 'Ended',
    terminated: 'Terminated',
    resolved: 'Resolved',
    dismissed: 'Dismissed',
    on_hold: 'On Hold',
  }
  return map[status] ?? status
}
