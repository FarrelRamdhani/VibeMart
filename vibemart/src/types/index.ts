export interface ProductWithRelations {
  id: string
  name: string
  description?: string
  manufacturer: string
  productCode: number
  codeSource: 'AUTO' | 'MANUAL'
  latestEntryDate: Date
  expirationDate?: Date
  inStock: number
  categoryId: string
  lowStockWarning: boolean
  lowStockThreshold: number
  buyPrice: number
  locationId: string
  createdAt: Date
  updatedAt: Date
  category?: {
    id: string
    name: string
    slug: string
  }
  location?: {
    id: string
    warehouseCode: string
    aisle: string
    rack: string
    shelf: string
    bin: string
  }
}

export interface SaleItem {
  productId: string
  productName: string
  productCode: number
  quantity: number
  sellPrice: number
  sellTax: number
  sellTotal: number
}

export interface CartItem extends SaleItem {
  id: string
}

export interface ReceiptData {
  id: string
  items: SaleItem[]
  subtotal: number
  taxTotal: number
  totalAmount: number
  createdAt: Date
  customerInfo?: {
    name?: string
    address?: string
  }
}

export interface TransactionLog {
  id: string
  type: string
  description: string
  amount: number
  productId?: string
  quantity?: number
  createdAt: Date
  productName?: string
}