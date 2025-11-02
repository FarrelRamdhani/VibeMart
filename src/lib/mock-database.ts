import { v4 as uuidv4 } from 'uuid'

// Mock database for development when real database isn't available
interface MockProduct {
  id: string
  name: string
  inStock: number
  lowStockThreshold: number
}

interface MockSale {
  id: string
  productId: string
  productNameSnapshot: string
  productCodeSnapshot: number
  sellPrice: number
  sellTax: number
  sellDate: Date
  quantity: number
  sellTotal: number
}

interface MockTransaction {
  id: string
  type: string
  description: string
  amount: number
  productId?: string
  quantity?: number
  createdAt: Date
}

interface MockAlert {
  id: string
  productId: string
  type: string
  details: string
  triggeredAt: Date
}

// Mock data storage
let mockProducts: MockProduct[] = [
  { id: '1', name: 'Laptop Dell XPS 15', inStock: 15, lowStockThreshold: 20 },
  { id: '2', name: 'Wireless Mouse Logitech', inStock: 50, lowStockThreshold: 20 },
  { id: '3', name: 'Mechanical Keyboard', inStock: 25, lowStockThreshold: 20 },
  { id: '4', name: 'USB-C Hub', inStock: 30, lowStockThreshold: 20 },
  { id: '5', name: 'Monitor 27" 4K', inStock: 10, lowStockThreshold: 20 },
  { id: '8', name: 'Desk Lamp LED', inStock: 40, lowStockThreshold: 20 },
  { id: '11', name: 'Notebook Set', inStock: 100, lowStockThreshold: 20 },
  { id: '12', name: 'Pen Set Premium', inStock: 20, lowStockThreshold: 20 },
  { id: '13', name: 'Printer Paper A4', inStock: 200, lowStockThreshold: 20 },
  { id: '14', name: 'Stapler Heavy Duty', inStock: 35, lowStockThreshold: 20 },
  { id: '15', name: 'Coffee Maker', inStock: 15, lowStockThreshold: 20 },
  { id: '17', name: 'Microwave Compact', inStock: 10, lowStockThreshold: 20 },
  { id: '19', name: 'Security Camera', inStock: 12, lowStockThreshold: 20 }
]

let mockSales: MockSale[] = []
let mockTransactions: MockTransaction[] = []
let mockAlerts: MockAlert[] = []

export class MockDatabase {
  static async findProduct(id: string): Promise<MockProduct | null> {
    const product = mockProducts.find(p => p.id === id)
    return product || null
  }

  static async updateProductStock(id: string, quantity: number): Promise<MockProduct> {
    const productIndex = mockProducts.findIndex(p => p.id === id)
    if (productIndex === -1) {
      throw new Error(`Product ${id} not found`)
    }

    const product = mockProducts[productIndex]
    const newStock = Math.max(0, product.inStock - quantity)
    
    mockProducts[productIndex] = {
      ...product,
      inStock: newStock,
      lowStockWarning: newStock <= product.lowStockThreshold
    }

    return mockProducts[productIndex]
  }

  static async createSale(saleData: Omit<MockSale, 'id' | 'sellDate'>): Promise<MockSale> {
    const sale: MockSale = {
      id: uuidv4(),
      ...saleData,
      sellDate: new Date()
    }
    mockSales.push(sale)
    return sale
  }

  static async createTransaction(transactionData: Omit<MockTransaction, 'id' | 'createdAt'>): Promise<MockTransaction> {
    const transaction: MockTransaction = {
      id: uuidv4(),
      ...transactionData,
      createdAt: new Date()
    }
    mockTransactions.push(transaction)
    return transaction
  }

  static async createAlert(alertData: Omit<MockAlert, 'id' | 'triggeredAt'>): Promise<MockAlert> {
    const alert: MockAlert = {
      id: uuidv4(),
      ...alertData,
      triggeredAt: new Date()
    }
    mockAlerts.push(alert)
    return alert
  }

  static async getSales(limit?: number, offset?: number): Promise<MockSale[]> {
    let sales = [...mockSales].sort((a, b) => b.sellDate.getTime() - a.sellDate.getTime())
    
    if (offset) {
      sales = sales.slice(offset)
    }
    if (limit) {
      sales = sales.slice(0, limit)
    }
    
    return sales
  }

  static async getSalesSummary(startDate?: Date, endDate?: Date): Promise<{
    totalRevenue: number
    totalItemsSold: number
    totalTransactions: number
  }> {
    let filteredSales = mockSales

    if (startDate || endDate) {
      filteredSales = mockSales.filter(sale => {
        const saleDate = sale.sellDate
        if (startDate && saleDate < startDate) return false
        if (endDate && saleDate > endDate) return false
        return true
      })
    }

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.sellTotal, 0)
    const totalItemsSold = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)
    const totalTransactions = filteredSales.length

    return {
      totalRevenue,
      totalItemsSold,
      totalTransactions
    }
  }

  static async getAllProducts(): Promise<MockProduct[]> {
    return [...mockProducts]
  }

  // Utility method to reset mock data (for testing)
  static resetData(): void {
    mockProducts = [
      { id: '1', name: 'Laptop Dell XPS 15', inStock: 15, lowStockThreshold: 20 },
      { id: '2', name: 'Wireless Mouse Logitech', inStock: 50, lowStockThreshold: 20 },
      { id: '3', name: 'Mechanical Keyboard', inStock: 25, lowStockThreshold: 20 },
      { id: '4', name: 'USB-C Hub', inStock: 30, lowStockThreshold: 20 },
      { id: '5', name: 'Monitor 27" 4K', inStock: 10, lowStockThreshold: 20 },
      { id: '8', name: 'Desk Lamp LED', inStock: 40, lowStockThreshold: 20 },
      { id: '11', name: 'Notebook Set', inStock: 100, lowStockThreshold: 20 },
      { id: '12', name: 'Pen Set Premium', inStock: 20, lowStockThreshold: 20 },
      { id: '13', name: 'Printer Paper A4', inStock: 200, lowStockThreshold: 20 },
      { id: '14', name: 'Stapler Heavy Duty', inStock: 35, lowStockThreshold: 20 },
      { id: '15', name: 'Coffee Maker', inStock: 15, lowStockThreshold: 20 },
      { id: '17', name: 'Microwave Compact', inStock: 10, lowStockThreshold: 20 },
      { id: '19', name: 'Security Camera', inStock: 12, lowStockThreshold: 20 }
    ]
    mockSales = []
    mockTransactions = []
    mockAlerts = []
  }
}