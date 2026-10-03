import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL!);
  }
  return _sql;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlQueryResult = Record<string, any>[];

function query(strings: TemplateStringsArray, ...values: unknown[]): Promise<SqlQueryResult> {
  return getSql()(strings, ...values) as Promise<SqlQueryResult>;
}

export { query as sql };

export async function ensureUsersTable() {
  await query`
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
  const rows = await query`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return rows[0] || null;
}

export async function findUserByUsername(username: string) {
  const rows = await query`SELECT * FROM users WHERE username = ${username} LIMIT 1`;
  return rows[0] || null;
}

export async function findUserById(id: string) {
  const rows = await query`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return rows[0] || null;
}

export async function createUser(data: { name: string; email: string; username: string; password: string }) {
  const rows = await query`
    INSERT INTO users (name, email, username, password)
    VALUES (${data.name}, ${data.email}, ${data.username}, ${data.password})
    RETURNING id, email, name, username, role
  `;
  return rows[0];
}

export async function createContactMessage(data: { name: string; email: string; subject: string; message: string }) {
  await query`
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
  await query`
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (${data.name}, ${data.email}, ${data.subject}, ${data.message})
  `;
}

export async function createActivityLog(data: { userId: string; action: string; details?: string; ip?: string }) {
  await query`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      ip TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await query`
    INSERT INTO activity_logs (user_id, action, details, ip)
    VALUES (${data.userId}, ${data.action}, ${data.details || ""}, ${data.ip || ""})
  `;
}

// ── Blog Posts ──
export async function ensureBlogTables() {
  await query`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      category TEXT DEFAULT 'General',
      cover_url TEXT,
      author TEXT DEFAULT 'System 777',
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await query`
    CREATE TABLE IF NOT EXISTS blog_files (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      post_id TEXT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      file_data TEXT DEFAULT '',
      mime TEXT DEFAULT '',
      size INTEGER DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function createBlogPost(data: { title: string; slug: string; excerpt?: string; content?: string; category?: string; coverUrl?: string; author?: string; published?: boolean }) {
  await ensureBlogTables();
  const rows = await query`
    INSERT INTO blog_posts (title, slug, excerpt, content, category, cover_url, author, published)
    VALUES (${data.title}, ${data.slug}, ${data.excerpt || ""}, ${data.content || ""}, ${data.category || "General"}, ${data.coverUrl || ""}, ${data.author || "System 777"}, ${data.published ?? false})
    RETURNING *
  `;
  return rows[0];
}

export async function getBlogPosts(publishedOnly = true) {
  await ensureBlogTables();
  if (publishedOnly) {
    return await query`SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC`;
  }
  return await query`SELECT * FROM blog_posts ORDER BY created_at DESC`;
}

export async function getBlogPost(slug: string) {
  await ensureBlogTables();
  const rows = await query`SELECT * FROM blog_posts WHERE slug = ${slug} LIMIT 1`;
  return rows[0] || null;
}

export async function updateBlogPost(id: string, data: { title?: string; excerpt?: string; content?: string; category?: string; coverUrl?: string; published?: boolean }) {
  await ensureBlogTables();
  const fields: string[] = [];
  const updates: unknown[] = [];
  if (data.title !== undefined) { fields.push("title = " + String(fields.length + 1)); updates.push(data.title); }
  if (data.excerpt !== undefined) { fields.push("excerpt = " + String(fields.length + 1)); updates.push(data.excerpt); }
  if (data.content !== undefined) { fields.push("content = " + String(fields.length + 1)); updates.push(data.content); }
  if (data.category !== undefined) { fields.push("category = " + String(fields.length + 1)); updates.push(data.category); }
  if (data.coverUrl !== undefined) { fields.push("cover_url = " + String(fields.length + 1)); updates.push(data.coverUrl); }
  if (data.published !== undefined) { fields.push("published = " + String(fields.length + 1)); updates.push(data.published); }
  fields.push("updated_at = NOW()");
  if (fields.length === 0) return null;
  const rows = await query`UPDATE blog_posts SET ${query`${fields.join(", ")}`} WHERE id = ${id} RETURNING *`;
  return rows[0] || null;
}

export async function deleteBlogPost(id: string) {
  await ensureBlogTables();
  await query`DELETE FROM blog_files WHERE post_id = ${id}`;
  await query`DELETE FROM blog_posts WHERE id = ${id}`;
}

export async function addBlogFile(data: { postId: string; filename: string; fileData: string; mime?: string; size?: number }) {
  await ensureBlogTables();
  const rows = await query`
    INSERT INTO blog_files (post_id, filename, file_data, mime, size)
    VALUES (${data.postId}, ${data.filename}, ${data.fileData}, ${data.mime || ""}, ${data.size || 0})
    RETURNING id, post_id, filename, mime, size, downloads, created_at
  `;
  return rows[0];
}

export async function getBlogFiles(postId: string) {
  await ensureBlogTables();
  return await query`SELECT id, post_id, filename, mime, size, downloads, created_at FROM blog_files WHERE post_id = ${postId} ORDER BY created_at DESC`;
}

export async function getBlogFileData(fileId: string) {
  await ensureBlogTables();
  const rows = await query`SELECT filename, file_data, mime FROM blog_files WHERE id = ${fileId} LIMIT 1`;
  return rows[0] || null;
}

export async function incrementDownload(fileId: string) {
  await ensureBlogTables();
  await query`UPDATE blog_files SET downloads = downloads + 1 WHERE id = ${fileId}`;
}

