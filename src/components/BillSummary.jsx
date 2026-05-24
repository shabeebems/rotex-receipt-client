import { calcDiscount, formatCurrency } from '../utils/format'

export default function BillSummary({ actualPrice, offerPrice }) {
  const { saved } = calcDiscount(actualPrice, offerPrice)

  return (
    <section className="mt-6 text-sm">
      <div className="space-y-3 border-b border-dashed border-slate-200 pb-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-600">Listed Price</span>
          <span className="font-medium text-slate-900">{formatCurrency(actualPrice)}</span>
        </div>
        {saved > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-600">Discount</span>
            <span className="font-medium text-emerald-600">− {formatCurrency(saved)}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-600">Discount</span>
            <span className="text-slate-400">—</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 pt-4">
        <span className="text-base font-bold text-slate-900">Total Amount</span>
        <span className="text-lg font-bold text-slate-900">{formatCurrency(offerPrice)}</span>
      </div>

      {saved > 0 && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">
          You save {formatCurrency(saved)} on this order
        </p>
      )}
    </section>
  )
}
