import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

const testProducts = [
  { name: "Laptop Dell XPS 15", manufacturer: "Dell", category: "Electronics", buyPrice: 1200.00, stock: 15 },
  { name: "Wireless Mouse Logitech", manufacturer: "Logitech", category: "Electronics", buyPrice: 25.00, stock: 50 },
  { name: "Mechanical Keyboard", manufacturer: "Corsair", category: "Electronics", buyPrice: 89.99, stock: 25 },
  { name: "USB-C Hub", manufacturer: "Anker", category: "Electronics", buyPrice: 45.00, stock: 30 },
  { name: "Monitor 27\" 4K", manufacturer: "LG", category: "Electronics", buyPrice: 350.00, stock: 10 },
  { name: "Office Chair Ergonomic", manufacturer: "Herman Miller", category: "Furniture", buyPrice: 450.00, stock: 8 },
  { name: "Standing Desk", manufacturer: "Uplift", category: "Furniture", buyPrice: 600.00, stock: 5 },
  { name: "Desk Lamp LED", manufacturer: "Philips", category: "Furniture", buyPrice: 35.00, stock: 40 },
  { name: "File Cabinet 4-Drawer", manufacturer: "HON", category: "Furniture", buyPrice: 150.00, stock: 12 },
  { name: "Whiteboard 4x8", manufacturer: "Quartet", category: "Office Supplies", buyPrice: 120.00, stock: 6 },
  { name: "Notebook Set", manufacturer: "Moleskine", category: "Office Supplies", buyPrice: 15.00, stock: 100 },
  { name: "Pen Set Premium", manufacturer: "Montblanc", category: "Office Supplies", buyPrice: 75.00, stock: 20 },
  { name: "Printer Paper A4", manufacturer: "HP", category: "Office Supplies", buyPrice: 12.00, stock: 200 },
  { name: "Stapler Heavy Duty", manufacturer: "Swingline", category: "Office Supplies", buyPrice: 18.00, stock: 35 },
  { name: "Coffee Maker", manufacturer: "Keurig", category: "Appliances", buyPrice: 89.00, stock: 15 },
  { name: "Mini Fridge", manufacturer: "Danby", category: "Appliances", buyPrice: 180.00, stock: 7 },
  { name: "Microwave Compact", manufacturer: "Panasonic", category: "Appliances", buyPrice: 95.00, stock: 10 },
  { name: "Water Cooler", manufacturer: "Primo", category: "Appliances", buyPrice: 250.00, stock: 3 },
  { name: "Security Camera", manufacturer: "Ring", category: "Security", buyPrice: 199.00, stock: 12 },
  { name: "Smart Lock", manufacturer: "August", category: "Security", buyPrice: 225.00, stock: 8 }
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  const categories = [
    { id: uuidv4(), name: 'Electronics', slug: 'electronics' },
    { id: uuidv4(), name: 'Furniture', slug: 'furniture' },
    { id: uuidv4(), name: 'Office Supplies', slug: 'office-supplies' },
    { id: uuidv4(), name: 'Appliances', slug: 'appliances' },
    { id: uuidv4(), name: 'Security', slug: 'security' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('✅ Categories created')

  // Create locations
  const locations = []
  for (let aisle = 1; aisle <= 5; aisle++) {
    for (let rack = 1; rack <= 3; rack++) {
      for (let shelf = 1; shelf <= 4; shelf++) {
        for (let bin = 1; bin <= 2; bin++) {
          locations.push({
            id: uuidv4(),
            warehouseCode: 'WH-01',
            aisle: aisle.toString(),
            rack: rack.toString(),
            shelf: shelf.toString(),
            bin: bin.toString()
          })
        }
      }
    }
  }

  for (const location of locations) {
    await prisma.location.upsert({
      where: {
        warehouseCode_aisle_rack_shelf_bin: {
          warehouseCode: location.warehouseCode,
          aisle: location.aisle,
          rack: location.rack,
          shelf: location.shelf,
          bin: location.bin
        }
      },
      update: {},
      create: location
    })
  }

  console.log('✅ Locations created')

  // Get created categories and locations
  const createdCategories = await prisma.category.findMany()
  const createdLocations = await prisma.location.findMany({ take: 20 })

  // Create products
  let productCode = 100000
  for (const product of testProducts) {
    const category = createdCategories.find(c => c.name === product.category)
    const location = createdLocations[Math.floor(Math.random() * createdLocations.length)]

    if (category && location) {
      await prisma.product.upsert({
        where: { productCode },
        update: {},
        create: {
          id: uuidv4(),
          name: product.name,
          manufacturer: product.manufacturer,
          productCode,
          codeSource: 'AUTO',
          latestEntryDate: new Date(),
          inStock: product.stock,
          categoryId: category.id,
          lowStockWarning: product.stock < 20,
          lowStockThreshold: 20,
          buyPrice: product.buyPrice,
          locationId: location.id
        }
      })
      productCode++
    }
  }

  console.log('✅ Products created')
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })