$port = 5173
$path = "C:\Users\arlek\erp-produccion\frontend"

# Crear servidor HTTP simple
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "✅ ERP V3.0 Demo ejecutándose en http://localhost:$port" -ForegroundColor Green
Write-Host "   Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

try {
    while ($true) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Obtener ruta solicitada
        $requestPath = $request.Url.LocalPath
        if ($requestPath -eq "/") {
            $requestPath = "/demo.html"
        }
        
        # Archivo a servir
        $filePath = Join-Path $path $requestPath
        
        # Servir archivo
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            
            # Determinar content type
            $contentType = "text/plain"
            if ($filePath -like "*.html") { $contentType = "text/html" }
            elseif ($filePath -like "*.js") { $contentType = "application/javascript" }
            elseif ($filePath -like "*.css") { $contentType = "text/css" }
            elseif ($filePath -like "*.json") { $contentType = "application/json" }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            # Archivo no encontrado - servir demo.html
            $content = [System.IO.File]::ReadAllBytes((Join-Path $path "demo.html"))
            $response.ContentType = "text/html"
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        
        $response.OutputStream.Close()
    }
}
finally {
    $listener.Stop()
    Write-Host "❌ Servidor detenido"
}
