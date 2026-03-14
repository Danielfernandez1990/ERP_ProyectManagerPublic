# 🚀 GUÍA DE EJECUCIÓN - ERP V3.0

## ¿CÓMO EJECUTAR EL PROYECTO?

Tienes **3 opciones**, elige la que prefieras:

---

## ✅ OPCIÓN 1: VER EN GITHUB (Más rápido - 1 minuto)

**No necesitas instalar nada. Solo abre tu navegador.**

1. Accede a: https://github.com/Danielfernandez1990/ERP_ProyectManagerPublic
2. Explora los archivos:
   - `backend/src/` - APIs (27 endpoints)
   - `frontend/src/` - React (7 componentes)
   - Documentación (15+ guías)

**Ventajas:**
- ✅ Ninguna instalación
- ✅ Ver código online
- ✅ Clonable en cualquier momento

---

## ✅ OPCIÓN 2: CLONAR Y VER EN VS CODE (Recomendado - 5 minutos)

### Requisito: Git instalado (lo tienes)

```powershell
# 1. Abre PowerShell

# 2. Navega a tu carpeta de proyectos
cd C:\Users\TuUsuario\Documents

# 3. Clona el repositorio
git clone https://github.com/Danielfernandez1990/ERP_ProyectManagerPublic.git
cd ERP_ProyectManagerPublic

# 4. Abre en VS Code
code .

# 5. En VS Code, abre una terminal (Ctrl + `)

# 6. Selecciona rama con APIs
git checkout develop

# 7. Explora el código:
# - Abre: backend/src/controllers/
# - Abre: frontend/src/pages/
# - Abre: cualquier .md para leer documentación
```

**Ventajas:**
- ✅ Ver código localmente
- ✅ Editable
- ✅ Git workflow completo

---

## ✅ OPCIÓN 3: EJECUTAR LOCALMENTE (20 minutos)

### Requisitos:
- ✅ Node.js (https://nodejs.org/)
- ✅ Git (ya lo tienes)
- ✅ PostgreSQL (opcional, puede usar Docker)

### Pasos:

#### PASO 1: Clonar y preparar

```powershell
git clone https://github.com/Danielfernandez1990/ERP_ProyectManagerPublic.git
cd ERP_ProyectManagerPublic
git checkout develop
cp .env.example .env
```

#### PASO 2: Backend - Terminal 1

```powershell
cd backend

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

**Verás:**
```
✓ Servidor iniciado en puerto 3000 (development)
```

#### PASO 3: Frontend - Terminal 2 (nueva)

```powershell
cd frontend

# Instalar dependencias
npm install

# Iniciar dev server
npm run dev
```

**Verás:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

#### PASO 4: Acceder

**Frontend:** http://localhost:5173
**Backend API:** http://localhost:3000/api

**Credenciales de login:**
- Email: `admin@erp.com`
- Contraseña: `Admin123!`

---

## ✅ OPCIÓN 4: CON DOCKER (25 minutos)

### Requisito: Docker Desktop instalado

```powershell
# 1. Verificar Docker
docker --version
docker-compose --version

# 2. Clonar
git clone https://github.com/Danielfernandez1990/ERP_ProyectManagerPublic.git
cd ERP_ProyectManagerPublic

# 3. Crear .env
cp .env.example .env

# 4. Levantar todo
docker-compose up -d

# 5. Esperar 30-60 segundos para que se construya

# 6. Verificar estado
docker-compose ps

# 7. Ver logs (si algo falla)
docker-compose logs -f backend
docker-compose logs -f frontend

# 8. Acceder
# Frontend: http://localhost:5173
# Backend: http://localhost:3000/api

# 9. Parar (cuando termines)
docker-compose down
```

---

## 📊 COMPARATIVA DE OPCIONES

| Opción | Tiempo | Requisitos | Dificultad | Ventaja |
|--------|--------|-----------|-----------|---------|
| 1. GitHub | 1 min | Navegador | Muy fácil | Ver código online |
| 2. VS Code | 5 min | Git + VS Code | Fácil | Explorar localmente |
| 3. Local | 20 min | Node.js + Git | Normal | Ejecutar y testear |
| 4. Docker | 25 min | Docker Desktop | Normal | Stack completo |

---

## 🎯 RECOMENDACIÓN

**Para empezar:** Opción 1 o 2 (ver el código)
**Para testear:** Opción 3 o 4 (ejecutar)

---

## 🧪 ¿QUÉ PUEDES HACER UNA VEZ EJECUTADO?

### Si eligiste Opción 3 o 4 (Ejecutar):

**1. Login**
- Accede a http://localhost:5173
- Ingresa:
  - Email: `admin@erp.com`
  - Pass: `Admin123!`

**2. Ver Dashboard**
- Estadísticas de usuarios, clientes, productos, proyectos, tareas
- Proyectos recientes
- Tareas asignadas

**3. Navegar (Sidebar)**
- Dashboard
- Clientes (próximamente)
- Productos (próximamente)
- Proyectos (próximamente)
- Tareas (próximamente)

**4. Probar APIs (con curl o Postman)**

```bash
# Health check
curl http://localhost:3000/api/health

# Obtener usuario actual (necesita token)
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/auth/me

# Ver documentación de endpoints
curl http://localhost:3000/api
```

---

## 📚 DOCUMENTACIÓN DISPONIBLE

Dentro del repositorio encontrarás:

```
START_HERE.md              ← Comienza aquí
TEST_LOCAL.md              ← Cómo probar localmente
TEST_ENDPOINTS.md          ← Ejemplos de API
SESION_1_COMPLETADA.md     ← Backend Auth
SESION_2_COMPLETADA.md     ← Backend CRUD
SESION_3_COMPLETADA.md     ← Frontend
INDEX_COMPLETO.md          ← Índice de todo
```

---

## ⚠️ PROBLEMAS COMUNES

### "Node no está instalado"
→ Descarga de https://nodejs.org/

### "Puerto 3000 ya está en uso"
→ Cambia en `backend/.env` PORT=3001
o mata el proceso: `netstat -ano | findstr :3000`

### "npm install falla"
→ Intenta: `npm install --legacy-peer-deps`

### "Docker no está instalado"
→ Descarga Docker Desktop de https://www.docker.com/products/docker-desktop

### "La BD no conecta"
→ Verifica .env tiene credenciales PostgreSQL correctas

---

## ✅ CHECKLIST FINAL

```
Si elegiste Opción 1 o 2:
✅ Código visible en GitHub o VS Code
✅ Puedes explorar estructura
✅ Lees documentación

Si elegiste Opción 3:
✅ npm install completó
✅ Backend corre en puerto 3000
✅ Frontend corre en puerto 5173
✅ Puedes acceder a http://localhost:5173
✅ Login funciona
✅ Dashboard se muestra

Si elegiste Opción 4:
✅ Docker corriendo
✅ docker-compose ps muestra 5 contenedores
✅ Puedes acceder a http://localhost:5173
✅ APIs responden en http://localhost:3000/api
```

---

## 🎓 ¿QUÉ APRENDISTE?

Con este proyecto completaste:

```
Backend:
- 27 endpoints REST API
- Autenticación JWT
- CRUD completo
- Manejo de errores
- Validaciones

Frontend:
- React + Vite
- Rutas protegidas
- State management
- Responsive design
- Tailwind CSS

DevOps:
- Docker + Docker Compose
- Git workflow
- Documentación profesional
- Testing

Total: ~4,500 líneas de código profesional
```

---

## 🚀 PRÓXIMOS PASOS

1. **Explorar el código** (Opción 1 o 2)
2. **Ejecutar localmente** (Opción 3 o 4)
3. **Modificar y experimentar**
4. **Agregar nuevas features**
5. **Desplegar en producción**

---

## 📞 NECESITAS AYUDA?

Cualquier duda, revisá:
- GitHub Issues
- Documentación (.md files)
- Comments en el código

---

**¡Listo para empezar!** 🎉

Elige una opción arriba y comienza.
