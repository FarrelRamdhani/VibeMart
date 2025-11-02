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

      const data = await prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
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

      // Create sales records
      for (const item of cart) {
        // Update product stock
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            inStock: {
              decrement: item.quantity,
            },
          },
        })

        // Create sale record
        await prisma.sale.create({
          data: {
            id: uuidv4(),
            productId: item.productId,
            productNameSnapshot: item.productName,
            productCodeSnapshot: item.productCode,
            sellPrice: item.sellPrice,
            sellTax: item.sellTax,
            sellDate: new Date(),
            quantity: item.quantity,
            sellTotal: item.sellTotal,
          },
        })

        // Create transaction record
        await prisma.transaction.create({
          data: {
            id: uuidv4(),
            type: 'SALE',
            description: `Sale of ${item.productName} (${item.quantity} units)`,
            amount: item.sellTotal,
            productId: item.productId,
            quantity: item.quantity,
          },
        })
      }

      // Generate and save PDF receipt
      const receiptData: ReceiptData = {
        id: receiptId,
        items: cart.map(item => ({
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
        createdAt: new Date(),
      }

      const pdfBuffer = await generateReceiptPDF(receiptData)
      
      // Save PDF to file system (in production, you'd save to cloud storage)
      const fs = require('fs')
      const path = require('path')
      const receiptsDir = path.join(process.cwd(), 'receipts')
      
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir)
      }
      
      const receiptPath = path.join(receiptsDir, `receipt_${receiptId}.pdf`)
      fs.writeFileSync(receiptPath, pdfBuffer)

      message.success('Checkout completed successfully!')
      setCart([])
    } catch (error) {
      console.error('Checkout error:', error)
      message.error('Checkout failed. Please try again.')
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