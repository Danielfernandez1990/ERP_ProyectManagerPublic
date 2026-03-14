# 🧪 GUÍA DE PRUEBA LOCAL - ERP V3.0

## 📋 Requisitos Previos

```
✅ Docker Desktop instalado y corriendo
✅ Git instalado
✅ Carpeta proyecto clonada: /erp-v3-empresarial/
```

---

## ⚡ INICIO RÁPIDO (5 minutos)

### Paso 1: Crear archivo .env

```bash
cd /erp-v3-empresarial
cp .env.example .env
```

**El .env quedará así:**
```env
NODE_ENV=development
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=erpadmin
DB_PASSWORD=changeme123!
DB_NAME=erp_v3
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:5173
API_BASE_URL=http://localhost:3000/api
ENCRYPTION_KEY=your-encryption-key-32-chars-min
IV=your-initialization-vector
```

### Paso 2: Levantar los contenedores

```bash
docker-compose up -d
```

**Esto inicia:**
- PostgreSQL (puerto 5432)
- Redis (puerto 6379)
- Backend Express (puerto 3000)
- Frontend Vite (puerto 5173)
- Nginx (puerto 80)

### Paso 3: Esperar a que esté listo

```bash
# Ver estado
docker-compose ps

# Esperar health checks
docker-compose logs postgres
docker-compose logs redis
docker-compose logs backend
```

### Paso 4: Verificar que funciona

**Terminal 1 - Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-14T15:30:45.123Z"
}
```

**Terminal 2 - Ver endpoints disponibles:**
```bash
curl http://localhost:3000/api
```

**Respuesta esperada:**
```json
{
  "message": "ERP V3.0 API",
  "version": "3.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "clientes": "/api/clientes",
    "productos": "/api/productos",
    "proyectos": "/api/proyectos",
    "usuarios": "/api/usuarios",
    "licencias": "/api/licencias",
    "integraciones": "/api/integraciones",
    "admin": "/api/admin"
  }
}
```

### Paso 5: Acceder a la aplicación

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:3000/api  
**Nginx Proxy:** http://localhost:80  

---

## 🗄️ VERIFICAR BASE DE DATOS

### Acceder a PostgreSQL

```bash
docker exec -it erp-postgres psql -U erpadmin -d erp_v3
```

### Ver tablas creadas

```sql
-- Listar tablas
\dt

-- Ver estructura de usuarios
\d usuarios

-- Contar registros
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM clientes;
SELECT COUNT(*) FROM productos;
SELECT COUNT(*) FROM proyectos;
SELECT COUNT(*) FROM tareas;

-- Ver índices
\di

-- Salir
\q
```

### Ver Redis

```bash
docker exec -it erp-redis redis-cli

# Ver claves almacenadas
KEYS *

# Ver info
INFO

# Salir
EXIT
```

---

## 📊 VER LOGS EN TIEMPO REAL

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# PostgreSQL logs
docker-compose logs -f postgres

# Redis logs
docker-compose logs -f redis

# Nginx logs
docker-compose logs -f nginx

# Todos
docker-compose logs -f
```

---

## 🔧 COMANDOS ÚTILES

### Verificar estado general

```bash
# Ver contenedores
docker-compose ps

# Ver uso de recursos
docker stats

# Ver volúmenes
docker volume ls

# Ver redes
docker network ls
docker network inspect erp-network
```

### Acceder a contenedores

```bash
# Backend (Node.js)
docker exec -it erp-backend sh

# Frontend (Node.js)
docker exec -it erp-frontend sh

# Nginx
docker exec -it erp-nginx sh

# PostgreSQL
docker exec -it erp-postgres sh
```

### Reiniciar servicios

```bash
# Reiniciar uno específico
docker-compose restart backend

# Reiniciar todos
docker-compose restart

# Parar todo
docker-compose stop

# Parar y eliminar
docker-compose down

# Down + eliminar volúmenes (CUIDADO: Borra BD)
docker-compose down -v
```

---

## 🧹 LIMPIAR VOLÚMENES (Reset Base de Datos)

```bash
# Parar contenedores
docker-compose down

# Eliminar volúmenes (BORRA TODO)
docker volume rm erp-v3-empresarial_postgres_data
docker volume rm erp-v3-empresarial_redis_data

# Levantar de nuevo (Se recrea la BD)
docker-compose up -d
```

---

## 🐛 PROBLEMAS COMUNES

### ❌ Error: "Cannot connect to Docker daemon"
**Solución:** Asegurar que Docker Desktop está corriendo
```bash
# Reiniciar Docker
# macOS/Windows: Reiniciar Docker Desktop
# Linux: sudo systemctl restart docker
```

### ❌ Error: "Port 3000 already in use"
**Solución:** Cambiar puerto en docker-compose.yml o matar proceso
```bash
# Ver qué está usando puerto 3000
lsof -i :3000

# Matar proceso (macOS/Linux)
kill -9 <PID>
```

### ❌ Error: "PostgreSQL connection refused"
**Solución:** Esperar a que health check pase
```bash
# Ver estado
docker-compose logs postgres

# Esperar 10-15 segundos y reintentar
docker-compose logs postgres | grep "ready to accept"
```

### ❌ Error: "Redis connection refused"
**Solución:** Verificar que Redis está levantado
```bash
docker-compose logs redis

# Reiniciar
docker-compose restart redis
```

### ❌ Error: "ECONNREFUSED 127.0.0.1:3000"
**Solución:** Backend no está listo aún
```bash
# Esperar logs
docker-compose logs backend

# Buscar error específico
docker-compose logs backend | grep error
```

---

## 📈 CHECKLIST DE VERIFICACIÓN

```
✅ docker-compose up -d (sin errores)
✅ docker-compose ps (todos "Up")
✅ curl localhost:3000/api/health (200 OK)
✅ curl localhost:3000/api (endpoints visibles)
✅ http://localhost:5173 (Frontend carga)
✅ docker exec psql... (BD accesible)
✅ docker exec redis-cli (Redis accesible)
```

Si todos pasan → **Listo para desarrollar!**

---

## 📝 NOTAS IMPORTANTES

- `.env` contiene credenciales locales (NO commitear)
- Las migraciones SQL se ejecutan automáticamente en primer `up`
- Los volúmenes persisten datos entre reinicios
- `--pull always` en `docker-compose up` fuerza actualizar imágenes
- Health checks evitan que dependencias falten en startup

---

## 🚀 PRÓXIMO PASO

Una vez verificado que todo funciona:

1. Crear ramas en Git
```bash
git checkout -b feature/backend-apis
```

2. Comenzar a crear rutas de autenticación
```
backend/src/routes/auth.routes.ts
backend/src/controllers/authController.ts
backend/src/middleware/auth.ts
```

3. Hacer commits regularmente
```bash
git add .
git commit -m "feat: add auth routes and controller"
git push origin feature/backend-apis
```

---

**¿Algún problema?** Revisar logs con `docker-compose logs <servicio>`
