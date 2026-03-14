# 🚀 REFERENCIA RÁPIDA - ERP V3.0

## 📋 Archivos Clave

| Archivo | Ubicación | Propósito |
|---------|-----------|----------|
| **START_HERE.md** | Raíz | Guía de inicio |
| **SETUP_COMPLETE.md** | Raíz | Resumen estructura |
| **GIT_STRUCTURE.md** | Raíz | Detalles organización |
| **.env** | Raíz | Configuración local |
| **docker-compose.yml** | Raíz | Desarrollo |
| **docker-compose.prod.yml** | Raíz | Producción |

---

## 🔧 Comandos Esenciales

### Docker
```bash
# Iniciar desarrollo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Reconstruir
docker-compose build --no-cache
```

### Git
```bash
# Inicializar
git init
git add .
git commit -m "Initial commit"

# Crear rama
git checkout -b feature/mi-feature

# Push
git push origin feature/mi-feature
```

### Node.js (Backend)
```bash
# Instalar dependencias
cd backend && npm install

# Desarrollo
npm run dev

# Build
npm run build

# Migraciones DB
npm run db:migrate
```

### React (Frontend)
```bash
# Instalar dependencias
cd frontend && npm install

# Desarrollo
npm run dev

# Build
npm run build
```

---

## 🔐 Variables de Entorno Críticas

```
JWT_SECRET=tu-clave-secreta-aqui        (CAMBIAR EN PRODUCCIÓN)
DB_PASSWORD=tu-contraseña               (CAMBIAR EN PRODUCCIÓN)
ENCRYPTION_KEY=32-caracteres-min        (CAMBIAR EN PRODUCCIÓN)
```

---

## 📚 Documentación

```
docs/README.md              - Descripción general
docs/ARCHITECTURE.md        - Arquitectura sistema
GIT_STRUCTURE.md           - Detalles organización
START_HERE.md              - Guía inicio
SETUP_COMPLETE.md          - Resumen ejecutivo
RESUMEN_EJECUTIVO.md       - Este archivo
```

---

## 🌐 URLs Locales

```
Frontend:     http://localhost:5173
Backend API:  http://localhost:3000/api
Health check: http://localhost:3000/api/health
Nginx:        http://localhost
```

---

## 👥 Usuarios Demo (🔄 A Crear)

```
super@empresa.cl      / 123456  (SUPER_ADMIN)
admin@empresa.cl      / 123456  (ADMIN)
operario@empresa.cl   / 123456  (OPERARIO)
viewer@empresa.cl     / 123456  (VISUALIZADOR)
```

---

## 📊 Stack Tecnológico

```
Frontend:     React 18 + Vite + Tailwind
Backend:      Node.js + Express + TypeScript
Database:     PostgreSQL 16
Cache:        Redis 7
DevOps:       Docker + Docker Compose
Proxy:        Nginx
```

---

## ✅ Instalación Rápida

### 1. Setup inicial
```bash
cd erp-v3-empresarial
cp .env.example .env
```

### 2. Iniciar servicios
```bash
docker-compose up -d
```

### 3. Verificar salud
```bash
curl http://localhost:3000/api/health
```

### 4. Acceder
```
http://localhost:5173  (Frontend)
```

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Port 5432 en uso | `docker ps` → detener postgres antiguo |
| Port 3000 en uso | `docker ps` → detener backend antiguo |
| No conecta BD | `docker-compose logs postgres` |
| No inicia frontend | `docker-compose logs frontend` |

---

## 🔄 Workflow Git Recomendado

```
main (producción)
  ↑ pull request
develop (integración)
  ↑ pull request
feature/mi-feature (desarrollo)
```

---

## 📦 Dependencias Principales

### Backend
- express, pg, redis, jwt, bcryptjs, joi, helmet, winston

### Frontend
- react, react-router, zustand, recharts, axios

---

## 🎯 Próximas Tareas

1. [ ] Leer START_HERE.md
2. [ ] Git init + commit
3. [ ] docker-compose up
4. [ ] Verificar salud
5. [ ] Comenzar desarrollo backend

---

**Guía rápida para consultas frecuentes** 📌
