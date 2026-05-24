const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`)
  }

  return data
}

export function fetchCustomers() {
  return request('/customers')
}

export function createCustomer(payload) {
  return request('/customers', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateCustomer(customerId, payload) {
  return request(`/customers/${encodeURIComponent(customerId)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function fetchOrders() {
  return request('/orders')
}

export function createOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateOrder(orderId, payload) {
  return request(`/orders/${encodeURIComponent(orderId)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
