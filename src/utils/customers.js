export function getCustomerById(customers, customerId) {
  return customers.find((c) => c.customerId === customerId)
}
