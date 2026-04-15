import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

async function main() {
  const dbUrl = new URL(process.env.DATABASE_URL as string);
  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.substring(1),
  });

  const prisma = new PrismaClient({ adapter: adapter as any });

  try {
    const testEmail = `test_${Date.now()}@example.com`;
    console.log(`Attempting to create user in MySQL users table: ${testEmail}`);
    
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: "testpassword",
        name: "Test User",
        phone: "1234567890",
      },
    });

    console.log("✅ Success! User created in 'users' table:", user);

    await prisma.user.delete({
      where: { id: user.id },
    });
    console.log("🧹 Cleaned up test user.");
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
