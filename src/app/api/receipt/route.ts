import { NextRequest, NextResponse } from 'next/server'
import { generateReceiptPDF } from '@/utils/pdf-generator'
import { ReceiptData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const receiptData: ReceiptData = await request.json()

    if (!receiptData || !receiptData.items || receiptData.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid receipt data' },
        { status: 400 }
      )
    }

    // Generate PDF
    const pdfBuffer = await generateReceiptPDF(receiptData)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt_${receiptData.id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate receipt PDF' },
      { status: 500 }
    )
  }
}