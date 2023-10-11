const { PrismaClient } = require("@prisma/client");

const globalForPrisma = {
  prisma: undefined
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = {
  db: prisma
};
