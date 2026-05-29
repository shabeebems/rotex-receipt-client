import { forwardRef } from 'react'
import BillSummary from './BillSummary'
import { COMPANY_NAME, formatCreatedAt, formatCurrency, formatDate } from '../utils/format'

const OrderDocument = forwardRef(function OrderDocument({ order, customerName }, ref) {
  const orderDate = order.createdAt ? formatCreatedAt(order.createdAt) : formatDate()

  return (
    <div
      ref={ref}
      className="print-area mx-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white p-8 text-slate-800 shadow-lg ring-1 ring-slate-200/80"
    >
      <header className="border-b-2 border-indigo-600 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Order Details
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{COMPANY_NAME}</h1>
        <p className="mt-1 text-sm text-slate-500">{order.service}</p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Order ID</p>
          <p className="mt-0.5 font-mono font-semibold text-indigo-600">{order.orderId}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Customer ID</p>
          <p className="mt-0.5 font-mono font-medium text-slate-800">{order.customerId}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Created</p>
          <p className="mt-0.5 font-medium text-slate-800">{orderDate}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</p>
          <p className="mt-0.5 font-medium text-slate-800">{order.status}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Payment</p>
          <p className="mt-0.5 font-medium text-slate-800">{order.paymentStatus}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Customer</p>
          <p className="mt-0.5 font-semibold text-slate-900">{customerName || '—'}</p>
        </div>
      </div>

      <section className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Resume line items ({order.orderDetails.length})
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="pb-2 pr-2">Resume for</th>
              <th className="pb-2 pr-2">Template</th>
              <th className="pb-2 text-right">Listed Price</th>
              <th className="pb-2 text-right">Discount Price</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((item, index) => {
              const hasDiscount = Number(item.offerRate) < Number(item.actualRate)
              return (
                <tr key={`${item.templateCode}-${index}`} className="border-b border-slate-100">
                  <td className="py-3 pr-2 font-medium text-slate-900">{item.resumeName}</td>
                  <td className="py-3 pr-2 font-mono text-xs text-indigo-600">{item.templateCode}</td>
                  <td
                    className={`py-3 text-right ${hasDiscount ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                  >
                    {formatCurrency(item.actualRate)}
                  </td>
                  <td className="py-3 text-right font-medium text-emerald-600">
                    {hasDiscount ? formatCurrency(item.offerRate) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <BillSummary actualPrice={order.actualPrice} offerPrice={order.offerPrice} />

      <footer className="mt-8 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
        This is a computer-generated order summary from {COMPANY_NAME}.
      </footer>
    </div>
  )
})

export default OrderDocument
