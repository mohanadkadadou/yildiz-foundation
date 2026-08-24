// prisma/seed-mhb-images.ts
// Sets coverImageUrl for the 32 universities added in seed-mhb.ts.
// Safe to re-run: only updates the coverImageUrl field, nothing else.
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const slugs = [
  'bahcesehir-cyprus-university',
  'girne-american-university',
  'cyprus-international-university',
  'near-east-university',
  'cyprus-health-and-social-sciences-university',
  'european-university-of-lefke',
  'university-of-kyrenia',
  'eastern-mediterranean-university',
  'bahcesehir-university',
  'ankara-science-university',
  'atilim-university',
  'ankara-medipol-university',
  'istanbul-medipol-university',
  'istinye-university',
  'istanbul-atlas-university',
  'biruni-university',
  'nisantasi-university',
  'yeni-yuzyil-university',
  'halic-university',
  'ibn-haldun-university',
  'fenerbahce-university',
  'istanbul-kent-university',
  'istanbul-kultur-university',
  'istanbul-okan-university',
  'fatih-sultan-mehmet-university',
  'beykent-university',
  'istanbul-topkapi-university',
  'istanbul-sabahattin-zaim-university',
  'esenyurt-university',
  'istanbul-gedik-university',
  'isik-university',
  'hasan-kalyoncu-university',
]

async function main() {
  let updated = 0
  for (const slug of slugs) {
    const result = await prisma.university.updateMany({
      where: { slug },
      data: { coverImageUrl: `/images/universities/${slug}.jpg` },
    })
    updated += result.count
  }
  console.log(`Updated coverImageUrl for ${updated} universities.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
