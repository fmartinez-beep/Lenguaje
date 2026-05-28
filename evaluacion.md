**Evaluación: fmartinez-beer / Lenguaje**

**Estado:** Evaluable

**Nota:** 8.60/10

**Desglose:**
- Ejecución y estabilidad: 17/20
- Front-end: 13/15
- Back-end: 13/15
- Funcionalidades: 18/20
- Responsive: 9/10
- Tipografías: 5/5
- Animación: 5/5
- Documentación: 8/10
- Repositorio: 4/5

**Resumen técnico:**
La web carga correctamente como proyecto estático en local, y responden `index.html`, `style.css`, `script.js` y los audios. `script.js` pasa comprobación de sintaxis con `node --check`. No he podido ejecutar el backend PHP/MySQL porque este equipo no tiene PHP ni Docker, pero la entrega incluye `docker-compose.yml`, endpoints PHP, `database.sql`, reglas de Firestore e integración Firestore desde el navegador.

**Funcionalidades indicadas:**
- Navegación fija, menú móvil y progreso de scroll.
- Carruseles accesibles por secciones.
- Audio ambiental por zonas con control manual.
- Partículas, estrellas y ambientación visual.
- Test del Oráculo con preguntas aleatorias.
- Validación, puntuación y resultado personalizado.
- Ranking persistente con Firestore y `localStorage`.
- Copia JSON/PHP opcional y backend MySQL con Docker.

**Complejidad del back-end:**
Media-alta. La parte principal usa Firebase Firestore con reglas bastante bien pensadas: lectura pública del ranking, creación validada y bloqueo de edición/borrado. Además, hay alternativa PHP/MySQL y copia JSON local. No le doy más porque no pude comprobar la ejecución real de PHP/Docker en este equipo y las URLs probables de despliegue público devuelven 404.

**Puntos fuertes:**
Muy buen trabajo de ambientación. La web tiene identidad, audio, partículas, carruseles, test interactivo y ranking. Felicidades por la documentación: explica bastante bien la arquitectura y las decisiones técnicas.

**Aspectos a mejorar:**
El backend está algo repartido entre Firestore, PHP, JSON y MySQL, y eso puede hacer la revisión más confusa. También convendría entregar una URL pública funcional o instrucciones más directas para comprobar Firestore.

**Retroalimentación:**
Buen proyecto, cuidado y completo. Se nota trabajo tanto visual como técnico. Para rematarlo, simplificaría el backend principal o dejaría una demo pública funcionando para que la parte persistente se pueda comprobar sin depender del entorno del profesor.