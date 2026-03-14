# ERP V3.0 - Empresarial

Sistema de Planificación de Recursos Empresariales (ERP) profesional, escalable y seguro, diseñado para PYMES.

## 🎯 Características Principales

### Módulos Base
- **Autenticación** - Login con RBAC (4 roles)
- **Dashboard** - KPIs y estadísticas en tiempo real
- **Gestión de Clientes** - CRUD completo con contactos
- **Gestión de Productos** - Catálogo con SKU único y control de stock
- **Gestión de Proyectos** - Seguimiento de proyectos y ganancia
- **Kanban** - Tablero visual con drag & drop
- **Usuarios** - RBAC con 30+ permisos granulares
- **Alertas** - Sistema inteligente de alertas

### Nuevas Características V3.0 🆕
- **Gestión de Licencias** - Generar, renovar y validar licencias
- **API Gateway** - Integraciones con sistemas externos
- **Panel Super Admin** - Configuración centralizada del sistema
- **Encriptación de Datos** - AES-256 para datos sensibles
- **Sincronización Automática** - Sincronización con APIs externas (15min a 1h)
- **Formato de Hora 24h** - Configuración de zona horaria y formato de fecha

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React.js 18 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **Base de Datos** | PostgreSQL 16 |
| **Cache/Sesiones** | Redis 7 |
| **Contenedores** | Docker + Docker Compose |
| **Reverse Proxy** | Nginx |

## 📋 Requisitos

- Docker & Docker Compose (version 1.29+)
- Git
- 4GB RAM mínimo
- 20GB espacio en disco

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/erp-v3-empresarial.git
cd erp-v3-empresarial
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tu configuración
```

### 3. Iniciar los contenedores
```bash
docker-compose up -d
```

### 4. Inicializar la base de datos
```bash
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

### 5. Acceder a la aplicación
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000/api
- **Nginx:** http://localhost

## 👤 Usuarios de Prueba

```
Usuario: super@empresa.cl
Contraseña: 123456
Rol: SUPER_ADMIN (Acceso total)

Usuario: admin@empresa.cl
Contraseña: 123456
Rol: ADMIN

Usuario: operario@empresa.cl
Contraseña: 123456
Rol: OPERARIO

Usuario: viewer@empresa.cl
Contraseña: 123456
Rol: VISUALIZADOR
```

## 📚 Documentación

- [Arquitectura del Sistema](./ARCHITECTURE.md)
- [Guía de Instalación Detallada](./INSTALLATION.md)
- [API Reference](./API_DOCS.md)
- [Sistema de Licencias](./LICENSES.md)
- [Integraciones Externas](./INTEGRATIONS.md)
- [Despliegue en Windows Server](./DEPLOYMENT.md)
- [Seguridad y Encriptación](./SECURITY.md)
- [Solución de Problemas](./TROUBLESHOOTING.md)

## 🔐 Seguridad

- JWT para autenticación
- Encriptación AES-256 para datos sensibles
- RBAC con 30+ permisos granulares
- Rate limiting (100 requests/15min)
- Helmet.js para headers de seguridad
- CORS configurado

## 📦 Deployment

### Docker Compose (Desarrollo)
```bash
docker-compose up -d
```

### Docker Compose (Producción)
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Windows Server
```bash
# Ver: DEPLOYMENT.md para instrucciones completas
powershell -ExecutionPolicy Bypass -File scripts/deploy-windows.ps1
```

## 🤝 Contribuciones

Este es un proyecto propietario. Contacta al propietario para contribuciones.

## 📄 Licencia

PROPRIETARY - Todos los derechos reservados.

## 📞 Soporte

Para soporte contacta a: support@tuempresa.com

---

**Versión:** 3.0.0  
**Última actualización:** 2024  
**Estado:** Producción Beta
