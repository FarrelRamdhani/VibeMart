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
      const where: any = {}

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

  const fetchLocations = async () => {
    try {
      const data = await prisma.location.findMany({
        orderBy: [
          { warehouseCode: 'asc' },
          { aisle: 'asc' },
          { rack: 'asc' },
          { shelf: 'asc' },
          { bin: 'asc' },
        ],
      })
      setLocations(data)
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