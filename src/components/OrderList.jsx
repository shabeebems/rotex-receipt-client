import { formatCreatedAt, formatCurrency } from '../utils/format'
import { getCustomerById } from '../utils/customers'
import { canDownloadReceipt } from '../utils/orders'
import CreateOrderForm from './CreateOrderForm'

function ActionButton({ children, onClick, variant = 'primary', disabled = false, title }) {
  const styles =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300'
      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:text-slate-400 disabled:bg-slate-50'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm transition sm:text-sm ${styles} disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}

function StatusBadge({ value, tone = 'default' }) {
  const tones = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    info: 'bg-indigo-50 text-indigo-700',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {value}
    </span>
  )
}

export default function OrderList({
  orders,
  customers,
  loading,
  onDownloadReceipt,
  onViewOrderDetails,
  onCreateOrder,
  onEditOrder,
  creating,
}) {
  if (loading) {
    return <p className="text-sm text-slate-500">Loading orders…</p>
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800">Orders</h2>
      <p className="mt-1 text-sm text-slate-500">
        Receipts are available only when status is Completed and payment is Paid.
      </p>

      <CreateOrderForm customers={customers} onSubmit={onCreateOrder} submitting={creating} />

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No orders yet. Add one above.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {orders.map((order) => {
                const customer = getCustomerById(customers, order.customerId)
                const receiptAllowed = canDownloadReceipt(order)
                const statusTone =
                  order.status === 'Completed'
                    ? 'success'
                    : order.status === 'In progress'
                      ? 'warning'
                      : 'default'

                return (
                  <tr key={order.orderId} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono text-indigo-600">{order.orderId}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{customer?.name ?? '—'}</p>
                      <p className="text-xs text-slate-400">{order.customerId}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatCreatedAt(order.createdAt)}</td>
                    <td className="px-4 py-3 text-slate-600">{order.orderDetails.length}</td>
                    <td className="px-4 py-3 text-right font-medium text-indigo-700">
                      {formatCurrency(order.offerPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={order.status} tone={statusTone} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <ActionButton
                          onClick={() => onDownloadReceipt(order)}
                          disabled={!receiptAllowed}
                          title={
                            receiptAllowed
                              ? 'Download receipt'
                              : 'Receipt requires Completed status and Paid payment'
                          }
                        >
                          Receipt
                        </ActionButton>
                        <ActionButton variant="secondary" onClick={() => onViewOrderDetails(order)}>
                          Order details
                        </ActionButton>
                        <ActionButton variant="secondary" onClick={() => onEditOrder(order)}>
                          Edit
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
