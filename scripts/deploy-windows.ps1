# PowerShell Script para Deploy en Windows Server

param(
    [string]$Action = "start",
    [string]$Environment = "production"
)

$ErrorActionPreference = "Stop"

function Write-Status {
    param([string]$Message, [string]$Status = "INFO")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] [$Status] $Message"
}

function Check-Prerequisites {
    Write-Status "Verificando requisitos previos..." "CHECK"
    
    # Verificar Docker
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Status "Docker no está instalado o no está en PATH" "ERROR"
        exit 1
    }
    Write-Status "✓ Docker encontrado"
    
    # Verificar Docker Compose
    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Status "Docker Compose no está instalado" "ERROR"
        exit 1
    }
    Write-Status "✓ Docker Compose encontrado"
    
    # Verificar Git
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Status "Git no está instalado" "ERROR"
        exit 1
    }
    Write-Status "✓ Git encontrado"
}

function Setup-Environment {
    Write-Status "Configurando variables de entorno..." "SETUP"
    
    if (-not (Test-Path ".env")) {
        Write-Status "Archivo .env no encontrado. Creando desde .env.example..."
        Copy-Item ".env.example" ".env"
        Write-Status "⚠ Por favor edita .env con tu configuración"
    }
}

function Start-Services {
    Write-Status "Iniciando servicios..." "START"
    
    if ($Environment -eq "production") {
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    } else {
        docker-compose up -d
    }
    
    Write-Status "Esperando a que los servicios estén listos..." "WAIT"
    Start-Sleep -Seconds 5
    
    # Verificar salud
    Check-Health
}

function Stop-Services {
    Write-Status "Deteniendo servicios..." "STOP"
    docker-compose down
    Write-Status "✓ Servicios detenidos"
}

function Restart-Services {
    Write-Status "Reiniciando servicios..." "RESTART"
    docker-compose restart
    Check-Health
}

function Check-Health {
    Write-Status "Verificando salud del sistema..." "HEALTH"
    
    $backend = docker ps --filter "name=erp-backend" --format "{{.Status}}"
    $database = docker ps --filter "name=erp-postgres" --format "{{.Status}}"
    $redis = docker ps --filter "name=erp-redis" --format "{{.Status}}"
    $frontend = docker ps --filter "name=erp-frontend" --format "{{.Status}}"
    
    if ($backend -like "*Up*") { Write-Status "✓ Backend: OK" } else { Write-Status "✗ Backend: OFFLINE" "WARN" }
    if ($database -like "*Up*") { Write-Status "✓ Database: OK" } else { Write-Status "✗ Database: OFFLINE" "WARN" }
    if ($redis -like "*Up*") { Write-Status "✓ Redis: OK" } else { Write-Status "✗ Redis: OFFLINE" "WARN" }
    if ($frontend -like "*Up*") { Write-Status "✓ Frontend: OK" } else { Write-Status "✗ Frontend: OFFLINE" "WARN" }
}

function View-Logs {
    param([string]$Service = "all")
    
    if ($Service -eq "all") {
        docker-compose logs -f
    } else {
        docker-compose logs -f $Service
    }
}

function Create-Backup {
    Write-Status "Creando backup de la base de datos..." "BACKUP"
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = "./data/backups"
    
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    
    docker-compose exec -T postgres pg_dump -U $env:DB_USER $env:DB_NAME > "$backupDir/backup_$timestamp.sql"
    Write-Status "✓ Backup creado: backup_$timestamp.sql"
}

# Main
try {
    Check-Prerequisites
    Setup-Environment
    
    switch ($Action) {
        "start" { Start-Services }
        "stop" { Stop-Services }
        "restart" { Restart-Services }
        "status" { Check-Health }
        "logs" { View-Logs }
        "backup" { Create-Backup }
        default {
            Write-Host @"
Uso: .\deploy-windows.ps1 -Action <action> -Environment <env>

Acciones disponibles:
  start      - Iniciar servicios
  stop       - Detener servicios
  restart    - Reiniciar servicios
  status     - Ver estado
  logs       - Ver logs en tiempo real
  backup     - Crear backup de BD

Ejemplos:
  .\deploy-windows.ps1 -Action start -Environment production
  .\deploy-windows.ps1 -Action logs
  .\deploy-windows.ps1 -Action backup
"@
        }
    }
} catch {
    Write-Status $_.Exception.Message "ERROR"
    exit 1
}
