// prisma/data-export/restore-data.ts
// Restores data.json into whatever database DATABASE_URL currently points to.
// Run `prisma db push` first to create the schema on the new database.
// Usage: npx tsx prisma/data-export/restore-data.ts
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

const MODELS_IN_ORDER = [
  'user', 'verificationToken', 'university', 'account', 'session',
  'program', 'galleryImage', 'scholarship', 'requirement',
  'booking', 'lead', 'blogPost', 'testimonial', 'favorite', 'application', 'newsletter',
] as const

function reviveDates(rows: any[]) {
  const dateKeys = ['createdAt', 'updatedAt', 'emailVerified', 'expires', 'preferredDate']
  return rows.map(row => {
    const copy = { ...row }
    for (const key of dateKeys) {
      if (copy[key]) copy[key] = new Date(copy[key])
    }
    return copy
  })
}

async function main() {
  const dataPath = join(__dirname, 'data.json')
  const data = JSON.parse(readFileSync(dataPath, 'utf-8'))

  for (const model of MODELS_IN_ORDER) {
    const rows = reviveDates(data[model] || [])
    if (rows.length === 0) continue
    await (prisma as any)[model].createMany({ data: rows, skipDuplicates: true })
    console.log(`${model}: inserted ${rows.length} rows`)
  }
  console.log('\nRestore complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
