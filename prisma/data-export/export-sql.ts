// prisma/data-export/export-sql.ts
// Converts data.json into a plain PostgreSQL INSERT script (data-dump.sql).
// Run AFTER export-data.ts. Import with: psql "<new-db-url>" -f prisma/data-export/data-dump.sql
// (run `npx prisma db push` against the new database first to create the schema/tables).
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// model name -> actual Postgres table name (Prisma default = PascalCase model name, no @@map used in schema.prisma)
const TABLE_NAMES: Record<string, string> = {
  user: 'User',
  verificationToken: 'VerificationToken',
  university: 'University',
  account: 'Account',
  session: 'Session',
  program: 'Program',
  galleryImage: 'GalleryImage',
  scholarship: 'Scholarship',
  requirement: 'Requirement',
  booking: 'Booking',
  lead: 'Lead',
  blogPost: 'BlogPost',
  testimonial: 'Testimonial',
  favorite: 'Favorite',
  application: 'Application',
  newsletter: 'Newsletter',
}

const MODELS_IN_ORDER = Object.keys(TABLE_NAMES)

function sqlValue(v: any): string {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  if (typeof v === 'number') return String(v)
  if (Array.isArray(v)) {
    if (v.length === 0) return "'{}'"
    const items = v.map(item => `"${String(item).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',')
    return `'{${items}}'`
  }
  // string, date-as-string, enum value — all quoted text; Postgres casts implicitly for enum/timestamp columns
  return `'${String(v).replace(/'/g, "''")}'`
}

function main() {
  const data = JSON.parse(readFileSync(join(__dirname, 'data.json'), 'utf-8'))
  const lines: string[] = [
    '-- Yildiz Foundation — data dump generated from the live database.',
    '-- Import into a FRESH database that already has the schema (run `npx prisma db push` first):',
    '--   psql "postgresql://user:pass@host:5432/dbname" -f data-dump.sql',
    'BEGIN;',
  ]

  for (const model of MODELS_IN_ORDER) {
    const rows: any[] = data[model] || []
    if (rows.length === 0) continue
    const table = TABLE_NAMES[model]
    const columns = Object.keys(rows[0])
    lines.push(`\n-- ${table} (${rows.length} rows)`)
    for (const row of rows) {
      const values = columns.map(c => sqlValue(row[c])).join(', ')
      lines.push(`INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values}) ON CONFLICT (id) DO NOTHING;`)
    }
  }

  lines.push('\nCOMMIT;')
  const outPath = join(__dirname, 'data-dump.sql')
  writeFileSync(outPath, lines.join('\n'), 'utf-8')
  console.log(`Wrote ${outPath}`)
}

main()
