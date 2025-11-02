import { NextRequest, NextResponse } from 'next/server'
import { InMemoryDatabase } from '@/lib/in-memory-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const inStockOnly = searchParams.get('inStockOnly') === 'true'

    const products = await InMemoryDatabase.getProducts(category, search, inStockOnly)

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}