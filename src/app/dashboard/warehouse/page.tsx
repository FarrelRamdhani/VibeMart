'use client'

import { useState, useEffect } from 'react'
import { Card, Table, Input, Button, Space, Typography, Modal, Form, InputNumber, Select, message, Tabs, Tag } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, StockOutlined, InboxOutlined } from '@ant-design/icons'
import { prisma } from '@/lib/prisma'
import { ProductWithRelations } from '@/types'
import { getConfig } from '@/lib/config'
import { v4 as uuidv4 } from 'uuid'

const { Title } = Typography
const { Search } = Input
const { Option } = Select
const { TextArea } = Input

export default function WarehousePage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [stockModalVisible, setStockModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithRelations | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithRelations | null>(null)
  const [form] = Form.useForm()
  const [stockForm] = Form.useForm()

  const config = getConfig()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchLocations()
  }, [searchText, selectedCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Fetch products from real database
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      const products = data.products || []
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
          category: { id: 'electronics', name: 'Electronics' },
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
          category: { id: 'electronics', name: 'Electronics' },
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
          category: { id: 'electronics', name: 'Electronics' },
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
          category: { id: 'electronics', name: 'Electronics' },
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
          category: { id: 'electronics', name: 'Electronics' },
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
          id: '6',
          name: 'Office Chair Ergonomic',
          description: 'High-back ergonomic office chair',
          manufacturer: 'Herman Miller',
          productCode: 100006,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 8,
          categoryId: 'furniture',
          lowStockWarning: true,
          lowStockThreshold: 20,
          buyPrice: 450.00,
          locationId: 'loc6',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'furniture', name: 'Furniture' },
          location: { 
            id: 'loc6', 
            warehouseCode: 'WH-01', 
            aisle: 'B', 
            rack: '1', 
            shelf: '1', 
            bin: '1' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '7',
          name: 'Standing Desk',
          description: 'Electric height-adjustable standing desk',
          manufacturer: 'Uplift',
          productCode: 100007,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 5,
          categoryId: 'furniture',
          lowStockWarning: true,
          lowStockThreshold: 20,
          buyPrice: 600.00,
          locationId: 'loc7',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'furniture', name: 'Furniture' },
          location: { 
            id: 'loc7', 
            warehouseCode: 'WH-01', 
            aisle: 'B', 
            rack: '1', 
            shelf: '1', 
            bin: '2' 
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
          category: { id: 'furniture', name: 'Furniture' },
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
          id: '9',
          name: 'File Cabinet 4-Drawer',
          description: 'Vertical file cabinet with 4 drawers',
          manufacturer: 'HON',
          productCode: 100009,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 12,
          categoryId: 'furniture',
          lowStockWarning: true,
          lowStockThreshold: 20,
          buyPrice: 150.00,
          locationId: 'loc9',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'furniture', name: 'Furniture' },
          location: { 
            id: 'loc9', 
            warehouseCode: 'WH-01', 
            aisle: 'B', 
            rack: '1', 
            shelf: '2', 
            bin: '2' 
          },
          receipts: [],
          sales: [],
          alerts: []
        },
        {
          id: '10',
          name: 'Whiteboard 4x8',
          description: 'Large magnetic whiteboard',
          manufacturer: 'Quartet',
          productCode: 100010,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 6,
          categoryId: 'office-supplies',
          lowStockWarning: true,
          lowStockThreshold: 20,
          buyPrice: 120.00,
          locationId: 'loc10',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'office-supplies', name: 'Office Supplies' },
          location: { 
            id: 'loc10', 
            warehouseCode: 'WH-01', 
            aisle: 'C', 
            rack: '1', 
            shelf: '1', 
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
          category: { id: 'office-supplies', name: 'Office Supplies' },
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
          category: { id: 'office-supplies', name: 'Office Supplies' },
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
          category: { id: 'office-supplies', name: 'Office Supplies' },
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
          category: { id: 'office-supplies', name: 'Office Supplies' },
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
          category: { id: 'appliances', name: 'Appliances' },
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
          id: '16',
          name: 'Mini Fridge',
          description: 'Compact mini refrigerator',
          manufacturer: 'Danby',
          productCode: 100016,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 7,
          categoryId: 'appliances',
          lowStockWarning: true,
          lowStockThreshold: 20,
          buyPrice: 180.00,
          locationId: 'loc16',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'appliances', name: 'Appliances' },
          location: { 
            id: 'loc16', 
            warehouseCode: 'WH-01', 
            aisle: 'D', 
            rack: '1', 
            shelf: '1', 
            bin: '2' 
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
          category: { id: 'appliances', name: 'Appliances' },
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
          id: '18',
          name: 'Water Cooler',
          description: 'Bottled water cooler dispenser',
          manufacturer: 'Primo',
          productCode: 100018,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 3,
          categoryId: 'appliances',
          lowStockWarning: true,
          lowStockThreshold: 20,
          buyPrice: 250.00,
          locationId: 'loc18',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'appliances', name: 'Appliances' },
          location: { 
            id: 'loc18', 
            warehouseCode: 'WH-01', 
            aisle: 'D', 
            rack: '1', 
            shelf: '2', 
            bin: '2' 
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
          category: { id: 'security', name: 'Security' },
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
        },
        {
          id: '20',
          name: 'Smart Lock',
          description: 'Keyless smart door lock',
          manufacturer: 'August',
          productCode: 100020,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          expirationDate: null,
          inStock: 8,
          categoryId: 'security',
          lowStockWarning: true,
          lowStockThreshold: 20,
          buyPrice: 225.00,
          locationId: 'loc20',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: 'security', name: 'Security' },
          location: { 
            id: 'loc20', 
            warehouseCode: 'WH-01', 
            aisle: 'E', 
            rack: '1', 
            shelf: '1', 
            bin: '2' 
          },
          receipts: [],
          sales: [],
          alerts: []
        }
      ]

      // Filter based on search and category
      let filteredProducts = mockProducts

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
        { id: 'electronics', name: 'Electronics' },
        { id: 'furniture', name: 'Furniture' },
        { id: 'office-supplies', name: 'Office Supplies' },
        { id: 'appliances', name: 'Appliances' },
        { id: 'security', name: 'Security' }
      ]
      setCategories(mockCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchLocations = async () => {
    try {
      // Mock locations for testing
      const mockLocations = []
      for (let i = 1; i <= 20; i++) {
        mockLocations.push({
          id: `loc${i}`,
          warehouseCode: 'WH-01',
          aisle: String.fromCharCode(65 + Math.floor((i - 1) / 4)), // A, B, C, D, E
          rack: Math.floor(((i - 1) % 4) / 2) + 1,
          shelf: ((i - 1) % 2) + 1,
          bin: '1'
        })
      }
      setLocations(mockLocations)
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const getNextProductCode = async () => {
    try {
      const lastProduct = await prisma.product.findFirst({
        orderBy: {
          productCode: 'desc',
        },
        select: {
          productCode: true,
        },
      })

      return lastProduct ? lastProduct.productCode + 1 : config.business.auto_product_code_start
    } catch (error) {
      console.error('Error getting next product code:', error)
      return config.business.auto_product_code_start
    }
  }

  const handleAddProduct = async (values: any) => {
    try {
      const productCode = values.codeSource === 'AUTO' 
        ? await getNextProductCode() 
        : values.productCode

      await prisma.product.create({
        data: {
          id: uuidv4(),
          name: values.name,
          description: values.description,
          manufacturer: values.manufacturer,
          productCode,
          codeSource: values.codeSource,
          latestEntryDate: new Date(),
          expirationDate: values.expirationDate || null,
          inStock: 0,
          categoryId: values.categoryId,
          lowStockWarning: false,
          lowStockThreshold: values.lowStockThreshold || config.business.default_low_stock_threshold,
          buyPrice: values.buyPrice,
          locationId: values.locationId,
        },
      })

      message.success('Product added successfully')
      setProductModalVisible(false)
      form.resetFields()
      fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      message.error('Failed to add product')
    }
  }

  const handleUpdateProduct = async (values: any) => {
    if (!editingProduct) return

    try {
      await prisma.product.update({
        where: { id: editingProduct.id },
        data: {
          name: values.name,
          description: values.description,
          manufacturer: values.manufacturer,
          expirationDate: values.expirationDate || null,
          lowStockThreshold: values.lowStockThreshold,
          buyPrice: values.buyPrice,
          locationId: values.locationId,
        },
      })

      message.success('Product updated successfully')
      setProductModalVisible(false)
      setEditingProduct(null)
      form.resetFields()
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      message.error('Failed to update product')
    }
  }

  const handleStockOperation = async (values: any) => {
    if (!selectedProduct) return

    try {
      const { operation, quantity, unitBuyPrice, reference } = values

      if (operation === 'ADD') {
        // Add stock
        await prisma.product.update({
          where: { id: selectedProduct.id },
          data: {
            inStock: {
              increment: quantity,
            },
            latestEntryDate: new Date(),
          },
        })

        // Create receipt record
        await prisma.receipt.create({
          data: {
            id: uuidv4(),
            productId: selectedProduct.id,
            quantity,
            unitBuyPrice,
            receivedDate: new Date(),
            reference,
          },
        })

        // Create transaction record
        await prisma.transaction.create({
          data: {
            id: uuidv4(),
            type: 'PURCHASE',
            description: `Stock added for ${selectedProduct.name} (${quantity} units)`,
            amount: quantity * unitBuyPrice,
            productId: selectedProduct.id,
            quantity,
          },
        })

        message.success('Stock added successfully')
      } else if (operation === 'REMOVE') {
        if (quantity > selectedProduct.inStock) {
          message.error('Cannot remove more stock than available')
          return
        }

        await prisma.product.update({
          where: { id: selectedProduct.id },
          data: {
            inStock: {
              decrement: quantity,
            },
          },
        })

        // Create transaction record
        await prisma.transaction.create({
          data: {
            id: uuidv4(),
            type: 'INVENTORY_ADJUSTMENT',
            description: `Stock removed for ${selectedProduct.name} (${quantity} units)`,
            amount: quantity * selectedProduct.buyPrice,
            productId: selectedProduct.id,
            quantity: -quantity,
          },
        })

        message.success('Stock removed successfully')
      }

      setStockModalVisible(false)
      stockForm.resetFields()
      setSelectedProduct(null)
      fetchProducts()
    } catch (error) {
      console.error('Error updating stock:', error)
      message.error('Failed to update stock')
    }
  }

  const getStockStatus = (product: ProductWithRelations) => {
    if (product.inStock <= product.lowStockThreshold) {
      return { color: 'red', text: 'Low Stock' }
    }
    if (product.inStock === 0) {
      return { color: 'red', text: 'Out of Stock' }
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
      title: 'Buy Price',
      dataIndex: 'buyPrice',
      key: 'buyPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record: ProductWithRelations) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record)
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                manufacturer: record.manufacturer,
                expirationDate: record.expirationDate,
                lowStockThreshold: record.lowStockThreshold,
                buyPrice: record.buyPrice,
                locationId: record.locationId,
              })
              setProductModalVisible(true)
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<StockOutlined />}
            onClick={() => {
              setSelectedProduct(record)
              stockForm.setFieldsValue({
                operation: 'ADD',
                quantity: 1,
                unitBuyPrice: record.buyPrice,
              })
              setStockModalVisible(true)
            }}
          >
            Stock
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={2}>Warehouse Management</Title>
      
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingProduct(null)
                form.resetFields()
                form.setFieldsValue({
                  codeSource: 'AUTO',
                  lowStockThreshold: config.business.default_low_stock_threshold,
                })
                setProductModalVisible(true)
              }}
            >
              Add Product
            </Button>
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

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={productModalVisible}
        onCancel={() => {
          setProductModalVisible(false)
          setEditingProduct(null)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingProduct ? handleUpdateProduct : handleAddProduct}
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Manufacturer"
            name="manufacturer"
            rules={[{ required: true, message: 'Please enter manufacturer' }]}
          >
            <Input />
          </Form.Item>

          {!editingProduct && (
            <>
              <Form.Item
                label="Product Code Source"
                name="codeSource"
                rules={[{ required: true, message: 'Please select code source' }]}
              >
                <Select>
                  <Option value="AUTO">Auto Generate</Option>
                  <Option value="MANUAL">Manual Entry</Option>
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.codeSource !== currentValues.codeSource}
              >
                {({ getFieldValue }) =>
                  getFieldValue('codeSource') === 'MANUAL' ? (
                    <Form.Item
                      label="Product Code"
                      name="productCode"
                      rules={[{ required: true, message: 'Please enter product code' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </>
          )}

          <Form.Item
            label="Expiration Date"
            name="expirationDate"
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Low Stock Threshold"
            name="lowStockThreshold"
            rules={[{ required: true, message: 'Please enter low stock threshold' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Buy Price"
            name="buyPrice"
            rules={[{ required: true, message: 'Please enter buy price' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Location"
            name="locationId"
            rules={[{ required: true, message: 'Please select location' }]}
          >
            <Select>
              {locations.map(location => (
                <Option key={location.id} value={location.id}>
                  {formatLocation(location)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select>
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Stock Management"
        open={stockModalVisible}
        onCancel={() => {
          setStockModalVisible(false)
          setSelectedProduct(null)
          stockForm.resetFields()
        }}
        onOk={() => stockForm.submit()}
      >
        {selectedProduct && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <div><strong>Product:</strong> {selectedProduct.name}</div>
            <div><strong>Current Stock:</strong> {selectedProduct.inStock}</div>
            
            <Form
              form={stockForm}
              layout="vertical"
              onFinish={handleStockOperation}
            >
              <Form.Item
                label="Operation"
                name="operation"
                rules={[{ required: true, message: 'Please select operation' }]}
              >
                <Select>
                  <Option value="ADD">
                    <Space><InboxOutlined />Add Stock</Space>
                  </Option>
                  <Option value="REMOVE">
                    <Space><StockOutlined />Remove Stock</Space>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.operation !== currentValues.operation}
              >
                {({ getFieldValue }) =>
                  getFieldValue('operation') === 'ADD' ? (
                    <Form.Item
                      label="Unit Buy Price"
                      name="unitBuyPrice"
                      rules={[{ required: true, message: 'Please enter unit buy price' }]}
                    >
                      <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>

              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Reference (Optional)"
                name="reference"
              >
                <Input placeholder="PO number, invoice, etc." />
              </Form.Item>
            </Form>
          </Space>
        )}
      </Modal>
    </div>
  )
}