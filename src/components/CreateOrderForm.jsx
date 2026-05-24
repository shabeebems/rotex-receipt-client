import { useState } from 'react'

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

const emptyLine = {
  resumeName: '',
  templateCode: '',
  actualRate: '',
  offerRate: '',
}

const emptyForm = {
  customerId: '',
  orderDate: '',
  status: 'In progress',
  service: 'Resume Building',
  paymentStatus: 'Pending',
}

export default function CreateOrderForm({ customers, onSubmit, submitting }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [orderDetails, setOrderDetails] = useState([{ ...emptyLine }])
  const [error, setError] = useState('')

  function updateLine(index, field, value) {
    setOrderDetails((lines) =>
      lines.map((line, i) => (i === index ? { ...line, [field]: value } : line))
    )
  }

  function addLine() {
    setOrderDetails((lines) => [...lines, { ...emptyLine }])
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
      setForm(emptyForm)
      setOrderDetails([{ ...emptyLine }])
      setOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700"
      >
        <span>Add order</span>
        <span className="text-indigo-600">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-200 px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-slate-600">Customer</span>
              <select
                required
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                className={inputClass}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Order date</span>
              <input
                required
                value={form.orderDate}
                onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
                className={inputClass}
                placeholder="23 May 2026"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Service</span>
              <input
                required
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option>In progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Payment status</span>
              <select
                value={form.paymentStatus}
                onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                className={inputClass}
              >
                <option>Pending</option>
                <option>Partial</option>
                <option>Paid</option>
              </select>
            </label>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Resume line items
            </p>
            {orderDetails.map((line, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-5"
              >
                <input
                  required
                  placeholder="Resume for"
                  value={line.resumeName}
                  onChange={(e) => updateLine(index, 'resumeName', e.target.value)}
                  className={inputClass}
                />
                <input
                  required
                  placeholder="Template code"
                  value={line.templateCode}
                  onChange={(e) => updateLine(index, 'templateCode', e.target.value)}
                  className={inputClass}
                />
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="Actual rate"
                  value={line.actualRate}
                  onChange={(e) => updateLine(index, 'actualRate', e.target.value)}
                  className={inputClass}
                />
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="Offer rate"
                  value={line.offerRate}
                  onChange={(e) => updateLine(index, 'offerRate', e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeLine(index)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLine}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              + Add line item
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting || customers.length === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Create order'}
          </button>
          {customers.length === 0 && (
            <p className="text-xs text-amber-600">Create a customer before adding an order.</p>
          )}
        </form>
      )}
    </div>
  )
}
