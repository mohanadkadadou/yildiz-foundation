// prisma/seed-admin.ts
// Bootstraps (or resets the password of) the first admin account.
// Usage: ADMIN_PASSWORD="your-password" npm run db:seed-admin
// Optionally set ADMIN_EMAIL to override the default.
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'muhanndkadadou0@gmail.com'
  const rawPassword = process.env.ADMIN_PASSWORD
  if (!rawPassword) throw new Error('Set ADMIN_PASSWORD before running this script, e.g. ADMIN_PASSWORD="your-password" npm run db:seed-admin')
  if (rawPassword.length < 8) throw new Error('ADMIN_PASSWORD must be at least 8 characters')

  const password = await bcrypt.hash(rawPassword, 12)
  const user = await prisma.user.upsert({
    where: { email },
    update: { password, role: UserRole.ADMIN },
    create: { email, password, role: UserRole.ADMIN, name: 'Admin' },
  })
  console.log(`Admin ready: ${user.email} (role: ${user.role})`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
