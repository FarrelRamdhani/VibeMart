'use client'

import { useState, useEffect } from 'react'
import { Card, Table, DatePicker, Button, Space, Typography, Tabs, Statistic, Row, Col } from 'antd'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import { prisma } from '@/lib/prisma'
import { TransactionLog } from '@/types'
import dayjs from 'dayjs'

const { Title } = Typography
const { RangePicker } = DatePicker

export default function BookkeepingPage() {
  const [transactions, setTransactions] = useState<TransactionLog[]>([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [dateRange])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const where = dateRange ? {
        createdAt: {
          gte: dateRange[0].toDate(),
          lte: dateRange[1].toDate(),
        },
      } : {}

      const data = await prisma.transaction.findMany({
        where,
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const formattedData: TransactionLog[] = data.map(item => ({
        id: item.id,
        type: item.type,
        description: item.description,
        amount: Number(item.amount),
        productId: item.productId || undefined,
        quantity: item.quantity || undefined,
        createdAt: item.createdAt,
        productName: item.product?.name,
      }))

      setTransactions(formattedData)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateGAAPReport = async () => {
    try {
      const sales = await prisma.sale.aggregate({
        _sum: {
          sellTotal: true,
          sellTax: true,
        },
        where: dateRange ? {
          sellDate: {
            gte: dateRange[0].toDate(),
            lte: dateRange[1].toDate(),
          },
        } : {},
      })

      const purchases = await prisma.receipt.aggregate({
        _sum: {
          quantity: true,
          unitBuyPrice: true,
        },
        where: dateRange ? {
          receivedDate: {
            gte: dateRange[0].toDate(),
            lte: dateRange[1].toDate(),
          },
        } : {},
      })

      const totalRevenue = Number(sales._sum.sellTotal || 0)
      const totalTax = Number(sales._sum.sellTax || 0)
      const totalPurchases = Number(purchases._sum.quantity || 0) * Number(purchases._sum.unitBuyPrice || 0)

      return {
        revenue: totalRevenue,
        tax: totalTax,
        purchases: totalPurchases,
        grossProfit: totalRevenue - totalPurchases,
        netProfit: totalRevenue - totalPurchases - totalTax,
      }
    } catch (error) {
      console.error('Error generating GAAP report:', error)
      return null
    }
  }

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (name: string) => name || '-',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => qty || '-',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
  ]

  return (
    <div>
      <Title level={2}>Bookkeeping</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space>
            <RangePicker onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)} />
            <Button icon={<DownloadOutlined />} onClick={() => console.log('Export functionality')}>
              Export Report
            </Button>
          </Space>
        </Card>

        <GAAPSummary dateRange={dateRange} />

        <Tabs defaultActiveKey="transactions">
          <Tabs.TabPane tab="Transaction Log" key="transactions">
            <Card>
              <Table
                columns={transactionColumns}
                dataSource={transactions}
                loading={loading}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                }}
              />
            </Card>
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="GAAP Reports" key="gaap">
            <GAAPReports dateRange={dateRange} />
          </Tabs.TabPane>
        </Tabs>
      </Space>
    </div>
  )
}

function GAAPSummary({ dateRange }: { dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null }) {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSummary()
  }, [dateRange])

  const fetchSummary = async () => {
    setLoading(true)
    try {
      const sales = await prisma.sale.aggregate({
        _sum: {
          sellTotal: true,
          sellTax: true,
        },
        where: dateRange ? {
          sellDate: {
            gte: dateRange[0].toDate(),
            lte: dateRange[1].toDate(),
          },
        } : {},
      })

      const purchases = await prisma.receipt.aggregate({
        _sum: {
          quantity: true,
          unitBuyPrice: true,
        },
        where: dateRange ? {
          receivedDate: {
            gte: dateRange[0].toDate(),
            lte: dateRange[1].toDate(),
          },
        } : {},
      })

      const totalRevenue = Number(sales._sum.sellTotal || 0)
      const totalTax = Number(sales._sum.sellTax || 0)
      const totalPurchases = Number(purchases._sum.quantity || 0) * Number(purchases._sum.unitBuyPrice || 0)

      setSummary({
        revenue: totalRevenue,
        tax: totalTax,
        purchases: totalPurchases,
        grossProfit: totalRevenue - totalPurchases,
        netProfit: totalRevenue - totalPurchases - totalTax,
      })
    } catch (error) {
      console.error('Error fetching summary:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Total Revenue"
            value={summary?.revenue || 0}
            precision={2}
            prefix="$"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Total Purchases"
            value={summary?.purchases || 0}
            precision={2}
            prefix="$"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Gross Profit"
            value={summary?.grossProfit || 0}
            precision={2}
            prefix="$"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card loading={loading}>
          <Statistic
            title="Net Profit"
            value={summary?.netProfit || 0}
            precision={2}
            prefix="$"
          />
        </Card>
      </Col>
    </Row>
  )
}

function GAAPReports({ dateRange }: { dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null }) {
  const [reports, setReports] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [dateRange])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const sales = await prisma.sale.findMany({
        where: dateRange ? {
          sellDate: {
            gte: dateRange[0].toDate(),
            lte: dateRange[1].toDate(),
          },
        } : {},
        include: {
          product: {
            select: {
              name: true,
              buyPrice: true,
            },
          },
        },
      })

      const receipts = await prisma.receipt.findMany({
        where: dateRange ? {
          receivedDate: {
            gte: dateRange[0].toDate(),
            lte: dateRange[1].toDate(),
          },
        } : {},
      })

      const incomeStatement = {
        revenue: sales.reduce((sum, sale) => sum + Number(sale.sellTotal), 0),
        cogs: sales.reduce((sum, sale) => sum + (Number(sale.product.buyPrice) * sale.quantity), 0),
        grossProfit: 0,
        expenses: receipts.reduce((sum, receipt) => sum + (Number(receipt.unitBuyPrice) * receipt.quantity), 0),
        netIncome: 0,
      }

      incomeStatement.grossProfit = incomeStatement.revenue - incomeStatement.cogs
      incomeStatement.netIncome = incomeStatement.grossProfit - incomeStatement.expenses

      setReports({
        incomeStatement,
        balanceSheet: {
          assets: 'Calculated based on inventory value',
          liabilities: 'Calculated based on payables',
          equity: 'Calculated based on retained earnings',
        },
      })
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="Income Statement" loading={loading}>
        <Table
          dataSource={[
            { key: 'revenue', item: 'Revenue', amount: reports?.incomeStatement?.revenue || 0 },
            { key: 'cogs', item: 'Cost of Goods Sold', amount: reports?.incomeStatement?.cogs || 0 },
            { key: 'grossProfit', item: 'Gross Profit', amount: reports?.incomeStatement?.grossProfit || 0 },
            { key: 'expenses', item: 'Expenses', amount: reports?.incomeStatement?.expenses || 0 },
            { key: 'netIncome', item: 'Net Income', amount: reports?.incomeStatement?.netIncome || 0 },
          ]}
          columns={[
            { title: 'Item', dataIndex: 'item', key: 'item' },
            { 
              title: 'Amount', 
              dataIndex: 'amount', 
              key: 'amount',
              render: (amount: number) => `$${amount.toFixed(2)}`,
            },
          ]}
          pagination={false}
        />
      </Card>

      <Card title="Balance Sheet" loading={loading}>
        <Table
          dataSource={[
            { key: 'assets', item: 'Total Assets', amount: 'TBD' },
            { key: 'liabilities', item: 'Total Liabilities', amount: 'TBD' },
            { key: 'equity', item: "Owner's Equity", amount: 'TBD' },
          ]}
          columns={[
            { title: 'Item', dataIndex: 'item', key: 'item' },
            { title: 'Amount', dataIndex: 'amount', key: 'amount' },
          ]}
          pagination={false}
        />
      </Card>
    </Space>
  )
}