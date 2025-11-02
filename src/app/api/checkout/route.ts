import { NextRequest, NextResponse } from 'next/server'
import { InMemoryDatabase } from '@/lib/in-memory-db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { cartItems, subtotal, taxTotal, totalAmount } = await request.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    const receiptId = uuidv4()
    const results = []

    // Process each cart item
    for (const item of cartItems) {
      try {
        // Check if product exists and has sufficient stock
        const product = await InMemoryDatabase.findProduct(item.productId)

        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }

        if (product.inStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`)
        }

        const previousStock = product.inStock

        // Update product stock
        const updatedProduct = await InMemoryDatabase.updateProductStock(item.productId, item.quantity)

        // Create sale record
        const sale = await InMemoryDatabase.createSale({
          productId: item.productId,
          productNameSnapshot: item.productName,
          productCodeSnapshot: item.productCode,
          sellPrice: item.sellPrice,
          sellTax: item.sellTax,
          quantity: item.quantity,
          sellTotal: item.sellTotal,
        })

        // Create transaction record
        const transaction = await InMemoryDatabase.createTransaction({
          type: 'SALE',
          description: `Sale of ${item.productName} (${item.quantity} units)`,
          amount: item.sellTotal,
          productId: item.productId,
          quantity: item.quantity,
        })

        results.push({
          productId: item.productId,
          productName: item.productName,
          previousStock,
          newStock: updatedProduct.inStock,
          saleId: sale.id,
          transactionId: transaction.id,
        })
      } catch (error) {
        console.error(`Error processing item ${item.productId}:`, error)
        return NextResponse.json(
          { error: `Failed to process ${item.productName}: ${error}` },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      receiptId,
      message: 'Checkout completed successfully',
      results,
      summary: {
        itemsProcessed: cartItems.length,
        subtotal,
        taxTotal,
        totalAmount,
      },
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Checkout failed. Please try again.' },
      { status: 500 }
    )
  }
}