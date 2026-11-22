import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const [productCount, categoryCount, orderCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
  ]);
  console.log("DB OK");
  console.log("  products:", productCount);
  console.log("  categories:", categoryCount);
  console.log("  orders:", orderCount);
} catch (e) {
  console.error("DB ERROR:", e.message);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
