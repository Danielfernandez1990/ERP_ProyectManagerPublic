# Arquitectura del Sistema - ERP V3.0

## 🏗️ Diagrama General

```
┌─────────────────────────────────────────────────────────┐
│                   Windows Server                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Docker Network Bridge                 │  │
│  │  (erp-network)                                   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │                                                  │  │
│  │  ┌───────────────┐  ┌───────────────┐          │  │
│  │  │ Nginx         │  │ Frontend      │          │  │
│  │  │ :80, :443     │  │ React :5173   │          │  │
│  │  └───────────────┘  └───────────────┘          │  │
│  │         ↓                                        │  │
│  │  ┌─────────────────────────────────┐            │  │
│  │  │      Backend Node.js            │            │  │
│  │  │      Express :3000              │            │  │
│  │  │                                 │            │  │
│  │  │  ├── Auth API                   │            │  │
│  │  │  ├── CRUD Módulos               │            │  │
│  │  │  ├── Licencias API              │            │  │
│  │  │  ├── Integraciones API          │            │  │
│  │  │  ├── Admin API                  │            │  │
│  │  │  └── Alertas API                │            │  │
│  │  └─────────────────────────────────┘            │  │
│  │         ↓                ↓                       │  │
│  │  ┌────────────────┐  ┌──────────────┐          │  │
│  │  │  PostgreSQL    │  │    Redis     │          │  │
│  │  │  :5432         │  │    :6379     │          │  │
│  │  │                │  │              │          │  │
│  │  │ - Datos        │  │ - Sesiones   │          │  │
│  │  │ - Licencias    │  │ - Caché      │          │  │
│  │  │ - Integraciones│  │ - Queue      │          │  │
│  │  └────────────────┘  └──────────────┘          │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Volúmenes Persistentes                  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ ├─ postgres_data/        (BD Principal)         │  │
│  │ ├─ redis_data/           (Cache)                │  │
│  │ ├─ /data/backups/        (Backups)              │  │
│  │ ├─ /data/logs/           (Logs)                 │  │
│  │ └─ /data/uploads/        (Archivos)             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📊 Estructura de Capas

### Capa de Presentación (Frontend)
- **Tecnología:** React.js 18 + Vite + TypeScript
- **Features:**
  - Interfaz responsive (desktop, tablet, mobile)
  - Componentes reutilizables
  - State management con Zustand
  - Rutas con React Router v6
  - Gráficas con Recharts
  - Drag & Drop nativo

### Capa de API (Backend)
- **Tecnología:** Node.js + Express + TypeScript
- **Estructura:**
  ```
  backend/
  ├── routes/        # Definición de endpoints
  ├── controllers/   # Lógica de negocio
  ├── services/      # Servicios reutilizables
  ├── models/        # Modelos de datos
  ├── middleware/    # Auth, logging, error handling
  ├── utils/         # Funciones auxiliares
  └── database/      # Migrations y seeds
  ```

### Capa de Datos (Persistencia)
- **BD Primaria:** PostgreSQL (datos estructurados)
- **Cache:** Redis (sesiones, caché, pub/sub)
- **Backups:** Sistema automático de backups diarios

## 🔑 Módulos Principales

### 1. Autenticación
```
POST   /api/auth/login        - Login
POST   /api/auth/logout       - Logout
POST   /api/auth/refresh      - Refresh token
PUT    /api/auth/password     - Cambiar contraseña
GET    /api/auth/me           - Usuario actual
```

### 2. Gestión de Clientes
```
GET    /api/clientes          - Listar todos
GET    /api/clientes/:id      - Obtener uno
POST   /api/clientes          - Crear
PUT    /api/clientes/:id      - Actualizar
DELETE /api/clientes/:id      - Eliminar
```

### 3. Gestión de Productos
```
GET    /api/productos         - Listar todos
POST   /api/productos         - Crear (auto-SKU)
PUT    /api/productos/:id     - Actualizar
DELETE /api/productos/:id     - Eliminar
GET    /api/productos/stock-bajo - Alertas de stock
```

### 4. Gestión de Licencias (🆕)
```
GET    /api/licencias         - Listar todas
POST   /api/licencias/generate - Generar licencia
PUT    /api/licencias/:id/renew - Renovar
DELETE /api/licencias/:id     - Revocar
POST   /api/licencias/validate - Validar clave
```

### 5. Gestión de Integraciones (🆕)
```
GET    /api/integraciones     - Listar todas
POST   /api/integraciones     - Crear conexión
PUT    /api/integraciones/:id - Editar
DELETE /api/integraciones/:id - Eliminar
POST   /api/integraciones/:id/test - Probar conexión
POST   /api/integraciones/:id/sync - Sincronizar ahora
GET    /api/integraciones/:id/logs - Ver logs
```

### 6. Panel Super Admin (🆕)
```
GET    /api/admin/config      - Obtener config
PUT    /api/admin/config      - Actualizar config
GET    /api/admin/dashboard   - KPIs del sistema
POST   /api/admin/backup      - Backup manual
GET    /api/admin/system-health - Salud del sistema
```

## 🔐 Seguridad

### Autenticación
- **JWT (JSON Web Tokens)**
  - Tokens de corta duración (7 días)
  - Refresh tokens en Redis
  - Expiración automática

### Autorización (RBAC)
- **4 Roles Predefinidos**
  - SUPER_ADMIN: Acceso total + gestión del sistema
  - ADMIN: Gestión de datos (sin eliminar)
  - OPERARIO: Operaciones limitadas
  - VISUALIZADOR: Solo lectura

### Encriptación
- **Datos Sensibles:** AES-256-CBC
  - API Keys de integraciones
  - Contraseñas
  - Tokens
- **En Tránsito:** HTTPS (TLS 1.2+)
- **En Reposo:** PostgreSQL + cifrado de columnas

### Middleware de Seguridad
- **Helmet.js:** Headers de seguridad HTTP
- **CORS:** Origen verificado
- **Rate Limiting:** 100 req/15min por IP
- **Validación:** Joi schemas en todos los endpoints

## 💾 Base de Datos

### Tablas Principales
```
usuarios
├── id (UUID)
├── email (UNIQUE)
├── password_hash (bcrypt)
├── rol (RBAC)
├── activo (BOOLEAN)
└── timestamps

clientes
├── id (UUID)
├── nombre
├── email, telefono
├── dirección, ciudad
├── ruc (UNIQUE)
└── timestamps

productos
├── id (UUID)
├── sku (UNIQUE, auto-generado)
├── nombre, categoría
├── precio, stock
├── stock_minimo (para alertas)
└── timestamps

proyectos
├── id (UUID)
├── código (auto-generado)
├── cliente_id (FK)
├── estado (PENDIENTE/PROGRESO/COMPLETADO)
├── fecha_inicio, fecha_fin
├── ganancia, nivel_riesgo
└── timestamps

tareas
├── id (UUID)
├── proyecto_id (FK)
├── estado (PENDIENTE/PROGRESO/COMPLETADO)
├── prioridad
├── asignado_a (FK usuarios)
└── timestamps

licencias (🆕)
├── id (UUID)
├── código (UNIQUE)
├── tipo (USERS/MODULES/ENTERPRISE)
├── cantidad_usuarios
├── modulos_incluidos (ARRAY)
├── fecha_inicio, fecha_vencimiento
├── estado, clave_validacion
└── timestamps

integraciones (🆕)
├── id (UUID)
├── nombre, tipo
├── base_url, api_key_encriptada
├── endpoints (JSONB)
├── frecuencia_sync, último_sync
├── estado
└── timestamps
```

## 🔄 Flujos Principales

### Flujo de Autenticación
```
1. Usuario ingresa credenciales
   ↓
2. Backend valida contra BD
   ↓
3. Si OK: genera JWT token
   ↓
4. Token guardado en localStorage + Redis
   ↓
5. Requests posteriores incluyen token en header
   ↓
6. Middleware verifica y valida JWT
```

### Flujo de Licencias
```
1. Super Admin genera licencia
   ↓
2. Sistema crea clave única encriptada
   ↓
3. Licencia guardada en BD
   ↓
4. En login: valida licencia activa
   ↓
5. Si próxima vencer: genera alerta
   ↓
6. Si vencida: bloquea acceso
```

### Flujo de Sincronización
```
Cada X minutos (configurable):
1. Obtener integraciones activas
   ↓
2. Por cada integración:
   - Conectar a API externa
   - Obtener datos (clientes/productos/stock)
   - Validar y transformar
   - Guardar en BD local
   - Registrar log de sync
   ↓
3. Generar alertas si hay cambios críticos
   ↓
4. Guardar estado y timestamp último sync
```

## 📈 Escalabilidad

### Capacidad Actual
- **Usuarios:** Hasta 1,000
- **Clientes:** Hasta 10,000
- **Productos:** Hasta 50,000
- **Transacciones/segundo:** 100+

### Cómo Escalar
1. **Base de Datos:** PostgreSQL replicación + read replicas
2. **Cache:** Redis cluster
3. **Backend:** Múltiples instancias + load balancer
4. **Contenedores:** Kubernetes o Docker Swarm

## 🛡️ Alta Disponibilidad

### Estrategia de Backup
- Backups automáticos diarios
- Replicación a almacenamiento externo
- Retención: 30 días

### Monitoreo
- Health checks cada 30s
- Logging centralizado
- Alertas de CPU/Memory

### Recuperación
- RTO (Recovery Time Objective): 15 minutos
- RPO (Recovery Point Objective): 1 hora

---

**Última actualización:** 2024
