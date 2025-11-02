'use client'

import { useState, useEffect } from 'react'
import { Card, Table, Input, Select, Space, Typography, Tag, Button } from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import { prisma } from '@/lib/prisma'
import { ProductWithRelations } from '@/types'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

export default function StorePage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchText, selectedCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const where: any = {
        inStock: {
          gt: 0,
        },
      }

      if (searchText) {
        where.OR = [
          { name: { contains: searchText, mode: 'insensitive' } },
          { manufacturer: { contains: searchText, mode: 'insensitive' } },
          { productCode: { equals: parseInt(searchText) || 0 } },
        ]
      }

      if (selectedCategory) {
        where.categoryId = selectedCategory
      }

      const data = await prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          location: {
            select: {
              id: true,
              warehouseCode: true,
              aisle: true,
              rack: true,
              shelf: true,
              bin: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      })

      const formattedData: ProductWithRelations[] = data.map(item => ({
        ...item,
        buyPrice: Number(item.buyPrice),
      }))

      setProducts(formattedData)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const getStockStatus = (product: ProductWithRelations) => {
    if (product.inStock <= product.lowStockThreshold) {
      return { color: 'red', text: 'Low Stock' }
    }
    if (product.inStock <= product.lowStockThreshold * 2) {
      return { color: 'orange', text: 'Medium Stock' }
    }
    return { color: 'green', text: 'In Stock' }
  }

  const formatLocation = (location: any) => {
    if (!location) return 'N/A'
    return `${location.warehouseCode}-${location.aisle}${location.rack}${location.shelf}${location.bin}`
  }

  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: any) => category?.name || 'N/A',
    },
    {
      title: 'Stock',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (stock: number, record: ProductWithRelations) => {
        const status = getStockStatus(record)
        return (
          <Space>
            <span>{stock}</span>
            <Tag color={status.color}>{status.text}</Tag>
          </Space>
        )
      },
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: any) => formatLocation(location),
    },
    {
      title: 'Price',
      dataIndex: 'buyPrice',
      key: 'buyPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: ProductWithRelations) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => console.log('View details:', record)}
        >
          View
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Title level={2}>Store - Product Search</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space wrap>
            <Search
              placeholder="Search by name, manufacturer, or product code"
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 300 }}
              onSearch={setSearchText}
              onChange={(e) => !e.target.value && setSearchText('')}
            />
            <Select
              placeholder="Select Category"
              allowClear
              style={{ width: 200 }}
              onChange={setSelectedCategory}
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Space>
        </Card>

        <Card>
          <Table
            columns={columns}
            dataSource={products}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} products`,
            }}
          />
        </Card>
      </Space>
    </div>
  )
}