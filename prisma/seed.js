const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function baseProduct(i) {
  const id = `p_auto_${i}`
  const title = `Auto product ${i}`
  return {
    id,
    title,
    description: `Auto-generated product ${i} description`,
    priceAmount: (10 + (i % 200)),
    priceCurrency: 'USD',
    images: JSON.stringify(['/images/placeholder.png']),
    rating: 3 + (i % 5) * 0.5,
    reviews: (i * 7) % 400,
    categories: JSON.stringify(['General']),
    stock: 50 + (i % 100),
    featured: i % 10 === 0,
  }
}

async function main() {
  console.log('seeding products...')
  const products = []
  for (let i = 1; i <= 500; i++) {
    products.push(baseProduct(i))
  }
  // insert in batches
  const BATCH = 50
  for (let b = 0; b < products.length; b += BATCH) {
    try {
      await prisma.product.createMany({ data: products.slice(b, b + BATCH) })
      console.log(`inserted batch ${b / BATCH + 1}`)
    } catch (err) {
      // ignore unique constraint failures (already seeded) and continue
      if (err && err.code === 'P2002') {
        console.log(`batch ${b / BATCH + 1} contains duplicates; skipping`)
        continue
      }
      throw err
    }
  }
  console.log('seeding complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
