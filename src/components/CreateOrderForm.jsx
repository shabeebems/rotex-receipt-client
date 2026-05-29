import { useState } from 'react'
import OrderFormFields from './OrderFormFields'
import { emptyOrderLine } from './orderFormConstants'

const emptyForm = {
  customerId: '',
  status: 'In progress',
  service: 'Resume Building',
  paymentStatus: 'Pending',
}

export default function CreateOrderForm({ customers, onSubmit, submitting }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [orderDetails, setOrderDetails] = useState([{ ...emptyOrderLine }])
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
      setForm(emptyForm)
      setOrderDetails([{ ...emptyOrderLine }])
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
