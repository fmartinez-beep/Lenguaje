# Documentacion tecnica - Landing Page Mitologia Griega

## 1. Datos generales

**Proyecto:** Mitologia Griega - Del Olimpo al Inframundo  
**Version de entrega:** 1.0  
**Repositorio:** <https://github.com/fmartinez-beep/Lenguaje>  


La web propone una experiencia inmersiva sobre mitologia griega organizada en cinco zonas narrativas: hero inicial, Olimpo, Tierra, Mar, Inframundo y Oraculo de Delfos. La parte final incorpora un test interactivo, calculo de resultado, ranking persistente y conexion real con Firebase Firestore como backend principal.

## 2. Requisitos de ejecucion

### Como abrir el proyecto descargado en Visual Studio Code

El profesor descargara el proyecto completo desde GitHub. Para revisar el codigo en Visual Studio Code:

1. Entrar al repositorio de GitHub.
2. Pulsar `Code`.
3. Pulsar `Download ZIP`.
4. Descomprimir el ZIP.
5. Abrir Visual Studio Code.
6. Ir a `File > Open Folder...` o `Archivo > Abrir carpeta...`.
7. Seleccionar la carpeta descomprimida del proyecto.

Al abrir la carpeta en Visual Studio Code, los archivos principales apareceran en el explorador lateral, en la raiz del proyecto:

```text
mitologia-griega-audio-mp3-optimizado/
|-- index.html
|-- style.css
`-- script.js
```

Para ver el codigo, debe hacer clic en `index.html`, `style.css` o `script.js` dentro del explorador de Visual Studio Code.

Para ver la web, puede hacer doble clic en `index.html` desde el explorador de archivos del sistema. En ese modo el ranking intenta sincronizarse con Firebase Firestore y conserva una copia local en `localStorage`.

### Requisitos generales

- Git o descarga ZIP desde GitHub.
- Navegador moderno.
- Conexion a internet para cargar Firebase y guardar el ranking en Firestore.
- Docker Desktop solo si se quiere probar la copia JSON local mediante PHP.

No es necesario instalar PHP ni MySQL para probar la funcionalidad principal, porque el backend principal es Firebase Firestore.

### Ejecucion directa

Para revisar la web se puede abrir `index.html` directamente en el navegador. En ese modo, el Oraculo carga Firebase desde CDN, guarda resultados en Firestore y mantiene `localStorage` como copia de respaldo.

### Ejecucion opcional con servidor local PHP

El proyecto tambien incluye un endpoint PHP para guardar una copia local en `resultados_oraculo.json`. Para que esa copia JSON se escriba en el archivo del proyecto, la pagina debe abrirse desde un servidor PHP. Opcion con Docker:

```bash
docker compose up --build
```

En Windows tambien se puede ejecutar:

```powershell
.\start-backend.ps1
```

La web queda disponible en:

```text
http://localhost:8080
```

El endpoint PHP de comprobacion queda disponible en:

```text
http://localhost:8080/api/health.php
```

Respuesta esperada:

```json
{"ok":true,"service":"oraculo-backend","database":"connected"}
```

phpMyAdmin queda disponible en caso de querer revisar la base MySQL incluida como apoyo local:

```text
http://localhost:8081
```

Credenciales de phpMyAdmin:

- Servidor: `db`
- Usuario: `oraculo_user`
- Contrasena: `oraculo_pass`
- Base de datos: `mitologia_oraculo`

Puertos usados por defecto:

- Web PHP/Apache: `8080`
- phpMyAdmin: `8081`
- MySQL expuesto al equipo anfitrion: `3307`

Si algun puerto esta ocupado, copiar `.env.example` como `.env`, cambiar `WEB_PORT`, `PHPMYADMIN_PORT` o `MYSQL_PORT`, y volver a ejecutar `docker compose up --build`.

Para parar los contenedores:

```bash
docker compose down
```

Para borrar tambien los datos de MySQL local y empezar desde cero:

```bash
docker compose down -v
```

Opcion con XAMPP/Laragon para la copia JSON/PHP:

1. Copiar el proyecto en la carpeta publica de XAMPP, Laragon o un servidor PHP equivalente.
2. Abrir la web desde una URL HTTP, por ejemplo:

```text
http://localhost/mitologia-griega-audio-mp3-optimizado/
```

Al abrir desde HTTP, el navegador puede llamar a `api/guardar_resultado_json.php` y ese endpoint puede escribir en `resultados_oraculo.json`. Si se abre como `file://`, el navegador no puede modificar archivos locales por seguridad.

## 3. Estructura del proyecto

```text
.
|-- index.html
|-- style.css
|-- script.js
|-- README.md
|-- Documentacion.md
|-- FIREBASE.md
|-- database.sql
|-- firebase.json
|-- firestore.rules
|-- firestore.indexes.json
|-- resultados_oraculo.json
|-- Dockerfile
|-- docker-compose.yml
|-- start-backend.ps1
|-- .env.example
|-- api/
|   |-- config.php
|   |-- health.php
|   |-- guardar_resultado.php
|   |-- guardar_resultado_json.php
|   `-- obtener_ranking.php
`-- audio/
```

### Archivos principales

`index.html` contiene la estructura semantica, navegacion, secciones de contenido, formulario del Oraculo y punto de montaje del test dinamico.

`style.css` contiene el sistema visual, responsive design, animaciones, carruseles, layout de secciones y estados de validacion.

`script.js` contiene la logica de interaccion: progreso de scroll, navegacion, audio, particulas, carruseles, test, validacion, ranking y comunicacion con Firebase Firestore.

`firestore.rules`, `firestore.indexes.json` y `firebase.json` contienen la configuracion del backend principal en Firebase.

`api/guardar_resultado_json.php` contiene el endpoint PHP opcional que permite guardar una copia local en `resultados_oraculo.json` cuando la web se ejecuta desde un servidor PHP.

`api/guardar_resultado.php`, `api/obtener_ranking.php`, `api/config.php`, `database.sql` y Docker mantienen una alternativa PHP/MySQL local y sirven como apoyo para revisar backend tradicional si se desea.

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

Aunque Firebase falle o la web se abra como archivo local, los resultados se guardan en `localStorage`. Esto permite revisar la funcionalidad sin servidor.

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

Utilidad: garantiza que el proyecto sea ejecutable y revisable incluso si Firestore no responde en ese momento.

### 8.8 Guardado de datos en Firebase Firestore

Para que el resultado del test quede guardado en una base de datos externa, se conecto la pagina con Firebase Firestore desde `script.js`. La web usa la configuracion de la aplicacion web creada en Firebase y carga los modulos oficiales mediante imports dinamicos desde CDN, sin necesidad de instalar paquetes con npm.

Archivos relacionados:

- `script.js`
- `firestore.rules`
- `firestore.indexes.json`
- `firebase.json`

La coleccion usada en Firestore se llama:

```text
resultados_oraculo
```

Cada documento guardado representa un resultado del Oraculo y contiene:

```json
{
  "nombre": "Ariadna",
  "puntuacion": 5,
  "total": 5,
  "titulo": "Elegido del Olimpo",
  "mundo": "Olimpo",
  "fecha": "serverTimestamp()"
}
```

En `script.js` se definio la coleccion y la configuracion del proyecto Firebase:

```js
const FIREBASE_COLLECTION = 'resultados_oraculo';

const firebaseConfig = {
  apiKey: '...',
  authDomain: 'landing-4c063.firebaseapp.com',
  projectId: 'landing-4c063',
  storageBucket: 'landing-4c063.firebasestorage.app',
  messagingSenderId: '1092712513900',
  appId: '1:1092712513900:web:0e8dc98b43f42ae1243349',
  measurementId: 'G-HYQ16KFM3P',
};
```

Despues se creo una funcion que inicializa Firebase solo cuando hace falta. Esta funcion importa `firebase-app.js` y `firebase-firestore.js`, inicializa la app y devuelve la instancia de Firestore:

```js
const getFirebaseClient = async () => {
  if (!firebaseClientPromise) {
    firebaseClientPromise = Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js'),
    ]).then(([appModule, firestoreModule]) => {
      const app = appModule.initializeApp(firebaseConfig);
      const db = firestoreModule.getFirestore(app);
      return { db, firestore: firestoreModule };
    });
  }
  return firebaseClientPromise;
};
```

Cuando el usuario termina el test, primero se crea un objeto `entry` con el nombre, la puntuacion, el total de preguntas, el titulo mitico, el mundo favorito y la fecha. Despues `saveEntry()` intenta guardar ese resultado en Firestore:

```js
await firestore.addDoc(firestore.collection(db, FIREBASE_COLLECTION), {
  nombre: entry.nombre,
  puntuacion: entry.puntuacion,
  total: entry.total,
  titulo: entry.titulo,
  mundo: entry.mundo,
  fecha: firestore.serverTimestamp(),
});
```

Se usa `serverTimestamp()` para que la fecha la genere Firebase y no dependa del reloj del navegador del usuario.

Para leer el ranking, la pagina consulta Firestore ordenando primero por puntuacion descendente y despues por fecha descendente. Asi aparecen arriba los mejores resultados y, en caso de empate, el mas reciente:

```js
const rankingQuery = firestore.query(
  firestore.collection(db, FIREBASE_COLLECTION),
  firestore.orderBy('puntuacion', 'desc'),
  firestore.orderBy('fecha', 'desc'),
  firestore.limit(8)
);

const snapshot = await firestore.getDocs(rankingQuery);
const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
renderRanking(entries);
```

Para permitir este funcionamiento sin abrir toda la base de datos, se crearon reglas de seguridad en `firestore.rules`. Las reglas permiten leer el ranking publicamente, crear documentos solo si tienen la estructura correcta y bloquean modificaciones o borrados desde la web:

```js
match /resultados_oraculo/{resultadoId} {
  allow read: if true;
  allow create: if isResultadoOraculoValido();
  allow update, delete: if false;
}
```

La funcion `isResultadoOraculoValido()` valida que los campos sean exactamente los esperados, que el nombre no supere 24 caracteres, que la puntuacion este entre 0 y el total, que el mundo sea uno de los cuatro mundos de la pagina y que la fecha sea `request.time`.

Tambien se creo `firestore.indexes.json` porque el ranking necesita una consulta compuesta:

```js
orderBy('puntuacion', 'desc')
orderBy('fecha', 'desc')
limit(8)
```

Si Firestore no esta disponible, la pagina no se rompe: el resultado se mantiene en `localStorage` como copia de respaldo y el ranking sigue funcionando localmente. Ademas, cuando se ejecuta con PHP, tambien se intenta guardar una copia en `resultados_oraculo.json`.

Utilidad: Firebase permite que el ranking sea persistente entre usuarios y dispositivos, sin depender de que cada navegador tenga su propio almacenamiento local.

### 8.9 Copia local JSON mediante PHP

Ademas del guardado principal en Firebase, el proyecto incluye un pequeno endpoint PHP que registra cada resultado en `resultados_oraculo.json`. Esta parte solo funciona cuando la pagina se abre desde un servidor PHP, porque un navegador abierto como `file://` no puede escribir archivos locales.

Archivos:

- `api/guardar_resultado_json.php`
- `resultados_oraculo.json`
- `Dockerfile`
- `docker-compose.yml`

Desde `script.js`, despues de guardar el resultado en `localStorage`, se llama al endpoint PHP de respaldo:

```js
const saveEntryToJsonFile = async entry => {
  const response = await fetch(JSON_BACKUP_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!response.ok) throw new Error('No se pudo guardar la copia JSON');
};
```

El endpoint valida los datos recibidos antes de escribirlos. Comprueba nombre, puntuacion, total, titulo y mundo favorito:

```php
if (
    $nombre === '' ||
    $nombreLength > 24 ||
    $puntuacion < 0 ||
    $total < 1 ||
    $total > 30 ||
    $puntuacion > $total ||
    $titulo === '' ||
    !in_array($mundo, ['Olimpo', 'Tierra', 'Mar', 'Inframundo'], true)
) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Datos invalidos']);
    exit;
}
```

La ruta del archivo JSON se calcula desde la raiz del proyecto:

```php
$jsonPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'resultados_oraculo.json';
```

Para evitar corrupcion del archivo si llegan dos peticiones a la vez, se usa bloqueo con `flock()`:

```php
if (!flock($handle, LOCK_EX)) {
    throw new RuntimeException('No se pudo bloquear el archivo JSON');
}
```

Despues se inserta el nuevo resultado, se ordena por puntuacion y fecha, se limita el historial y se reescribe el JSON con formato legible:

```php
array_unshift($entries, $entry);
usort($entries, function ($a, $b) {
    $scoreCompare = intval($b['puntuacion'] ?? 0) <=> intval($a['puntuacion'] ?? 0);
    if ($scoreCompare !== 0) {
        return $scoreCompare;
    }
    return strtotime($b['fecha'] ?? 'now') <=> strtotime($a['fecha'] ?? 'now');
});
$entries = array_slice($entries, 0, 50);
```

Utilidad: permite demostrar una escritura real en servidor local y deja una copia revisable en VS Code, sin sustituir al backend principal de Firebase.

### 8.10 Estado de guardado y fallback

La pagina intenta guardar cada resultado en Firebase Firestore. Si la conexion con Firebase falla, el resultado se conserva en `localStorage` para no perder la respuesta del usuario. Si la web se ejecuta mediante PHP, tambien se intenta registrar una copia en `resultados_oraculo.json`.

Fragmento JS del cambio de estado:

```js
const setBackendStatus = (message, mode = 'local') => {
  if (!backendStatus) return;
  backendStatus.textContent = message;
  backendStatus.className = `backend-status backend-status-${mode}`;
};
```

Aunque actualmente no se muestra el recuadro inferior de estado en la interfaz, la funcion se mantiene defensiva: si el elemento `backend-status` no existe, no produce errores.

Fragmento del guardado local previo al envio remoto:

```js
const current = getLocalRanking();
const next = sortRanking([entry, ...current]);
setLocalRanking(next);
renderRanking(next);
```

Utilidad: evita perder resultados aunque haya un fallo temporal de red o Firebase no este disponible durante la prueba.

## 9. Validacion y seguridad basica

El frontend valida campos obligatorios y el backend vuelve a validar los datos recibidos. En Firebase esta validacion se realiza con reglas de Firestore, y en la copia JSON se repite en PHP. No se confia solo en JavaScript.

Fragmento de reglas Firestore:

```js
allow create: if isResultadoOraculoValido();
allow update, delete: if false;
```

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
- La escritura en `resultados_oraculo.json` debe probarse arrancando Docker Compose o sirviendo la web con XAMPP/Laragon.
- La persistencia principal debe comprobarse en Firebase Firestore revisando la coleccion `resultados_oraculo`.

Comando recomendado para backend:

```bash
docker compose up --build
curl http://localhost:8080/api/health.php
php -l api/config.php
php -l api/health.php
php -l api/guardar_resultado.php
php -l api/guardar_resultado_json.php
php -l api/obtener_ranking.php
```

## 12. Correspondencia con la rubrica

| Requisito | Cumplimiento |
| --- | --- |
| Frontend funcional | `index.html`, `style.css`, `script.js` |
| Backend funcional | Firebase Firestore, `firestore.rules`, `firestore.indexes.json`, `firebase.json`, `api/guardar_resultado_json.php` |
| Animacion frontend | Estrellas, particulas, transiciones, carruseles y progreso |
| Tres tipografias | `Cinzel Decorative`, `Cinzel`, `Crimson Pro` |
| Responsive | Breakpoints en `style.css` y ajustes por JS |
| Cinco funcionalidades | Se documentan nueve funcionalidades evaluables |
| Documentacion tecnica | Este archivo `Documentacion.md` |
| Repositorio revisable | Proyecto completo y preparado para commit `v 0.9` |

## 13. Conclusiones

La version 1.0 refuerza los puntos criticos de evaluacion: documentacion obligatoria, backend real con Firebase Firestore, fallback local para que el proyecto siempre sea revisable, copia JSON opcional mediante PHP, test dinamico con banco de preguntas, responsive design, animaciones y trazabilidad mediante Git.
