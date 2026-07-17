import { PrismaClient } from "./generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const createPrismaClient = () =>
    new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    })

declare global {
    var prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const prismaClient = globalThis.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient