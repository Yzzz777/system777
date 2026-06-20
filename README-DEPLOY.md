# SYSTEM 777 — Plataforma de Academia Tech

## Inicio Rápido

### 1. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 2. Ejecutar script de deploy

```bash
# Deploy completo (todas las fases)
./deploy.sh all

# O ejecutar fases individuales
./deploy.sh env      # Verificar .env
./deploy.sh github   # Configurar GitHub repo
./deploy.sh dns      # Configurar Cloudflare DNS
./deploy.sh pages    # Configurar Cloudflare Pages
./deploy.sh actions  # Configurar GitHub Actions
./deploy.sh build    # Verificar build local
./deploy.sh deploy   # Deploy inicial
```

### 3. Verificar

- Dominio: https://jrsystem7777.com
- Pages: https://system777.pages.dev
- GitHub: https://github.com/usuario/system777

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de conexión a Neon PostgreSQL |
| `CLOUDFLARE_API_TOKEN` | Token de API de Cloudflare |
| `CLOUDFLARE_ACCOUNT_ID` | ID de cuenta de Cloudflare |
| `GITHUB_TOKEN` | Personal Access Token de GitHub |
| `GITHUB_REPO` | Repositorio (usuario/repo) |
| `AUTH_SECRET` | Secreto para Auth.js |

## Seguridad

- **NUNCA** subas `.env` a Git
- Cambia credenciales si fueron expuestas
- Usa tokens con permisos mínimos
- Revisa logs en `deploy.log`

## Troubleshooting

### Error 522 en Cloudflare
- DNS no propagado (espera 5-30 min)
- Cloudflare Pages no desplegado

### Build falla
- Verifica Node.js 20: `nvm use 20`
- Instala dependencias: `npm install`
- Verifica Prisma: `npx prisma generate`

### GitHub Actions no funciona
- Verifica Secrets en Settings → Secrets
- Revisa logs en Actions tab
