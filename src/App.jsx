import { useCallback, useEffect, useRef, useState } from 'react'
import OrderList from './components/OrderList'
import CustomerList from './components/CustomerList'
import OrderPreviewModal from './components/OrderPreviewModal'
import EditCustomerModal from './components/EditCustomerModal'
import EditOrderModal from './components/EditOrderModal'
import ReceiptDocument from './components/ReceiptDocument'
import {
  createCustomer,
  createOrder,
  fetchCustomers,
  fetchOrders,
  updateCustomer,
  updateOrder,
} from './api/client'
import { getCustomerById } from './utils/customers'
import { canDownloadReceipt } from './utils/orders'
import { downloadElementAsPdf } from './utils/pdf'
import { COMPANY_NAME } from './utils/format'

const VIEWS = [
  { id: 'orders', label: 'Orders' },
  { id: 'customers', label: 'Customers' },
]

export default function App() {
  const [activeView, setActiveView] = useState('orders')
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [creatingCustomer, setCreatingCustomer] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [updatingCustomer, setUpdatingCustomer] = useState(false)
  const [updatingOrder, setUpdatingOrder] = useState(false)
  const [previewOrder, setPreviewOrder] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [receiptPdfJob, setReceiptPdfJob] = useState(null)
  const [orderDownloading, setOrderDownloading] = useState(false)
  const orderPreviewRef = useRef(null)
  const receiptRef = useRef(null)

  const loadCustomers = useCallback(async () => {
    setLoadingCustomers(true)
    try {
      const data = await fetchCustomers()
      setCustomers(data)
      setLoadError('')
    } catch (error) {
      setLoadError(error.message)
    } finally {
      setLoadingCustomers(false)
    }
  }, [])

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true)
    try {
      const data = await fetchOrders()
      setOrders(data)
      setLoadError('')
    } catch (error) {
      setLoadError(error.message)
    } finally {
      setLoadingOrders(false)
    }
  }, [])

  useEffect(() => {
    // Defer initial fetch so we don't synchronously trigger state updates
    // inside the effect body (keeps ESLint happy + avoids cascading renders).
    const t = setTimeout(() => {
      loadCustomers()
      loadOrders()
    }, 0)

    return () => clearTimeout(t)
  }, [loadCustomers, loadOrders])

  const previewCustomerName = previewOrder
    ? getCustomerById(customers, previewOrder.customerId)?.name
    : null

  useEffect(() => {
    if (!receiptPdfJob) return

    const run = async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

      const fileSlug = receiptPdfJob.order.orderId.replace(/\s+/g, '-')
      const filename = `${COMPANY_NAME.replace(/\s+/g, '-')}-receipt-${fileSlug}.pdf`
      await downloadElementAsPdf(receiptRef.current, filename)
      setReceiptPdfJob(null)
    }

    run()
  }, [receiptPdfJob])

  async function handleCreateCustomer(payload) {
    setCreatingCustomer(true)
    try {
      await createCustomer(payload)
      await loadCustomers()
    } finally {
      setCreatingCustomer(false)
    }
  }

  async function handleUpdateCustomer(payload) {
    if (!editingCustomer) return

    setUpdatingCustomer(true)
    try {
      await updateCustomer(editingCustomer.customerId, payload)
      await loadCustomers()
      setEditingCustomer(null)
    } finally {
      setUpdatingCustomer(false)
    }
  }

  async function handleCreateOrder(payload) {
    setCreatingOrder(true)
    try {
      await createOrder(payload)
      await Promise.all([loadOrders(), loadCustomers()])
    } finally {
      setCreatingOrder(false)
    }
  }

  async function handleUpdateOrder(payload) {
    if (!editingOrder) return

    setUpdatingOrder(true)
    try {
      const updated = await updateOrder(editingOrder.orderId, payload)
      await Promise.all([loadOrders(), loadCustomers()])
      setEditingOrder(null)
      if (previewOrder?.orderId === updated.orderId) {
        setPreviewOrder(updated)
      }
    } finally {
      setUpdatingOrder(false)
    }
  }

  function handleDownloadReceipt(order) {
    if (!canDownloadReceipt(order)) return
    setReceiptPdfJob({ order })
  }

  function handleViewOrderDetails(order) {
    setPreviewOrder(order)
  }

  async function handleDownloadOrderFromPreview() {
    if (!previewOrder || !orderPreviewRef.current) return

    setOrderDownloading(true)
    try {
      const fileSlug = previewOrder.orderId.replace(/\s+/g, '-')
      const filename = `${COMPANY_NAME.replace(/\s+/g, '-')}-order-details-${fileSlug}.pdf`
      await downloadElementAsPdf(orderPreviewRef.current, filename)
    } finally {
      setOrderDownloading(false)
    }
  }

  const receiptOrder = receiptPdfJob?.order ?? null
  const receiptCustomerName = receiptOrder
    ? getCustomerById(customers, receiptOrder.customerId)?.name
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/30 to-slate-100">
      <header className="border-b border-white/60 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                PDF Generator
              </p>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{COMPANY_NAME}</h1>
            </div>

            <nav className="flex gap-2 rounded-xl bg-slate-100 p-1">
              {VIEWS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveView(id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeView === id
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
        {loadError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}. Make sure the API server is running on port 5000 and MongoDB is started.
          </div>
        )}

        <section className="rounded-2xl border border-white bg-white p-6 shadow-lg shadow-slate-200/50">
          {activeView === 'orders' ? (
            <OrderList
              orders={orders}
              customers={customers}
              loading={loadingOrders}
              onDownloadReceipt={handleDownloadReceipt}
              onViewOrderDetails={handleViewOrderDetails}
              onCreateOrder={handleCreateOrder}
              onEditOrder={setEditingOrder}
              creating={creatingOrder}
            />
          ) : (
            <CustomerList
              customers={customers}
              loading={loadingCustomers}
              onCreateCustomer={handleCreateCustomer}
              onEditCustomer={setEditingCustomer}
              creating={creatingCustomer}
            />
          )}
        </section>
      </main>

      {previewOrder && (
        <OrderPreviewModal
          order={previewOrder}
          customerName={previewCustomerName}
          orderRef={orderPreviewRef}
          onClose={() => setPreviewOrder(null)}
          onDownload={handleDownloadOrderFromPreview}
          downloading={orderDownloading}
        />
      )}

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSubmit={handleUpdateCustomer}
          submitting={updatingCustomer}
        />
      )}

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          customers={customers}
          onClose={() => setEditingOrder(null)}
          onSubmit={handleUpdateOrder}
          submitting={updatingOrder}
        />
      )}

      {receiptOrder && (
        <div aria-hidden className="pointer-events-none fixed -left-[10000px] top-0 opacity-0">
          <ReceiptDocument
            ref={receiptRef}
            order={receiptOrder}
            customerName={receiptCustomerName}
          />
        </div>
      )}
    </div>
  )
}
