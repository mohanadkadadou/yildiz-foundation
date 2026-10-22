// prisma/data-export/export-data.ts
// Exports every table's data from the current DATABASE_URL into a single JSON file.
// Usage: npx tsx prisma/data-export/export-data.ts
import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

// Parent tables before the tables that reference them (FK-safe order).
const MODELS_IN_ORDER = [
  'user', 'verificationToken', 'university', 'account', 'session',
  'program', 'galleryImage', 'scholarship', 'requirement',
  'booking', 'lead', 'blogPost', 'testimonial', 'favorite', 'application', 'newsletter',
] as const

async function main() {
  const data: Record<string, any[]> = {}
  for (const model of MODELS_IN_ORDER) {
    const rows = await (prisma as any)[model].findMany()
    data[model] = rows
    console.log(`${model}: ${rows.length} rows`)
  }
  const outPath = join(__dirname, 'data.json')
  writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`\nExported to ${outPath}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
