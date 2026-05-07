# Instrucciones para revisar el proyecto

Este archivo esta pensado solo como guia rapida de consulta. La documentacion completa de entrega esta centralizada en `Documentacion.md`.

## Archivos principales

Despues de descargar el proyecto desde GitHub, hay que descomprimir el ZIP y abrir la carpeta completa en Visual Studio Code:

```text
File > Open Folder...
```

o en castellano:

```text
Archivo > Abrir carpeta...
```

Al abrir la carpeta, los archivos de la web aparecen en la raiz del proyecto, dentro del explorador lateral de Visual Studio Code:

```text
index.html
style.css
script.js
README.md
Documentacion.md
CHANGELOG.md
database.sql
firestore.rules
firestore.indexes.json
firebase.json
FIREBASE.md
resultados_oraculo.json
```

Para ver el codigo, basta con hacer clic en `index.html`, `style.css` o `script.js` dentro de Visual Studio Code.

Para ver la web, basta con hacer doble clic en `index.html` desde el explorador de archivos del sistema. El ranking intenta usar Firebase Firestore y, si no hay conexion, conserva una copia en `localStorage`.

El backend principal esta en Firebase Firestore:

```text
Coleccion: resultados_oraculo
Reglas:    firestore.rules
Indice:    firestore.indexes.json
Config:    firebase.json
```

El backend PHP opcional para copia local JSON esta en:

```text
api/guardar_resultado_json.php
api/health.php
```

El arranque reproducible con Docker esta en:

```text
Dockerfile
docker-compose.yml
.env.example
start-backend.ps1
```

## Ejecucion opcional con servidor PHP

Requisito:

- Docker Desktop instalado.

Desde la carpeta del proyecto:

```bash
docker compose up --build
```

En Windows tambien se puede ejecutar:

```powershell
.\start-backend.ps1
```

URLs:

```text
Web:        http://localhost:8080
Backend PHP: http://localhost:8080/api/health.php
phpMyAdmin: http://localhost:8081
```

Respuesta esperada del backend:

```json
{"ok":true,"service":"oraculo-backend","database":"connected"}
```

## phpMyAdmin opcional

Credenciales:

```text
Servidor:       db
Usuario:        oraculo_user
Contrasena:     oraculo_pass
Base de datos:  mitologia_oraculo
```

Tabla principal:

```text
resultados_oraculo
```

## Ejecucion sin backend

Tambien se puede abrir `index.html` directamente en el navegador. En ese caso, el Oraculo usa Firebase Firestore como backend principal y `localStorage` como respaldo. La copia en `resultados_oraculo.json` solo funciona si se abre desde un servidor PHP.

## Ejecucion alternativa con XAMPP/Laragon

1. Copiar el proyecto en `htdocs` o carpeta publica equivalente.
2. Abrir la web desde HTTP:

```text
http://localhost/mitologia-griega-audio-mp3-optimizado/
```

Desde HTTP, `api/guardar_resultado_json.php` puede escribir la copia local en `resultados_oraculo.json`.

## Parar Docker

```bash
docker compose down
```

Para borrar tambien los datos de MySQL:

```bash
docker compose down -v
```
