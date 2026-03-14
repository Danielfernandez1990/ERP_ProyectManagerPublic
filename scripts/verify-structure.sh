#!/bin/bash
# Script de verificación de estructura Git
# Ejecutar: bash scripts/verify-structure.sh

echo "================================"
echo "  ERP V3.0 - Verificación"
echo "================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar
verify_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (FALTA)"
        return 1
    fi
}

verify_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (FALTA)"
        return 1
    fi
}

# ===== Backend =====
echo -e "${YELLOW}Backend:${NC}"
verify_file "backend/package.json"
verify_file "backend/tsconfig.json"
verify_file "backend/Dockerfile"
verify_file "backend/src/main.ts"
verify_file "backend/src/config/env.ts"
verify_file "backend/src/config/database.ts"
verify_file "backend/src/config/redis.ts"
verify_file "backend/src/middleware/errorHandler.ts"
verify_file "backend/src/utils/encryption.ts"
verify_file "backend/src/utils/validators.ts"
verify_file "backend/src/utils/jwt.ts"
verify_file "backend/src/utils/logger.ts"
verify_file "backend/src/database/migrations/001_init.sql"
verify_file "backend/src/database/migrations/002_licenses_integrations.sql"
echo ""

# ===== Frontend =====
echo -e "${YELLOW}Frontend:${NC}"
verify_file "frontend/package.json"
verify_file "frontend/vite.config.js"
verify_file "frontend/tailwind.config.js"
verify_file "frontend/postcss.config.js"
verify_file "frontend/Dockerfile"
verify_file "frontend/src/services/api.js"
verify_file "frontend/src/store/authStore.js"
echo ""

# ===== Nginx =====
echo -e "${YELLOW}Nginx:${NC}"
verify_file "nginx/Dockerfile"
verify_file "nginx/nginx.conf"
verify_file "nginx/default.conf"
echo ""

# ===== Docker & Config =====
echo -e "${YELLOW}Docker & Config:${NC}"
verify_file "docker-compose.yml"
verify_file "docker-compose.prod.yml"
verify_file ".env.example"
verify_file ".gitignore"
echo ""

# ===== Documentación =====
echo -e "${YELLOW}Documentación:${NC}"
verify_file "docs/README.md"
verify_file "docs/ARCHITECTURE.md"
verify_file "GIT_STRUCTURE.md"
verify_file "START_HERE.md"
verify_file "SETUP_COMPLETE.md"
echo ""

# ===== Scripts =====
echo -e "${YELLOW}Scripts:${NC}"
verify_file "scripts/deploy-windows.ps1"
echo ""

# ===== Directorios =====
echo -e "${YELLOW}Directorios:${NC}"
verify_dir "backend/src"
verify_dir "backend/src/config"
verify_dir "backend/src/middleware"
verify_dir "backend/src/utils"
verify_dir "backend/src/database"
verify_dir "frontend/src"
verify_dir "nginx"
verify_dir "docs"
verify_dir "scripts"
echo ""

echo "================================"
echo "  ✅ Verificación completada"
echo "================================"
