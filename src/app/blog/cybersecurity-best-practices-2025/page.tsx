"use client";

import BlogPost from "@/components/BlogPost";

export default function CybersecurityBestPractices2025() {
  return (
    <BlogPost
      title="Mejores Prácticas de Ciberseguridad 2025"
      category="Ciberseguridad"
      author="System 777"
      date="2025-01-12"
      readTime="12 min"
      content={`
## Introducción

En 2025, las amenazas cibernéticas evolucionan a una velocidad sin precedentes. Con el aumento de la inteligencia artificial en los ataques, las vulnerabilidades en cadenas de suministro y la sofisticación de los ransomware, implementar buenas prácticas de seguridad ya no es opcional: es una necesidad. En esta guía, cubriremos las prácticas esenciales que todo desarrollador y equipo de TI debe implementar para proteger sus aplicaciones y datos.

## 1. Autenticación Robusta

### Autenticación Multifactor (MFA)

MFA es una de las capas de seguridad más efectivas. Requiere que los usuarios demuestren su identidad mediante al menos dos factores: algo que saben (contraseña), algo que tienen (teléfono) o algo que son (biometría).

\`\`\`javascript
// Ejemplo: Implementación de MFA con TOTP (Time-based One-Time Password)
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Generar secreto para el usuario
const secret = authenticator.generateSecret();
console.log('Secreto:', secret);

// Generar URL de URI para códigos QR
const otpauth = authenticator.keyuri('usuario@email.com', 'MiApp', secret);
console.log('URI:', otpauth);

// Generar código QR para que el usuario escanee con Google Authenticator
const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
console.log('QR Code URL:', qrCodeDataUrl);

// Verificar código del usuario
const userCode = '123456'; // Código que ingresó el usuario
const isValid = authenticator.verify({
  token: userCode,
  secret: secret,
});
console.log('Código válido:', isValid);
\`\`\`

**Recomendaciones de MFA:**
- Usa authenticator apps (Google Authenticator, Authy, Microsoft Authenticator) en lugar de SMS.
- Implementa backup codes para cuando el usuario pierda acceso a su dispositivo.
- Ofrece Hardware Security Keys (YubiKey) para cuentas de alto nivel.

### Hash de Contraseñas con bcrypt

Nunca almacenes contraseñas en texto plano. Usa bcrypt o Argon2 para hashearlas.

\`\`\`javascript
// Instalar: npm install bcryptjs
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // Número de rondas de salt (más alto = más seguro pero más lento)

// Registrar usuario - hashear contraseña antes de guardar
async function registerUser(username, plainPassword) {
  const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  // Guardar hashedPassword en la base de datos, NUNCA plainPassword
  return {
    username,
    password: hashedPassword,
    createdAt: new Date(),
  };
}

// Login - verificar contraseña
async function loginUser(username, plainPassword) {
  // Obtener usuario de la base de datos
  const user = await getUserFromDB(username);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta');
  }

  return { success: true, token: generateJWT(user) };
}
\`\`\`

**Prácticas de contraseñas seguras:**
- Longitud mínima de 12 caracteres.
- Combinar mayúsculas, minúsculas, números y símbolos.
- No reutilizar contraseñas entre servicios.
- Implementar verificación de contraseñas comprometidas con Have I Been Pwned API.

## 2. Validación de Entrada con Zod

La validación de entrada es crítica para prevenir inyecciones y ataques de manipulación de datos.

\`\`\`typescript
// Instalar: npm install zod
import { z } from 'zod';

// Esquema de validación para registro de usuario
const userRegistrationSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario no puede exceder 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo se permiten letras, números y guiones bajos'),
  email: z
    .string()
    .email('Email no válido')
    .max(255, 'Email demasiado largo'),
  password: z
    .string()
    .min(12, 'La contraseña debe tener al menos 12 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un símbolo'),
  age: z.number().int().min(18).max(120).optional(),
});

// Validar datos del formulario
function validateRegistration(data: unknown) {
  try {
    const validatedData = userRegistrationSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    return {
      success: false,
      errors: error.errors,
    };
  }
}

// Ejemplo de uso en API
app.post('/api/register', async (req, res) => {
  const validation = validateRegistration(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: 'Datos de entrada inválidos',
      errors: validation.errors,
    });
  }
  // Procesar registro con datos validados...
});
\`\`\`

**Principios de validación:**
- Valida tanto en el cliente como en el servidor (nunca confíes solo en el cliente).
- Usa whitelist approach: define lo que es válido, no lo que es inválido.
- Sanitiza HTML para prevenir XSS si el input puede contener HTML.
- Longitud máxima en todos los campos de texto.

## 3. Prevención de Inyección SQL

La inyección SQL sigue siendo una de las vulnerabilidades más peligrosas. Nunca concatenes datos de usuario directamente en consultas SQL.

\`\`\`typescript
// ❌ MAL - Vulnerable a inyección SQL
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;
// Un atacante podría enviar: ' OR '1'='1' --
// Esto retornaría TODOS los usuarios

// ✅ BIEN - Usar parámetros/prepared statements
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getUserByEmail(email: string) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

// ✅ BIEN - Con Prisma ORM (automáticamente previene inyección)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}
\`\`\`

**Reglas contra SQL Injection:**
- Usa siempre prepared statements o query builders.
- Nunca uses \`\${variable}\` en consultas SQL.
- Limita los permisos del usuario de base de datos (no uses el usuario root).
- Implementa WAF (Web Application Firewall) como capa adicional de protección.

## 4. HTTPS y TLS

La comunicación cifrada es fundamental para proteger datos en tránsito.

\`\`\`bash
# Configuración de Nginx con HTTPS
server {
    listen 443 ssl http2;
    server_name misitio.com;

    ssl_certificate /etc/letsencrypt/live/misitio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/misitio.com/privkey.pem;

    # Configuración TLS moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Habilitar OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name misitio.com;
    return 301 https://$server_name$request_uri;
}
\`\`\`

**Recomendaciones HTTPS:**
- Usa Let's Encrypt para certificados SSL gratuitos.
- Configura auto-renewal con certbot.
- Implementa HSTS para forzar HTTPS.
- Redirige todo el tráfico HTTP a HTTPS.
- Usa TLS 1.3 cuando sea posible.

## 5. Rate Limiting

El rate limiting protege contra ataques de fuerza bruta y DDoS.

\`\`\`typescript
// Instalar: npm install express-rate-limit
import rateLimit from 'express-rate-limit';

// Rate limiting general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    error: 'Demasiadas peticiones. Intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting más estricto para login (prevenir fuerza bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por ventana
  message: {
    error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar logins exitosos
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', loginLimiter);
\`\`\`

**Estrategias de rate limiting:**
- Por dirección IP: protege contra ataques desde una sola fuente.
- Por usuario autenticado: protege contra abuso de cuentas.
- Por endpoint: endpoints sensibles (login, registro) con límites más estrictos.
- Respuesta con headers \`Retry-After\` para informar al cliente.

## 6. Headers de Seguridad

Los headers HTTP de seguridad adicionan capas de protección contra XSS, clickjacking y otros ataques.

\`\`\`typescript
// Usando helmet.js con Express
import helmet from 'helmet';

app.use(helmet());

// O configuración manual
app.use((req, res, next) => {
  // Prevenir XSS
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevenir MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Política de contenido estricta
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://trusted-cdn.com; style-src 'self' 'unsafe-inline';"
  );

  // Prevenir información del servidor
  res.removeHeader('X-Powered-By');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  next();
});
\`\`\`

## 7. Auditoría de Dependencias

Las vulnerabilidades en dependencias de terceros son una de las principales fuentes de brechas de seguridad.

\`\`\`bash
# Audit de dependencias en Node.js
npm audit                    # Ver vulnerabilidades
npm audit fix                # Corregir automáticamente
npm audit fix --force        # Corregir (puede incluir breaking changes)

# Usar Snyk para auditoría más profunda
npx snyk test
npx snyk monitor

# Python - Safety
pip install safety
safety check

# Verificar licencias para problemas legales
npx license-checker --only-allow 'MIT;Apache-2.0;BSD-3-Clause'
\`\`\`

**Prácticas de gestión de dependencias:**
- Actualiza dependencias regularmente.
- Usa dependabot o renovate para crear PRs automáticos de actualizaciones.
- Revisa el changelog antes de actualizar dependencias mayores.
- Monitorea CVEs para las dependencias que usas.
- Usa lockfiles (package-lock.json) para reproducibilidad.
- Evalúa la reputación de las dependencias antes de instalarlas.

## Checklist de Seguridad Rápida

- [ ] MFA habilitado en todas las cuentas administrativas
- [ ] Contraseñas hasheadas con bcrypt/Argon2 (mínimo 12 caracteres)
- [ ] Validación de entrada implementada con esquemas (Zod, Yup)
- [ ] Consultas SQL parametrizadas en toda la aplicación
- [ ] HTTPS habilitado con TLS 1.2+
- [ ] Rate limiting en endpoints de autenticación
- [ ] Headers de seguridad configurados
- [ ] Auditoría de dependencias ejecutada
- [ ] Logs de seguridad centralizados
- [ ] Backups automáticos y cifrados

## Conclusión

La ciberseguridad no es un destino, es un viaje continuo. Estas prácticas son la base para construir aplicaciones seguras. Recuerda: la seguridad más costosa es la que no se implementa antes de un ataque. Implementa estas prácticas hoy y mantente actualizado sobre las nuevas amenazas.
      `}
    />
  );
}
