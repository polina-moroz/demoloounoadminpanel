import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: ReactNode
}

export default function StatCard({ label, value, sub, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-body">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
        {sub && <div className="stat-card-sub">{sub}</div>}
      </div>
      <div className="stat-card-icon">{icon}</div>
    </div>
  )
}
