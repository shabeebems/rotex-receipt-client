import OrderDocument from './OrderDocument'

export default function OrderPreviewModal({
  order,
  customerName,
  orderRef,
  onClose,
  onDownload,
  downloading,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-preview-title"
    >
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 id="order-preview-title" className="text-lg font-semibold text-slate-900">
              Order preview
            </h3>
            <p className="text-sm text-slate-500 font-mono">{order.orderId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto bg-slate-50/80 p-4 sm:p-6">
          <OrderDocument ref={orderRef} order={order} customerName={customerName} />
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {downloading ? 'Generating…' : 'Download order PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}
