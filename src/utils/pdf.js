import { domToPng } from 'modern-screenshot'
import { jsPDF } from 'jspdf'

const PX_TO_MM = 0.264583

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

export async function downloadElementAsPdf(element, filename) {
  if (!element) return

  const dataUrl = await domToPng(element, {
    scale: 2,
    quality: 1,
    backgroundColor: '#ffffff',
  })

  const img = await loadImage(dataUrl)
  const pdfWidthMm = img.width * PX_TO_MM
  const pdfHeightMm = img.height * PX_TO_MM

  const pdf = new jsPDF({
    orientation: pdfWidthMm > pdfHeightMm ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [pdfWidthMm, pdfHeightMm],
    compress: true,
  })

  pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'FAST')
  pdf.save(filename)
}

export function printElement() {
  window.print()
}
