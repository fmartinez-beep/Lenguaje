# Mitología Griega — Experiencia web inmersiva

**Versión 0.8**

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
- Test interactivo con 5 preguntas.
- Resultado personalizado según puntuación.
- Ranking de iniciados usando `localStorage`.
- Preparación para backend PHP/MySQL en la carpeta `api/`.
- Carruseles más accesibles: flechas focusables, dots navegables y contador.
- JavaScript reorganizado en módulos funcionales.
- Audio ambiental procedural sin depender de archivos MP3 externos.
- Partículas adaptadas a móvil y equipos menos potentes.

## Cómo probarlo sin backend

Abre `index.html` en el navegador. El Oráculo funcionará con almacenamiento local.

## Cómo activar el backend PHP/MySQL

1. Copia el proyecto en `htdocs` si usas XAMPP, o en la carpeta pública de Laragon.
2. Importa `database.sql` en phpMyAdmin.
3. Revisa los datos de conexión en `api/config.php`.
4. En `index.html`, cambia la etiqueta `<body>` por:

```html
<body data-backend="php">
```

Con eso, el JavaScript intentará guardar y leer el ranking desde:

- `api/guardar_resultado.php`
- `api/obtener_ranking.php`

Si el backend falla, la web sigue funcionando con `localStorage`.

## Archivos principales

- `index.html`: estructura semántica y contenido.
- `style.css`: estética, responsive, animaciones y sección Oráculo.
- `script.js`: interactividad, carruseles, audio, partículas y ranking.
- `database.sql`: base de datos para MySQL.
- `api/`: endpoints PHP.
