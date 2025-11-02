'use client'

import { useState, useEffect } from 'react'
import { Card, Table, Input, Button, Space, Typography, Modal, message, InputNumber, Select } from 'antd'
import { SearchOutlined, PlusOutlined, MinusOutlined, DeleteOutlined, ShoppingCartOutlined, PrinterOutlined } from '@ant-design/icons'
import { prisma } from '@/lib/prisma'
import { CartItem, ProductWithRelations, ReceiptData } from '@/types'
import { generateReceiptPDF } from '@/utils/pdf-generator'
import { getConfig } from '@/lib/config'
import { v4 as uuidv4 } from 'uuid'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

export default function CashierPage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithRelations | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [productModalVisible, setProductModalVisible] = useState(false)

  const config = getConfig()

  useEffect(() => {
    fetchProducts()
  }, [searchText])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Mock data for testing - same as store page
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
        }
      ]

      // Filter based on search (only items with stock > 0)
      let filteredProducts = mockProducts.filter(product => product.inStock > 0)

      if (searchText) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          product.manufacturer.toLowerCase().includes(searchText.toLowerCase()) ||
          product.productCode.toString().includes(searchText)
        )
      }

      setProducts(filteredProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: ProductWithRelations, qty: number) => {
    if (qty > product.inStock) {
      message.error('Insufficient stock available')
      return
    }

    const sellPrice = Number(product.buyPrice) * 1.5 // 50% markup
    const sellTax = sellPrice * config.receipt.tax_rate
    const sellTotal = (sellPrice + sellTax) * qty

    const cartItem: CartItem = {
      id: uuidv4(),
      productId: product.id,
      productName: product.name,
      productCode: product.productCode,
      quantity: qty,
      sellPrice,
      sellTax,
      sellTotal,
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.productId === product.productId)
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.productId
            ? {
                ...item,
                quantity: item.quantity + qty,
                sellTotal: (item.sellPrice + item.sellTax) * (item.quantity + qty),
              }
            : item
        )
      }
      return [...prev, cartItem]
    })

    setProductModalVisible(false)
    setQuantity(1)
    setSelectedProduct(null)
    message.success('Added to cart')
  }

  const updateCartItem = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity,
              sellTotal: (item.sellPrice + item.sellTax) * newQuantity,
            }
          : item
      )
    )
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0)
    const taxTotal = cart.reduce((sum, item) => sum + (item.sellTax * item.quantity), 0)
    const totalAmount = cart.reduce((sum, item) => sum + item.sellTotal, 0)

    return { subtotal, taxTotal, totalAmount }
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      message.error('Cart is empty')
      return
    }

    setCheckoutLoading(true)
    try {
      const { subtotal, taxTotal, totalAmount } = calculateTotals()
      const receiptId = uuidv4()

      // Prepare checkout data
      const checkoutData = {
        cartItems: cart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          productCode: item.productCode,
          quantity: item.quantity,
          sellPrice: item.sellPrice,
          sellTax: item.sellTax,
          sellTotal: item.sellTotal,
        })),
        subtotal,
        taxTotal,
        totalAmount,
      }

      // Process checkout via API
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      })

      const checkoutResult = await checkoutResponse.json()

      if (!checkoutResponse.ok) {
        throw new Error(checkoutResult.error || 'Checkout failed')
      }

      // Generate and download PDF receipt
      const receiptData: ReceiptData = {
        id: receiptId,
        items: checkoutData.cartItems,
        subtotal,
        taxTotal,
        totalAmount,
        createdAt: new Date(),
      }

      // Generate PDF via API
      const pdfResponse = await fetch('/api/receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData),
      })

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate receipt')
      }

      // Download PDF
      const pdfBlob = await pdfResponse.blob()
      const pdfUrl = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `receipt_${receiptId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(pdfUrl)

      message.success(`Checkout completed! Receipt #${receiptId} downloaded.`)
      setCart([])
      
      // Refresh products to show updated stock
      fetchProducts()
    } catch (error) {
      console.error('Checkout error:', error)
      message.error(`Checkout failed: ${error}`)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const productColumns = [
    {
      title: 'Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Stock',
      dataIndex: 'inStock',
      key: 'inStock',
      width: 80,
    },
    {
      title: 'Price',
      dataIndex: 'buyPrice',
      key: 'buyPrice',
      width: 100,
      render: (price: number) => `$${(price * 1.5).toFixed(2)}`, // Show sell price
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record: ProductWithRelations) => (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedProduct(record)
            setProductModalVisible(true)
          }}
        >
          Add
        </Button>
      ),
    },
  ]

  const cartColumns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (quantity: number, record: CartItem) => (
        <Space>
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => updateCartItem(record.id, quantity - 1)}
          />
          <span>{quantity}</span>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => updateCartItem(record.id, quantity + 1)}
          />
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Tax',
      dataIndex: 'sellTax',
      key: 'sellTax',
      render: (tax: number) => `$${tax.toFixed(2)}`,
    },
    {
      title: 'Total',
      dataIndex: 'sellTotal',
      key: 'sellTotal',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id)}
        />
      ),
    },
  ]

  const { subtotal, taxTotal, totalAmount } = calculateTotals()

  return (
    <div>
      <Title level={2}>Cashier - Point of Sale</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space>
            <Search
              placeholder="Search products..."
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 300 }}
              onSearch={setSearchText}
              onChange={(e) => !e.target.value && setSearchText('')}
            />
          </Space>
        </Card>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Card title="Products" size="small">
              <Table
                columns={productColumns}
                dataSource={products}
                loading={loading}
                rowKey="id"
                size="small"
                pagination={{
                  pageSize: 8,
                  size: 'small',
                }}
              />
            </Card>
          </div>

          <div style={{ width: 500 }}>
            <Card 
              title={
                <Space>
                  <ShoppingCartOutlined />
                  Shopping Cart
                </Space>
              }
              size="small"
              extra={
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  loading={checkoutLoading}
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  Checkout
                </Button>
              }
            >
              <Table
                columns={cartColumns}
                dataSource={cart}
                rowKey="id"
                size="small"
                pagination={false}
                footer={() => (
                  <div style={{ textAlign: 'right' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>Subtotal: ${subtotal.toFixed(2)}</div>
                      <div>Tax: ${taxTotal.toFixed(2)}</div>
                      <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                        Total: ${totalAmount.toFixed(2)}
                      </div>
                    </Space>
                  </div>
                )}
              />
            </Card>
          </div>
        </div>
      </Space>

      <Modal
        title="Add to Cart"
        open={productModalVisible}
        onCancel={() => {
          setProductModalVisible(false)
          setSelectedProduct(null)
          setQuantity(1)
        }}
        onOk={() => selectedProduct && addToCart(selectedProduct, quantity)}
        okText="Add to Cart"
      >
        {selectedProduct && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <div><strong>Product:</strong> {selectedProduct.name}</div>
            <div><strong>Available Stock:</strong> {selectedProduct.inStock}</div>
            <div><strong>Unit Price:</strong> ${(selectedProduct.buyPrice * 1.5).toFixed(2)}</div>
            <div>
              <strong>Quantity:</strong>
              <InputNumber
                min={1}
                max={selectedProduct.inStock}
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
                style={{ marginLeft: 8 }}
              />
            </div>
            <div><strong>Total:</strong> ${((selectedProduct.buyPrice * 1.5) * quantity).toFixed(2)}</div>
          </Space>
        )}
      </Modal>
    </div>
  )
}