// In-memory database for development without database setup
import { v4 as uuidv4 } from 'uuid'

interface Product {
  id: string
  name: string
  description: string
  manufacturer: string
  productCode: number
  codeSource: string
  latestEntryDate: Date
  expirationDate: Date | null
  inStock: number
  lowStockWarning: boolean
  lowStockThreshold: number
  buyPrice: number
  locationId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
  category: { id: string; name: string }
  location: { id: string; warehouseCode: string; aisle: string; rack: string; shelf: string; bin: string }
}

interface Sale {
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

interface Transaction {
  id: string
  type: string
  description: string
  amount: number
  productId?: string
  quantity?: number
  createdAt: Date
}

// Initial data
const initialProducts: Product[] = [
  {
    id: '1', name: 'Laptop Dell XPS 15', description: 'High-performance laptop with 4K display',
    manufacturer: 'Dell', productCode: 100001, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 15, lowStockWarning: false, lowStockThreshold: 20, buyPrice: 1200.00,
    locationId: 'loc1', categoryId: 'electronics', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'electronics', name: 'Electronics' },
    location: { id: 'loc1', warehouseCode: 'WH-01', aisle: 'A', rack: '1', shelf: '1', bin: '1' }
  },
  {
    id: '2', name: 'Wireless Mouse Logitech', description: 'Ergonomic wireless mouse',
    manufacturer: 'Logitech', productCode: 100002, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 50, lowStockWarning: false, lowStockThreshold: 20, buyPrice: 25.00,
    locationId: 'loc2', categoryId: 'electronics', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'electronics', name: 'Electronics' },
    location: { id: 'loc2', warehouseCode: 'WH-01', aisle: 'A', rack: '1', shelf: '1', bin: '2' }
  },
  {
    id: '3', name: 'Mechanical Keyboard', description: 'RGB mechanical gaming keyboard',
    manufacturer: 'Corsair', productCode: 100003, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 25, lowStockWarning: false, lowStockThreshold: 20, buyPrice: 89.99,
    locationId: 'loc3', categoryId: 'electronics', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'electronics', name: 'Electronics' },
    location: { id: 'loc3', warehouseCode: 'WH-01', aisle: 'A', rack: '1', shelf: '2', bin: '1' }
  },
  {
    id: '4', name: 'USB-C Hub', description: '7-in-1 USB-C hub with HDMI',
    manufacturer: 'Anker', productCode: 100004, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 30, lowStockWarning: false, lowStockThreshold: 20, buyPrice: 45.00,
    locationId: 'loc4', categoryId: 'electronics', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'electronics', name: 'Electronics' },
    location: { id: 'loc4', warehouseCode: 'WH-01', aisle: 'A', rack: '1', shelf: '2', bin: '2' }
  },
  {
    id: '5', name: 'Monitor 27" 4K', description: '27-inch 4K UHD monitor',
    manufacturer: 'LG', productCode: 100005, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 10, lowStockWarning: true, lowStockThreshold: 20, buyPrice: 350.00,
    locationId: 'loc5', categoryId: 'electronics', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'electronics', name: 'Electronics' },
    location: { id: 'loc5', warehouseCode: 'WH-01', aisle: 'A', rack: '2', shelf: '1', bin: '1' }
  },
  {
    id: '8', name: 'Desk Lamp LED', description: 'Adjustable LED desk lamp',
    manufacturer: 'Philips', productCode: 100008, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 40, lowStockWarning: false, lowStockThreshold: 20, buyPrice: 35.00,
    locationId: 'loc8', categoryId: 'furniture', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'furniture', name: 'Furniture' },
    location: { id: 'loc8', warehouseCode: 'WH-01', aisle: 'B', rack: '1', shelf: '2', bin: '1' }
  },
  {
    id: '11', name: 'Notebook Set', description: 'Premium notebook set with pens',
    manufacturer: 'Moleskine', productCode: 100011, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 100, lowStockWarning: false, lowStockThreshold: 20, buyPrice: 15.00,
    locationId: 'loc11', categoryId: 'office-supplies', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'office-supplies', name: 'Office Supplies' },
    location: { id: 'loc11', warehouseCode: 'WH-01', aisle: 'C', rack: '1', shelf: '1', bin: '2' }
  },
  {
    id: '12', name: 'Pen Set Premium', description: 'Executive pen set',
    manufacturer: 'Montblanc', productCode: 100012, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 20, lowStockWarning: true, lowStockThreshold: 20, buyPrice: 75.00,
    locationId: 'loc12', categoryId: 'office-supplies', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'office-supplies', name: 'Office Supplies' },
    location: { id: 'loc12', warehouseCode: 'WH-01', aisle: 'C', rack: '1', shelf: '2', bin: '1' }
  },
  {
    id: '13', name: 'Printer Paper A4', description: 'High-quality A4 printer paper',
    manufacturer: 'HP', productCode: 100013, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 200, lowStockWarning: false, lowStockThreshold: 20, buyPrice: 12.00,
    locationId: 'loc13', categoryId: 'office-supplies', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'office-supplies', name: 'Office Supplies' },
    location: { id: 'loc13', warehouseCode: 'WH-01', aisle: 'C', rack: '1', shelf: '2', bin: '2' }
  },
  {
    id: '14', name: 'Stapler Heavy Duty', description: 'Heavy-duty stapler for office use',
    manufacturer: 'Swingline', productCode: 100014, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 35, lowStockWarning: false, lowStockThreshold: 20, buyPrice: 18.00,
    locationId: 'loc14', categoryId: 'office-supplies', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'office-supplies', name: 'Office Supplies' },
    location: { id: 'loc14', warehouseCode: 'WH-01', aisle: 'C', rack: '2', shelf: '1', bin: '1' }
  },
  {
    id: '15', name: 'Coffee Maker', description: 'Single-serve coffee maker',
    manufacturer: 'Keurig', productCode: 100015, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 15, lowStockWarning: true, lowStockThreshold: 20, buyPrice: 89.00,
    locationId: 'loc15', categoryId: 'appliances', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'appliances', name: 'Appliances' },
    location: { id: 'loc15', warehouseCode: 'WH-01', aisle: 'D', rack: '1', shelf: '1', bin: '1' }
  },
  {
    id: '17', name: 'Microwave Compact', description: 'Compact microwave oven',
    manufacturer: 'Panasonic', productCode: 100017, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 10, lowStockWarning: true, lowStockThreshold: 20, buyPrice: 95.00,
    locationId: 'loc17', categoryId: 'appliances', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'appliances', name: 'Appliances' },
    location: { id: 'loc17', warehouseCode: 'WH-01', aisle: 'D', rack: '1', shelf: '2', bin: '1' }
  },
  {
    id: '19', name: 'Security Camera', description: 'Wireless security camera system',
    manufacturer: 'Ring', productCode: 100019, codeSource: 'AUTO', latestEntryDate: new Date(),
    expirationDate: null, inStock: 12, lowStockWarning: true, lowStockThreshold: 20, buyPrice: 199.00,
    locationId: 'loc19', categoryId: 'security', createdAt: new Date(), updatedAt: new Date(),
    category: { id: 'security', name: 'Security' },
    location: { id: 'loc19', warehouseCode: 'WH-01', aisle: 'E', rack: '1', shelf: '1', bin: '1' }
  }
]

// In-memory storage
let products = [...initialProducts]
let sales: Sale[] = []
let transactions: Transaction[] = []

export class InMemoryDatabase {
  static async findProduct(id: string): Promise<Product | null> {
    return products.find(p => p.id === id) || null
  }

  static async updateProductStock(id: string, quantity: number): Promise<Product> {
    const productIndex = products.findIndex(p => p.id === id)
    if (productIndex === -1) {
      throw new Error(`Product ${id} not found`)
    }

    const product = products[productIndex]
    const newStock = Math.max(0, product.inStock - quantity)
    
    products[productIndex] = {
      ...product,
      inStock: newStock,
      lowStockWarning: newStock <= product.lowStockThreshold,
      updatedAt: new Date()
    }

    return products[productIndex]
  }

  static async createSale(saleData: Omit<Sale, 'id' | 'sellDate'>): Promise<Sale> {
    const sale: Sale = {
      id: uuidv4(),
      ...saleData,
      sellDate: new Date()
    }
    sales.push(sale)
    return sale
  }

  static async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const transaction: Transaction = {
      id: uuidv4(),
      ...transactionData,
      createdAt: new Date()
    }
    transactions.push(transaction)
    return transaction
  }

  static async getSales(limit?: number, offset?: number): Promise<Sale[]> {
    let sortedSales = [...sales].sort((a, b) => b.sellDate.getTime() - a.sellDate.getTime())
    
    if (offset) {
      sortedSales = sortedSales.slice(offset)
    }
    if (limit) {
      sortedSales = sortedSales.slice(0, limit)
    }
    
    return sortedSales
  }

  static async getSalesSummary(startDate?: Date, endDate?: Date): Promise<{
    totalRevenue: number
    totalItemsSold: number
    totalTransactions: number
  }> {
    let filteredSales = sales

    if (startDate || endDate) {
      filteredSales = sales.filter(sale => {
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

  static async getAllProducts(): Promise<Product[]> {
    return [...products]
  }

  static async getProducts(category?: string, search?: string, inStockOnly?: boolean): Promise<Product[]> {
    let filteredProducts = [...products]

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.categoryId === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.manufacturer.toLowerCase().includes(searchLower) ||
        p.productCode.toString().includes(searchLower)
      )
    }

    if (inStockOnly) {
      filteredProducts = filteredProducts.filter(p => p.inStock > 0)
    }

    return filteredProducts.sort((a, b) => {
      if (a.lowStockWarning && !b.lowStockWarning) return -1
      if (!a.lowStockWarning && b.lowStockWarning) return 1
      return a.name.localeCompare(b.name)
    })
  }

  // Reset data to initial state
  static resetData(): void {
    products = [...initialProducts]
    sales = []
    transactions = []
  }
}