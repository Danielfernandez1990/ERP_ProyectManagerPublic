# 🧪 GUÍA DE PRUEBA - ENDPOINTS AUTH & USUARIOS

## ✅ Backend APIs Implementadas (Sesión 1)

```
✅ POST /api/auth/login         - Autenticar usuario
✅ POST /api/auth/logout        - Cerrar sesión
✅ POST /api/auth/refresh       - Refrescar token JWT
✅ POST /api/auth/register      - Registrar nuevo usuario (Solo Super Admin)
✅ GET  /api/auth/me            - Obtener usuario autenticado

✅ GET  /api/usuarios           - Listar usuarios (paginado)
✅ GET  /api/usuarios/:id       - Obtener usuario específico
✅ POST /api/usuarios           - Crear usuario (Solo Super Admin)
✅ PUT  /api/usuarios/:id       - Actualizar usuario (Solo Super Admin)
✅ DELETE /api/usuarios/:id     - Eliminar usuario (Solo Super Admin)
✅ PUT  /api/usuarios/:id/password - Cambiar contraseña
```

---

## 🚀 CÓMO PROBAR

### Opción 1: Con cURL (Terminal)

#### 1. LOGIN
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@erp.com",
    "password": "Admin123!"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "email": "admin@erp.com",
    "nombre": "Admin",
    "rol": "SUPER_ADMIN"
  }
}
```

**Guardar el token:** Copiar el valor de `token` para los siguientes requests.

#### 2. OBTENER USUARIO ACTUAL
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. LISTAR USUARIOS
```bash
curl -X GET "http://localhost:3000/api/usuarios?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. CREAR USUARIO
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@erp.com",
    "password": "JuanPassword123!",
    "rol": "ADMIN",
    "departamento": "Ventas"
  }'
```

#### 5. OBTENER USUARIO
```bash
curl -X GET http://localhost:3000/api/usuarios/uuid-del-usuario \
  -H "Authorization: Bearer $TOKEN"
```

#### 6. ACTUALIZAR USUARIO
```bash
curl -X PUT http://localhost:3000/api/usuarios/uuid-del-usuario \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez Silva",
    "departamento": "Marketing"
  }'
```

#### 7. CAMBIAR CONTRASEÑA
```bash
curl -X PUT http://localhost:3000/api/usuarios/uuid-del-usuario/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "NewPassword123!"
  }'
```

#### 8. ELIMINAR USUARIO
```bash
curl -X DELETE http://localhost:3000/api/usuarios/uuid-del-usuario \
  -H "Authorization: Bearer $TOKEN"
```

#### 9. LOGOUT
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

#### 10. REFRESCAR TOKEN
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer $TOKEN"
```

---

### Opción 2: Con Postman

#### Importar colección

1. Abre Postman
2. Click en "Import"
3. Selecciona "Paste Raw Text"
4. Copia este JSON:

```json
{
  "info": {
    "name": "ERP V3.0 - Auth & Usuarios",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"admin@erp.com\", \"password\": \"Admin123!\"}"
        },
        "url": {"raw": "http://localhost:3000/api/auth/login", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["api", "auth", "login"]}
      }
    },
    {
      "name": "Get Me",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": {"raw": "http://localhost:3000/api/auth/me", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["api", "auth", "me"]}
      }
    },
    {
      "name": "List Usuarios",
      "request": {
        "method": "GET",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
        "url": {"raw": "http://localhost:3000/api/usuarios?page=1&limit=10", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["api", "usuarios"], "query": [{"key": "page", "value": "1"}, {"key": "limit", "value": "10"}]}
      }
    },
    {
      "name": "Create Usuario",
      "request": {
        "method": "POST",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}, {"key": "Content-Type", "value": "application/json"}],
        "body": {"mode": "raw", "raw": "{\"nombre\": \"Juan\", \"email\": \"juan@erp.com\", \"password\": \"Juan123!\", \"rol\": \"ADMIN\", \"departamento\": \"Ventas\"}"},
        "url": {"raw": "http://localhost:3000/api/usuarios", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["api", "usuarios"]}
      }
    }
  ]
}
```

5. Click en "Import"
6. La colección aparecerá en el sidebar

#### Usar variables de Postman

En Postman, configura una variable global `token`:

1. Settings (⚙️) → Variables
2. Agregar variable: `token` = `<valor-del-token>`
3. En los requests usar `{{token}}` en el header Authorization

---

## 📊 RESPUESTAS ESPERADAS

### Login Exitoso (200)
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@erp.com",
    "nombre": "Admin",
    "rol": "SUPER_ADMIN"
  }
}
```

### Login Fallido (401)
```json
{
  "error": "Credenciales inválidas",
  "message": "Email o contraseña incorrectos"
}
```

### Token Inválido (401)
```json
{
  "error": "Token inválido o expirado",
  "message": "Por favor inicia sesión nuevamente"
}
```

### Permiso Denegado (403)
```json
{
  "error": "Permiso denegado",
  "message": "Solo Super Admins pueden acceder"
}
```

### Usuario No Encontrado (404)
```json
{
  "error": "Usuario no encontrado"
}
```

### Email Duplicado (409)
```json
{
  "error": "Email ya registrado"
}
```

---

## 🔑 DATOS DE PRUEBA

### Usuario inicial (crear en BD)
```sql
-- Ejecutar en PostgreSQL
INSERT INTO usuarios (nombre, email, password_hash, rol, departamento, activo, created_at, updated_at)
VALUES (
  'Admin',
  'admin@erp.com',
  '$2a$10$xyz...', -- hash de "Admin123!" con bcrypt
  'SUPER_ADMIN',
  'Administración',
  true,
  NOW(),
  NOW()
);
```

**Para generar el hash de contraseña:**
```bash
# En Node.js
node -e "console.log(require('bcryptjs').hashSync('Admin123!', 10))"
```

---

## ✅ CHECKLIST DE PRUEBA

```
Antes de empezar:
✅ Docker está corriendo
✅ Backend está levantado (docker-compose up -d)
✅ curl http://localhost:3000/api/health → 200 OK
✅ Base de datos tiene usuario inicial

Pruebas de Auth:
✅ POST /api/auth/login → 200 con token
✅ GET /api/auth/me con token → 200 con datos usuario
✅ POST /api/auth/refresh → 200 con nuevo token
✅ POST /api/auth/logout → 200
✅ Login con email incorrecto → 401
✅ Request sin token → 401

Pruebas de Usuarios:
✅ GET /api/usuarios → 200 con lista
✅ POST /api/usuarios (sin SUPER_ADMIN) → 403
✅ POST /api/usuarios (con SUPER_ADMIN) → 201
✅ GET /api/usuarios/:id → 200
✅ PUT /api/usuarios/:id → 200
✅ DELETE /api/usuarios/:id → 200
✅ PUT /api/usuarios/:id/password → 200

Paginación:
✅ GET /api/usuarios?page=1&limit=5 → Correcta
✅ GET /api/usuarios?page=2&limit=5 → Segunda página

Validaciones:
✅ Email inválido → 400
✅ Contraseña débil → 400
✅ Campos faltantes → 400
```

---

## 🐛 TROUBLESHOOTING

### "Connection refused"
```
→ Backend no está corriendo
→ docker-compose up -d backend
```

### "token is invalid"
```
→ Token expirado
→ Hacer login de nuevo
```

### "User not found"
```
→ ID de usuario es incorrecto
→ Verificar UUID en listado
```

### "Email already registered"
```
→ Email ya existe
→ Usar otro email o actualizar contraseña del existente
```

---

## 📈 PRÓXIMO PASO

Una vez verificados todos estos endpoints:

1. Crear APIs de Clientes (similar a Usuarios)
2. Crear APIs de Productos
3. Crear APIs de Proyectos
4. Crear APIs de Tareas (Kanban)

---

## 📝 NOTAS

- Todos los endpoints requieren `Authorization: Bearer <token>` excepto `/api/auth/login`
- Las contraseñas se hashean con bcrypt (salt: 10)
- Los tokens JWT expiran en 7 días (configurable en .env)
- El soft delete marca usuarios como inactivos en lugar de eliminarlos
- Paginación por defecto: página 1, límite 10 registros

---

Generated: 2026-03-14
Status: Listo para probar
