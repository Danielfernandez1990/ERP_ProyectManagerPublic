# ERP V3.0 EMPRESARIAL - ESTRUCTURA GIT

Este documento describe la estructura completa del repositorio Git para el ERP V3.0.

## 📁 Estructura de Carpetas

```
erp-v3-empresarial/
│
├── .git/                              # Repositorio Git
├── .gitignore                         # Archivos a ignorar
├── .env.example                       # Variables de entorno (template)
├── .env                               # Variables de entorno (local, NO commitear)
│
├── backend/                           # 🔧 API Node.js + Express
│   ├── src/
│   │   ├── main.ts                   # Entry point
│   │   ├── config/
│   │   │   ├── env.ts                # Configuración de variables
│   │   │   ├── database.ts           # Conexión PostgreSQL
│   │   │   └── redis.ts              # Conexión Redis
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts       # Manejo de errores
│   │   │   └── logger.ts             # Logging de requests
│   │   ├── routes/                   # 🆕 Rutas de API (a implementar)
│   │   ├── controllers/              # 🆕 Controladores (a implementar)
│   │   ├── services/                 # 🆕 Servicios (a implementar)
│   │   ├── models/                   # 🆕 Modelos de datos (a implementar)
│   │   ├── utils/
│   │   │   ├── encryption.ts         # AES-256 encryption
│   │   │   ├── validators.ts         # Validación con Joi
│   │   │   ├── jwt.ts                # Manejo de JWT
│   │   │   └── logger.ts             # Winston logger
│   │   └── database/
│   │       └── migrations/
│   │           ├── 001_init.sql      # Tablas principales
│   │           └── 002_licenses_integrations.sql
│   ├── Dockerfile                    # Multistage para backend
│   ├── .dockerignore
│   ├── package.json                  # Dependencias Node.js
│   ├── tsconfig.json                 # Configuración TypeScript
│   └── .env.example
│
├── frontend/                          # ⚛️ React + Vite
│   ├── src/
│   │   ├── main.jsx                  # Entry point React
│   │   ├── App.jsx                   # Componente raíz
│   │   ├── pages/                    # 🆕 Páginas (a implementar)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Clientes.jsx
│   │   │   ├── Productos.jsx
│   │   │   ├── SuperAdmin.jsx        # 🆕 Panel Super Admin
│   │   │   └── ...
│   │   ├── components/               # 🆕 Componentes (a implementar)
│   │   ├── hooks/                    # 🆕 Custom hooks (a implementar)
│   │   ├── services/
│   │   │   └── api.js                # Cliente HTTP centralizado
│   │   ├── store/
│   │   │   └── authStore.js          # State management (Zustand)
│   │   ├── styles/
│   │   │   └── index.css             # Tailwind imports
│   │   └── utils/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js                # Configuración Vite
│   ├── tailwind.config.js            # Tailwind CSS
│   ├── postcss.config.js
│   ├── Dockerfile                    # Multistage para frontend
│   ├── package.json
│   └── .env.example
│
├── nginx/                             # 🌐 Reverse Proxy
│   ├── Dockerfile
│   ├── nginx.conf                    # Configuración nginx
│   └── default.conf                  # Configuración virtual host
│
├── docker-compose.yml                # Orquestación desarrollo
├── docker-compose.prod.yml           # Orquestación producción
│
├── docs/                              # 📚 Documentación
│   ├── README.md                     # Descripción general
│   ├── ARCHITECTURE.md               # Arquitectura del sistema
│   ├── INSTALLATION.md               # Guía de instalación
│   ├── API_DOCS.md                   # Documentación de API
│   ├── LICENSES.md                   # Sistema de licencias
│   ├── INTEGRATIONS.md               # APIs externas
│   ├── DEPLOYMENT.md                 # Despliegue Windows Server
│   ├── SECURITY.md                   # Seguridad y encriptación
│   └── TROUBLESHOOTING.md            # Solución de problemas
│
├── scripts/                           # 🔧 Scripts de utilidad
│   ├── deploy-windows.ps1            # Deploy en Windows Server
│   ├── init-db.sh                    # Inicializar BD
│   ├── backup.sh                     # Backup automático
│   └── healthcheck.sh                # Verificar salud
│
├── data/                              # 💾 Datos persistentes (NO commitear)
│   ├── postgres/                     # BD PostgreSQL
│   ├── redis/                        # Cache Redis
│   ├── backups/                      # Backups de BD
│   ├── logs/                         # Logs de aplicación
│   └── uploads/                      # Archivos subidos
│
└── .gitattributes
```

## 🔄 Workflow de Git

### 1. Inicializar el repositorio
```bash
cd erp-v3-empresarial
git init
git add .
git commit -m "Initial commit: ERP V3.0 structure" -m "" -m "Assisted-By: cagent"
```

### 2. Crear ramas de trabajo
```bash
# Rama principal
git branch -M main

# Ramas de desarrollo
git checkout -b develop
git checkout -b feature/super-admin
git checkout -b feature/licencias
git checkout -b feature/integraciones
```

### 3. Workflow sugerido
```
main (producción)
  ↑
release/v3.0.1
  ↑
develop (integración)
  ↑
feature/licencias, feature/integraciones, etc.
```

## 📋 Archivos Principales

### Backend
| Archivo | Descripción |
|---------|-------------|
| `src/main.ts` | Punto de entrada de la API |
| `src/config/env.ts` | Configuración centralizada |
| `src/middleware/` | CORS, auth, logging, error handling |
| `src/database/migrations/` | Migraciones SQL |

### Frontend
| Archivo | Descripción |
|---------|-------------|
| `src/main.jsx` | Punto de entrada React |
| `src/App.jsx` | Componente raíz |
| `src/services/api.js` | Cliente HTTP centralizado |
| `src/store/authStore.js` | Estado global (Zustand) |

### Docker
| Archivo | Descripción |
|---------|-------------|
| `docker-compose.yml` | Orquestación (desarrollo) |
| `docker-compose.prod.yml` | Overrides producción |
| `backend/Dockerfile` | Multi-stage backend |
| `frontend/Dockerfile` | Multi-stage frontend |
| `nginx/Dockerfile` | Reverse proxy |

## 🚀 Primeros Pasos

### 1. Clonar y configurar
```bash
git clone <url>
cd erp-v3-empresarial
cp .env.example .env
# Editar .env con tu configuración
```

### 2. Iniciar desarrollo
```bash
# Opción A: Con Docker Compose
docker-compose up -d

# Opción B: Local (requiere Node.js + PostgreSQL + Redis)
cd backend && npm install && npm run dev &
cd frontend && npm install && npm run dev
```

### 3. Acceder a la aplicación
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000/api
- **Health:** http://localhost:3000/api/health

## 🔐 Seguridad en Git

### NO commitear:
```
.env (contiene contraseñas)
node_modules/
dist/
.vscode/settings.json
data/ (bases de datos locales)
logs/
*.key
*.pem
.DS_Store
```

### YA está en .gitignore ✓

## 📦 Dependencias Principales

### Backend
- `express` - Framework web
- `pg` - Driver PostgreSQL
- `redis` - Cliente Redis
- `jsonwebtoken` - JWT
- `bcryptjs` - Hashing de contraseñas
- `joi` - Validación
- `helmet` - Headers de seguridad

### Frontend
- `react` - Librería UI
- `vite` - Build tool
- `react-router-dom` - Enrutamiento
- `zustand` - State management
- `recharts` - Gráficas
- `tailwindcss` - Estilos

## 🔗 Commits importantes

```
Inicial: Initial commit: ERP V3.0 structure
Backend: Implement Auth API endpoints
Backend: Add License management system
Backend: Add Integration gateway
Frontend: Build Dashboard component
Frontend: Build SuperAdmin panel
Docker: Configure multi-container setup
Docs: Complete API documentation
Release: Version 3.0.0 release
```

## 🔍 Comandos Git útiles

```bash
# Ver estado
git status

# Ver cambios
git diff

# Crear rama
git checkout -b feature/nueva-feature

# Commitear
git add .
git commit -m "Descripción" -m "" -m "Assisted-By: cagent"

# Push
git push origin feature/nueva-feature

# Mergear a develop
git checkout develop
git merge feature/nueva-feature

# Ver log
git log --oneline --graph --all
```

## 📞 Contacto

**Propietario:** [Tu Empresa]
**Email:** support@tuempresa.com

---

**Estructura completada:** 2024
**Estado:** Listo para desarrollo
