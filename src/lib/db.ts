import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function ensureUsersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      username TEXT UNIQUE,
      password TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      role TEXT DEFAULT 'STUDENT',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function findUserByEmail(email: string) {
  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return rows[0] || null;
}

export async function findUserByUsername(username: string) {
  const rows = await sql`SELECT * FROM users WHERE username = ${username} LIMIT 1`;
  return rows[0] || null;
}

export async function findUserById(id: string) {
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return rows[0] || null;
}

export async function createUser(data: { name: string; email: string; username: string; password: string }) {
  const rows = await sql`
    INSERT INTO users (name, email, username, password)
    VALUES (${data.name}, ${data.email}, ${data.username}, ${data.password})
    RETURNING id, email, name, username, role
  `;
  return rows[0];
}

export async function createContactMessage(data: { name: string; email: string; subject: string; message: string }) {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (${data.name}, ${data.email}, ${data.subject}, ${data.message})
  `;
}

export async function createActivityLog(data: { userId: string; action: string; details?: string; ip?: string }) {
  await sql`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      ip TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    INSERT INTO activity_logs (user_id, action, details, ip)
    VALUES (${data.userId}, ${data.action}, ${data.details || ""}, ${data.ip || ""})
  `;
}

export { sql };
