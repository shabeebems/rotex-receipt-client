import CreateCustomerForm from './CreateCustomerForm'

export default function CustomerList({
  customers,
  loading,
  onCreateCustomer,
  creating,
}) {
  if (loading) {
    return <p className="text-sm text-slate-500">Loading customers…</p>
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800">Customers</h2>
      <p className="mt-1 text-sm text-slate-500">Registered customers and contact details.</p>

      <CreateCustomerForm onSubmit={onCreateCustomer} submitting={creating} />

      {customers.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No customers yet. Add one above.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3 text-center">Orders</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{customer.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{customer.name}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.email}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.city}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex min-w-[1.75rem] justify-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                      {customer.ordersCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{customer.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
