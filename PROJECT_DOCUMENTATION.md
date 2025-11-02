# 📚 VibeMart Project Documentation & Reference

Complete technical documentation for the VibeMart Retail Management System. This guide serves as a comprehensive reference for understanding, modifying, and extending the project.

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: Ant Design 5.x
- **Database**: PostgreSQL
- **ORM**: Prisma 5.x
- **Authentication**: JWT (JSON Web Tokens)
- **PDF Generation**: Puppeteer
- **Styling**: Tailwind CSS + Ant Design
- **Configuration**: YAML-based config

### Project Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Auth      │  │   Dashboard │  │    Business Logic   │   │
│  │  Provider   │  │   Layout    │  │     Components      │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    API Layer (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Auth      │  │   Config    │  │     Prisma ORM      │   │
│  │  Utilities  │  │   Loader    │  │     Client          │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Database (PostgreSQL)                     │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure Deep Dive

### `/src/app/` - Next.js App Router
```
src/app/
├── dashboard/                    # Main dashboard area
│   ├── bookkeeping/             # Bookkeeper module
│   │   ├── page.tsx            # Bookkeeping main page
│   │   ├── transactions/       # Transaction management
│   │   └── reports/            # Financial reports
│   ├── cashier/                # Point of Sale module
│   │   ├── page.tsx            # Cashier interface
│   │   └── components/         # POS components
│   ├── store/                  # Store operations module
│   │   ├── page.tsx            # Store main page
│   │   ├── search/             # Product search
│   │   └── components/         # Store components
│   ├── warehouse/              # Warehouse management module
│   │   ├── page.tsx            # Warehouse main page
│   │   ├── products/           # Product CRUD
│   │   ├── inventory/          # Stock management
│   │   └── locations/          # Location tracking
│   ├── layout.tsx              # Dashboard layout wrapper
│   └── page.tsx                # Dashboard home
├── layout.tsx                  # Root layout with Ant Design
├── page.tsx                    # Login page
└── globals.css                 # Global styles
```

### `/src/components/` - Reusable Components
```
src/components/
├── auth-provider.tsx           # Authentication context provider
├── common/                     # Shared components
│   ├── layout/                # Layout components
│   ├── forms/                 # Form components
│   └── tables/                # Table components
└── modules/                   # Module-specific components
    ├── bookkeeping/           # Bookkeeper components
    ├── cashier/              # Cashier components
    ├── store/                # Store components
    └── warehouse/            # Warehouse components
```

### `/src/lib/` - Core Utilities
```
src/lib/
├── auth.ts                     # Authentication logic
├── config.ts                   # Configuration management
├── prisma.ts                   # Prisma client setup
├── validations.ts              # Form validations
└── constants.ts                # Application constants
```

### `/src/types/` - TypeScript Definitions
```
src/types/
├── index.ts                    # Main type definitions
├── auth.ts                     # Authentication types
├── api.ts                      # API response types
└── business.ts                 # Business logic types
```

### `/src/utils/` - Helper Functions
```
src/utils/
├── pdf-generator.ts            # PDF receipt generation
├── formatters.ts               # Data formatting utilities
├── calculations.ts             # Business calculations
└── helpers.ts                  # General helper functions
```

## 🗄️ Database Schema Reference

### Core Tables

#### `users` - Authentication & Role Management
```sql
- id: String (UUID, Primary Key)
- username: String (Unique)
- password: String (Hashed with bcrypt)
- role: UserRole (Enum: BOOKKEEPER, STORE_CLERK, WAREHOUSE_CLERK)
- createdAt: DateTime
- updatedAt: DateTime
```

#### `products` - Master Product Data
```sql
- id: String (UUID, Primary Key)
- name: String
- description: String (Optional)
- manufacturer: String
- productCode: Int (Unique)
- codeSource: CodeSource (Enum: AUTO, MANUAL)
- latestEntryDate: Date
- expirationDate: Date (Optional)
- inStock: Int (Default: 0)
- categoryId: String (Foreign Key)
- lowStockWarning: Boolean (Default: false)
- lowStockThreshold: Int (Default: 50)
- buyPrice: Decimal
- locationId: String (Foreign Key)
- createdAt: DateTime
- updatedAt: DateTime
```

#### `categories` - Product Categorization
```sql
- id: String (UUID, Primary Key)
- name: String
- slug: String (Unique)
- parentId: String (Optional, Self-referencing)
- createdAt: DateTime
- updatedAt: DateTime
```

#### `locations` - Warehouse Physical Locations
```sql
- id: String (UUID, Primary Key)
- warehouseCode: String
- aisle: String
- rack: String
- shelf: String
- bin: String
- notes: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

#### `sales` - Store Sales Records
```sql
- id: String (UUID, Primary Key)
- productId: String (Foreign Key)
- productNameSnapshot: String
- productCodeSnapshot: Int
- sellPrice: Decimal
- sellTax: Decimal
- sellDate: Date
- quantity: Int
- sellTotal: Decimal
- createdAt: DateTime
```

#### `receipts` - Inbound Stock Entries
```sql
- id: String (UUID, Primary Key)
- productId: String (Foreign Key)
- quantity: Int
- unitBuyPrice: Decimal
- receivedDate: Date
- reference: String (Optional)
- createdAt: DateTime
```

#### `transactions` - Bookkeeping Transaction Logs
```sql
- id: String (UUID, Primary Key)
- type: TransactionType (Enum: SALE, PURCHASE, INVENTORY_ADJUSTMENT, EXPENSE, REVENUE)
- description: String
- amount: Decimal
- productId: String (Optional, Foreign Key)
- quantity: Int (Optional)
- createdAt: DateTime
```

#### `alerts` - System Notifications
```sql
- id: String (UUID, Primary Key)
- productId: String (Foreign Key)
- type: AlertType (Enum: LOW_STOCK)
- triggeredAt: DateTime
- resolvedAt: DateTime (Optional)
- details: String
```

## 🔐 Authentication System

### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string
  username: string
  role: UserRole
  iat: number
  exp: number
}
```

### Authentication Flow
1. **Login**: User submits credentials → Server validates → JWT token generated
2. **Token Storage**: Token stored in `localStorage` as `vibemart_token`
3. **API Requests**: Token included in `Authorization` header
4. **Token Validation**: Middleware validates token on protected routes
5. **Role-Based Access**: Components check user role for feature access

### Auth Provider Context
```typescript
// Usage in components
const { user, login, logout, isAuthenticated } = useAuth()

// Role-based rendering
{user?.role === UserRole.BOOKKEEPER && <BookkeepingModule />}
```

## ⚙️ Configuration System

### `config.yml` Structure
```yaml
company:
  name: "VibeMart Retail Store"
  address: "123 Main Street, City, State 12345"
  phone: "+1 (555) 123-4567"
  email: "info@vibemart.com"
  website: "www.vibemart.com"

receipt:
  header: "VIBE MART"
  footer: "Thank you for shopping with us!"
  tax_rate: 0.06
  currency: "USD"
  currency_symbol: "$"

business:
  default_low_stock_threshold: 50
  auto_product_code_start: 100000
  warehouse_code: "WH-01"
```

### Configuration Loading
```typescript
// config.ts loads and validates YAML configuration
const config = loadConfig()
// Provides type-safe access to configuration values
config.company.name
config.receipt.tax_rate
```

## 🎨 UI Component Patterns

### Ant Design Integration
```typescript
// Theme customization in layout.tsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  }}
>
```

### Common Component Patterns
```typescript
// Form pattern
const [form] = Form.useForm()
const onFinish = async (values) => {
  try {
    await apiCall(values)
    message.success('Success!')
  } catch (error) {
    message.error('Error occurred')
  }
}

// Table pattern
const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Actions', key: 'actions', render: (_, record) => (
    <Space>
      <Button onClick={() => edit(record)}>Edit</Button>
      <Button danger onClick={() => delete(record.id)}>Delete</Button>
    </Space>
  )}
]
```

## 🔧 Development Guidelines

### Code Organization
1. **Feature-based structure**: Group related files together
2. **Separation of concerns**: Keep UI, logic, and data separate
3. **Type safety**: Use TypeScript for all components and functions
4. **Consistent naming**: Follow established naming conventions

### API Patterns
```typescript
// API route pattern
export async function GET(request: Request) {
  try {
    const data = await prisma.model.findMany()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

// Client-side API calls
const fetchData = async () => {
  const response = await fetch('/api/endpoint')
  const data = await response.json()
  return data
}
```

### Error Handling
```typescript
// Global error boundary
// Form validation
// API error responses
// User feedback with message components
```

## 🔄 State Management

### Local State
```typescript
// React hooks for component state
const [loading, setLoading] = useState(false)
const [data, setData] = useState([])
```

### Global State
```typescript
// Context API for authentication
// URL state for navigation and filtering
// Server state with API calls
```

## 📊 Business Logic Reference

### Stock Management
```typescript
// Stock update on sale
const updateStock = async (productId: string, quantity: number) => {
  await prisma.product.update({
    where: { id: productId },
    data: { inStock: { decrement: quantity } }
  })
  
  // Check for low stock
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (product.inStock <= product.lowStockThreshold) {
    await createLowStockAlert(productId)
  }
}
```

### Financial Calculations
```typescript
// Sale total calculation
const calculateSaleTotal = (price: number, quantity: number, taxRate: number) => {
  const subtotal = price * quantity
  const tax = subtotal * taxRate
  return { subtotal, tax, total: subtotal + tax }
}
```

### Product Code Generation
```typescript
// Auto-generate product codes
const generateProductCode = async () => {
  const lastProduct = await prisma.product.findFirst({
    orderBy: { productCode: 'desc' }
  })
  return lastProduct ? lastProduct.productCode + 1 : 100000
}
```

## 🧪 Testing Guidelines

### Unit Testing
```typescript
// Test utilities and business logic
describe('calculateSaleTotal', () => {
  it('should calculate correct total with tax', () => {
    const result = calculateSaleTotal(100, 2, 0.06)
    expect(result.total).toBe(212)
  })
})
```

### Integration Testing
```typescript
// Test API endpoints and database operations
// Test authentication flows
// Test business processes
```

## 🚀 Deployment Considerations

### Environment Variables
```env
# Production configuration
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="production-secret-key"
NODE_ENV="production"
```

### Build Process
```bash
# Production build
npm run build
npm run start

# Database migrations
npm run db:push
npm run db:generate
```

## 🔍 Debugging & Monitoring

### Common Debug Points
1. **Authentication flow**: Token generation and validation
2. **Database queries**: Prisma query performance
3. **API responses**: Error handling and data format
4. **UI state**: Component re-renders and state updates

### Logging Strategy
```typescript
// Error logging
console.error('API Error:', error)

// Debug logging
console.log('User action:', action, data)

// Performance monitoring
console.time('API Call')
// ... API call
console.timeEnd('API Call')
```

## 📝 Modification Guidelines

### Adding New Features
1. **Database**: Add/update Prisma schema
2. **Types**: Define TypeScript interfaces
3. **API**: Create API routes if needed
4. **Components**: Build UI components
5. **Integration**: Connect to existing systems

### Modifying Existing Features
1. **Understand dependencies**: Check what uses the feature
2. **Database migrations**: Plan schema changes carefully
3. **Backward compatibility**: Maintain existing API contracts
4. **Testing**: Update tests accordingly

### Security Considerations
1. **Input validation**: Sanitize all user inputs
2. **SQL injection**: Use Prisma parameterized queries
3. **XSS protection**: Escape user-generated content
4. **Authentication**: Verify user permissions for all actions

## 🎯 Quick Reference Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
```

### Database
```bash
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio
npm run db:generate      # Generate Prisma client
```

### Common Patterns
```typescript
// Prisma query
const products = await prisma.product.findMany({
  include: { category: true, location: true }
})

// Form submission
const onFinish = async (values) => {
  setLoading(true)
  try {
    await submitData(values)
    message.success('Success!')
  } catch (error) {
    message.error('Error: ' + error.message)
  } finally {
    setLoading(false)
  }
}

// Navigation
router.push('/dashboard/warehouse')
```

---

**This documentation serves as your complete reference for understanding and modifying the VibeMart project. Keep it handy during development!**