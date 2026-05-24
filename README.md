# Rotex Resume Makers — Receipt & Order PDF

Generate **order details** and **payment receipts** as PDF for resume building customers.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Features

- Enter customer name, resume code, actual rate, and offer rate
- Live preview for **Order Details** and **Receipt**
- **Download PDF** — saves the active document
- **Print** — opens print dialog for the active document
- Automatic discount calculation when offer rate is lower than actual rate

## Tech stack

- React (Vite)
- Tailwind CSS v4
- jsPDF + html2canvas for PDF export
