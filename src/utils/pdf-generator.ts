import puppeteer from 'puppeteer'
import { getConfig } from '@/lib/config'
import { ReceiptData } from '@/types'

export async function generateReceiptPDF(receiptData: ReceiptData): Promise<Buffer> {
  const config = getConfig()
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Receipt - ${config.company.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          font-size: 14px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .company-info {
          font-size: 12px;
          color: #666;
        }
        .receipt-info {
          margin-bottom: 20px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .items-table th,
        .items-table td {
          border-bottom: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .items-table th {
          font-weight: bold;
          background-color: #f5f5f5;
        }
        .totals {
          text-align: right;
          margin-bottom: 20px;
        }
        .total-row {
          margin: 5px 0;
        }
        .grand-total {
          font-weight: bold;
          font-size: 16px;
          border-top: 2px solid #333;
          padding-top: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">${config.receipt.header}</div>
        <div class="company-info">
          ${config.company.name}<br>
          ${config.company.address}<br>
          ${config.company.phone}<br>
          ${config.company.email}
        </div>
      </div>

      <div class="receipt-info">
        <strong>Receipt #:</strong> ${receiptData.id}<br>
        <strong>Date:</strong> ${receiptData.createdAt.toLocaleString()}<br>
        ${receiptData.customerInfo?.name ? `<strong>Customer:</strong> ${receiptData.customerInfo.name}<br>` : ''}
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${receiptData.items.map(item => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.quantity}</td>
              <td>${config.receipt.currency_symbol}${item.sellPrice.toFixed(2)}</td>
              <td>${config.receipt.currency_symbol}${item.sellTotal.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">Subtotal: ${config.receipt.currency_symbol}${receiptData.subtotal.toFixed(2)}</div>
        <div class="total-row">Tax (${(config.receipt.tax_rate * 100).toFixed(0)}%): ${config.receipt.currency_symbol}${receiptData.taxTotal.toFixed(2)}</div>
        <div class="total-row grand-total">Total: ${config.receipt.currency_symbol}${receiptData.totalAmount.toFixed(2)}</div>
      </div>

      <div class="footer">
        ${config.receipt.footer}<br>
        Thank you for your business!
      </div>
    </body>
    </html>
  `

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  
  await page.setContent(html, { waitUntil: 'networkidle0' })
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  })
  
  await browser.close()
  
  return pdfBuffer
}