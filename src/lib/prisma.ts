import { PrismaClient } from '@prisma/client'

// Create a singleton Prisma Client instance
const prisma = new PrismaClient()

export default prisma