import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = "angelsuarezx511@gmail.com";
  const password = process.env.OWNER_PASSWORD || "System777Admin!";

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log("La cuenta ya existe:", email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name: "Angel Suarez",
      email,
      username: "admin",
      password: hashedPassword,
      role: "OWNER",
      emailVerified: new Date(),
    },
  });

  console.log("Cuenta Owner creada:");
  console.log("  Email:", user.email);
  console.log("  Rol:", user.role);
  console.log("  Usuario:", user.username);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
