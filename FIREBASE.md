# Configuracion de Firebase para el Oraculo

Este proyecto guarda resultados del Oraculo. En MySQL la tabla se llama `resultados_oraculo`; en Firestore se usara una coleccion con el mismo nombre.

## Archivos creados

- `firestore.rules`: reglas de seguridad para Cloud Firestore.
- `firestore.indexes.json`: indice necesario para ordenar el ranking por puntuacion y fecha.
- `firebase.json`: configuracion base para desplegar reglas, indices y, si quieres, hosting estatico.

## Coleccion

Nombre de la coleccion:

```text
resultados_oraculo
```

Cada documento debe tener esta forma:

```json
{
  "nombre": "Ariadna",
  "puntuacion": 5,
  "total": 5,
  "titulo": "Oraculo del Olimpo",
  "mundo": "Olimpo",
  "fecha": "serverTimestamp()"
}
```

Campos:

- `nombre`: texto obligatorio, maximo 24 caracteres.
- `puntuacion`: numero entero entre 0 y `total`.
- `total`: numero entero entre 1 y 30.
- `titulo`: texto obligatorio, maximo 60 caracteres.
- `mundo`: uno de `Olimpo`, `Tierra`, `Mar` o `Inframundo`.
- `fecha`: fecha generada por Firebase con `serverTimestamp()`.

## Reglas

Firebase te dio unas reglas iniciales que bloquean todo:

```js
allow read, write: if false;
```

Eso es seguro para empezar, pero no permite que el ranking funcione. El archivo `firestore.rules` incluido en este proyecto permite:

- Leer `resultados_oraculo` publicamente para mostrar el ranking.
- Crear nuevos resultados solo si los datos cumplen la estructura esperada.
- Bloquear ediciones y borrados desde la web.
- Bloquear cualquier otra coleccion.

En la consola de Firebase puedes copiar el contenido de `firestore.rules` en:

```text
Firestore Database > Rules
```

## Indice del ranking

El ranking necesita esta consulta:

```js
orderBy('puntuacion', 'desc')
orderBy('fecha', 'desc')
limit(8)
```

Por eso se incluye `firestore.indexes.json`. Si usas Firebase CLI:

```powershell
firebase deploy --only firestore
```

Si no usas CLI, Firebase normalmente te mostrara un enlace para crear el indice cuando ejecutes esa consulta por primera vez.

## Conexion desde la web

`script.js` ya carga Firebase desde el navegador con los modulos oficiales por CDN:

```js
import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
```

La configuracion usada es la de la app web `landing-4c063`. No uses el Admin SDK ni un `serviceAccountKey.json` en el navegador.

Para que los resultados aparezcan en Firebase, comprueba estos puntos:

- Firestore Database debe estar creado en Firebase.
- Las reglas de `firestore.rules` deben estar publicadas en `Firestore Database > Rules`.
- La coleccion se crea automaticamente al guardar el primer resultado valido.
- Si Firebase pide un indice para el ranking, crea el indice sugerido o despliega `firestore.indexes.json`.

Consulta que usa el ranking:

```js
orderBy('puntuacion', 'desc')
orderBy('fecha', 'desc')
limit(8)
```

## Copia local en JSON

El proyecto tambien intenta guardar cada resultado en `resultados_oraculo.json` mediante:

```text
api/guardar_resultado_json.php
```

Para que ese archivo se actualice en VS Code, abre la web desde el backend PHP:

```powershell
.\start-backend.ps1
```

Y entra en:

```text
http://localhost:8080
```

No se actualizara el archivo si abres `index.html` directamente, si usas Live Server estatico, o si estas viendo la version desplegada en Firebase Hosting, porque esos modos no ejecutan PHP ni pueden escribir archivos del proyecto.
