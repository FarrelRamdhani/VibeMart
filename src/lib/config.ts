export interface CompanyConfig {
  name: string
  address: string
  phone: string
  email: string
  website: string
}

export interface ReceiptConfig {
  header: string
  footer: string
  tax_rate: number
  currency: string
  currency_symbol: string
}

export interface BusinessConfig {
  default_low_stock_threshold: number
  auto_product_code_start: number
  warehouse_code: string
}

export interface Config {
  company: CompanyConfig
  receipt: ReceiptConfig
  business: BusinessConfig
}

// Browser-compatible config - hardcoded values from config.yml
const defaultConfig: Config = {
  company: {
    name: "VibeMart Retail Store",
    address: "123 Main Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "info@vibemart.com",
    website: "www.vibemart.com"
  },
  receipt: {
    header: "VIBE MART",
    footer: "Thank you for shopping with us!",
    tax_rate: 0.06,
    currency: "USD",
    currency_symbol: "$"
  },
  business: {
    default_low_stock_threshold: 50,
    auto_product_code_start: 100000,
    warehouse_code: "WH-01"
  }
}

export function getConfig(): Config {
  return defaultConfig
}