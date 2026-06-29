"use client";

import BlogPost from "@/components/BlogPost";

export default function DockerForBeginners() {
  return (
    <BlogPost
      title="Docker para Principiantes: Contenedoriza Tus Apps"
      category="DevOps"
      author="System 777"
      date="2025-01-05"
      readTime="14 min"
      content={`
## ¿Qué es Docker?

Docker es una plataforma de automatización de despliegue de aplicaciones dentro de contenedores de software. Un contenedor empaqueta una aplicación con todo lo que necesita para ejecutarse: código, runtime, librerías, variables de entorno y archivos de configuración.

La diferencia clave con las máquinas virtuales es que los contenedores comparten el kernel del sistema operativo del host, haciéndolos mucho más ligeros, rápidos y eficientes.

### ¿Por qué usar Docker?

- **Consistencia**: "Funciona en mi máquina" deja de ser un problema. Si funciona en el contenedor, funciona en cualquier lugar.
- **Aislamiento**: Cada contenedor tiene su propio sistema de archivos y dependencias, sin conflictos.
- **Portabilidad**: Los contenedores ejecutan en cualquier sistema que tenga Docker instalado.
- **Velocidad**: Arrancar un contenedor toma segundos,不像 arrancar una VM que toma minutos.
- **Escalabilidad**: Fácilmente despliega múltiples instancias de tu aplicación.
- **Reproducibilidad**: Cada deploy es idéntico al anterior.

## Instalación

### Linux (Ubuntu/Debian)

\`\`\`bash
# Actualizar el índice de paquetes
sudo apt update

# Instalar dependencias
sudo apt install -y ca-certificates curl gnupg

# Agregar la clave GPG oficial de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Agregar el repositorio
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Agregar tu usuario al grupo docker (para evitar usar sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalación
docker --version
docker run hello-world
\`\`\`

### Windows

1. Descarga Docker Desktop desde [docker.com](https://www.docker.com/products/docker-desktop/).
2. Ejecuta el instalador.
3. Asegúrate de tener WSL2 habilitado (se recomienda) o Hyper-V.
4. Reinicia el computer si es necesario.
5. Abre Docker Desktop y verifica la instalación.

### macOS

\`\`\`bash
# Usando Homebrew (recomendado)
brew install --cask docker

# O descarga desde docker.com/products/docker-desktop
\`\`\`

## Conceptos Fundamentales

### Imágenes (Images)

Una imagen Docker es una plantilla de solo lectura que contiene todo lo necesario para ejecutar una aplicación. Las imágenes se construyen a partir de un Dockerfile y se almacenan en un registro como Docker Hub.

\`\`\`bash
# Listar imágenes locales
docker images

# Buscar imágenes en Docker Hub
docker search nginx

# Descargar una imagen
docker pull ubuntu:22.04
docker pull node:18-alpine
docker pull postgres:15
\`\`\`

### Contenedores (Containers)

Un contenedor es una instancia ejecutable de una imagen. Es como un proceso aislado con su propio sistema de archivos, red y espacio de procesos.

\`\`\`bash
# Ejecutar un contenedor interactivo
docker run -it ubuntu:22.04 bash

# Ejecutar un contenedor en background
docker run -d --name mi-web nginx

# Ver contenedores ejecutándose
docker ps

# Ver todos los contenedores (incluyendo los detenidos)
docker ps -a

# Detener un contenedor
docker stop mi-web

# Eliminar un contenedor
docker rm mi-web
\`\`\`

### Dockerfiles

Un Dockerfile es un archivo de texto con instrucciones paso a paso para construir una imagen Docker.

\`\`\`dockerfile
# Dockerfile para una aplicación Node.js

# 1. Usar una imagen base oficial de Node.js
FROM node:18-alpine AS builder

# 2. Establecer el directorio de trabajo
WORKDIR /app

# 3. Copiar archivos de dependencias primero (mejora el caché)
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instalar dependencias
RUN npm ci
RUN npx prisma generate

# 5. Copiar el código fuente
COPY . .

# 6. Compilar la aplicación
RUN npm run build

# 7. Etapa de producción (multi-stage build)
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar solo los archivos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
\`\`\`

### Volumes (Volúmenes)

Los volúmenes permiten persistir datos fuera del contenedor y compartir datos entre contenedores.

\`\`\`bash
# Crear un volumen nombrado
docker volume create mi-volumen

# Montar un volumen al ejecutar un contenedor
docker run -d \\
  --name mi-postgres \\
  -e POSTGRES_PASSWORD=secret \\
  -v mi-volumen:/var/lib/postgresql/data \\
  -p 5432:5432 \\
  postgres:15

# Montar un directorio local (bind mount)
docker run -d \\
  -v $(pwd)/mi-codigo:/app \\
  -p 3000:3000 \\
  node:18-alpine
\`\`\`

\`\`\`bash
# Listar volúmenes
docker volume ls

# Inspeccionar un volumen
docker volume inspect mi-volumen

# Eliminar un volumen
docker volume rm mi-volumen
\`\`\`

## Dockerfile de Ejemplo Completo

\`\`\`dockerfile
# ============================================
# Dockerfile para una API REST con Express
# ============================================

# Imagen base
FROM node:18-alpine

# Metadatos
LABEL maintainer="System 777"
LABEL description="API REST con Express.js"

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Cambiar al usuario no-root
USER nodeuser

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Comando de inicio
CMD ["node", "server.js"]
\`\`\`

## Comandos Esenciales de Docker

### Gestión de contenedores

\`\`\`bash
# Ejecutar contenedor con nombre y puerto
docker run -d --name mi-api -p 8080:3000 mi-imagen

# Ejecutar con variables de entorno
docker run -d --name mi-app \\
  -e DATABASE_URL=postgresql://user:pass@db:5432/mydb \\
  -e NODE_ENV=production \\
  mi-imagen

# Ver logs en tiempo real
docker logs -f mi-api

# Entrar a un contenedor ejecutándose
docker exec -it mi-api sh

# Ver recursos consumidos
docker stats

# Ver detalles de un contenedor
docker inspect mi-api
\`\`\`

### Gestión de imágenes

\`\`\`bash
# Construir imagen desde Dockerfile
docker build -t mi-api:v1 .

# Construir sin caché
docker build --no-cache -t mi-api:v1 .

# Etiquetar una imagen
docker tag mi-api:v1 mi-registry.com/mi-api:latest

# Subir imagen a un registro
docker push mi-registry.com/mi-api:latest

# Eliminar imágenes no utilizadas
docker image prune
\`\`\`

## Docker Compose

Docker Compose permite definir y ejecutar aplicaciones multi-contenedor con un solo archivo YAML.

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  # Base de datos PostgreSQL
  db:
    image: postgres:15-alpine
    container_name: mi-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: miapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret123
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d miapp"]
      interval: 10s
      timeout: 5s
      retries: 5

  # API Node.js
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: mi-api
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://admin:secret123@db:5432/miapp
      NODE_ENV: production
      PORT: 3000
    ports:
      - "8080:3000"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./api:/app
      - /app/node_modules

  # Redis para caché
  redis:
    image: redis:7-alpine
    container_name: mi-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Nginx como reverse proxy
  nginx:
    image: nginx:alpine
    container_name: mi-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/certs:/etc/nginx/certs:ro
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
\`\`\`

\`\`\`bash
# Comandos de Docker Compose
docker compose up -d              # Iniciar servicios en background
docker compose down                # Detener y eliminar servicios
docker compose logs -f api         # Ver logs de un servicio
docker compose ps                  # Ver servicios ejecutándose
docker compose exec api sh         # Entrar a un contenedor
docker compose build --no-cache    # Reconstruir imágenes
docker compose pull                # Actualizar imágenes base
\`\`\`

## Buenas Prácticas

### Seguridad

1. **No ejecutes como root**: Crea un usuario no-root en tu Dockerfile.
2. **No guardes secretos en imágenes**: Usa variables de entorno o Docker Secrets.
3. **Escanea vulnerabilidades**: Usa \`docker scout\` o Trivy para escanear imágenes.
4. **Usa imágenes oficiales**: Siempre usa imágenes verificadas de Docker Hub.

\`\`\`bash
# Escanear imagen con Docker Scout
docker scout cves mi-api:latest

# Usar Trivy
trivy image mi-api:latest
\`\`\`

### Optimización

1. **Multi-stage builds**: Reduce el tamaño de la imagen final.
2. **Ordena las capas**: Coloca \`COPY package.json\` antes de \`COPY .\` para aprovechar el caché.
3. **Usa .dockerignore**: Excluye archivos innecesarios.

\`\`\`
# .dockerignore
node_modules
npm-debug.log
.git
.env
.env.local
*.md
docker-compose.yml
Dockerfile
.dockerignore
dist
coverage
.nyc_output
\`\`\`

### Monitoreo

\`\`\`bash
# Ver uso de recursos
docker stats --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"

# Limpiar recursos no utilizados
docker system prune -a --volumes

# Ver discos usage
docker system df
\`\`\`

## Casos de Uso Comunes

### Desarrollo local con Docker

\`\`\`bash
# Ejecutar un entorno de desarrollo completo
docker compose -f docker-compose.dev.yml up -d

# Con Hot Reload montando el código fuente
docker compose -f docker-compose.dev.yml logs -f api
\`\`\`

### CI/CD con Docker

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t mi-api:$GITHUB_SHA .
      - name: Test image
        run: docker run -d -p 3000:3000 mi-api:$GITHUB_SHA
      - name: Deploy
        run: |
          docker compose pull
          docker compose up -d
\`\`\`

## Conclusión

Docker ha revolucionado la forma en que desarrollamos, desplegamos y escalamos aplicaciones. Con esta guía tienes las bases para empezar a contenedorizar tus proyectos. La clave es practicar: empieza con un Dockerfile simple para una de tus aplicaciones, luego avanza a Docker Compose para orquestar múltiples servicios.

Recursos recomendados:
- **Docker Documentation**: docs.docker.com
- **Docker Hub**: hub.docker.com
- **Play with Docker**: labs.play-with-docker.com (entorno online para practicar)
      `}
    />
  );
}
