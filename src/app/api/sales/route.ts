import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (startDate || endDate) {
      where.sellDate = {}
      if (startDate) {
        where.sellDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.sellDate.lte = new Date(endDate)
      }
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          product: {
            select: {
              name: true,
              manufacturer: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          sellDate: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sale.count({ where }),
    ])

    // Calculate totals
    const totals = await prisma.sale.aggregate({
      where,
      _sum: {
        sellTotal: true,
        quantity: true,
      },
    })

    return NextResponse.json({
      sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary: {
        totalRevenue: totals._sum.sellTotal || 0,
        totalItemsSold: totals._sum.quantity || 0,
        totalTransactions: total,
      },
    })
  } catch (error) {
    console.error('Sales API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    )
  }
}