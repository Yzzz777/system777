"use client";

import BlogPost from "@/components/BlogPost";

export default function Nextjs15NewFeatures() {
  return (
    <BlogPost
      title="Next.js 15: Todas las Nuevas Funcionalidades"
      category="Programación"
      author="System 777"
      date="2025-01-08"
      readTime="10 min"
      content={`
## Introducción

Next.js 15 trae mejoras significativas que consolidan a React como el framework web más completo del ecosistema. Desde React 19 hasta Turbopack estable, pasando por nuevas capacidades de enrutamiento y renderizado, esta versión redefine lo que es posible construir en la web.

## React 19: El Futuro de React

Next.js 15 adopta React 19 como versión base, trayendo todas las mejoras de rendimiento y nuevas API del equipo de Meta.

### Server Actions (ya estables)

Las Server Actions permiten ejecutar código del servidor directamente desde componentes cliente, eliminando la necesidad de crear endpoints API para mutaciones.

\`\`\`tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.post.create({
    data: { title, content },
  });

  revalidatePath('/posts');
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });
  revalidatePath('/posts');
}
\`\`\`

\`\`\`tsx
// app/posts/new/page.tsx
import { createPost } from '../actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Título" required />
      <textarea name="content" placeholder="Contenido" required />
      <button type="submit">Crear Post</button>
    </form>
  );
}
\`\`\`

### use() Hook

El hook \`use()\` permite leer Promises y Context en renderizado condicional.

\`\`\`tsx
import { use } from 'react';

async function fetchUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}

function UserProfile({ userId }: { userId: string }) {
  const user = use(fetchUser(userId));
  return <div>{user.name}</div>;
}
\`\`\`

### useOptimistic

Actualización optimista de UI antes de que la mutación del servidor se complete.

\`\`\`tsx
'use client';

import { useOptimistic } from 'react';
import { addTodo } from './actions';

function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: string) => [...state, { id: crypto.randomUUID(), text: newTodo, done: false }]
  );

  async function handleSubmit(formData: FormData) {
    const text = formData.get('text') as string;
    addOptimisticTodo(text);
    await addTodo(text);
  }

  return (
    <form action={handleSubmit}>
      <input name="text" required />
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </form>
  );
}
\`\`\`

## Turbopack: Estable y Listo para Producción

Turbopack es el nuevo bundler de Next.js, escrito en Rust, que reemplaza a Webpack. En Next.js 15, Turbopack está oficialmente listo para producción.

### Rendimiento

- **Hasta 76x más rápido** en compilaciones con Webpack para proyectos grandes.
- **Hasta 96% más rápido** en hot module replacement (HMR).
- Consumo significativamente menos memoria.

### Configuración

\`\`\`bash
# Usar Turbopack en desarrollo
next dev --turbopack

# Turbopack se habilita automáticamente en next build desde Next.js 15
next build
\`\`\`

\`\`\`js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack se activa automáticamente, no necesita configuración
  experimental: {
    // Puedes deshabilitar Turbopack si es necesario
    // turbopack: false,
  },
};
module.exports = nextConfig;
\`\`\`

## Parallel Routes: Renderizado Paralelo

Las rutas paralelas permiten renderizar múltiples páginas en la misma vista, cada una con su propio estado y carga.

\`\`\`
app/
├── layout.tsx
├── page.tsx
├── @analytics/
│   └── page.tsx
├── @notifications/
│   └── page.tsx
└── @sidebar/
    └── page.tsx
\`\`\`

\`\`\`tsx
// app/layout.tsx
export default function Layout({
  children,
  analytics,
  notifications,
  sidebar,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  notifications: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="flex">
      {sidebar}
      <main className="flex-1">
        {children}
        <div className="grid grid-cols-2 gap-4">
          {analytics}
          {notifications}
        </div>
      </main>
    </div>
  );
}
\`\`\`

### Fallback para rutas paralelas

\`\`\`tsx
// app/@analytics/default.tsx
// Se renderiza si la ruta @analytics no tiene match
export default function Default() {
  return <div>Selecciona una métrica para ver el análisis</div>;
}
\`\`\`

## Intercepting Routes: Modales y Overlays

Las rutas interceptantes permiten interceptar la navegación y renderizar contenido diferente sin cambiar la URL.

### Conveniones de carpetas

- **\`(.)\`** - Interceptar en el mismo nivel
- **\`(..)\`** - Interceptar un nivel arriba
- **\`(..)(..)\`** - Interceptar dos niveles arriba
- **\`(...)\`** - Interceptar desde la raíz

\`\`\`
app/
├── feed/
│   └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx          # Vista completa de foto
└── @modal/
    └── (.)photo/
        └── [id]/
            └── page.tsx      # Modal de foto (intercepta /photo/[id])
\`\`\`

\`\`\`tsx
// app/@modal/(.)photo/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PhotoModal({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') router.back();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [router]);

  return (
    <div className="modal-overlay" onClick={() => router.back()}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <img src={\`/api/photos/\${params.id}\`} alt="Photo" />
        <button onClick={() => router.back()}>Cerrar</button>
      </div>
    </div>
  );
}
\`\`\`

## Instrumentation API

La Instrumentation API permite ejecutar código de inicialización global antes de que tu aplicación empiece, ideal para configurar monitoreo, logging y métricas.

\`\`\`ts
// instrumentation.ts
import { registerOTel } from '@vercel/otel';

export function register() {
  // Solo ejecutar en el servidor
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Inicializar OpenTelemetry para monitoreo
    registerOTel('my-next-app');

    // Configurar error tracking
    console.log('Instrumentation server-side init');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    console.log('Instrumentation edge runtime init');
  }
}
\`\`\`

\`\`\`ts
// instrumentation.ts - Ejemplo con Sentry
import * as Sentry from '@sentry/nextjs';

export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });
}
\`\`\`

## Mejoras de Rendimiento

### Caché mejorado por defecto

Next.js 15 hace que las fetch requests sean \`cache: 'force-cache'\` por defecto (antes era \`no-store\`). Esto significa que todas las peticiones fetch se cachean automáticamente.

\`\`\`tsx
// Caché por defecto (nuevo comportamiento en Next.js 15)
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

// Forzar revalidación
async function getLatestProducts() {
  const res = await fetch('https://api.example.com/products', {
    cache: 'no-store', // Sin caché
  });
  return res.json();
}

// Revalidar cada 60 segundos
async function getPopularProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 },
  });
  return res.json();
}
\`\`\`

### DynamicIO (Experimental)

\`\`\`js
// next.config.js
const nextConfig = {
  experimental: {
    dynamicIO: true,
  },
};

module.exports = nextConfig;
\`\`\`

### PPR (Partial Prerendering) - Experimental

\`\`\`js
// next.config.js
const nextConfig = {
  experimental: {
    ppr: true,
  },
};

module.exports = nextConfig;
\`\`\`

## Manejo de Headers y Cookies

\`\`\`tsx
// Leyendo headers del servidor
import { headers } from 'next/headers';

export default async function Page() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');

  return <div>User Agent: {userAgent}</div>;
}
\`\`\`

\`\`\`tsx
// Leyendo y escribiendo cookies
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');

  return <div>Theme: {theme?.value ?? 'light'}</div>;
}
\`\`\`

## Migración a Next.js 15

\`\`\`bash
# Actualizar Next.js
npm install next@latest react@latest react-dom@latest

# Actualizar dependencias de TypeScript
npm install -D @types/react @types/react-dom

# Ejecutar el migrador de Next.js
npx nextjs/codemod@latest upgrade
\`\`\`

### Cambios a tener en cuenta

1. **React 19**: Asegúrate de que todas tus dependencias sean compatibles con React 19.
2. **Caché por defecto**: Las fetch requests ahora se cachean por defecto.
3. **Turbopack**: Verifica que tu \`next.config.js\` sea compatible.
4. **TypeScript**: Actualiza \`@types/react\` a la versión 19.

## Conclusión

Next.js 15 representa un salto significativo en la evolución del framework web. Con React 19, Turbopack estable y nuevas capacidades de enrutamiento, puedes construir aplicaciones web más rápidas, más modularizadas y más mantenibles. La adopción gradual de estas funcionalidades te permitirá mejorar la experiencia de usuario de tus aplicaciones incrementalmente.

Las Parallel Routes y Intercepting Routes son especialmente poderosas para crear interfaces complejas sin sacrificar la experiencia de usuario. Combinadas con Server Actions y React 19, ofrecen un paradigma de desarrollo web completamente nuevo.
      `}
    />
  );
}
