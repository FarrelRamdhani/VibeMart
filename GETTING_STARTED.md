# 🚀 Getting Started with VibeMart

A complete step-by-step guide to set up and run the VibeMart Retail Management System locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **PostgreSQL** (version 13 or higher)
- **Git** (for version control)
- **npm** (comes with Node.js)

### Verify Installations

```bash
# Check Node.js version
node --version

# Check npm version  
npm --version

# Check PostgreSQL
psql --version
```

## 🛠️ Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the project
git clone <repository-url>
cd VibeMart
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install
```

### Step 3: Set Up PostgreSQL Database

1. **Start PostgreSQL Service**
   ```bash
   # On Windows (if using PostgreSQL installer)
   net start postgresql
   
   # On macOS (if using Homebrew)
   brew services start postgresql
   
   # On Linux (if using systemd)
   sudo systemctl start postgresql
   ```

2. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create the database
   CREATE DATABASE vibemart;
   
   # Exit PostgreSQL
   \q
   ```

### Step 4: Configure Environment Variables

1. **Create `.env` file** in the root directory:
   ```bash
   # Create environment file
   touch .env
   ```

2. **Add the following configuration** to your `.env` file:

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/vibemart"
   
   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   
   # Default User Credentials
   BOOKKEEPER_CREDENTIALS="bookkeeper:password123"
   STORE_CLERK_CREDENTIALS="storeclerk:password123"
   WAREHOUSE_CLERK_CREDENTIALS="warehouseclerk:password123"
   ```

   **⚠️ Important**: Replace `your_password` with your actual PostgreSQL password.

### Step 5: Set Up Database Schema

```bash
# Push database schema to PostgreSQL
npm run db:push

# Generate Prisma client
npm run db:generate
```

### Step 6: Verify Database Setup (Optional)

```bash
# Open Prisma Studio to view database
npm run db:studio
```

This will open a browser window at `http://localhost:5555` where you can view your database tables.

## 🎮 Running the Application

### Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at **http://localhost:3000**

### Access the Application

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Login with default credentials**:

| Role | Username | Password |
|------|----------|----------|
| Bookkeeper | `bookkeeper` | `password123` |
| Store Clerk | `storeclerk` | `password123` |
| Warehouse Clerk | `warehouseclerk` | `password123` |

## 🔧 Available Scripts

Here are all the available npm scripts:

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma client
```

## 🏗️ Project Structure

```
VibeMart/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── dashboard/          # Main dashboard
��   │   │   ├── bookkeeping/   # Bookkeeping module
│   │   │   ├── store/          # Store operations
│   │   │   ├── cashier/        # Point of sale
│   │   │   └── warehouse/      # Inventory management
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Login page
│   ├── components/             # React components
│   │   └── auth-provider.tsx   # Authentication context
│   ├── lib/                    # Utilities
│   │   ├── auth.ts             # Authentication logic
│   │   ├── config.ts           # Configuration loader
│   │   └── prisma.ts           # Database client
│   ├── types/                  # TypeScript definitions
│   └── utils/                  # Helper functions
├── prisma/
│   └── schema.prisma            # Database schema
├── config.yml                  # Application configuration
├── .env                        # Environment variables
└── package.json                # Dependencies and scripts
```

## 🎯 Module Overview

### 📊 Bookkeeping Module
- **Access**: Bookkeeper role
- **Features**: Financial reports, transaction logs, GAAP compliance
- **Navigation**: Dashboard → Bookkeeping

### 🛍️ Store Module  
- **Access**: Store Clerk role
- **Features**: Product search, viewing, stock status
- **Navigation**: Dashboard → Store

### 💰 Cashier Module
- **Access**: Store Clerk role
- **Features**: Point of sale, cart management, PDF receipts
- **Navigation**: Dashboard → Store → Cashier

### 📦 Warehouse Module
- **Access**: Warehouse Clerk role  
- **Features**: Product CRUD, stock management, location tracking
- **Navigation**: Dashboard → Warehouse

## 🔍 Testing Your Setup

### 1. Test Authentication
- Try logging in with each role
- Verify role-based access control
- Check session persistence

### 2. Test Database Operations
- Add a new product (Warehouse Clerk)
- Search for products (Store Clerk)
- Process a sale (Store Clerk → Cashier)
- View transactions (Bookkeeper)

### 3. Test PDF Generation
- Process a sale and verify PDF receipt generation
- Check receipt archiving functionality

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Database connection failed"
```bash
# Solution: Check PostgreSQL is running and credentials are correct
psql -U postgres -h localhost -d vibemart
```

**Issue**: "Prisma client not found"
```bash
# Solution: Regenerate Prisma client
npm run db:generate
```

**Issue**: "Port 3000 already in use"
```bash
# Solution: Kill process on port 3000 or use different port
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Issue**: "Module not found" errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

1. **Check the logs** - Look at the terminal output for error messages
2. **Verify environment variables** - Ensure `.env` file is correctly configured
3. **Check database connection** - Use `npm run db:studio` to verify database access
4. **Restart services** - Sometimes a simple restart fixes issues

## 📚 Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Ant Design Documentation**: https://ant.design/docs/react/introduce
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

## 🎉 You're All Set!

Congratulations! You now have VibeMart running locally. Here are some suggested next steps:

1. **Explore all modules** - Test each role's functionality
2. **Add sample data** - Populate the database with test products
3. **Customize configuration** - Edit `config.yml` to match your business
4. **Review the codebase** - Understand the architecture and patterns
5. **Start developing** - Add new features or customize existing ones

Happy coding! 🚀