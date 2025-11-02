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
      // Mock data for testing - same as warehouse but only items with stock > 0
      const mockProducts: ProductWithRelations[] = [
        {
          id: '1',
          name: 'Laptop Dell XPS 15',
          description: 'High-performance laptop with 4K display',
          manufacturer: 'Dell',
          productCode: 100001,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 15,
          categoryId: 'electronics',
          lowStockWarning: false,
          lowStockThreshold: 20,
          buyPrice: 1200.00,
          locationId: 'loc1',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'electronics', name: 'Electronics', slug: 'electronics' },
          location: { 
            id: 'loc1', 
            warehouseCode: 'WH-01', 
            aisle: 'A', 
            rack: '1', 
            shelf: '1', 
            bin: '1' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '2',
          name: 'Wireless Mouse Logitech',
          description: 'Ergonomic wireless mouse',
          manufacturer: 'Logitech',
          productCode: 100002,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 50,
          categoryId: 'electronics',
          lowStockWarning: false,
          lowStockThreshold: 20,
          buyPrice: 25.00,
          locationId: 'loc2',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'electronics', name: 'Electronics', slug: 'electronics' },
          location: { 
            id: 'loc2', 
            warehouseCode: 'WH-01', 
            aisle: 'A', 
            rack: '1', 
            shelf: '1', 
            bin: '2' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '3',
          name: 'Mechanical Keyboard',
          description: 'RGB mechanical gaming keyboard',
          manufacturer: 'Corsair',
          productCode: 100003,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 25,
          categoryId: 'electronics',
          lowStockWarning: false,
          lowStockThreshold: 20,
          buyPrice: 89.99,
          locationId: 'loc3',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'electronics', name: 'Electronics', slug: 'electronics' },
          location: { 
            id: 'loc3', 
            warehouseCode: 'WH-01', 
            aisle: 'A', 
            rack: '1', 
            shelf: '2', 
            bin: '1' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '4',
          name: 'USB-C Hub',
          description: '7-in-1 USB-C hub with HDMI',
          manufacturer: 'Anker',
          productCode: 100004,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 30,
          categoryId: 'electronics',
          lowStockWarning: false,
          lowStockThreshold: 20,
          buyPrice: 45.00,
          locationId: 'loc4',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'electronics', name: 'Electronics', slug: 'electronics' },
          location: { 
            id: 'loc4', 
            warehouseCode: 'WH-01', 
            aisle: 'A', 
            rack: '1', 
            shelf: '2', 
            bin: '2' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '5',
          name: 'Monitor 27" 4K',
          description: '27-inch 4K UHD monitor',
          manufacturer: 'LG',
          productCode: 100005,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 10,
          categoryId: 'electronics',
          lowStockWarning: true,
          lowStockThreshold: 20,
          buyPrice: 350.00,
          locationId: 'loc5',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'electronics', name: 'Electronics', slug: 'electronics' },
          location: { 
            id: 'loc5', 
            warehouseCode: 'WH-01', 
            aisle: 'A', 
            rack: '2', 
            shelf: '1', 
            bin: '1' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '8',
          name: 'Desk Lamp LED',
          description: 'Adjustable LED desk lamp',
          manufacturer: 'Philips',
          productCode: 100008,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 40,
          categoryId: 'furniture',
          lowStockWarning: false,
          lowStockThreshold: 20,
          buyPrice: 35.00,
          locationId: 'loc8',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'furniture', name: 'Furniture', slug: 'furniture' },
          location: { 
            id: 'loc8', 
            warehouseCode: 'WH-01', 
            aisle: 'B', 
            rack: '1', 
            shelf: '2', 
            bin: '1' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '11',
          name: 'Notebook Set',
          description: 'Premium notebook set with pens',
          manufacturer: 'Moleskine',
          productCode: 100011,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 100,
          categoryId: 'office-supplies',
          lowStockWarning: false,
          lowStockThreshold: 20,
          buyPrice: 15.00,
          locationId: 'loc11',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'office-supplies', name: 'Office Supplies', slug: 'office-supplies' },
          location: { 
            id: 'loc11', 
            warehouseCode: 'WH-01', 
            aisle: 'C', 
            rack: '1', 
            shelf: '1', 
            bin: '2' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '12',
          name: 'Pen Set Premium',
          description: 'Executive pen set',
          manufacturer: 'Montblanc',
          productCode: 100012,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 20,
          categoryId: 'office-supplies',
          lowStockWarning: false,
          lowStockThreshold: 20,
          buyPrice: 75.00,
          locationId: 'loc12',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'office-supplies', name: 'Office Supplies', slug: 'office-supplies' },
          location: { 
            id: 'loc12', 
            warehouseCode: 'WH-01', 
            aisle: 'C', 
            rack: '1', 
            shelf: '2', 
            bin: '1' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '13',
          name: 'Printer Paper A4',
          description: 'High-quality A4 printer paper',
          manufacturer: 'HP',
          productCode: 100013,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 200,
          categoryId: 'office-supplies',
          lowStockWarning: false,
          lowStockThreshold: 20,
          buyPrice: 12.00,
          locationId: 'loc13',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'office-supplies', name: 'Office Supplies', slug: 'office-supplies' },
          location: { 
            id: 'loc13', 
            warehouseCode: 'WH-01', 
            aisle: 'C', 
            rack: '1', 
            shelf: '2', 
            bin: '2' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '14',
          name: 'Stapler Heavy Duty',
          description: 'Heavy-duty stapler for office use',
          manufacturer: 'Swingline',
          productCode: 100014,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 35,
          categoryId: 'office-supplies',
          lowStockWarning: false,
          lowStockThreshold: 20,
          buyPrice: 18.00,
          locationId: 'loc14',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'office-supplies', name: 'Office Supplies', slug: 'office-supplies' },
          location: { 
            id: 'loc14', 
            warehouseCode: 'WH-01', 
            aisle: 'C', 
            rack: '2', 
            shelf: '1', 
            bin: '1' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '15',
          name: 'Coffee Maker',
          description: 'Single-serve coffee maker',
          manufacturer: 'Keurig',
          productCode: 100015,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 15,
          categoryId: 'appliances',
          lowStockWarning: false,
          lowStockThreshold: 20,
          buyPrice: 89.00,
          locationId: 'loc15',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'appliances', name: 'Appliances', slug: 'appliances' },
          location: { 
            id: 'loc15', 
            warehouseCode: 'WH-01', 
            aisle: 'D', 
            rack: '1', 
            shelf: '1', 
            bin: '1' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '17',
          name: 'Microwave Compact',
          description: 'Compact microwave oven',
          manufacturer: 'Panasonic',
          productCode: 100017,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 10,
          categoryId: 'appliances',
          lowStockWarning: true,
          lowStockThreshold: 20,
          buyPrice: 95.00,
          locationId: 'loc17',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'appliances', name: 'Appliances', slug: 'appliances' },
          location: { 
            id: 'loc17', 
            warehouseCode: 'WH-01', 
            aisle: 'D', 
            rack: '1', 
            shelf: '2', 
            bin: '1' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '19',
          name: 'Security Camera',
          description: 'Wireless security camera system',
          manufacturer: 'Ring',
          productCode: 100019,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 12,
          categoryId: 'security',
          lowStockWarning: true,
          lowStockThreshold: 20,
          buyPrice: 199.00,
          locationId: 'loc19',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'security', name: 'Security', slug: 'security' },
          location: { 
            id: 'loc19', 
            warehouseCode: 'WH-01', 
            aisle: 'E', 
            rack: '1', 
            shelf: '1', 
            bin: '1' 
          },
          receipts: [],
          sales: [],
          alerts: []
        }
      ]

      // Filter based on search and category (only items with stock > 0)
      let filteredProducts = mockProducts.filter(product => product.inStock > 0)

      if (searchText) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          product.manufacturer.toLowerCase().includes(searchText.toLowerCase()) ||
          product.productCode.toString().includes(searchText)
        )
      }

      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product =>
          product.category.name.toLowerCase() === selectedCategory.toLowerCase()
        )
      }

      setProducts(filteredProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // Mock categories for testing
      const mockCategories = [
        { id: 'electronics', name: 'Electronics', slug: 'electronics' },
        { id: 'furniture', name: 'Furniture', slug: 'furniture' },
        { id: 'office-supplies', name: 'Office Supplies', slug: 'office-supplies' },
        { id: 'appliances', name: 'Appliances', slug: 'appliances' },
        { id: 'security', name: 'Security', slug: 'security' }
      ]
      setCategories(mockCategories)
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