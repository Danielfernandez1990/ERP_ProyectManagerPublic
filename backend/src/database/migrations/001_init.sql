-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL CHECK (rol IN ('SUPER_ADMIN', 'ADMIN', 'OPERARIO', 'VISUALIZADOR')),
  departamento VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  ultimo_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  ruc VARCHAR(20) UNIQUE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  precio DECIMAL(12, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  stock_minimo INTEGER DEFAULT 10,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Proyectos
CREATE TABLE IF NOT EXISTS proyectos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  cliente_id UUID REFERENCES clientes(id),
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PROGRESO', 'COMPLETADO', 'CANCELADO')),
  fecha_inicio DATE,
  fecha_fin_estimada DATE,
  fecha_fin_real DATE,
  ganancia DECIMAL(12, 2),
  nivel_riesgo VARCHAR(50) DEFAULT 'BAJO' CHECK (nivel_riesgo IN ('BAJO', 'MEDIO', 'ALTO')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tareas (Kanban)
CREATE TABLE IF NOT EXISTS tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  proyecto_id UUID REFERENCES proyectos(id),
  estado VARCHAR(50) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PROGRESO', 'COMPLETADO')),
  prioridad VARCHAR(50) DEFAULT 'MEDIA' CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA')),
  asignado_a UUID REFERENCES usuarios(id),
  fecha_vencimiento DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_proyectos_cliente ON proyectos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_tareas_proyecto ON tareas(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_tareas_asignado ON tareas(asignado_a);
