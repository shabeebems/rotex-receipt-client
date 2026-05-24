import { formatCurrency } from '../utils/format'
import { getCustomerById } from '../utils/customers'
import CreateOrderForm from './CreateOrderForm'

function ActionButton({ children, onClick, variant = 'primary' }) {
  const styles =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm transition sm:text-sm ${styles}`}
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
  creating,
}) {
  if (loading) {
    return <p className="text-sm text-slate-500">Loading orders…</p>
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800">Orders</h2>
      <p className="mt-1 text-sm text-slate-500">
        Each order may include multiple resumes. Open order details to preview and download.
      </p>

      <CreateOrderForm customers={customers} onSubmit={onCreateOrder} submitting={creating} />

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No orders yet. Add one above.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3 text-right">Offer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {orders.map((order) => {
                const customer = getCustomerById(customers, order.customerId)
                const statusTone =
                  order.status === 'Completed'
                    ? 'success'
                    : order.status === 'In progress'
                      ? 'warning'
                      : 'default'
                const paymentTone =
                  order.paymentStatus === 'Paid'
                    ? 'success'
                    : order.paymentStatus === 'Partial'
                      ? 'warning'
                      : 'default'

                return (
                  <tr key={order.orderId} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono text-indigo-600">{order.orderId}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{customer?.name ?? '—'}</p>
                      <p className="text-xs text-slate-400">{order.customerId}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{order.service}</td>
                    <td className="px-4 py-3 text-slate-600">{order.orderDetails.length}</td>
                    <td className="px-4 py-3 text-right font-medium text-indigo-700">
                      {formatCurrency(order.offerPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={order.status} tone={statusTone} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={order.paymentStatus} tone={paymentTone} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <ActionButton onClick={() => onDownloadReceipt(order)}>Receipt</ActionButton>
                        <ActionButton variant="secondary" onClick={() => onViewOrderDetails(order)}>
                          Order details
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
