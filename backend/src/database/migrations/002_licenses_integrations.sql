-- Tabla de Licencias
CREATE TABLE IF NOT EXISTS licencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  tipo_licencia VARCHAR(50) NOT NULL CHECK (tipo_licencia IN ('USERS', 'MODULES', 'ENTERPRISE')),
  cantidad_usuarios INTEGER NOT NULL DEFAULT 1,
  modulos_incluidos TEXT[] DEFAULT ARRAY[]::TEXT[],
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado VARCHAR(50) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'PROXIMA_VENCER', 'VENCIDA', 'SUSPENDIDA')),
  clave_validacion VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Integraciones
CREATE TABLE IF NOT EXISTS integraciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('WEBHOOK', 'REST', 'SOAP', 'CUSTOM')),
  base_url VARCHAR(500) NOT NULL,
  api_key_encriptada VARCHAR(500),
  endpoints JSONB DEFAULT '{}'::jsonb,
  frecuencia_sync INTEGER DEFAULT 300,
  ultimo_sync TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'ERROR', 'INACTIVA')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Logs de Sincronización
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integracion_id UUID REFERENCES integraciones(id) ON DELETE CASCADE,
  estado VARCHAR(50) NOT NULL,
  mensaje TEXT,
  registros_procesados INTEGER DEFAULT 0,
  errores TEXT,
  duracion_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Alertas
CREATE TABLE IF NOT EXISTS alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(100) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  prioridad VARCHAR(50) DEFAULT 'MEDIA' CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA', 'CRITICA')),
  estado VARCHAR(50) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'RESUELTA', 'IGNORADA')),
  referencia_id UUID,
  referencia_tipo VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_licencias_estado ON licencias(estado);
CREATE INDEX IF NOT EXISTS idx_licencias_vencimiento ON licencias(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_integraciones_estado ON integraciones(estado);
CREATE INDEX IF NOT EXISTS idx_sync_logs_integracion ON sync_logs(integracion_id);
CREATE INDEX IF NOT EXISTS idx_alertas_estado ON alertas(estado);
CREATE INDEX IF NOT EXISTS idx_alertas_tipo ON alertas(tipo);
