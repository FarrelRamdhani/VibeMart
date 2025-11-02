import { NextRequest, NextResponse } from 'next/server'
import { MockDatabase } from '@/lib/mock-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const startDateFilter = startDate ? new Date(startDate) : undefined
    const endDateFilter = endDate ? new Date(endDate) : undefined

    const [sales, summary] = await Promise.all([
      MockDatabase.getSales(limit, (page - 1) * limit),
      MockDatabase.getSalesSummary(startDateFilter, endDateFilter),
    ])

    // Filter sales by date range
    let filteredSales = sales
    if (startDateFilter || endDateFilter) {
      filteredSales = sales.filter(sale => {
        const saleDate = sale.sellDate
        if (startDateFilter && saleDate < startDateFilter) return false
        if (endDateFilter && saleDate > endDateFilter) return false
        return true
      })
    }

    const total = filteredSales.length

    return NextResponse.json({
      sales: filteredSales.map(sale => ({
        ...sale,
        product: {
          name: sale.productNameSnapshot,
          manufacturer: 'Unknown', // Mock data
          category: {
            name: 'Unknown', // Mock data
          },
        },
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary,
    })
  } catch (error) {
    console.error('Sales API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    )
  }
}