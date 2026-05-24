export function getCustomerById(customers, customerId) {
  return customers.find((c) => c.id === customerId || c.customerId === customerId)
}
