# Mitología Griega — Experiencia web inmersiva

**Versión 0.9**

Proyecto final para **Lenguaje de Marcas**. La web está planteada como un viaje narrativo por cinco zonas:

1. Hero / firmamento
2. Olimpo
3. Tierra
4. Mar
5. Inframundo
6. Oráculo de Delfos

## Qué se ha añadido

- Música ambiental con los MP3 originales del proyecto (`cabecera`, `Olimpo`, `Tierra`, `Oceano`, `Inframundo`).
- Optimización de audio: `preload="none"`, una sola pista activa, crossfade suave y pausa automática al cambiar de pestaña.
- Sección final **Oráculo de Delfos**.
- Test interactivo con 5 preguntas aleatorias por sesión a partir de un banco de 25.
- Resultado personalizado según puntuación.
- Ranking de iniciados con persistencia híbrida: PHP/MySQL cuando hay backend disponible y `localStorage` como respaldo.
- Backend PHP/MySQL en la carpeta `api/`, con guardado y lectura del ranking.
- Carruseles más accesibles: flechas focusables, dots navegables y contador.
- JavaScript reorganizado en módulos funcionales.
- Audio ambiental procedural sin depender de archivos MP3 externos.
- Partículas adaptadas a móvil y equipos menos potentes.
- Documento técnico obligatorio en `Documentacion.md`.

## Cómo probarlo sin backend

Abre `index.html` en el navegador. El Oráculo funcionará con almacenamiento local.

## Cómo activar el backend PHP/MySQL

1. Copia el proyecto en `htdocs` si usas XAMPP, o en la carpeta pública de Laragon.
2. Importa `database.sql` en phpMyAdmin.
3. Revisa los datos de conexión en `api/config.php`.
4. Sirve el proyecto desde `http://localhost/...`. El `<body data-backend="auto">` hace que JavaScript intente usar PHP/MySQL automáticamente cuando no se abre como archivo local.

El JavaScript guarda y lee el ranking desde:

- `api/guardar_resultado.php`
- `api/obtener_ranking.php`

Si el backend falla, la web sigue funcionando con `localStorage`.

## Archivos principales

- `index.html`: estructura semántica y contenido.
- `style.css`: estética, responsive, animaciones y sección Oráculo.
- `script.js`: interactividad, carruseles, audio, partículas y ranking.
- `database.sql`: base de datos para MySQL.
- `api/`: endpoints PHP.
- `Documentacion.md`: documentación técnica de entrega según la rúbrica.
