# VibeMart Retail Management System

A comprehensive retail management system built with Next.js, TypeScript, and PostgreSQL, featuring role-based access control and GAAP-compliant bookkeeping.

## Features

### 🏢 Role-Based Access Control
- **Bookkeeper**: Access to financial reports, transaction logs, and GAAP reporting
- **Store Clerk**: Product search and viewing capabilities
- **Warehouse Clerk**: Complete inventory management and stock control

### 📊 Bookkeeping Module
- Real-time transaction logging
- GAAP-compliant financial reports
- Income Statement and Balance Sheet generation
- Date-range filtering and export capabilities

### 🛍️ Store Module
- Advanced product search by name, manufacturer, or product code
- Category filtering
- Real-time stock status indicators
- Location information display

### 💰 Cashier Module
- Point of Sale (POS) system
- Shopping cart management
- Automatic PDF receipt generation
- Real-time stock updates
- Tax calculations
- Receipt archiving

### 📦 Warehouse Module
- Product CRUD operations
- Automatic product code generation
- Stock management (add/remove)
- Location tracking
- Low stock alerts
- Category management

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI Framework**: Ant Design
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role management
- **PDF Generation**: Puppeteer
- **Configuration**: YAML-based configuration

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running locally
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibemart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/vibemart"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   BOOKKEEPER_CREDENTIALS="bookkeeper:password123"
   STORE_CLERK_CREDENTIALS="storeclerk:password123"
   WAREHOUSE_CLERK_CREDENTIALS="warehouseclerk:password123"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Bookkeeper | `bookkeeper` | `password123` |
| Store Clerk | `storeclerk` | `password123` |
| Warehouse Clerk | `warehouseclerk` | `password123` |

## Configuration

The system uses a `config.yml` file for customizable settings:

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
  tax_rate: 0.06  # 6% sales tax
  currency: "USD"
  currency_symbol: "$"

business:
  default_low_stock_threshold: 50
  auto_product_code_start: 100000
  warehouse_code: "WH-01"
```

## Database Schema

The system includes the following main tables:

- **users**: Authentication and role management
- **categories**: Product categorization
- **locations**: Warehouse physical locations
- **products**: Master product data
- **receipts**: Inbound stock entries
- **sales**: Store sales records
- **alerts**: Low-stock warnings
- **transactions**: Bookkeeping transaction logs

## Usage

### For Bookkeepers
1. Log in with bookkeeper credentials
2. Access transaction logs and financial reports
3. Generate GAAP-compliant reports
4. Filter by date ranges and export data

### For Store Clerks
1. Log in with store clerk credentials
2. Search products using various filters
3. View product details and stock levels
4. Check product locations in warehouse

### For Warehouse Clerks
1. Log in with warehouse clerk credentials
2. Add new products with automatic code generation
3. Manage stock levels (add/remove)
4. Track product locations
5. Monitor low stock alerts

### For Cashier Operations
1. Access cashier module from store clerk account
2. Search and add products to cart
3. Process sales with automatic tax calculation
4. Generate PDF receipts
5. Automatic stock updates and transaction logging

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client

### Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── bookkeeping/    # Bookkeeping module
│   │   ├── store/          # Store module
│   │   ├── cashier/        # Cashier module
│   │   ├── warehouse/      # Warehouse module
│   │   └── layout.tsx      # Dashboard layout
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Login page
├── components/
│   └── auth-provider.tsx   # Authentication context
├── lib/
│   ├── auth.ts             # Authentication utilities
│   ├── config.ts           # Configuration loader
│   └── prisma.ts           # Prisma client
├── types/
│   └── index.ts            # TypeScript type definitions
└── utils/
    └── pdf-generator.ts    # PDF receipt generation
```

## Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Environment variable configuration
- SQL injection prevention with Prisma ORM

## Production Deployment

1. Set up a production PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build`
4. Start the production server: `npm run start`
5. Set up reverse proxy (nginx/Apache)
6. Configure SSL certificates
7. Set up regular database backups

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.