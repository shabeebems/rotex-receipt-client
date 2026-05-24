export function canDownloadReceipt(order) {
  return order.status === 'Completed' && order.paymentStatus === 'Paid'
}
