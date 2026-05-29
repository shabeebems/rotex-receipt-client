const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

export default function OrderFormFields({
  form,
  setForm,
  orderDetails,
  updateLine,
  addLine,
  removeLine,
  customers,
  customerDisabled = false,
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-slate-600">Customer</span>
          <select
            required
            disabled={customerDisabled}
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            className={inputClass}
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c.customerId} value={c.customerId}>
                {c.name} ({c.customerId})
              </option>
            ))}
          </select>
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
    </>
  )
}
