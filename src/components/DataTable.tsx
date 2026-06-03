import type { ReactNode } from 'react'

interface Column<T> {
  key: string
  label: string
  render?: (row: T) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  title?: string
  subtitle?: string
  columns: Column<T>[]
  data: T[]
  controls?: ReactNode
  emptyText?: string
}

export default function DataTable<T extends { id: string }>({
  title,
  subtitle,
  columns,
  data,
  controls,
  emptyText = 'No data available',
}: DataTableProps<T>) {
  return (
    <div className="table-wrapper">
      {(title || controls) && (
        <div className="table-header">
          <div>
            {title && <div className="table-title">{title}</div>}
            {subtitle && <div className="table-subtitle">{subtitle}</div>}
          </div>
          {controls && <div className="table-controls">{controls}</div>}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 16px' }}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map(row => (
                <tr key={row.id}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
