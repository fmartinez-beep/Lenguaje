# Mitologia Griega - Experiencia web inmersiva

**Version 1.0**

Proyecto final para **Lenguaje de Marcas**. La web esta planteada como un viaje narrativo por cinco zonas:

1. Hero / firmamento
2. Olimpo
3. Tierra
4. Mar
5. Inframundo
6. Oraculo de Delfos

## Que se ha anadido

- Musica ambiental con los MP3 originales del proyecto (`cabecera`, `Olimpo`, `Tierra`, `Oceano`, `Inframundo`).
- Optimizacion de audio: `preload="none"`, una sola pista activa, crossfade suave y pausa automatica al cambiar de pestana.
- Seccion final **Oraculo de Delfos**.
- Test interactivo con 5 preguntas aleatorias por sesion a partir de un banco de 25.
- Resultado personalizado segun puntuacion.
- Ranking de iniciados con persistencia hibrida: Firebase Firestore como backend principal y `localStorage` como respaldo.
- Reglas, indice y configuracion de Firebase en `firestore.rules`, `firestore.indexes.json` y `firebase.json`.
- Copia JSON local opcional mediante PHP en `api/guardar_resultado_json.php`.
- Arranque Docker con PHP, MySQL y phpMyAdmin para revisar el backend local opcional.
- Carruseles mas accesibles: flechas focusables, dots navegables y contador.
- JavaScript reorganizado en modulos funcionales.
- Audio ambiental procedural sin depender de archivos MP3 externos.
- Particulas adaptadas a movil y equipos menos potentes.
- Documento tecnico obligatorio en `Documentacion.md`.

## Como probarlo directamente

Abre `index.html` en el navegador. El Oraculo intentara guardar y leer el ranking desde Firebase Firestore. Si Firebase no esta disponible, funcionara con almacenamiento local.

## Backend principal: Firebase Firestore

El ranking se guarda en la coleccion:

```text
resultados_oraculo
```

Archivos de Firebase:

- `firestore.rules`: reglas de seguridad.
- `firestore.indexes.json`: indice para ordenar por puntuacion y fecha.
- `firebase.json`: configuracion del proyecto.
- `FIREBASE.md`: guia especifica de configuracion.

## Copia local JSON con PHP

### Opcion rapida con Docker

1. Instala Docker Desktop si tu equipo no lo tiene.
2. Desde la carpeta del proyecto ejecuta:

```bash
docker compose up --build
```

En Windows tambien puedes ejecutar:

```powershell
.\start-backend.ps1
```

3. Abre la web en `http://localhost:8080`.
4. Al completar el test, tambien se intentara escribir en `resultados_oraculo.json`.
5. Comprueba el backend PHP en `http://localhost:8080/api/health.php`.
6. Abre phpMyAdmin en `http://localhost:8081` si quieres revisar la base MySQL incluida como apoyo.

Credenciales por defecto:

- Servidor: `db`
- Usuario: `oraculo_user`
- Contrasena: `oraculo_pass`
- Base de datos: `mitologia_oraculo`

Puedes copiar `.env.example` a `.env` si quieres cambiar puertos o contrasenas.

### Opcion con XAMPP/Laragon

1. Copia el proyecto en `htdocs` si usas XAMPP, o en la carpeta publica de Laragon.
2. Sirve el proyecto desde `http://localhost/...`.
3. Al abrir desde HTTP, `api/guardar_resultado_json.php` podra escribir en `resultados_oraculo.json`.

El JavaScript guarda y lee el ranking principal desde Firebase. La copia JSON se envia a:

- `api/guardar_resultado_json.php`

Endpoint de comprobacion:

- `api/health.php`

Si el backend falla, la web sigue funcionando con `localStorage`.

## Archivos principales

- `index.html`: estructura semantica y contenido.
- `style.css`: estetica, responsive, animaciones y seccion Oraculo.
- `script.js`: interactividad, carruseles, audio, particulas, ranking y conexion con Firebase.
- `firestore.rules`, `firestore.indexes.json`, `firebase.json`: configuracion de Firebase.
- `FIREBASE.md`: instrucciones de Firebase.
- `resultados_oraculo.json`: copia local opcional de resultados.
- `database.sql`: base de datos para MySQL.
- `api/`: endpoints PHP.
- `Dockerfile` y `docker-compose.yml`: backend local reproducible.
- `start-backend.ps1`: arranque rapido del backend en Windows.
- `Documentacion.md`: documentacion tecnica de entrega segun la rubrica.
