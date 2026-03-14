# 🌐 GUÍA DE ACCESO - ERP V3.0

## 🎯 ¿DÓNDE ACCEDER?

### URLs Disponibles (Una vez iniciado con docker-compose)

```
┌─────────────────────────────────────────────────┐
│       FRONTEND (React + Vite)                   │
│       http://localhost:5173                     │
│                                                 │
│       ✓ Dashboard                               │
│       ✓ Gestión Clientes                        │
│       ✓ Gestión Productos                       │
│       ✓ Gestión Proyectos                       │
│       ✓ Panel Kanban                            │
│       ✓ Gestión Usuarios                        │
│       ✓ Centro de Alertas                       │
│       ✓ Panel Super Admin (🆕)                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│       BACKEND API (Node.js + Express)           │
│       http://localhost:3000/api                 │
│                                                 │
│       GET  /api/health          → Status OK    │
│       GET  /api                 → Info general  │
│       POST /api/auth/login      → Autenticación│
│       GET  /api/clientes        → Listar       │
│       POST /api/licencias/gen   → Generar lic. │
│       GET  /api/admin/config    → Super Admin  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│       NGINX (Reverse Proxy)                     │
│       http://localhost                          │
│                                                 │
│       Redirecciona a:                           │
│       / → Frontend (localhost:5173)             │
│       /api → Backend (localhost:3000/api)       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│       POSTGRESQL (Base de Datos)                │
│       localhost:5432                            │
│                                                 │
│       Usuario: erpadmin                         │
│       BD: erp_v3                                │
│       (Acceso solo interno docker)              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│       REDIS (Cache/Sesiones)                    │
│       localhost:6379                            │
│                                                 │
│       (Acceso solo interno docker)              │
└─────────────────────────────────────────────────┘
```

---

## 🚀 CÓMO INICIAR TODO

### Paso 1: Entrar a la carpeta del proyecto
```bash
cd erp-v3-empresarial
```

### Paso 2: Copiar configuración
```bash
copy .env.example .env
# (Esto ya está hecho, pero si lo eliminas, hazlo de nuevo)
```

### Paso 3: Iniciar Docker Compose
```bash
docker-compose up -d
```

### Paso 4: Esperar a que levante (30-60 segundos)
```bash
docker ps
# Deberías ver 5 contenedores corriendo:
# - erp-postgres (verde)
# - erp-redis (verde)
# - erp-backend (verde)
# - erp-frontend (verde)
# - erp-nginx (verde)
```

### Paso 5: Verificar salud
```bash
curl http://localhost:3000/api/health
# Respuesta:
# {"status":"ok","timestamp":"2024-01-15T10:30:45.123Z"}
```

### Paso 6: Acceder a la aplicación
```
Abre el navegador y ve a:
http://localhost:5173
```

---

## 📊 LO QUE VAS A VER

### En http://localhost:5173 (Frontend)

**Primera carga (sin login):**
- ❌ Página en blanco (porque no hay componentes implementados aún)
- ✅ Backend está corriendo correctamente

**Qué debería pasar (en próxima sesión):**
- ✅ Login page
- ✅ Dashboard con KPIs
- ✅ Módulos funcionales
- ✅ Sincronización automática

### En http://localhost:3000/api (Backend)

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

---

## 🔍 PROBAR LOS ENDPOINTS

### Desde PowerShell

```powershell
# Health check
curl http://localhost:3000/api/health

# Obtener info API
curl http://localhost:3000/api

# Login (cuando esté implementado)
$body = @{
    email = "super@empresa.cl"
    password = "123456"
} | ConvertTo-Json

curl -Method POST `
  -Uri "http://localhost:3000/api/auth/login" `
  -ContentType "application/json" `
  -Body $body
```

### Desde Postman / Insomnia

1. **Crear nuevo request**
2. **URL:** http://localhost:3000/api/health
3. **Method:** GET
4. **Send** → Deberías ver: `{"status":"ok",...}`

---

## 🐳 COMANDOS DOCKER ÚTILES

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Detener todo
docker-compose down

# Detener todo y limpiar volúmenes
docker-compose down -v

# Reconstruir las imágenes
docker-compose build --no-cache

# Ejecutar comando en un contenedor
docker-compose exec backend npm run db:migrate

# Ver estado de los contenedores
docker ps -a

# Acceder a la shell de un contenedor
docker-compose exec backend sh
docker-compose exec postgres psql -U erpadmin -d erp_v3
```

---

## 🔐 ACCESO A LA BASE DE DATOS

### Desde dentro del contenedor Docker

```bash
# Entrar al contenedor postgres
docker-compose exec postgres psql -U erpadmin -d erp_v3

# Comandos SQL
\dt              → Ver todas las tablas
\d usuarios      → Ver estructura de tabla
SELECT * FROM usuarios;
SELECT * FROM licencias;
SELECT * FROM integraciones;
\q              → Salir
```

### Desde cliente externo (pgAdmin, DBeaver, etc.)

```
Host:     localhost
Port:     5432
Usuario:  erpadmin
Password: changeme123!
BD:       erp_v3
```

---

## ⚠️ PROBLEMAS COMUNES

### ❌ "No puedo acceder a http://localhost:5173"
**Solución:**
```bash
docker ps
# Si el contenedor frontend NO aparece, ver logs:
docker-compose logs frontend
```

### ❌ "Port 5173 ya está en uso"
**Solución:**
```bash
docker-compose down
# O especificar otro puerto en docker-compose.yml
```

### ❌ "No conecta a la BD"
**Solución:**
```bash
docker-compose logs postgres
# Esperar 30 segundos a que PostgreSQL inicie completamente
docker-compose restart postgres
```

### ❌ "API devuelve error de CORS"
**Solución:**
- Los CORS ya están configurados
- Si sigue habiendo problemas, revisar `backend/src/main.ts`
- Verificar que `FRONTEND_URL` en `.env` es correcta

---

## 📈 FLUJO VISUAL

```
┌──────────────┐
│   Usuario    │
│   Navegador  │
└──────┬───────┘
       │
       │ http://localhost:5173
       ↓
┌──────────────────┐
│  Frontend React  │
│  (Vite)          │
└──────┬───────────┘
       │
       │ HTTP/JSON
       │ /api/...
       ↓
┌──────────────────────┐
│ Backend Express      │
│ (Node.js + TS)       │
│ - Auth               │
│ - CRUD               │
│ - Licencias          │
│ - Integraciones      │
└─┬────────────────────┘
  │
  ├─ PostgreSQL ──→ Datos persistentes
  │
  ├─ Redis ────────→ Sesiones + Caché
  │
  └─ APIs Externas → Sincronización
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Cuando inicies por primera vez:

- [ ] Docker Compose iniciado (`docker ps` muestra 5 contenedores)
- [ ] Backend responde (`curl http://localhost:3000/api/health`)
- [ ] Frontend carga (`http://localhost:5173` abre sin errores)
- [ ] Sin errores en logs (`docker-compose logs`)
- [ ] PostgreSQL conectada (`docker-compose logs postgres` muestra "ready to accept connections")
- [ ] Redis conectada (`docker-compose logs redis` muestra "Ready to accept connections")

---

## 🎯 PRÓXIMAS PÁGINAS A CREAR

En la próxima sesión, implementaremos:

1. **Login Page**
   - http://localhost:5173/login
   - Con usuarios demo

2. **Dashboard**
   - http://localhost:5173/dashboard
   - KPIs, estadísticas

3. **Módulos CRUD**
   - http://localhost:5173/clientes
   - http://localhost:5173/productos
   - http://localhost:5173/proyectos
   - http://localhost:5173/usuarios

4. **Panel Super Admin** (🆕)
   - http://localhost:5173/admin
   - Gestión de licencias
   - Gestión de integraciones
   - Configuración del sistema

5. **Centro de Alertas**
   - http://localhost:5173/alertas

---

## 📞 RESUMEN RÁPIDO

| Necesito... | Ir a... |
|------------|---------|
| Ver el sitio web | http://localhost:5173 |
| Probar la API | http://localhost:3000/api |
| Ver si funciona | http://localhost:3000/api/health |
| Acceder a la BD | docker-compose exec postgres psql... |
| Ver logs | docker-compose logs -f |
| Detener todo | docker-compose down |

---

**ERP V3.0 está listo para empezar.** 🚀

Próximo paso: `docker-compose up -d` y verifica en http://localhost:3000/api/health

¿Necesitas ayuda?  
Revisa: `erp-v3-empresarial/QUICK_REFERENCE.md`
