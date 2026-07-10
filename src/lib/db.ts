import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const DATABASE_URL = process.env.DATABASE_URL || ''

  // Turso cloud database — use libsql adapter
  if (DATABASE_URL.startsWith('libsql://')) {
    return import('@prisma/adapter-libsql').then(({ PrismaLibSql }) =>
      import('@libsql/client').then(({ createClient }) => {
        const libsql = createClient({ url: DATABASE_URL })
        const adapter = new PrismaLibSql(libsql)
        return new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === 'development' ? ['query'] : [],
        })
      })
    )
  }

  // Local SQLite — resolve relative paths to absolute
  let dbUrl = DATABASE_URL
  if (!dbUrl || dbUrl.startsWith('file:')) {
    const relativePath = dbUrl.replace('file:', '') || 'db/custom.db'
    const absolutePath = path.resolve(process.cwd(), relativePath)
    dbUrl = `file:${absolutePath}`
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    datasources: {
      db: { url: dbUrl },
    },
  })
}

export const db =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db