import { forwardRef } from 'react'
import BillSummary from './BillSummary'
import { COMPANY_NAME, formatCreatedAt, formatCurrency, formatDate } from '../utils/format'

const ReceiptDocument = forwardRef(function ReceiptDocument({ order, customerName }, ref) {
  const receiptDate = order.createdAt ? formatCreatedAt(order.createdAt) : formatDate()
  const receiptNo = `RCP-${order.orderId.replace(/\s+/g, '')}`

  return (
    <div
      ref={ref}
      className="print-area mx-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white p-8 text-slate-800 shadow-lg ring-1 ring-slate-200/80"
    >
      <header className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{COMPANY_NAME}</h1>
        <p className="mt-1 text-sm text-slate-500">Payment Receipt</p>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
      </header>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Receipt No.</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-slate-800">{receiptNo}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Date</p>
          <p className="mt-0.5 font-medium text-slate-800">{receiptDate}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Order ID</p>
          <p className="mt-0.5 font-mono font-semibold text-indigo-600">{order.orderId}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Customer ID</p>
          <p className="mt-0.5 font-mono font-medium text-slate-800">{order.customerId}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Customer</p>
          <p className="mt-0.5 font-semibold text-slate-900">{customerName || '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Service</p>
          <p className="mt-0.5 font-medium text-slate-800">{order.service}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Order Status</p>
          <p className="mt-0.5 font-medium text-slate-800">{order.status}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Payment Status</p>
          <p className="mt-0.5 font-medium text-slate-800">{order.paymentStatus}</p>
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
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((item, index) => (
              <tr key={`${item.templateCode}-${index}`} className="border-b border-slate-100">
                <td className="py-3 pr-2 font-medium text-slate-900">{item.resumeName}</td>
                <td className="py-3 pr-2 font-mono text-xs text-indigo-600">{item.templateCode}</td>
                <td className="py-3 text-right text-slate-700">{formatCurrency(item.actualRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <BillSummary actualPrice={order.actualPrice} offerPrice={order.offerPrice} />

      <p className="mt-6 text-center text-sm leading-relaxed text-slate-600">
        Thank you for choosing {COMPANY_NAME}. Payment recorded for order {order.orderId}.
      </p>

      <footer className="mt-8 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
        This receipt is valid as proof of payment. For queries, contact {COMPANY_NAME}.
      </footer>
    </div>
  )
})

export default ReceiptDocument
