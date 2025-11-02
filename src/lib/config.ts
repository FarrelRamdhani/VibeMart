import * as yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

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

let config: Config | null = null

export function getConfig(): Config {
  if (!config) {
    try {
      const configPath = path.join(process.cwd(), 'config.yml')
      const fileContents = fs.readFileSync(configPath, 'utf8')
      config = yaml.load(fileContents) as Config
    } catch (error) {
      console.error('Error loading config:', error)
      throw new Error('Failed to load configuration')
    }
  }
  return config
}