# Documentacion tecnica - Landing Page Mitologia Griega

## 1. Datos generales

**Proyecto:** Mitologia Griega - Del Olimpo al Inframundo  
**Version de entrega:** 0.9  
**Repositorio:** <https://github.com/fmartinez-beep/Lenguaje>  
**Producto evaluable:** landing page funcional con frontend, backend PHP/MySQL, documentacion tecnica y trazabilidad en Git.

La web propone una experiencia inmersiva sobre mitologia griega organizada en cinco zonas narrativas: hero inicial, Olimpo, Tierra, Mar, Inframundo y Oraculo de Delfos. La parte final incorpora un test interactivo, calculo de resultado, ranking persistente y conexion real con backend.

## 2. Requisitos de ejecucion

### Ejecucion sin backend

Para revisar solo el frontend se puede abrir `index.html` directamente en el navegador. En ese modo, el Oraculo usa `localStorage` para guardar el ranking local.

### Ejecucion con backend PHP/MySQL

1. Copiar el proyecto en la carpeta publica de XAMPP, Laragon o un servidor PHP equivalente.
2. Crear la base de datos importando `database.sql`.
3. Revisar credenciales en `api/config.php`.
4. Abrir la web desde una URL HTTP, por ejemplo:

```text
http://localhost/mitologia-griega-audio-mp3-optimizado/
```

La etiqueta `<body data-backend="auto">` permite que el JavaScript use PHP/MySQL automaticamente cuando la pagina no se abre como archivo local.

Fragmento relevante:

```html
<body data-backend="auto">
```

```js
const backendMode = document.body.dataset.backend || 'auto';
const backendEnabled = backendMode === 'php' || (backendMode === 'auto' && window.location.protocol !== 'file:');
```

## 3. Estructura del proyecto

```text
.
|-- index.html
|-- style.css
|-- script.js
|-- README.md
|-- Documentacion.md
|-- database.sql
|-- api/
|   |-- config.php
|   |-- guardar_resultado.php
|   `-- obtener_ranking.php
`-- audio/
```

### Archivos principales

`index.html` contiene la estructura semantica, navegacion, secciones de contenido, formulario del Oraculo y punto de montaje del test dinamico.

`style.css` contiene el sistema visual, responsive design, animaciones, carruseles, layout de secciones y estados de validacion.

`script.js` contiene la logica de interaccion: progreso de scroll, navegacion, audio, particulas, carruseles, test, validacion, ranking y comunicacion con backend.

`api/` contiene el backend PHP que guarda y recupera resultados desde MySQL.

## 4. Frontend: estructura HTML y calidad semantica

La landing usa una estructura clara con `nav`, `header`, `main`, `section`, `form`, `aside` y `footer`. El contenido principal esta dentro de `main`, las secciones tienen identificadores navegables y el Oraculo usa un formulario real.

Fragmentos relevantes:

```html
<nav id="main-nav" aria-label="Navegacion principal">
  <a class="nav-logo" href="#top" aria-label="Ir al inicio">ΜΥΘΟΛΟΓΙΑ</a>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links-list" aria-label="Abrir menu">
```

```html
<main id="main-content">
  <section id="olympus" class="world-section olympus-section" data-section-id="olympus">
```

```html
<form class="oracle-panel oracle-form" id="oracle-form" novalidate>
  <div class="oracle-field">
    <label for="visitor-name">Nombre del iniciado</label>
    <input id="visitor-name" name="nombre" type="text" maxlength="24" autocomplete="name" required/>
  </div>
  <div class="oracle-questions" id="oracle-questions" aria-live="polite"></div>
</form>
```

Decisiones tecnicas:

- Se incluye `skip-link` para saltar al contenido.
- La navegacion usa `aria-label`, `aria-expanded` y `aria-controls`.
- El resultado del Oraculo usa `aria-live="polite"` para anunciar cambios sin interrumpir.
- Los controles interactivos son botones reales y enlaces reales.

## 5. Sistema visual y tipografias

La rubrica exige al menos tres tipografias usadas con coherencia. El proyecto usa tres familias de Google Fonts:

- `Cinzel Decorative`: titulos principales y elementos epicos.
- `Cinzel`: subtitulos, botones, badges y elementos de interfaz.
- `Crimson Pro`: texto narrativo y cuerpo general.

Fragmento de carga:

```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
```

Fragmento de definicion:

```css
:root {
  --font-display: 'Cinzel Decorative', serif;
  --font-heading: 'Cinzel', serif;
  --font-body: 'Crimson Pro', serif;
}
```

Aplicacion:

```css
body {
  font-family: var(--font-body);
}

.hero-title {
  font-family: var(--font-display);
}

.section-badge,
.oracle-submit {
  font-family: var(--font-heading);
}
```

## 6. Responsive design

La web esta preparada para escritorio, tablet vertical, tablet horizontal, movil vertical y movil horizontal mediante rejillas fluidas, `clamp()`, breakpoints y ajustes especificos para componentes complejos como carruseles y Oraculo.

Fragmentos relevantes:

```css
@media (max-width: 1100px) {
  .oracle-layout {
    grid-template-columns: 1fr 1fr;
  }

  .oracle-result {
    grid-column: 1 / -1;
  }
}
```

```css
@media (max-width: 768px) {
  .oracle-layout {
    grid-template-columns: 1fr;
  }

  .nav-links {
    position: fixed;
  }
}
```

```css
@media (max-width: 480px) {
  .section-title {
    font-size: clamp(1.8rem, 6vw, 3rem);
  }
}
```

Tambien se reduce carga visual en pantallas compactas desde JavaScript:

```js
const CONFIG = {
  compactScreen: window.innerWidth < 900,
  finePointer: window.matchMedia('(pointer: fine)').matches,
};
```

## 7. Animaciones de frontend

La landing incorpora varias animaciones integradas en la experiencia:

- Estrellas generadas por JavaScript en el hero.
- Particulas en mar, inframundo y Oraculo.
- Transiciones entre mundos.
- Aparicion progresiva de tarjetas.
- Movimiento de carruseles.
- Barra de progreso de scroll.

Fragmento de estrellas:

```js
function createStars() {
  const container = document.getElementById('stars-container');
  if (!container) return;

  for (let i = 0; i < total; i += 1) {
    const star = document.createElement('span');
    star.className = 'star';
    container.appendChild(star);
  }
}
```

Fragmento CSS de animacion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

Este ultimo bloque evita mareos o sobrecarga visual en usuarios con reduccion de movimiento activada.

## 8. Funcionalidades implementadas

### 8.1 Navegacion fija, menu movil y progreso de scroll

La navegacion cambia segun el scroll, permite saltar a cada zona y se adapta a movil mediante un boton hamburguesa.

Metodos principales:

- `initProgressBar()`
- `initNav()`
- `initScrollScene()`

Fragmento relevante:

```js
function initProgressBar() {
  const bar = document.getElementById('progress-bar');

  return {
    update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    },
  };
}
```

Utilidad: mejora la orientacion del usuario dentro de una landing larga y mantiene una navegacion clara entre secciones.

### 8.2 Carruseles accesibles por seccion

Cada mundo usa un carrusel de tarjetas con flechas, puntos de navegacion y contador. El componente detecta sus paginas y actualiza el estado visual y accesible.

Metodo principal:

- `initSliders()`

Fragmento relevante:

```js
function initSliders() {
  document.querySelectorAll('[data-slider]').forEach(slider => {
    const track = slider.querySelector('.cards-track');
    const pages = Array.from(slider.querySelectorAll('.cards-page'));
    const dots = Array.from(slider.querySelectorAll('.slider-dot'));
```

Fragmento de actualizacion:

```js
const update = nextIndex => {
  index = clamp(nextIndex, 0, pages.length - 1);
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
};
```

Utilidad: permite organizar mucho contenido mitologico sin saturar la pantalla.

### 8.3 Audio ambiental optimizado

La web incorpora musica ambiental con activacion manual para respetar politicas de autoplay. Solo hay una pista activa y se aplican volumenes por zona.

Metodo principal:

- `initAmbientSound()`

Fragmento relevante:

```js
const zoneVolumes = {
  hero: 0.18,
  olympus: 0.26,
  earth: 0.24,
  sea: 0.28,
  underworld: 0.25,
  oracle: 0.22,
};
```

Fragmento de control:

```js
button.addEventListener('click', async () => {
  started = !started;
  button.setAttribute('aria-pressed', String(started));
  if (started) await setZoneSound(state.activeZone || 'hero');
});
```

Utilidad: refuerza la inmersion sin bloquear la carga inicial ni reproducir sonido sin permiso.

### 8.4 Particulas y ambientacion visual procedimental

El proyecto genera particulas decorativas en varias zonas sin depender de imagenes pesadas. Esto reduce dependencias y permite adaptar la cantidad segun pantalla o rendimiento.

Metodos principales:

- `regenerateParticles()`
- `createParticle()`
- `createStars()`

Fragmento relevante:

```js
function regenerateParticles() {
  const count = CONFIG.compactScreen || CONFIG.lowPower ? 18 : 42;
  for (let i = 0; i < count; i += 1) {
    createParticle(sea, 'sea-particle', { minSize: 3, maxSize: 10 });
  }
}
```

Utilidad: aporta animacion de frontend evaluable y coherente con cada mundo.

### 8.5 Test del Oraculo con banco de preguntas aleatorio

El Oraculo no usa preguntas fijas en HTML. JavaScript selecciona 5 preguntas por sesion desde un banco de 25, guarda esa seleccion en `sessionStorage` y tambien baraja las respuestas.

Variables y metodos principales:

- `questionPool`
- `getSessionQuestions()`
- `renderQuestions()`
- `shuffle()`

Fragmento de configuracion:

```js
const SESSION_QUESTIONS_KEY = 'mitologia-oraculo-preguntas-sesion';
const QUESTIONS_PER_SESSION = 5;
const questionPool = [
  {
    id: 'mares-poseidon',
    question: '¿Quien gobierna los mares?',
    answers: [
      { text: 'Zeus', correct: false },
      { text: 'Poseidon', correct: true },
      { text: 'Hades', correct: false },
    ],
  },
];
```

Fragmento de seleccion:

```js
const getSessionQuestions = () => {
  const selected = shuffle(questionPool).slice(0, QUESTIONS_PER_SESSION);
  sessionStorage.setItem(SESSION_QUESTIONS_KEY, JSON.stringify(selected.map(question => question.id)));
  return selected;
};
```

Fragmento de renderizado:

```js
const renderQuestions = questions => {
  questionsContainer.innerHTML = '';
  questions.forEach((question, questionIndex) => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'oracle-question';
    const legend = document.createElement('legend');
    legend.textContent = `${questionIndex + 1}. ${question.question}`;
    fieldset.appendChild(legend);
  });
};
```

Utilidad: el test rota entre sesiones sin ser infinito y mantiene una evaluacion controlada sobre 5 puntos.

### 8.6 Validacion, puntuacion y resultado personalizado

El formulario valida nombre, mundo favorito y todas las respuestas. Despues calcula puntuacion y genera un titulo mitico.

Metodos principales:

- `validate()`
- `getTitleByScore()`
- `getMessage()`

Fragmento relevante:

```js
const validate = () => {
  let valid = true;
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

  if (!nameField.value.trim()) {
    nameField.closest('.oracle-field')?.classList.add('is-invalid');
    valid = false;
  }
};
```

Fragmento de puntuacion:

```js
const score = selectedQuestions.reduce((sum, _, index) => {
  return sum + Number(formData.get(`q${index + 1}`) || 0);
}, 0);
```

Utilidad: convierte la landing en una experiencia interactiva real, con feedback inmediato y estados de error visibles.

### 8.7 Ranking persistente en frontend

Aunque el backend falle o la web se abra como archivo local, los resultados se guardan en `localStorage`. Esto permite revisar la funcionalidad sin servidor.

Metodos principales:

- `getLocalRanking()`
- `setLocalRanking()`
- `renderRanking()`
- `saveEntry()`

Fragmento relevante:

```js
const getLocalRanking = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const setLocalRanking = entries => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 12)));
};
```

Fragmento de ordenacion:

```js
const sortRanking = entries => entries
  .sort((a, b) => b.puntuacion - a.puntuacion || new Date(b.fecha) - new Date(a.fecha))
  .slice(0, 8);
```

Utilidad: garantiza que el proyecto sea ejecutable y revisable incluso sin configurar MySQL.

### 8.8 Backend PHP/MySQL integrado

El backend permite guardar y recuperar el ranking desde una base de datos MySQL. Esta funcionalidad cumple el requisito de backend funcional y relaciona el formulario del frontend con logica de servidor.

Archivos:

- `api/config.php`
- `api/guardar_resultado.php`
- `api/obtener_ranking.php`
- `database.sql`

Conexion:

```php
function getConnection(): PDO {
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS, $DB_CHARSET;

    $dsn = "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=$DB_CHARSET";
    return new PDO($dsn, $DB_USER, $DB_PASS, $options);
}
```

Guardado:

```php
$stmt = $pdo->prepare(
    'INSERT INTO resultados_oraculo (nombre, puntuacion, total, titulo, mundo)
     VALUES (:nombre, :puntuacion, :total, :titulo, :mundo)'
);
```

Lectura:

```php
$stmt = $pdo->query(
    'SELECT nombre, puntuacion, total, titulo, mundo, fecha
     FROM resultados_oraculo
     ORDER BY puntuacion DESC, fecha DESC
     LIMIT 8'
);
```

El backend tambien contempla una base de datos creada con una version anterior sin la columna `total`: si MySQL devuelve el error de columna inexistente, se usa una consulta compatible con `5 AS total` o un `INSERT` sin esa columna. Asi se evita que una instalacion previa deje la entrega sin ejecutar.

Tabla:

```sql
CREATE TABLE IF NOT EXISTS resultados_oraculo (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(24) NOT NULL,
  puntuacion TINYINT UNSIGNED NOT NULL,
  total TINYINT UNSIGNED NOT NULL DEFAULT 5,
  titulo VARCHAR(60) NOT NULL,
  mundo VARCHAR(30) NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ranking (puntuacion DESC, fecha DESC)
);
```

Integracion desde JavaScript:

```js
const response = await fetch(endpoints.save, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify(entry),
});
```

Utilidad: el ranking no depende solo del navegador cuando se ejecuta en servidor PHP; queda guardado en base de datos.

### 8.9 Estado de backend y fallback visible

La pagina muestra si el ranking se esta leyendo desde PHP/MySQL o desde almacenamiento local. Esto facilita la revision tecnica.

Fragmento HTML:

```html
<p class="backend-status" id="backend-status">Comprobando persistencia del Oraculo...</p>
```

Fragmento JS:

```js
const setBackendStatus = (message, mode = 'local') => {
  backendStatus.textContent = message;
  backendStatus.className = `backend-status backend-status-${mode}`;
};
```

Fragmento CSS:

```css
.backend-status-remote {
  border-color: rgba(89, 210, 139, 0.44);
  color: #c9ffd9;
  background: rgba(89, 210, 139, 0.12);
}
```

Utilidad: evita ambiguedad en la evaluacion y demuestra si la persistencia real esta activa.

## 9. Validacion y seguridad basica

El frontend valida campos obligatorios y el backend vuelve a validar los datos recibidos. No se confia solo en JavaScript.

Fragmento PHP:

```php
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'JSON invalido']);
    exit;
}

$nombreLength = function_exists('mb_strlen') ? mb_strlen($nombre, 'UTF-8') : strlen($nombre);

if (
    $nombre === '' ||
    $nombreLength > 24 ||
    $puntuacion < 0 ||
    $total < 1 ||
    $total > 30 ||
    $puntuacion > $total ||
    $titulo === '' ||
    $mundo === ''
) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Datos invalidos']);
    exit;
}
```

Ademas, al pintar el ranking se escapan los datos para evitar inyeccion HTML en la interfaz:

```js
const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}[char]));
```

## 10. Accesibilidad y usabilidad

Medidas aplicadas:

- `lang="es"` en el documento.
- Navegacion con `aria-label`.
- Boton de menu con `aria-expanded`.
- Boton de musica con `aria-pressed`.
- `aria-live` en resultados y preguntas del Oraculo.
- Estados visuales de error en formulario.
- Soporte para `prefers-reduced-motion`.
- Controles reales (`button`, `input`, `select`) en vez de elementos genericos.

Fragmento:

```html
<aside class="oracle-panel oracle-result" aria-live="polite">
  <h3 id="oracle-result-title">El Oraculo espera</h3>
</aside>
```

## 11. Pruebas realizadas

Pruebas de frontend:

- Renderizado del HTML en Chrome headless.
- Comprobacion de que el Oraculo genera 5 preguntas dinamicas.
- Revision de diferencias con `git diff --check`.
- Revision de estado de repositorio con `git status`.

Pruebas pendientes segun entorno:

- La sintaxis PHP debe revisarse con `php -l` en un equipo con PHP instalado.
- La persistencia MySQL debe probarse importando `database.sql` en XAMPP/Laragon y abriendo la web por HTTP.

Comando recomendado para backend:

```bash
php -l api/config.php
php -l api/guardar_resultado.php
php -l api/obtener_ranking.php
```

## 12. Correspondencia con la rubrica

| Requisito | Cumplimiento |
| --- | --- |
| Frontend funcional | `index.html`, `style.css`, `script.js` |
| Backend funcional | `api/guardar_resultado.php`, `api/obtener_ranking.php`, `database.sql` |
| Animacion frontend | Estrellas, particulas, transiciones, carruseles y progreso |
| Tres tipografias | `Cinzel Decorative`, `Cinzel`, `Crimson Pro` |
| Responsive | Breakpoints en `style.css` y ajustes por JS |
| Cinco funcionalidades | Se documentan nueve funcionalidades evaluables |
| Documentacion tecnica | Este archivo `Documentacion.md` |
| Repositorio revisable | Proyecto completo y preparado para commit `v 0.9` |

## 13. Conclusiones

La version 0.9 refuerza los puntos criticos de evaluacion: documentacion obligatoria, backend PHP/MySQL real, fallback local para que el proyecto siempre sea revisable, test dinamico con banco de preguntas, responsive design, animaciones y trazabilidad mediante Git.
