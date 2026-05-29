import { useState } from 'react'
import OrderFormFields from './OrderFormFields'
import { emptyOrderLine } from './orderFormConstants'

export default function EditOrderModal({ order, customers, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState({
    customerId: order.customerId,
    status: order.status,
    service: order.service,
    paymentStatus: order.paymentStatus,
  })
  const [orderDetails, setOrderDetails] = useState(
    order.orderDetails.map((line) => ({
      resumeName: line.resumeName,
      templateCode: line.templateCode,
      actualRate: String(line.actualRate),
      offerRate: String(line.offerRate),
    }))
  )
  const [error, setError] = useState('')

  function updateLine(index, field, value) {
    setOrderDetails((lines) =>
      lines.map((line, i) => (i === index ? { ...line, [field]: value } : line))
    )
  }

  function addLine() {
    setOrderDetails((lines) => [...lines, { ...emptyOrderLine }])
  }

  function removeLine(index) {
    setOrderDetails((lines) => (lines.length > 1 ? lines.filter((_, i) => i !== index) : lines))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      await onSubmit({
        ...form,
        orderDetails: orderDetails.map((line) => ({
          resumeName: line.resumeName,
          templateCode: line.templateCode,
          actualRate: Number(line.actualRate),
          offerRate: Number(line.offerRate),
        })),
      })
      onClose()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Edit order</h3>
            <p className="text-sm text-slate-500 font-mono">{order.orderId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-4 overflow-y-auto px-5 py-4">
            <OrderFormFields
              form={form}
              setForm={setForm}
              orderDetails={orderDetails}
              updateLine={updateLine}
              addLine={addLine}
              removeLine={removeLine}
              customers={customers}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
