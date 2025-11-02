import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.alert.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.product.deleteMany()
  await prisma.location.deleteMany()
  await prisma.category.deleteMany()
  console.log('🧹 Cleared existing data')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: 'electronics',
        name: 'Electronics',
        description: 'Electronic devices and accessories',
      },
    }),
    prisma.category.create({
      data: {
        id: 'furniture',
        name: 'Furniture',
        description: 'Office furniture and fixtures',
      },
    }),
    prisma.category.create({
      data: {
        id: 'office-supplies',
        name: 'Office Supplies',
        description: 'Stationery and office supplies',
      },
    }),
    prisma.category.create({
      data: {
        id: 'appliances',
        name: 'Appliances',
        description: 'Office appliances and equipment',
      },
    }),
    prisma.category.create({
      data: {
        id: 'security',
        name: 'Security',
        description: 'Security and surveillance equipment',
      },
    }),
  ])
  console.log(`📁 Created ${categories.length} categories`)

  // Create locations
  const locations = await Promise.all([
    // Electronics - Aisle A
    prisma.location.create({
      data: {
        id: 'loc1',
        warehouseCode: 'WH-01',
        aisle: 'A',
        rack: '1',
        shelf: '1',
        bin: '1',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc2',
        warehouseCode: 'WH-01',
        aisle: 'A',
        rack: '1',
        shelf: '1',
        bin: '2',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc3',
        warehouseCode: 'WH-01',
        aisle: 'A',
        rack: '1',
        shelf: '2',
        bin: '1',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc4',
        warehouseCode: 'WH-01',
        aisle: 'A',
        rack: '1',
        shelf: '2',
        bin: '2',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc5',
        warehouseCode: 'WH-01',
        aisle: 'A',
        rack: '2',
        shelf: '1',
        bin: '1',
      },
    }),
    // Furniture - Aisle B
    prisma.location.create({
      data: {
        id: 'loc6',
        warehouseCode: 'WH-01',
        aisle: 'B',
        rack: '1',
        shelf: '1',
        bin: '1',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc7',
        warehouseCode: 'WH-01',
        aisle: 'B',
        rack: '1',
        shelf: '1',
        bin: '2',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc8',
        warehouseCode: 'WH-01',
        aisle: 'B',
        rack: '1',
        shelf: '2',
        bin: '1',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc9',
        warehouseCode: 'WH-01',
        aisle: 'B',
        rack: '1',
        shelf: '2',
        bin: '2',
      },
    }),
    // Office Supplies - Aisle C
    prisma.location.create({
      data: {
        id: 'loc10',
        warehouseCode: 'WH-01',
        aisle: 'C',
        rack: '1',
        shelf: '1',
        bin: '1',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc11',
        warehouseCode: 'WH-01',
        aisle: 'C',
        rack: '1',
        shelf: '1',
        bin: '2',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc12',
        warehouseCode: 'WH-01',
        aisle: 'C',
        rack: '1',
        shelf: '2',
        bin: '1',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc13',
        warehouseCode: 'WH-01',
        aisle: 'C',
        rack: '1',
        shelf: '2',
        bin: '2',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc14',
        warehouseCode: 'WH-01',
        aisle: 'C',
        rack: '2',
        shelf: '1',
        bin: '1',
      },
    }),
    // Appliances - Aisle D
    prisma.location.create({
      data: {
        id: 'loc15',
        warehouseCode: 'WH-01',
        aisle: 'D',
        rack: '1',
        shelf: '1',
        bin: '1',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc16',
        warehouseCode: 'WH-01',
        aisle: 'D',
        rack: '1',
        shelf: '1',
        bin: '2',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc17',
        warehouseCode: 'WH-01',
        aisle: 'D',
        rack: '1',
        shelf: '2',
        bin: '1',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc18',
        warehouseCode: 'WH-01',
        aisle: 'D',
        rack: '1',
        shelf: '2',
        bin: '2',
      },
    }),
    // Security - Aisle E
    prisma.location.create({
      data: {
        id: 'loc19',
        warehouseCode: 'WH-01',
        aisle: 'E',
        rack: '1',
        shelf: '1',
        bin: '1',
      },
    }),
    prisma.location.create({
      data: {
        id: 'loc20',
        warehouseCode: 'WH-01',
        aisle: 'E',
        rack: '1',
        shelf: '1',
        bin: '2',
      },
    }),
  ])
  console.log(`📍 Created ${locations.length} locations`)

  // Create products
  const products = await Promise.all([
    // Electronics
    prisma.product.create({
      data: {
        id: '1',
        name: 'Laptop Dell XPS 15',
        description: 'High-performance laptop with 4K display',
        manufacturer: 'Dell',
        productCode: 100001,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 15,
        lowStockThreshold: 20,
        buyPrice: 1200.00,
        categoryId: 'electronics',
        locationId: 'loc1',
      },
    }),
    prisma.product.create({
      data: {
        id: '2',
        name: 'Wireless Mouse Logitech',
        description: 'Ergonomic wireless mouse',
        manufacturer: 'Logitech',
        productCode: 100002,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 50,
        lowStockThreshold: 20,
        buyPrice: 25.00,
        categoryId: 'electronics',
        locationId: 'loc2',
      },
    }),
    prisma.product.create({
      data: {
        id: '3',
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical gaming keyboard',
        manufacturer: 'Corsair',
        productCode: 100003,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 25,
        lowStockThreshold: 20,
        buyPrice: 89.99,
        categoryId: 'electronics',
        locationId: 'loc3',
      },
    }),
    prisma.product.create({
      data: {
        id: '4',
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI',
        manufacturer: 'Anker',
        productCode: 100004,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 30,
        lowStockThreshold: 20,
        buyPrice: 45.00,
        categoryId: 'electronics',
        locationId: 'loc4',
      },
    }),
    prisma.product.create({
      data: {
        id: '5',
        name: 'Monitor 27" 4K',
        description: '27-inch 4K UHD monitor',
        manufacturer: 'LG',
        productCode: 100005,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 10,
        lowStockThreshold: 20,
        buyPrice: 350.00,
        categoryId: 'electronics',
        locationId: 'loc5',
      },
    }),
    // Furniture
    prisma.product.create({
      data: {
        id: '6',
        name: 'Office Chair Ergonomic',
        description: 'High-back ergonomic office chair',
        manufacturer: 'Herman Miller',
        productCode: 100006,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 8,
        lowStockThreshold: 15,
        buyPrice: 450.00,
        categoryId: 'furniture',
        locationId: 'loc6',
      },
    }),
    prisma.product.create({
      data: {
        id: '7',
        name: 'Standing Desk',
        description: 'Electric height-adjustable standing desk',
        manufacturer: 'Uplift',
        productCode: 100007,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 12,
        lowStockThreshold: 15,
        buyPrice: 600.00,
        categoryId: 'furniture',
        locationId: 'loc7',
      },
    }),
    prisma.product.create({
      data: {
        id: '8',
        name: 'Desk Lamp LED',
        description: 'Adjustable LED desk lamp',
        manufacturer: 'Philips',
        productCode: 100008,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 40,
        lowStockThreshold: 20,
        buyPrice: 35.00,
        categoryId: 'furniture',
        locationId: 'loc8',
      },
    }),
    prisma.product.create({
      data: {
        id: '9',
        name: 'File Cabinet 4-Drawer',
        description: 'Vertical file cabinet with 4 drawers',
        manufacturer: 'HON',
        productCode: 100009,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 6,
        lowStockThreshold: 15,
        buyPrice: 150.00,
        categoryId: 'furniture',
        locationId: 'loc9',
      },
    }),
    // Office Supplies
    prisma.product.create({
      data: {
        id: '10',
        name: 'Whiteboard 4x8',
        description: 'Large magnetic whiteboard',
        manufacturer: 'Quartet',
        productCode: 100010,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 3,
        lowStockThreshold: 15,
        buyPrice: 120.00,
        categoryId: 'office-supplies',
        locationId: 'loc10',
      },
    }),
    prisma.product.create({
      data: {
        id: '11',
        name: 'Notebook Set',
        description: 'Premium notebook set with pens',
        manufacturer: 'Moleskine',
        productCode: 100011,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 100,
        lowStockThreshold: 20,
        buyPrice: 15.00,
        categoryId: 'office-supplies',
        locationId: 'loc11',
      },
    }),
    prisma.product.create({
      data: {
        id: '12',
        name: 'Pen Set Premium',
        description: 'Executive pen set',
        manufacturer: 'Montblanc',
        productCode: 100012,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 20,
        lowStockThreshold: 20,
        buyPrice: 75.00,
        categoryId: 'office-supplies',
        locationId: 'loc12',
      },
    }),
    prisma.product.create({
      data: {
        id: '13',
        name: 'Printer Paper A4',
        description: 'High-quality A4 printer paper',
        manufacturer: 'HP',
        productCode: 100013,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 200,
        lowStockThreshold: 20,
        buyPrice: 12.00,
        categoryId: 'office-supplies',
        locationId: 'loc13',
      },
    }),
    prisma.product.create({
      data: {
        id: '14',
        name: 'Stapler Heavy Duty',
        description: 'Heavy-duty stapler for office use',
        manufacturer: 'Swingline',
        productCode: 100014,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 35,
        lowStockThreshold: 20,
        buyPrice: 18.00,
        categoryId: 'office-supplies',
        locationId: 'loc14',
      },
    }),
    // Appliances
    prisma.product.create({
      data: {
        id: '15',
        name: 'Coffee Maker',
        description: 'Single-serve coffee maker',
        manufacturer: 'Keurig',
        productCode: 100015,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 15,
        lowStockThreshold: 20,
        buyPrice: 89.00,
        categoryId: 'appliances',
        locationId: 'loc15',
      },
    }),
    prisma.product.create({
      data: {
        id: '16',
        name: 'Mini Fridge',
        description: 'Compact mini refrigerator',
        manufacturer: 'Danby',
        productCode: 100016,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 8,
        lowStockThreshold: 15,
        buyPrice: 180.00,
        categoryId: 'appliances',
        locationId: 'loc16',
      },
    }),
    prisma.product.create({
      data: {
        id: '17',
        name: 'Microwave Compact',
        description: 'Compact microwave oven',
        manufacturer: 'Panasonic',
        productCode: 100017,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 10,
        lowStockThreshold: 20,
        buyPrice: 95.00,
        categoryId: 'appliances',
        locationId: 'loc17',
      },
    }),
    prisma.product.create({
      data: {
        id: '18',
        name: 'Water Cooler',
        description: 'Bottled water cooler dispenser',
        manufacturer: 'Primo',
        productCode: 100018,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 5,
        lowStockThreshold: 15,
        buyPrice: 250.00,
        categoryId: 'appliances',
        locationId: 'loc18',
      },
    }),
    // Security
    prisma.product.create({
      data: {
        id: '19',
        name: 'Security Camera',
        description: 'Wireless security camera system',
        manufacturer: 'Ring',
        productCode: 100019,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 12,
        lowStockThreshold: 20,
        buyPrice: 199.00,
        categoryId: 'security',
        locationId: 'loc19',
      },
    }),
    prisma.product.create({
      data: {
        id: '20',
        name: 'Smart Lock',
        description: 'Keyless smart door lock',
        manufacturer: 'August',
        productCode: 100020,
        codeSource: 'AUTO',
        latestEntryDate: new Date(),
        expirationDate: null,
        inStock: 18,
        lowStockThreshold: 20,
        buyPrice: 225.00,
        categoryId: 'security',
        locationId: 'loc20',
      },
    }),
  ])
  console.log(`📦 Created ${products.length} products`)

  // Update low stock warnings
  await prisma.product.updateMany({
    where: {
      inStock: {
        lte: prisma.product.fields.lowStockThreshold,
      },
    },
    data: {
      lowStockWarning: true,
    },
  })
  console.log('⚠️ Updated low stock warnings')

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   Categories: ${categories.length}`)
  console.log(`   Locations: ${locations.length}`)
  console.log(`   Products: ${products.length}`)
  console.log('\n🚀 Ready to start using VibeMart!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })