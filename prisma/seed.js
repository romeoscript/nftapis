// prisma/seed.js
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'

const prisma = new PrismaClient()
const productsData = JSON.parse(readFileSync('./prisma/products.json', 'utf8'))

async function main() {
  for (const product of productsData.products) {
    await prisma.product.create({
      data: product
    })
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())