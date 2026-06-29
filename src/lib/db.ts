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

export async function ensureEnrollmentsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL,
      course_slug TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT false,
      enrolled_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, course_slug)
    )
  `;
}

export async function enrollUser(userId: string, courseSlug: string) {
  await ensureEnrollmentsTable();
  const rows = await sql`
    INSERT INTO enrollments (user_id, course_slug)
    VALUES (${userId}, ${courseSlug})
    ON CONFLICT (user_id, course_slug) DO NOTHING
    RETURNING id, user_id, course_slug, progress, completed, enrolled_at
  `;
  if (rows.length === 0) {
    return (await sql`SELECT * FROM enrollments WHERE user_id = ${userId} AND course_slug = ${courseSlug} LIMIT 1`)[0];
  }
  return rows[0];
}

export async function getUserEnrollment(userId: string, courseSlug: string) {
  await ensureEnrollmentsTable();
  const rows = await sql`SELECT * FROM enrollments WHERE user_id = ${userId} AND course_slug = ${courseSlug} LIMIT 1`;
  return rows[0] || null;
}

export async function getUserEnrollments(userId: string) {
  await ensureEnrollmentsTable();
  return await sql`SELECT * FROM enrollments WHERE user_id = ${userId} ORDER BY enrolled_at DESC`;
}

export async function updateEnrollmentProgress(userId: string, courseSlug: string, progress: number) {
  await ensureEnrollmentsTable();
  await sql`
    UPDATE enrollments SET progress = ${progress}, completed = ${progress >= 100}
    WHERE user_id = ${userId} AND course_slug = ${courseSlug}
  `;
}

export async function ensurePaymentsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      amount REAL NOT NULL,
      method TEXT NOT NULL DEFAULT 'banreservas',
      status TEXT NOT NULL DEFAULT 'pending',
      reference TEXT,
      proof_url TEXT,
      type TEXT DEFAULT 'subscription',
      plan_or_course TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function createPayment(data: {
  name: string;
  email: string;
  phone?: string;
  amount: number;
  method: string;
  reference?: string;
  proofUrl?: string;
  type?: string;
  planOrCourse?: string;
}) {
  await ensurePaymentsTable();
  const rows = await sql`
    INSERT INTO payments (name, email, phone, amount, method, reference, proof_url, type, plan_or_course)
    VALUES (${data.name}, ${data.email}, ${data.phone || ""}, ${data.amount}, ${data.method}, ${data.reference || ""}, ${data.proofUrl || ""}, ${data.type || "subscription"}, ${data.planOrCourse || ""})
    RETURNING *
  `;
  return rows[0];
}

export async function getAllPayments() {
  await ensurePaymentsTable();
  return await sql`SELECT * FROM payments ORDER BY created_at DESC`;
}

export async function updatePaymentStatus(id: string, status: string) {
  await ensurePaymentsTable();
  const rows = await sql`
    UPDATE payments SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return rows[0] || null;
}

export async function ensureNotificationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function getNotifications(userId: string) {
  await ensureNotificationsTable();
  return await sql`SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 50`;
}

export async function createNotification(data: { userId: string; title: string; message: string }) {
  await ensureNotificationsTable();
  const rows = await sql`
    INSERT INTO notifications (user_id, title, message)
    VALUES (${data.userId}, ${data.title}, ${data.message})
    RETURNING *
  `;
  return rows[0];
}

export async function markNotificationRead(id: string) {
  await ensureNotificationsTable();
  await sql`UPDATE notifications SET read = true WHERE id = ${id}`;
}

export async function markAllNotificationsRead(userId: string) {
  await ensureNotificationsTable();
  await sql`UPDATE notifications SET read = true WHERE user_id = ${userId} AND read = false`;
}

export { sql };
