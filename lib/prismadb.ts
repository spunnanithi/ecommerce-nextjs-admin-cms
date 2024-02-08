import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();

// Prevents use from creating a new instance of PrismaDB everytime Next.js hot reloads
// during development
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
