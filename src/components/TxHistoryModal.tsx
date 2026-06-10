import { X } from 'lucide-react'
import type { Transaction } from '../types'

const DIAMONDS_TO_USD = 0.0035  // $3.50 per 1,000 diamonds

const TX_META = {
  coin_purchase: {
    label: 'Coin Purchase',
    color: '#2ECC8A',
    icon: '🪙',
    description: (t: Transaction) => t.note ?? '',
  },
  diamonds_received: {
    label: 'Diamonds Received',
    color: '#D4AF37',
    icon: '💎',
    description: (t: Transaction) => t.note ?? '',
  },
  withdrawal: {
    label: 'Withdrawal',
    color: '#3498DB',
    icon: '🏦',
    description: (t: Transaction) => t.note ?? '',
  },
}

function TxRow({ tx }: { tx: Transaction }) {
  const meta = TX_META[tx.type]

  const amountNode = tx.type === 'coin_purchase' ? (
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#2ECC8A' }}>
        ${tx.amount.toFixed(2)}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>USD</div>
    </div>
  ) : tx.type === 'diamonds_received' ? (
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#D4AF37' }}>
        +{tx.amount.toLocaleString()} 💎
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        ≈ ${(tx.amount * DIAMONDS_TO_USD).toFixed(2)}
      </div>
    </div>
  ) : (
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#3498DB' }}>
        {tx.amount.toLocaleString()} 💎
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        → ${(tx.amount * DIAMONDS_TO_USD).toFixed(2)} USD
      </div>
    </div>
  )

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '12px 0',
      borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${meta.color}15`,
        border: `1.5px solid ${meta.color}30`,
        fontSize: 16,
      }}>
        {meta.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
            textTransform: 'uppercase', letterSpacing: '0.5px',
            background: `${meta.color}18`, color: meta.color,
            border: `1px solid ${meta.color}30`,
          }}>
            {meta.label}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2, lineHeight: 1.4 }}>
          {meta.description(tx)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {new Date(tx.date).toLocaleString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </div>
      </div>

      {amountNode}
    </div>
  )
}

interface Props {
  userHandle: string
  userName: string
  transactions: Transaction[]
  onClose: () => void
}

export default function TxHistoryModal({ userHandle, userName, transactions, onClose }: Props) {
  const coinTxs       = transactions.filter(t => t.type === 'coin_purchase')
  const diamondTxs    = transactions.filter(t => t.type === 'diamonds_received')
  const withdrawalTxs = transactions.filter(t => t.type === 'withdrawal')

  const totalCoinsUSD  = coinTxs.reduce((s, t) => s + t.amount, 0)
  const totalDiamonds  = diamondTxs.reduce((s, t) => s + t.amount, 0)
  const totalWithdrawn = withdrawalTxs.reduce((s, t) => s + t.amount, 0)

  return (
    <div className="modal-overlay" style={{ zIndex: 350 }} onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 540, width: '94%', maxHeight: '84vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Transaction History</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              @{userHandle} · {userName} · {transactions.length} transactions
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          borderBottom: '1px solid var(--border)',
        }}>
          {[
            { label: 'Coins Purchased',   value: `$${totalCoinsUSD.toFixed(2)}`,        color: '#2ECC8A', icon: '🪙', count: coinTxs.length },
            { label: 'Diamonds Received', value: `${totalDiamonds.toLocaleString()} 💎`, color: '#D4AF37', icon: '💎', count: diamondTxs.length },
            { label: 'Withdrawn',         value: `${totalWithdrawn.toLocaleString()} 💎`,color: '#3498DB', icon: '🏦', count: withdrawalTxs.length },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: '12px 16px',
              borderRight: i < 2 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{s.count} transactions</div>
            </div>
          ))}
        </div>

        <div style={{ overflowY: 'auto', padding: '4px 20px 16px', flex: 1 }}>
          {transactions.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No transactions found.
            </div>
          ) : [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
            <TxRow key={tx.id} tx={tx} />
          ))}
        </div>
      </div>
    </div>
  )
}
