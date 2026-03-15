# 🎬 TUTORIAL VISUAL: CÓMO PROBAR ERP V3.01

## 📥 DESCARGA EL ARCHIVO

### **Paso 1: Ir a GitHub**
```
https://github.com/Danielfernandez1990/ERP_ProyectManagerPublic
```

### **Paso 2: Descargar archivo**
- Navega a: `frontend/app-v4-completa.html`
- Click derecho → "Descargar"
- O clona todo el repo con Git

### **Paso 3: Abre en navegador**
- Navega a la carpeta donde descargaste el archivo
- Doble-click en `app-v4-completa.html`
- Se abre en tu navegador predeterminado ✨

---

## 🔐 LOGIN

```
📧 Email:    admin@erp.com
🔑 Contraseña: Admin123!
```

Presiona: **Iniciar Sesión**

---

## 🎯 PRUEBA 1: DASHBOARD

**Esperado:**
- Ver 5 tarjetas: Usuarios (4), Clientes (3), Productos (5), Proyectos (3), Tareas (5)
- Tarjeta verde: "Ingresos Totales (Proyectos): $16,000"
- Sección "Últimos Clientes" con 3 clientes
- Botón "Ver detalles →" en cada cliente

**Acción:**
- Click en "Ver detalles →" para Tech Solutions SA
- Verás un modal con toda la información del cliente

---

## 🎯 PRUEBA 2: USUARIOS CON JERARQUÍA

**Ubicación:** Menú lateral → 👥 Usuarios

**Esperado:**
```
Tabla con 4 columnas:
- Nombre: Admin, Juan Pérez, María García, Carlos López
- Email: admin@erp.com, juan@erp.com, maria@erp.com, carlos@erp.com
- Rol: SUPER_ADMIN, ADMIN, GERENTE, USUARIO
- Jerarquía: ✨ Nivel 0, Nivel 1, Nivel 2, Nivel 3 ← NUEVA COLUMNA
- Estado: Activo (verde)
```

**Validación:**
- ✅ Verás "Nivel 0", "Nivel 1", "Nivel 2", "Nivel 3"
- ✅ Esto es la jerarquía de usuarios

---

## 🎯 PRUEBA 3: CLIENTES CON CONTACTO

**Ubicación:** Menú lateral → 🏢 Clientes

**Esperado:**
- Ver 3 tarjetas de clientes
- Cada tarjeta muestra:
  - Nombre (ej: Tech Solutions SA)
  - RUC (ej: 20123456789)
  - Email (ej: info@techsol.com)
  - Teléfono (ej: 987654321)
  - Contacto (ej: Juan Martínez)

**Acción:**
- Click en cualquier tarjeta
- Se abre modal con **toda la información**:
  - Nombre
  - RUC
  - Email
  - Teléfono
  - **Contacto Principal** ← INCLUIDO
  - **Dirección** ← INCLUIDO
- Click en × para cerrar

---

## 🎯 PRUEBA 4: PRODUCTOS CON DETALLES

**Ubicación:** Menú lateral → 📦 Productos

**Esperado:**
```
Tabla con productos:
- Laptop Dell | DL-001 | Electrónica | $1200 | 15 unidades
- Mouse Logitech | LOG-002 | Accesorios | $35 | 50 unidades (verde)
- Teclado Mecánico | KEY-003 | Accesorios | $120 | 25 unidades (verde)
- Monitor LG 27" | MON-004 | Pantallas | $450 | 10 unidades (amarillo)
- Webcam HD | WEB-005 | Accesorios | $85 | 30 unidades (verde)
```

**Acción:**
- Click en cualquier fila (ej: Laptop Dell)
- Se abre modal con detalles:
  - Nombre: Laptop Dell
  - SKU: DL-001
  - Categoría: Electrónica
  - Precio: $1200
  - Stock: 15 unidades

---

## 🎯 PRUEBA 5: PROYECTOS CON INGRESOS

**Ubicación:** Menú lateral → 💼 Proyectos

**Esperado:**
- Ver 3 tarjetas con:
  - Nombre del proyecto
  - Cliente asociado
  - Estado (Completado/En Progreso/Pendiente)
  - Riesgo (Bajo/Medio/Alto con colores)
  - Ingresos en USD

**Acción:**
- Click en cualquier tarjeta (ej: Migración Sistema Legacy)
- Se abre modal con:
  - Nombre: Migración Sistema Legacy
  - Cliente: Tech Solutions SA
  - Estado: En Progreso
  - Fecha Inicio: 2025-01-15
  - Fecha Fin: 2025-03-15
  - Riesgo: Medio
  - Ingresos: $5000

---

## 🎯 PRUEBA 6: KANBAN CON DRAG & DROP ✨

**Ubicación:** Menú lateral → ✓ Kanban

**Estructura esperada:**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 📋 Por Hacer    │  │ 🔄 En Progreso  │  │ ✅ Completado   │
│ (2 tareas)      │  │ (2 tareas)      │  │ (1 tarea)       │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ Diseñar BD      │  │ Implementar API │  │ Maquetación UI  │
│ Testing QA      │  │ Integración pag │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Acción 1: Arrastra una tarjeta**
1. Haz click y mantén en "Diseñar BD"
2. Arrastra a la columna "En Progreso"
3. Suelta el botón del ratón
4. **La tarjeta se mueve automáticamente** ✨
5. El estado se actualiza (PENDIENTE → PROGRESO)

**Acción 2: Ver detalles de tarea**
1. Click en cualquier tarjeta (ej: "Implementar API")
2. Se abre modal con:
   - Título: Implementar API REST
   - Proyecto: Migración Sistema Legacy
   - Estado: PROGRESO
   - Asignado: María García
   - Prioridad: Alta (Rojo)
   - Fecha Vencimiento: 2025-03-01

---

## 🎯 PRUEBA 7: SEGMENTOS (NUEVA FUNCIONALIDAD)

**Ubicación:** Menú lateral → 🎯 Segmentos

**Esperado:**
- Ver 3 tarjetas de segmentos:

```
┌─────────────────────────────┐
│ 🎯 Segmento Premium         │
│ Clientes de alto valor      │
│ Criterios: Compras > $5000  │
│ Estado: ✅ Activo           │
│ [Editar]                    │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 🎯 Segmento Regular         │
│ Clientes frecuentes         │
│ Criterios: Compras $1-$5k   │
│ Estado: ✅ Activo           │
│ [Editar]                    │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 🎯 Segmento Nuevos          │
│ Clientes nuevos             │
│ Criterios: Clientes < 3m    │
│ Estado: ✅ Activo           │
│ [Editar]                    │
└─────────────────────────────┘
```

**Validación:**
- ✅ Ves 3 segmentos diferentes
- ✅ Cada uno con descripción y criterios
- ✅ Botón Editar en cada tarjeta

---

## 🎯 PRUEBA 8: CONFIGURACIÓN SMTP

**Ubicación:** Menú lateral → ⚙️ Configuración

**Esperado:**
```
Formulario SMTP:

Servidor SMTP: [smtp.gmail.com          ]
Puerto:        [587                     ]

Usuario/Email: [alerta@erp.com         ]
Contraseña:    [••••••••               ]

Email de Origen: [alerta@erp.com        ]

☑ Habilitar alertas por correo

[💾 Guardar Configuración] [🧪 Enviar Email de Prueba]

ℹ️ Información:
Las alertas se enviarán automáticamente cuando:
✓ Una tarea cambie de estado
✓ Se cree un nuevo proyecto
✓ Venza una tarea (24h antes)
✓ Un cliente genere una solicitud
```

**Acción:**
1. Observa los campos pre-rellenados
2. Click en checkbox para habilitar/deshabilitar
3. Click en "Guardar Configuración"
4. Verás mensaje de confirmación
5. (Botón "Enviar Email de Prueba" disponible para siguiente fase)

---

## ✅ LISTA DE VALIDACIÓN COMPLETA

- [ ] **Login funciona** → Ingresa credenciales
- [ ] **Dashboard muestra 5 estadísticas**
- [ ] **Usuarios tiene 4 usuarios con jerarquía** (Nivel 0-3)
- [ ] **Clientes muestra 3 con contacto** → Click abre modal
- [ ] **Productos tabla con 5 productos** → Click abre modal
- [ ] **Proyectos muestra 3 con ingresos** → Click abre modal
- [ ] **Kanban tiene 3 columnas con 5 tareas**
- [ ] **Drag-drop funciona en Kanban** → Arrastra y suelta
- [ ] **Click en tarea abre modal** → Detalle completo
- [ ] **Segmentos muestra 3 segmentos** → Nueva funcionalidad ✨
- [ ] **Configuración tiene formulario SMTP** → Nueva funcionalidad ✨
- [ ] **Formulario SMTP pre-lleno** → Editable
- [ ] **Logout funciona** → Click en usuario arriba → Cerrar sesión

---

## 🐛 TROUBLESHOOTING

### **El HTML no abre en navegador**
**Solución:**
- Asegúrate de descargar el archivo completo (59 KB)
- Abre con Chrome, Firefox o Edge
- Si no abre automático: Click derecho → Abrir con → Selecciona navegador

### **El Kanban no se deja arrastrar**
**Solución:**
- Usa Chrome o Firefox (mejor soporte)
- Recarga la página (F5)
- Intenta con otra tarea

### **Los modales no abren**
**Solución:**
- Click bien centrado en la tarjeta/fila
- Si no abre: Recarga la página
- Cierra con × o haz click afuera

### **No veo las nuevas funcionalidades (Segmentos, SMTP)**
**Solución:**
- Asegúrate de usar `app-v4-completa.html` (no demo.html)
- Actualiza la descarga (es el archivo del último commit)

---

## 📞 RESULTADO ESPERADO

Después de completar todas las pruebas:

```
✅ CRUD Segmentos funcional
✅ Kanban con drag-drop
✅ 4 modales de detalle diferentes
✅ Jerarquía de usuarios visible
✅ SMTP configuración lista
✅ 8 páginas navegables
✅ 100% Funcionalidad completada
```

---

## 🎉 CONCLUSIÓN

Si lograste completar todas las pruebas, entonces:

**✨ ERP V3.01 ESTÁ COMPLETAMENTE FUNCIONAL ✨**

Todos los 8 problemas han sido resueltos y el sistema está listo para:
1. Pruebas de usuario
2. Integración con backend
3. Feedback y mejoras

---

**¡Disfruta tu ERP V3.01! 🚀**

Última actualización: 14-03-2026
Versión: 4.0.0
Estado: ✅ LISTO PARA PRUEBAS

