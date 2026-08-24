// prisma/cleanup-test-entries.ts
// One-off cleanup: removes junk/test university records that aren't real universities.
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const junkSlugs = ['kadadou', 'mohand-kadadou', 'tjrba-']

async function main() {
  const result = await prisma.university.deleteMany({ where: { slug: { in: junkSlugs } } })
  console.log(`Deleted ${result.count} test/junk university records.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
