/* ════════════════════════════════════════════════════════════════════════
   MITOLOGÍA GRIEGA — script.js (VERSIÓN 3D INMERSIVA)
   ════════════════════════════════════════════════════════════════════════
   
   🎬 SISTEMA 3D CINEMATOGRÁFICO:
   
   Este script crea una experiencia de scroll 3D donde al hacer scroll:
   - Cada sección "crece" como si cayera hacia el observador
   - Las transiciones son suaves entre mundos
   - El efecto da la sensación de estar "cayendo" en 3D
   - El menú permanece fijo (sin transformaciones)
   - El botón "Volver Arriba" hace la secuencia inversa
   
   ════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURACIÓN GLOBAL DEL SISTEMA 3D
// ════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURACIÓN GLOBAL DEL SISTEMA 3D
// ════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // ─ Movimiento Reducido (accesibilidad) ─
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  
  // ─ Control de Animación ─
  ticking: false,
};

const PERF_PROFILE = {
  finePointer: window.matchMedia('(pointer: fine)').matches,
  lowPower:
    (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 6) ||
    (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 6),
  compactScreen: window.innerWidth < 1100,
};

// ════════════════════════════════════════════════════════════════════════
// 📊 ESTADO GLOBAL
// ════════════════════════════════════════════════════════════════════════

const state = {
  scrollY: 0,
  currentSection: null,
  sectionProgress: 0,
  sections: [],
  sectionHeights: {},
  starCycleTimer: null,
  isReturningToTop: false,
  returnStartTime: null,
  returnTotalDuration: 0,
};

// ════════════════════════════════════════════════════════════════════════
// 📐 UTILIDADES MATEMÁTICAS
// ════════════════════════════════════════════════════════════════════════

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeIn(t) {
  return Math.pow(t, 3);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clearContainer(id) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = '';
  return el;
}

// ════════════════════════════════════════════════════════════════════════
// ⭐ GENERADOR DE ESTRELLAS (ORIGINAL PRESERVADO)
// ════════════════════════════════════════════════════════════════════════

function createStars() {
  const container = clearContainer('stars-container');
  if (!container) return;

  if (state.starCycleTimer) {
    clearTimeout(state.starCycleTimer);
    state.starCycleTimer = null;
  }

  const W = container.offsetWidth  || window.innerWidth;
  const H = container.offsetHeight || window.innerHeight;

  const T_DRAW = 2200, T_HOLD = 7000, T_FADE = 1200, T_GAP = 600;

  const SETS = [
    [{ name: 'Osa Mayor', stars: [{ fx: 0.07, fy: 0.10, r: 2.2 }, { fx: 0.11, fy: 0.14, r: 1.8 }, { fx: 0.12, fy: 0.20, r: 1.6 }, { fx: 0.07, fy: 0.18, r: 1.4 }, { fx: 0.04, fy: 0.11, r: 1.9 }, { fx: 0.02, fy: 0.05, r: 1.6 }, { fx: 0.01, fy: 0.00, r: 1.5 }], lines: [[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]] }, { name: 'Orion', stars: [{ fx: 0.14, fy: 0.60, r: 2.2 }, { fx: 0.20, fy: 0.57, r: 1.7 }, { fx: 0.12, fy: 0.72, r: 1.6 }, { fx: 0.16, fy: 0.71, r: 1.6 }, { fx: 0.20, fy: 0.70, r: 1.6 }, { fx: 0.11, fy: 0.84, r: 2.2 }, { fx: 0.21, fy: 0.82, r: 1.4 }, { fx: 0.16, fy: 0.63, r: 1.2 }, { fx: 0.16, fy: 0.51, r: 1.6 }], lines: [[8,7],[7,0],[7,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6]] }],
    [{ name: 'Osa Menor', stars: [{ fx: 0.62, fy: 0.03, r: 2.2 }, { fx: 0.59, fy: 0.08, r: 1.4 }, { fx: 0.55, fy: 0.12, r: 1.3 }, { fx: 0.52, fy: 0.17, r: 1.4 }, { fx: 0.47, fy: 0.15, r: 1.3 }, { fx: 0.44, fy: 0.21, r: 1.8 }, { fx: 0.50, fy: 0.24, r: 1.3 }], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]] }, { name: 'Perseo', stars: [{ fx: 0.86, fy: 0.14, r: 2.0 }, { fx: 0.91, fy: 0.09, r: 1.5 }, { fx: 0.95, fy: 0.05, r: 1.3 }, { fx: 0.88, fy: 0.22, r: 1.4 }, { fx: 0.84, fy: 0.29, r: 1.3 }, { fx: 0.93, fy: 0.30, r: 1.3 }, { fx: 0.80, fy: 0.08, r: 2.2 }, { fx: 0.83, fy: 0.11, r: 1.3 }], lines: [[6,7],[7,0],[0,1],[1,2],[0,3],[3,4],[3,5]] }],
    [{ name: 'Hercules', stars: [{ fx: 0.77, fy: 0.58, r: 1.8 }, { fx: 0.77, fy: 0.65, r: 2.0 }, { fx: 0.71, fy: 0.70, r: 1.5 }, { fx: 0.83, fy: 0.70, r: 1.4 }, { fx: 0.68, fy: 0.76, r: 1.4 }, { fx: 0.65, fy: 0.83, r: 1.3 }, { fx: 0.86, fy: 0.76, r: 1.5 }, { fx: 0.89, fy: 0.83, r: 1.4 }, { fx: 0.75, fy: 0.82, r: 1.3 }, { fx: 0.72, fy: 0.90, r: 1.4 }], lines: [[0,1],[1,2],[1,3],[2,4],[4,5],[3,6],[6,7],[1,8],[8,9]] }, { name: 'Lyra', stars: [{ fx: 0.38, fy: 0.06, r: 2.2 }, { fx: 0.41, fy: 0.12, r: 1.4 }, { fx: 0.44, fy: 0.09, r: 1.4 }, { fx: 0.45, fy: 0.17, r: 1.6 }, { fx: 0.41, fy: 0.19, r: 1.5 }], lines: [[0,1],[0,2],[1,3],[2,4],[3,4]] }, { name: 'Cassiopeia', stars: [{ fx: 0.79, fy: 0.84, r: 1.6 }, { fx: 0.84, fy: 0.80, r: 1.5 }, { fx: 0.88, fy: 0.85, r: 1.9 }, { fx: 0.92, fy: 0.81, r: 1.4 }, { fx: 0.96, fy: 0.86, r: 1.3 }], lines: [[0,1],[1,2],[2,3],[3,4]] }],
  ];

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width',  W);
  svg.setAttribute('height', H);
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;';

  const defs = document.createElementNS(NS, 'defs');
  const filt = document.createElementNS(NS, 'filter');
  filt.setAttribute('id', 'sg');
  filt.setAttribute('x', '-60%');
  filt.setAttribute('y', '-60%');
  filt.setAttribute('width', '220%');
  filt.setAttribute('height', '220%');
  const fblur = document.createElementNS(NS, 'feGaussianBlur');
  fblur.setAttribute('stdDeviation', '1.8');
  fblur.setAttribute('result', 'glow');
  const fmerge = document.createElementNS(NS, 'feMerge');
  ['glow','SourceGraphic'].forEach(i => {
    const n = document.createElementNS(NS, 'feMergeNode');
    n.setAttribute('in', i);
    fmerge.appendChild(n);
  });
  filt.appendChild(fblur);
  filt.appendChild(fmerge);
  defs.appendChild(filt);
  svg.appendChild(defs);
  container.appendChild(svg);

  function buildSet(setDef) {
    const setG = document.createElementNS(NS, 'g');
    setG.style.opacity = '0';
    setG.style.transition = `opacity ${T_FADE / 1000}s ease-in-out`;

    setDef.forEach((constellation, ci) => {
      const pts = constellation.stars.map(s => ({ x: s.fx * W, y: s.fy * H, r: s.r }));

      constellation.lines.forEach(([a, b], li) => {
        const p1 = pts[a], p2 = pts[b];
        const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', p1.x.toFixed(1));
        line.setAttribute('y1', p1.y.toFixed(1));
        line.setAttribute('x2', p2.x.toFixed(1));
        line.setAttribute('y2', p2.y.toFixed(1));
        line.setAttribute('stroke', 'rgba(180,210,255,0.35)');
        line.setAttribute('stroke-width', '0.8');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke-dasharray', len.toFixed(1));
        line.setAttribute('stroke-dashoffset', len.toFixed(1));
        const delay = ci * 400 + li * 180;
        line.style.animation = `drawLine 2s ease-out ${delay}ms forwards`;
        setG.appendChild(line);
      });

      pts.forEach((p, si) => {
        const star = constellation.stars[si];
        const circle = document.createElementNS(NS, 'circle');
        circle.setAttribute('cx', p.x.toFixed(1));
        circle.setAttribute('cy', p.y.toFixed(1));
        circle.setAttribute('r', p.r.toFixed(1));
        circle.setAttribute('fill', 'rgba(230,240,255,0.90)');
        if (star.r >= 1.8) circle.setAttribute('filter', 'url(#sg)');
        const delay = ci * 400 + si * 90;
        circle.style.cssText = `opacity:0;animation:starFadeIn 1s ease-out ${delay}ms forwards`;
        setTimeout(() => {
          if (!circle.isConnected) return;
          const dur = (4 + si * 0.5).toFixed(1);
          circle.style.animation = `constShimmer ${dur}s ease-in-out infinite`;
        }, T_DRAW + 300);
        setG.appendChild(circle);
      });
    });

    return setG;
  }

  let currentSet = 0;

  function runSet(index) {
    const setG = buildSet(SETS[index]);
    svg.appendChild(setG);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      setG.style.opacity = '1';
    }));

    state.starCycleTimer = setTimeout(() => {
      setG.style.opacity = '0';

      state.starCycleTimer = setTimeout(() => {
        svg.removeChild(setG);
        state.starCycleTimer = setTimeout(() => {
          currentSet = (currentSet + 1) % SETS.length;
          runSet(currentSet);
        }, T_GAP);

      }, T_FADE);

    }, T_DRAW + T_HOLD);
  }

  runSet(0);

  // Estrellas de fondo fijas
  if (!CONFIG.reducedMotion) {
    const N = Math.min(40, Math.round(W / 32));
    for (let i = 0; i < N; i++) {
      const dot = document.createElement('div');
      dot.className = 'star';
      const sz = rand(0.8, 2);
      Object.assign(dot.style, {
        width: `${sz}px`,
        height: `${sz}px`,
        top: `${rand(0,100)}%`,
        left: `${rand(0,100)}%`,
        '--dur': `${rand(3,7)}s`,
        '--delay': `${rand(0,6)}s`,
        '--min-op': `${rand(0.08,0.35)}`,
      });
      container.appendChild(dot);
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// 🌊 GENERADORES DE PARTÍCULAS (ORIGINAL PRESERVADO)
// ════════════════════════════════════════════════════════════════════════

function createSeaParticles() {
  const container = clearContainer('sea-particles');
  if (!container || CONFIG.reducedMotion) return;
  const count = Math.min(48, Math.round(window.innerWidth / 24));
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'sea-particle';
    const size = rand(3, 14);
    Object.assign(particle.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${rand(0, 100)}%`,
      bottom: `${rand(0, 20)}%`,
      background: `rgba(${Math.round(rand(40, 120))}, ${Math.round(rand(160, 220))}, ${Math.round(rand(180, 240))}, ${rand(0.2, 0.5)})`,
      '--dur': `${rand(6, 18)}s`,
      '--delay': `${rand(0, 10)}s`,
    });
    container.appendChild(particle);
  }
}

function createAshParticles() {
  const container = clearContainer('ash-particles');
  if (!container || CONFIG.reducedMotion) return;
  const count = Math.min(40, Math.round(window.innerWidth / 28));
  for (let i = 0; i < count; i++) {
    const ash = document.createElement('div');
    ash.className = 'ash-particle';
    const size = rand(2, 8);
    Object.assign(ash.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${rand(0, 100)}%`,
      top: `${rand(-20, 10)}%`,
      background: `rgba(${Math.round(rand(150, 220))}, ${Math.round(rand(60, 120))}, ${Math.round(rand(40, 80))}, ${rand(0.3, 0.6)})`,
      '--dur': `${rand(10, 25)}s`,
      '--delay': `${rand(0, 15)}s`,
      borderRadius: rand(0, 1) > 0.5 ? '50%' : `${rand(20, 50)}%`,
    });
    container.appendChild(ash);
  }
}

function createWaveBubbles() {
  const container = clearContainer('wave-bubbles');
  if (!container || CONFIG.reducedMotion) return;
  const count = Math.min(24, Math.round(window.innerWidth / 45));
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('div');
    const size = rand(4, 20);
    Object.assign(bubble.style, {
      position: 'absolute',
      borderRadius: '50%',
      width: `${size}px`,
      height: `${size}px`,
      left: `${rand(0, 100)}%`,
      bottom: `${rand(0, 50)}%`,
      background: `rgba(100, 200, 230, ${rand(0.1, 0.3)})`,
      border: `1px solid rgba(150, 220, 240, ${rand(0.3, 0.6)})`,
      animation: `bubbleRise ${rand(4, 12)}s ease-in infinite`,
      animationDelay: `${rand(0, 8)}s`,
    });
    container.appendChild(bubble);
  }
}

// ════════════════════════════════════════════════════════════════════════
// 🎯 NÚCLEO 3D — SISTEMA DE TRANSFORMACIONES
// ════════════════════════════════════════════════════════════════════════

/**
 * 📍 DETECTAR SECCIÓN Y PROGRESO ACTUAL (REESCRITA)
 * 
 * Usa getBoundingClientRect() para ser preciso
 * Calcula qué sección está más centrada en el viewport
 */
function detectarSeccionActual() {
  state.scrollY = window.scrollY;
  
  let mejorSeccion = null;
  let mejorProgreso = 0;
  let menorDistancia = Infinity;
  
  // ─ Para cada sección, calcular cuán centrada está ─
  for (const section of state.sections) {
    const rect = section.getBoundingClientRect();
    const viewport = window.innerHeight;
    
    // Centro de la sección en coordenadas del viewport
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = viewport / 2;
    
    // Distancia del centro de la sección al centro del viewport
    const distance = Math.abs(sectionCenter - viewportCenter);
    
    // ✅ Si esta sección está más cerca del centro
    if (distance < menorDistancia) {
      menorDistancia = distance;
      mejorSeccion = section;
      
      // Calcular progreso (0-1):
      // - Cuando rect.top == viewport (secc está abajo) → progress ≈ 0
      // - Cuando rect.top + rect.height / 2 == viewportCenter → progress ≈ 0.5
      // - Cuando rect.bottom == 0 (secc sale arriba) → progress ≈ 1
      
      mejorProgreso = (viewportCenter - rect.top) / rect.height;
      mejorProgreso = Math.max(0.01, Math.min(0.99, mejorProgreso));
    }
  }
  
  state.currentSection = mejorSeccion;
  state.sectionProgress = mejorProgreso;
}

/**
 * 🎬 APLICAR TRANSFORMACIONES 3D A TODAS LAS SECCIONES (REESCRITA)
 * 
 * Para cada sección:
 * - Calcula qué tan centrada está en el viewport
 * - Aplica transformaciones proporcionales
 * - Las secciones "crecen" al llegar al centro
 */
function calcularTransformacionesActuales() {
  const viewport = window.innerHeight;
  const viewportCenter = viewport / 2;
  
  // ─ Transición delicada con opacidad suave ─
  for (const section of state.sections) {
    const inner = section.querySelector('.section-inner');
    if (!inner) continue;
    
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const distanceFromCenter = sectionCenter - viewportCenter;
    
    // Normalizar a rango -1 a 1
    let normalizedDistance = distanceFromCenter / (viewport / 2);
    normalizedDistance = Math.max(-1, Math.min(1, normalizedDistance));
    
    // Proximidad al centro: 1 = centrada, 0 = fuera de vista
    const proximidadAlCentro = 1 - Math.abs(normalizedDistance);
    const eased = easeOut(proximidadAlCentro);
    
    // Opacidad suave: más visible cuando la sección está centrada
    const opacity = lerp(0.6, 1, eased);
    
    // Solo aplicar opacidad, sin transformaciones 3D
    inner.style.opacity = String(opacity);
    inner.style.transform = 'translateY(0)';
  }
}

/**
 * 📊 RECALCULAR ALTURAS DE SECCIONES
 * Se llama en init y en resize para precisión
 */
function calcularAlturasSeciones() {
  state.sectionHeights = {};
  state.sections.forEach(section => {
    state.sectionHeights[section.id] = section.offsetHeight;
  });
}

// ════════════════════════════════════════════════════════════════════════
// 🔄 NAVEGACIÓN Y CONTROLS
// ════════════════════════════════════════════════════════════════════════

/**
 * ⬆️ VOLVER AL OLIMPO (SECUENCIA INVERSA)
 * 
 * Anima el scroll haciendo la reversión del efecto 3D
 * El botón "Volver al Olimpo" ejecuta esto
 */
function volverAlOlimpo() {
  const totalDistance = window.scrollY;
  if (totalDistance === 0) return;
  
  const startTime = performance.now();
  const returnDuration = 3500; // ms de animación
  
  state.isReturningToTop = true;
  state.returnStartTime = startTime;
  state.returnTotalDuration = returnDuration;
  
  function animarRetorno(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / returnDuration);
    
    // ─ Easing suave: entrada lenta, aceleración ─
    const eased = progress < 0.5
      ? easeIn(progress * 2)  
      : 1 - easeIn((1 - progress) * 2);
    
    // ─ Scroll interpolada a la posición ─
    const newScrollY = totalDistance * (1 - eased);
    window.scrollTo(0, newScrollY);
    
    if (progress < 1) {
      requestAnimationFrame(animarRetorno);
    } else {
      // ✅ Retorno completado
      state.isReturningToTop = false;
      state.returnStartTime = null;
      actualizarEscena();
    }
  }
  
  requestAnimationFrame(animarRetorno);
}

/**
 * 🔘 INICIALIZAR BOTÓN "VOLVER AL OLIMPO"
 */
function inicializarBotonVolver() {
  let btn = document.getElementById('back-to-top');
  
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Volver al inicio');
    btn.innerHTML = `
      <span class="back-icon">⬆</span>
      <span class="back-text">Volver al Olimpo</span>
    `;
    document.body.appendChild(btn);
  }
  
  btn.addEventListener('click', volverAlOlimpo);
  
  return {
    update() {
      const underworld = document.getElementById('underworld');
      if (!underworld) return;
      
      const rect = underworld.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * 0.75;
      btn.classList.toggle('is-visible', visible);
    },
  };
}

/**
 * ⚙️ INICIALIZAR NAVEGACIÓN FIJA
 */
function inicializarNav() {
  const body = document.body;
  const nav = document.getElementById('main-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  
  if (!nav || !navToggle || !navLinks.length) return {};
  
  const closeNav = () => {
    body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  
  const toggleNav = () => {
    const open = body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
  };
  
  navToggle.addEventListener('click', toggleNav);
  
  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      
      event.preventDefault();
      closeNav();
      
      target.scrollIntoView({
        behavior: CONFIG.reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });
  
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNav();
  });
  
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeNav();
  });
  
  return {
    update(scrollY) {
      nav.classList.toggle('scrolled', scrollY > 80);
    },
  };
}

// ════════════════════════════════════════════════════════════════════════
// 📡 BUCLE PRINCIPAL DE ANIMACIÓN
// ════════════════════════════════════════════════════════════════════════

/**
 * 🎬 ACTUALIZAR ESCENA
 * Llamada cada frame: aplica transformaciones a TODAS las secciones
 */
function actualizarEscena() {
  if (!CONFIG.reducedMotion) {
    // Actualizar la posición de scroll
    state.scrollY = window.scrollY;
    
    // Aplicar transformaciones 3D a todas las secciones
    calcularTransformacionesActuales();
  }
}

/**
 * 🔄 SOLICITAR ACTUALIZACIÓN (THROTTLE)
 * Una actualización por frame máximo
 */
function solicitarActualizacion() {
  if (CONFIG.ticking) return;
  CONFIG.ticking = true;
  window.requestAnimationFrame(() => {
    actualizarEscena();
    CONFIG.ticking = false;
  });
}

/**
 *📊 ACTUALIZAR BARRA DE PROGRESO
 */
function actualizarProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;
  
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}

// ════════════════════════════════════════════════════════════════════════
// 🚀 INICIALIZACIÓN PRINCIPAL
// ════════════════════════════════════════════════════════════════════════

function inicializar() {
  console.log('✨ Inicializando sistema 3D inmersivo...');
  
  // ─────────────────────────────────────────────────────────
  // 1️⃣ Recopilar secciones
  // ─────────────────────────────────────────────────────────
  state.sections = Array.from(document.querySelectorAll('.world-section'));
  
  if (!state.sections.length) {
    console.warn('⚠️ No hay secciones .world-section encontradas');
    return;
  }
  
  console.log(`✅ ${state.sections.length} secciones detectadas`);
  
  // º─────────────────────────────────────────────────────────
  // 2️⃣ Calcular alturas
  // ─────────────────────────────────────────────────────────
  calcularAlturasSeciones();
  
  // ─────────────────────────────────────────────────────────
  // 3️⃣ Generar partículas y visuales
  // ─────────────────────────────────────────────────────────
  createStars();
  createSeaParticles();
  createAshParticles();
  createWaveBubbles();
  
  // ─────────────────────────────────────────────────────────
  // 4️⃣ Inicializar componentes UI
  // ─────────────────────────────────────────────────────────
  const navModule = inicializarNav();
  const backToTopModule = inicializarBotonVolver();
  
  // ─────────────────────────────────────────────────────────
  // 5️⃣ Eventos de scroll y resize
  // ─────────────────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    actualizarProgressBar();
    navModule.update?.(window.scrollY);
    backToTopModule.update?.();
    solicitarActualizacion();
  }, { passive: true });
  
  window.addEventListener('resize', () => {
    calcularAlturasSeciones();
    solicitarActualizacion();
  }, { passive: true });
  
  // ─────────────────────────────────────────────────────────
  // 6️⃣ Actualización inicial y barra de progreso
  // ─────────────────────────────────────────────────────────
  actualizarEscena();
  actualizarProgressBar();
  
  console.log('✨ Sistema 3D listo. ¡Disfruta del viaje!');
}

// ════════════════════════════════════════════════════════════════════════
// ⏰ ESPERAR A QUE EL DOM ESTÉ LISTO
// ════════════════════════════════════════════════════════════════════════

if (document.readyState === 'loading') {
  // Bootstrap legado desactivado: el inicializador moderno del final del
  // archivo ya cubre toda la escena sin duplicar listeners ni trabajo.
}
/* ════════════════════════════════════════════════════════════════════════
   MITOLOGÍA GRIEGA — script.js (VERSIÓN 3D INMERSIVA)
   ════════════════════════════════════════════════════════════════════════
   
   🎬 EFECTO 3D CINEMATOGRÁFICO:
   
   Este script transforma la experiencia de scroll en un viaje 3D inmersivo:
   
   1. DETECCIÓN DE SCROLL:
      - Cada frame, se calcula en qué sección estamos
      - Y qué porcentaje (0-1) hemos avanzado dentro de esa sección
   
   2. TRANSFORMACIONES 3D:
      - Zoom progresivo: entra pequeño → agranda → se reduce
      - Traslación en Z: efecto de "caída" hacia el observador
      - Opacidad: fade in/out suave en transiciones
   
   3. EFECTO RESULTANTE:
      - Como si cayéramos "dentro" de la pantalla
      - Cada sección se agranda al estar centrada
      - Las transiciones entre mundos son suaves y cinematográficas
   
   ════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURACIÓN DEL SISTEMA 3D
// ════════════════════════════════════════════════════════════════════════

const CONFIG_3D = {
  // ─ Movimiento Reducido ─
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  
  // ─ Control de Animación General ─
  ticking: false,
  
  // ─ Parámetros 3D Principales ─
  perspectiveValue: 800,          // Distancia de la cámara (px) — distancia menor = efecto más fuerte
  maxZoomScale: 1.12,             // Escala máxima (como si se acercara mucho)
  minZoomScale: 0.75,             // Escala mínima (cuando entra la sección desde el fondo)
  depthFar: 300,                  // Profundidad inicial (lejos)
  depthNear: -250,                // Profundidad final (cerca, negativo = hacia el observador)
};

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
state.reducedMotion = motionQuery.matches;

// ════════════════════════════════════════════════════════════════════════
// 🎯 ESTADO GLOBAL DEL SISTEMA
// ════════════════════════════════════════════════════════════════════════

const STATE_3D = {
  // ─ Posición Actual en la Página ─
  scrollY: 0,
  currentSection: null,           // Referencia al elemento actual
  sectionProgress: 0,             // 0 a 1: % dentro de la sección visible
  
  // ─ Listado de Secciones ─
  sections: [],                   // Array de .world-section
  sectionHeights: {},             // Mapa de ids → alturas (para cálculos)
  
  // ─ IDs para referencia ─
  sectionIds: [
    'top',           // Hero: "MITOS GRIEGOS"
    'olympus',       // Olimpo + transición nubes
    'earth',         // Tierra + transición agua
    'sea',           // Mar + transición grietas
    'underworld',    // Inframundo
  ],
  
  // ─ Timer del Ciclo de Estrellas ─
  starCycleTimer: null,
  
  // ─ Reversión (Botón Volver Arriba) ─
  isReturningToTop: false,
  returnStartTime: null,
  returnTotalDuration: 0,
};

// ════════════════════════════════════════════════════════════════════════
// 📐 FUNCIONES MATEMÁTICAS AUXILIARES
// ════════════════════════════════════════════════════════════════════════

/**
 * 🔀 INTERPOLACIÓN LINEAL (LERP)
 * Suavizar transiciones entre dos valores
 * @param {number} a - Inicio
 * @param {number} b - Fin
 * @param {number} t - Progreso (0-1)
 */
function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/**
 * 🎯 EASING: Ease-Out Cúbica
 * Movimiento que comienza rápido y se ralentiza
 * Perfecto para "entrar" en una sección
 */
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * 🎯 EASING: Ease-In Cúbica
 * Movimiento que comienza lento y acelera
 * Perfecto para "salir" de una sección (reversión)
 */
function easeIn(t) {
  return Math.pow(t, 3);
}

/**
 * 🎲 NÚMERO ALEATORIO
 */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * 🧹 LIMPIAR CONTENEDOR
 */
function clearContainer(id) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = '';
  return el;
}

/*
 * createStars
 * ───────────
 * Cielo nocturno del hero con dos capas:
 *   1. Canvas de constelaciones: ciclo de 3 sets que se alternan con fade.
 *      Las coordenadas son fracciones (0-1) del tamaño real del contenedor,
 *      así que escalan correctamente con cualquier pantalla.
 *   2. Estrellas de fondo (div.star): puntos fijos que parpadean.
 */
function createStars() {
  const container = clearContainer('stars-container');
  if (!container) return;

  // Cancelar ciclo anterior si venimos de un resize
  if (state.starCycleTimer) {
    clearTimeout(state.starCycleTimer);
    state.starCycleTimer = null;
  }

  const W = container.offsetWidth  || window.innerWidth;
  const H = container.offsetHeight || window.innerHeight;

  // ── Tiempos del ciclo ──────────────────────────────────────────────
  const T_DRAW    = 2200; // ms que tarda en dibujarse cada set
  const T_HOLD    = 7000; // ms visible tras dibujarse
  const T_FADE    = 1200; // ms del fade-out
  const T_GAP     =  600; // ms de pausa oscura entre sets

  // ── SETS: coordenadas como fracción de W y H ───────────────────────
  // Zona central del texto: x 0.18-0.82, y 0.28-0.72 — evitar esa banda.
  // Cada estrella: { fx, fy, r }  donde fx*W, fy*H = px reales.
  // r = radio en px (visible con claridad).
  const SETS = [
    // ── SET A: Osa Mayor + Orión ─────────────────────────────────────
    [
      {
        name: 'Osa Mayor',
        stars: [
          { fx: 0.07, fy: 0.10, r: 2.2 }, // Dubhe
          { fx: 0.11, fy: 0.14, r: 1.8 }, // Merak
          { fx: 0.12, fy: 0.20, r: 1.6 }, // Phecda
          { fx: 0.07, fy: 0.18, r: 1.4 }, // Megrez
          { fx: 0.04, fy: 0.11, r: 1.9 }, // Alioth
          { fx: 0.02, fy: 0.05, r: 1.6 }, // Mizar
          { fx: 0.01, fy: 0.00, r: 1.5 }, // Alkaid
        ],
        lines: [[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]],
      },
      {
        name: 'Orion',
        stars: [
          { fx: 0.14, fy: 0.60, r: 2.2 }, // Betelgeuse
          { fx: 0.20, fy: 0.57, r: 1.7 }, // Bellatrix
          { fx: 0.12, fy: 0.72, r: 1.6 }, // Alnitak
          { fx: 0.16, fy: 0.71, r: 1.6 }, // Alnilam
          { fx: 0.20, fy: 0.70, r: 1.6 }, // Mintaka
          { fx: 0.11, fy: 0.84, r: 2.2 }, // Rigel
          { fx: 0.21, fy: 0.82, r: 1.4 }, // Saiph
          { fx: 0.16, fy: 0.63, r: 1.2 }, // cuello
          { fx: 0.16, fy: 0.51, r: 1.6 }, // cabeza
        ],
        lines: [[8,7],[7,0],[7,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6]],
      },
    ],
    // ── SET B: Osa Menor + Perseo ─────────────────────────────────────
    [
      {
        name: 'Osa Menor',
        stars: [
          { fx: 0.62, fy: 0.03, r: 2.2 }, // Polaris
          { fx: 0.59, fy: 0.08, r: 1.4 }, // Yildun
          { fx: 0.55, fy: 0.12, r: 1.3 }, // epsilon
          { fx: 0.52, fy: 0.17, r: 1.4 }, // Pherkad
          { fx: 0.47, fy: 0.15, r: 1.3 }, // eta
          { fx: 0.44, fy: 0.21, r: 1.8 }, // Kochab
          { fx: 0.50, fy: 0.24, r: 1.3 }, // zeta
        ],
        lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],
      },
      {
        name: 'Perseo',
        stars: [
          { fx: 0.86, fy: 0.14, r: 2.0 }, // Mirfak
          { fx: 0.91, fy: 0.09, r: 1.5 }, // delta
          { fx: 0.95, fy: 0.05, r: 1.3 }, // epsilon
          { fx: 0.88, fy: 0.22, r: 1.4 }, // zeta
          { fx: 0.84, fy: 0.29, r: 1.3 }, // xi
          { fx: 0.93, fy: 0.30, r: 1.3 }, // eta
          { fx: 0.80, fy: 0.08, r: 2.2 }, // Algol (Medusa)
          { fx: 0.83, fy: 0.11, r: 1.3 }, // pi
        ],
        lines: [[6,7],[7,0],[0,1],[1,2],[0,3],[3,4],[3,5]],
      },
    ],
    // ── SET C: Hércules + Lira + Casiopea ────────────────────────────
    [
      {
        name: 'Hercules',
        stars: [
          { fx: 0.77, fy: 0.58, r: 1.8 }, // cabeza
          { fx: 0.77, fy: 0.65, r: 2.0 }, // torso
          { fx: 0.71, fy: 0.70, r: 1.5 }, // hombro izq
          { fx: 0.83, fy: 0.70, r: 1.4 }, // hombro der
          { fx: 0.68, fy: 0.76, r: 1.4 }, // codo izq
          { fx: 0.65, fy: 0.83, r: 1.3 }, // clava
          { fx: 0.86, fy: 0.76, r: 1.5 }, // codo der
          { fx: 0.89, fy: 0.83, r: 1.4 }, // mano der
          { fx: 0.75, fy: 0.82, r: 1.3 }, // cadera
          { fx: 0.72, fy: 0.90, r: 1.4 }, // rodilla
        ],
        lines: [[0,1],[1,2],[1,3],[2,4],[4,5],[3,6],[6,7],[1,8],[8,9]],
      },
      {
        name: 'Lyra',
        stars: [
          { fx: 0.38, fy: 0.06, r: 2.2 }, // Vega
          { fx: 0.41, fy: 0.12, r: 1.4 }, // epsilon-1
          { fx: 0.44, fy: 0.09, r: 1.4 }, // epsilon-2
          { fx: 0.45, fy: 0.17, r: 1.6 }, // Sheliak
          { fx: 0.41, fy: 0.19, r: 1.5 }, // Sulafat
        ],
        lines: [[0,1],[0,2],[1,3],[2,4],[3,4]],
      },
      {
        name: 'Cassiopeia',
        stars: [
          { fx: 0.79, fy: 0.84, r: 1.6 }, // Schedar
          { fx: 0.84, fy: 0.80, r: 1.5 }, // Caph
          { fx: 0.88, fy: 0.85, r: 1.9 }, // Tsih
          { fx: 0.92, fy: 0.81, r: 1.4 }, // Ruchbah
          { fx: 0.96, fy: 0.86, r: 1.3 }, // Segin
        ],
        lines: [[0,1],[1,2],[2,3],[3,4]],
      },
    ],
  ];

  // ── SVG ───────────────────────────────────────────────────────────
  const NS  = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  // viewBox en px reales — sin fracciones que encojan los elementos
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width',  W);
  svg.setAttribute('height', H);
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;';

  // Filtro glow para estrellas brillantes
  const defs   = document.createElementNS(NS, 'defs');
  const filt   = document.createElementNS(NS, 'filter');
  filt.setAttribute('id', 'sg');
  filt.setAttribute('x', '-60%'); filt.setAttribute('y', '-60%');
  filt.setAttribute('width', '220%'); filt.setAttribute('height', '220%');
  const fblur  = document.createElementNS(NS, 'feGaussianBlur');
  fblur.setAttribute('stdDeviation', '1.8'); // halo visible pero sutil
  fblur.setAttribute('result', 'glow');
  const fmerge = document.createElementNS(NS, 'feMerge');
  ['glow','SourceGraphic'].forEach(i => {
    const n = document.createElementNS(NS, 'feMergeNode');
    n.setAttribute('in', i);
    fmerge.appendChild(n);
  });
  filt.appendChild(fblur);
  filt.appendChild(fmerge);
  defs.appendChild(filt);
  svg.appendChild(defs);
  container.appendChild(svg);

  // ── buildSet: crea el <g> de un set con px reales ──────────────────
  function buildSet(setDef) {
    const setG = document.createElementNS(NS, 'g');
    setG.style.opacity = '0';
    setG.style.transition = `opacity ${T_FADE / 1000}s ease-in-out`;

    setDef.forEach((constellation, ci) => {
      // Convertir fracciones a px
      const pts = constellation.stars.map(s => ({ x: s.fx * W, y: s.fy * H, r: s.r }));

      // Líneas: se trazan con animación stroke-dashoffset
      constellation.lines.forEach(([a, b], li) => {
        const p1   = pts[a], p2 = pts[b];
        const len  = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', p1.x.toFixed(1));
        line.setAttribute('y1', p1.y.toFixed(1));
        line.setAttribute('x2', p2.x.toFixed(1));
        line.setAttribute('y2', p2.y.toFixed(1));
        line.setAttribute('stroke',           'rgba(180,210,255,0.35)');
        line.setAttribute('stroke-width',     '0.8');
        line.setAttribute('stroke-linecap',   'round');
        line.setAttribute('fill',             'none');
        line.setAttribute('stroke-dasharray', len.toFixed(1));
        line.setAttribute('stroke-dashoffset',len.toFixed(1));
        // Animación de trazo inline — no depende de ninguna clase CSS
        const delay = ci * 400 + li * 180; // ms
        line.style.animation = `drawLine 2s ease-out ${delay}ms forwards`;
        setG.appendChild(line);
      });

      // Estrellas: fade-in inline
      pts.forEach((p, si) => {
        const star  = constellation.stars[si];
        const circle = document.createElementNS(NS, 'circle');
        circle.setAttribute('cx', p.x.toFixed(1));
        circle.setAttribute('cy', p.y.toFixed(1));
        circle.setAttribute('r',  p.r.toFixed(1));
        circle.setAttribute('fill', 'rgba(230,240,255,0.90)');
        if (star.r >= 1.8) circle.setAttribute('filter', 'url(#sg)');
        const delay = ci * 400 + si * 90;
        circle.style.cssText = `opacity:0;animation:starFadeIn 1s ease-out ${delay}ms forwards`;
        // Shimmer tras fade-in
        setTimeout(() => {
          if (!circle.isConnected) return;
          const dur = (4 + si * 0.5).toFixed(1);
          circle.style.animation = `constShimmer ${dur}s ease-in-out infinite`;
        }, T_DRAW + 300);
        setG.appendChild(circle);
      });
    });

    return setG;
  }

  // ── Ciclo ──────────────────────────────────────────────────────────
  let currentSet = 0;

  function runSet(index) {
    const setG = buildSet(SETS[index]);
    svg.appendChild(setG);

    // Doble rAF: garantiza que el navegador pintó opacity:0 antes de subirla
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setG.style.opacity = '1';
    }));

    // Tras T_DRAW + T_HOLD: fade-out
    state.starCycleTimer = setTimeout(() => {
      setG.style.opacity = '0';

      // Tras T_FADE: eliminar y pasar al siguiente
      state.starCycleTimer = setTimeout(() => {
        svg.removeChild(setG);
        state.starCycleTimer = setTimeout(() => {
          currentSet = (currentSet + 1) % SETS.length;
          runSet(currentSet);
        }, T_GAP);
      }, T_FADE);

    }, T_DRAW + T_HOLD);
  }

  runSet(0);

  // ── Estrellas de fondo fijas (div.star) ───────────────────────────
  if (!state.reducedMotion) {
    const density = PERF_PROFILE.lowPower ? 52 : 38;
    const cap = PERF_PROFILE.lowPower ? 24 : 36;
    const N = Math.min(cap, Math.round(W / density));
    for (let i = 0; i < N; i++) {
      const dot = document.createElement('div');
      dot.className = 'star';
      const sz = rand(0.8, 2);
      Object.assign(dot.style, {
        width: `${sz}px`, height: `${sz}px`,
        top:   `${rand(0,100)}%`, left: `${rand(0,100)}%`,
        '--dur':    `${rand(3,7)}s`,
        '--delay':  `${rand(0,6)}s`,
        '--min-op': `${rand(0.08,0.35)}`,
      });
      container.appendChild(dot);
    }
  }
} // fin createStars


function createSeaParticles() {
  const container = clearContainer('sea-particles');
  if (!container || state.reducedMotion) return;

  const divisor = PERF_PROFILE.lowPower ? 42 : 30;
  const cap = PERF_PROFILE.lowPower ? 24 : 36;
  const count = Math.min(cap, Math.round(window.innerWidth / divisor));

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'sea-particle';
    const size = rand(3, 14);

    Object.assign(particle.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${rand(0, 100)}%`,
      bottom: `${rand(0, 20)}%`,
      background: `rgba(${Math.round(rand(40, 120))}, ${Math.round(rand(160, 220))}, ${Math.round(rand(180, 240))}, ${rand(0.2, 0.5)})`,
      '--dur': `${rand(6, 18)}s`,
      '--delay': `${rand(0, 10)}s`,
    });

    container.appendChild(particle);
  }
}

function createAshParticles() {
  const container = clearContainer('ash-particles');
  if (!container || state.reducedMotion) return;

  const divisor = PERF_PROFILE.lowPower ? 46 : 34;
  const cap = PERF_PROFILE.lowPower ? 22 : 32;
  const count = Math.min(cap, Math.round(window.innerWidth / divisor));

  for (let i = 0; i < count; i++) {
    const ash = document.createElement('div');
    ash.className = 'ash-particle';
    const size = rand(2, 8);

    Object.assign(ash.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${rand(0, 100)}%`,
      top: `${rand(-20, 10)}%`,
      background: `rgba(${Math.round(rand(150, 220))}, ${Math.round(rand(60, 120))}, ${Math.round(rand(40, 80))}, ${rand(0.3, 0.6)})`,
      '--dur': `${rand(10, 25)}s`,
      '--delay': `${rand(0, 15)}s`,
      borderRadius: rand(0, 1) > 0.5 ? '50%' : `${rand(20, 50)}%`,
    });

    container.appendChild(ash);
  }
}

function createWaveBubbles() {
  const container = clearContainer('wave-bubbles');
  if (!container || state.reducedMotion) return;

  const divisor = PERF_PROFILE.lowPower ? 72 : 56;
  const cap = PERF_PROFILE.lowPower ? 10 : 16;
  const count = Math.min(cap, Math.round(window.innerWidth / divisor));

  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('div');
    const size = rand(4, 20);

    Object.assign(bubble.style, {
      position: 'absolute',
      borderRadius: '50%',
      width: `${size}px`,
      height: `${size}px`,
      left: `${rand(0, 100)}%`,
      bottom: `${rand(0, 50)}%`,
      background: `rgba(100, 200, 230, ${rand(0.1, 0.3)})`,
      border: `1px solid rgba(150, 220, 240, ${rand(0.3, 0.6)})`,
      animation: `bubbleRise ${rand(4, 12)}s ease-in infinite`,
      animationDelay: `${rand(0, 8)}s`,
    });

    container.appendChild(bubble);
  }
}

function smoothScrollTo(target) {
  target.scrollIntoView({
    behavior: state.reducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
}

function initNav() {
  const body = document.body;
  const nav = document.getElementById('main-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = Array.from(document.querySelectorAll('.world-section'));

  if (!nav || !navToggle || !navLinks.length) return {};

  const closeNav = () => {
    body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  };

  const toggleNav = () => {
    const open = body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  navToggle.addEventListener('click', toggleNav);

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      closeNav();
      smoothScrollTo(target);
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeNav();
  });

  return {
    update(scrollY) {
      nav.classList.toggle('scrolled', scrollY > 80);

      // currentId = null mientras no haya una sección claramente centrada.
      // Antes se inicializaba con sections[0].id, lo que hacía que "Olimpo"
      // quedara activo durante las zonas de transición (donde ninguna sección
      // cumple la condición). Con null, los enlaces se desactivan todos
      // en las transiciones — comportamiento correcto.
      let currentId = null;
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.35) {
          currentId = section.id;
        }
      });

      navLinks.forEach(link => {
        const isActive = currentId !== null && link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    },
  };
}

function initCardAnimations() {
  const cards = document.querySelectorAll('.info-card');
  if (!cards.length) return;
  if (state.reducedMotion) {
    cards.forEach(card => card.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
  });

  cards.forEach(card => observer.observe(card));
}

function initHeroEffects() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle || state.reducedMotion) return;

  heroTitle.addEventListener('mouseenter', () => {
    heroTitle.style.filter = 'drop-shadow(0 0 30px rgba(232,200,74,0.6))';
  });

  heroTitle.addEventListener('mouseleave', () => {
    heroTitle.style.filter = '';
  });
}

function initBackToTop() {
  let btn = document.getElementById('back-to-top');

  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.type = 'button';
    btn.textContent = '↑ Volver al Olimpo';
    btn.setAttribute('aria-label', 'Volver al inicio');
    document.body.appendChild(btn);
  }

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: state.reducedMotion ? 'auto' : 'smooth',
    });
  });

  return {
    update() {
      const underworld = document.getElementById('underworld');
      if (!underworld) return;
      const rect = underworld.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * 0.75;
      btn.classList.toggle('is-visible', visible);
    },
  };
}

/* ================================================================
   SISTEMA DE AUDIO AMBIENTAL — 5 zonas con MP3 reales
   ================================================================
   Sin Web Audio API. Volumen controlado directamente con audioEl.volume.
   Crossfade mediante interpolación lineal con setInterval (20ms).

   Cada zona tiene su elemento <audio> en loop.
   Al cambiar de zona: fade out del actual + fade in del nuevo
   durante FADE_MS milisegundos.
================================================================ */
function initAmbientSound() {
  /* El botón vive en el nav del HTML, no se crea dinámicamente */
  const btn = document.getElementById('ambient-btn');
  if (!btn) return; // salvaguarda por si el HTML cambia

  const TRACKS = [
    { id: 'hero',       file: 'cabecera.mp3'  },
    { id: 'olympus',    file: 'Olimpo.mp3'    },
    { id: 'earth',      file: 'Tierra.mp3'    },
    { id: 'sea',        file: 'Oceano.mp3'    },
    { id: 'underworld', file: 'Inframundo.mp3'},
  ];

  const MAX_VOL  = 0.85; // volumen máximo de la pista activa
  const FADE_MS  = 4000; // duración del crossfade en ms
  const TICK_MS  = 50;   // intervalo del fade (ms entre pasos)

  // layers[i] = { id, audioEl, targetVol, currentVol }
  let layers        = [];
  let currentZoneId = null;
  let fadeInterval  = null;
  let sectionObserver = null;
  let started       = false; // true tras el primer play()

  /* ── Crear los elementos <audio> al arrancar ──────────────────── */
  // Se crean inmediatamente pero no se descargan (preload=none)
  // ni se reproducen hasta que el usuario pulse el botón.
  function buildLayers() {
    if (layers.length) return;
    layers = TRACKS.map(({ id, file }) => {
      const audioEl   = new Audio(file);
      audioEl.loop    = true;
      audioEl.preload = 'none';
      audioEl.volume  = 0;
      return { id, audioEl, targetVol: 0, currentVol: 0 };
    });
  }

  /* ── Motor de fade: corre cada TICK_MS ms ─────────────────────── */
  // Mueve currentVol de cada layer hacia su targetVol en pasos lineales.
  // El paso por tick = MAX_VOL / (FADE_MS / TICK_MS).
  function startFadeLoop() {
    if (fadeInterval) return;
    const step = MAX_VOL / (FADE_MS / TICK_MS);
    fadeInterval = setInterval(() => {
      let allSettled = true;
      layers.forEach(layer => {
        if (Math.abs(layer.currentVol - layer.targetVol) < 0.001) {
          layer.currentVol = layer.targetVol;
        } else {
          allSettled = false;
          layer.currentVol += layer.currentVol < layer.targetVol ? step : -step;
          layer.currentVol  = Math.max(0, Math.min(MAX_VOL, layer.currentVol));
        }
        layer.audioEl.volume = layer.currentVol;
      });
      // Cuando todo está estable podemos ralentizar, pero es más simple dejarlo correr
    }, TICK_MS);
  }

  function stopFadeLoop() {
    if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; }
  }

  /* ── crossfadeTo ──────────────────────────────────────────────── */
  function crossfadeTo(zoneId) {
    if (!started || zoneId === currentZoneId) return;
    currentZoneId = zoneId;
    layers.forEach(layer => {
      layer.targetVol = (layer.id === zoneId) ? MAX_VOL : 0;
    });
    startFadeLoop();
  }

  /* ── watchZones ───────────────────────────────────────────────── */
  function watchZones() {
    if (sectionObserver) return;
    const hero = document.querySelector('.hero-intro') ||
                 document.getElementById('top');
    const sections = Array.from(document.querySelectorAll('.world-section[id]'));
    const els = [hero, ...sections].filter(Boolean);

    const ratioMap = new Map();
    els.forEach(el => ratioMap.set(el.id || 'hero', 0));

    sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(e => ratioMap.set(e.target.id || 'hero', e.intersectionRatio));
      let bestId = null, bestRatio = 0;
      ratioMap.forEach((r, id) => { if (r > bestRatio) { bestRatio = r; bestId = id; } });
      if (bestId && bestRatio > 0.05) crossfadeTo(bestId);
    }, {
      rootMargin: '-20% 0px -20% 0px',
      threshold:  [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0],
    });
    els.forEach(el => sectionObserver.observe(el));
  }

  /* ── stopAmbient ──────────────────────────────────────────────── */
  const stopAmbient = () => {
    stopFadeLoop();
    layers.forEach(layer => {
      layer.targetVol  = 0;
      layer.currentVol = 0;
      layer.audioEl.volume = 0;
      layer.audioEl.pause();
    });
    started = false;
    currentZoneId = null;
    btn.querySelector('.ambient-label').textContent = 'Ambiente';
    btn.classList.remove('is-active');
    btn.setAttribute('aria-pressed', 'false');
  };

  /* ── startAmbient ─────────────────────────────────────────────── */
  const startAmbient = async () => {
    buildLayers();

    // Detectar zona visible
    const allEls = [
      document.querySelector('.hero-intro'),
      ...Array.from(document.querySelectorAll('.world-section[id]')),
    ].filter(Boolean);

    let dominantId = 'hero', maxVisible = 0;
    allEls.forEach(el => {
      const r = el.getBoundingClientRect();
      const v = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
      if (v > maxVisible) { maxVisible = v; dominantId = el.id || 'hero'; }
    });
    currentZoneId = dominantId;

    // Poner volumen objetivo: activo MAX_VOL, resto 0
    layers.forEach(layer => {
      layer.targetVol  = (layer.id === dominantId) ? MAX_VOL : 0;
      layer.currentVol = 0;
      layer.audioEl.volume = 0;
    });

    // Reproducir todos (los silenciados no se oirán)
    await Promise.all(layers.map(async layer => {
      try {
        await layer.audioEl.play();
      } catch (e) {
        console.warn('play() error:', layer.id, e.message);
      }
    }));

    started = true;
    startFadeLoop(); // sube gradualmente el layer activo desde 0 → MAX_VOL

    btn.querySelector('.ambient-label').textContent = 'Silenciar';
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');

    watchZones();
  };

  /* ── Botón toggle ─────────────────────────────────────────────── */
  btn.addEventListener('click', async () => {
    if (started) {
      stopAmbient();
    } else {
      try {
        await startAmbient();
      } catch (err) {
        console.error('Audio error:', err);
        btn.querySelector('.ambient-label').textContent = 'Ambiente';
        btn.classList.remove('is-active');
      }
    }
  });
}


function initScrollScene() {
  const parthenon = document.getElementById('parthenon-bg');
  const figureShells = Array.from(document.querySelectorAll('.figure-shell[data-parallax-factor]'));
  const sections = Array.from(document.querySelectorAll('.world-section'));
  const hero = document.querySelector('.hero-intro');
  const transitionZones = Array.from(document.querySelectorAll('.transition-zone'));
  const navModule = initNav();
  const backToTopModule = initBackToTop();

  const clamp01 = value => Math.max(0, Math.min(1, value));
  const smoother = value => {
    const t = clamp01(value);
    return t * t * (3 - 2 * t);
  };
  const px = value => `${value.toFixed(2)}px`;
  const num = value => value.toFixed(4);
  const deg = value => `${value.toFixed(2)}deg`;
  const vw = value => `${value.toFixed(2)}vw`;

  function setVars(el, vars) {
    Object.entries(vars).forEach(([name, value]) => {
      if (el.style.getPropertyValue(name) !== value) {
        el.style.setProperty(name, value);
      }
    });
  }

  function getPassProgress(rect) {
    return clamp01((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
  }

  function getCenterPower(rect, spread = 0.72) {
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - window.innerHeight / 2);
    return smoother(1 - clamp01(distance / (window.innerHeight * spread)));
  }

  function resetHeroDepth() {
    if (!hero) return;
    setVars(hero, {
      '--hero-text-y': '0px',
      '--hero-text-z': '0px',
      '--hero-text-scale': '1',
      '--hero-text-tilt': '0deg',
      '--hero-text-opacity': '1',
      '--hero-stars-y': '0px',
      '--hero-stars-z': '0px',
      '--hero-stars-scale': '1',
      '--hero-stars-opacity': '1',
      '--hero-column-y': '0px',
      '--hero-column-z': '0px',
      '--hero-column-scale': '1',
      '--hero-left-x': '0px',
      '--hero-right-x': '0px',
      '--hero-left-rot': '0deg',
      '--hero-right-rot': '0deg',
      '--hero-glow-y': '0px',
      '--hero-glow-blur': '0px',
      '--hero-glow-alpha': '0',
      '--hero-bottom-fade-opacity': '0',
    });
  }

  function applyHeroDepth() {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const exit = smoother(clamp01(-rect.top / Math.max(rect.height * 1.18, 1)));
    const textFade = smoother(clamp01((exit - 0.3) / 0.5));
    const starFade = smoother(clamp01((exit - 0.42) / 0.52));
    const starRush = smoother(clamp01(exit / 0.96));
    const centerHoldY = Math.max(0, Math.min(-rect.top * 0.22, window.innerHeight * 0.16));

    setVars(hero, {
      '--hero-text-y': px(centerHoldY + lerp(0, -16, exit)),
      '--hero-text-z': px(lerp(0, 420, exit)),
      '--hero-text-scale': num(lerp(1, 1.28, exit)),
      '--hero-text-tilt': deg(lerp(0, -2.5, exit)),
      '--hero-text-opacity': num(lerp(1, 0, textFade)),
      '--hero-stars-y': px(lerp(0, 86, starRush)),
      '--hero-stars-z': px(lerp(0, 420, starRush)),
      '--hero-stars-scale': num(lerp(1, 1.28, starRush)),
      '--hero-stars-opacity': num(lerp(1, 0.16, starFade)),
      '--hero-column-y': px(lerp(0, 74, exit)),
      '--hero-column-z': px(lerp(0, 300, exit)),
      '--hero-column-scale': num(lerp(1, 1.18, exit)),
      '--hero-left-x': px(lerp(0, -48, exit)),
      '--hero-right-x': px(lerp(0, 48, exit)),
      '--hero-left-rot': deg(lerp(0, -8, exit)),
      '--hero-right-rot': deg(lerp(0, 8, exit)),
      '--hero-glow-y': px(lerp(0, 18, exit)),
      '--hero-glow-blur': px(lerp(0, 38, exit)),
      '--hero-glow-alpha': num(lerp(0, 0.32, exit)),
      '--hero-bottom-fade-opacity': num(smoother(clamp01((exit - 0.16) / 0.36))),
    });
  }

  function resetSectionDepth(section) {
    const inner = section.querySelector('.section-inner');
    if (inner) {
      inner.style.transform = '';
      inner.style.opacity = '';
    }
    setVars(section, {
      '--badge-y': '0px',
      '--badge-z': '0px',
      '--badge-scale': '1',
      '--title-y': '0px',
      '--title-z': '0px',
      '--title-scale': '1',
      '--cards-y': '0px',
      '--cards-z': '0px',
      '--cards-scale': '1',
      '--cards-tilt': '0deg',
      '--card-visible-y': '0px',
      '--card-z': '0px',
      '--card-tilt': '0deg',
      '--card-scale': '1',
    });
  }

  function applySectionDepth(section) {
    const inner = section.querySelector('.section-inner');
    if (!inner) return;

    const rect = section.getBoundingClientRect();
    if (rect.bottom < -260 || rect.top > window.innerHeight + 260) return;

    const centerPower = getCenterPower(rect);
    const enter = smoother(clamp01((window.innerHeight - rect.top) / (window.innerHeight * 0.9)));
    const leave = smoother(clamp01((-rect.top) / Math.max(rect.height * 0.82, 1)));
    const depthPush = smoother(clamp01((centerPower + enter * 0.55) / 1.55));

    const y = lerp(80, -18, enter) - leave * 70;
    const z = lerp(-260, 150, depthPush) + centerPower * 95 - leave * 180;
    const scale = lerp(0.88, 1.055, centerPower) - leave * 0.035;
    const tilt = lerp(6, -3, enter) + leave * 5;
    const opacity = Math.max(0.68, lerp(0.74, 1, centerPower) - leave * 0.16);

    inner.style.transform = `translate3d(0, ${px(y)}, ${px(z)}) rotateX(${deg(tilt)}) scale(${num(scale)})`;
    inner.style.opacity = num(opacity);

    setVars(section, {
      '--badge-y': px(lerp(22, -18, enter) - leave * 26),
      '--badge-z': px(lerp(-90, 210, centerPower)),
      '--badge-scale': num(lerp(0.96, 1.05, centerPower)),
      '--title-y': px(lerp(36, -12, enter) - leave * 48),
      '--title-z': px(lerp(-120, 260, centerPower)),
      '--title-scale': num(lerp(0.94, 1.075, centerPower)),
      '--cards-y': px(lerp(74, 8, enter) - leave * 58),
      '--cards-z': px(lerp(-180, 190, centerPower)),
      '--cards-scale': num(lerp(0.94, 1.035, centerPower)),
      '--cards-tilt': deg(lerp(7, -2, enter) + leave * 4),
      '--card-visible-y': px(lerp(12, -6, centerPower)),
      '--card-z': px(lerp(-42, 80, centerPower)),
      '--card-tilt': deg(lerp(2.5, -1.5, centerPower)),
      '--card-scale': num(lerp(0.985, 1.015, centerPower)),
    });
  }

  function resetTransitionDepth(zone) {
    setVars(zone, {
      '--transition-y': '0px',
      '--transition-z': '0px',
      '--transition-label-y': '0px',
      '--transition-label-z': '0px',
      '--transition-label-scale': '1',
      '--curtain-left-x': '0vw',
      '--curtain-right-x': '0vw',
      '--curtain-z': '0px',
      '--curtain-left-rot': '0deg',
      '--curtain-right-rot': '0deg',
      '--gate-fall-y': '0px',
      '--gate-z': '0px',
      '--gate-star-scale': '1',
      '--gate-star-opacity': '0.85',
      '--underworld-veil-opacity': '0.38',
      '--underworld-veil-scale': '1',
      '--foam-y': '0px',
      '--foam-z': '0px',
      '--foam-opacity': '0.45',
      '--foam-soft-opacity': '0.32',
    });
  }

  function applyTransitionDepth(zone) {
    const rect = zone.getBoundingClientRect();
    if (rect.bottom < -220 || rect.top > window.innerHeight + 220) return;

    const pass = getPassProgress(rect);
    const open = smoother(clamp01((pass - 0.12) / 0.72));
    const centerPower = getCenterPower(rect, 0.62);
    const fall = smoother(pass);
    const cameraZ = lerp(-220, 260, centerPower);

    const baseVars = {
      '--transition-y': px(lerp(-64, 86, fall)),
      '--transition-z': px(cameraZ),
      '--transition-label-y': px(lerp(-38, 54, fall)),
      '--transition-label-z': px(lerp(-90, 220, centerPower)),
      '--transition-label-scale': num(lerp(0.9, 1.1, centerPower)),
      '--curtain-left-x': vw(lerp(0, -42, open)),
      '--curtain-right-x': vw(lerp(0, 42, open)),
      '--curtain-z': px(lerp(210, -70, open) + centerPower * 120),
      '--curtain-left-rot': deg(lerp(0, -17, open)),
      '--curtain-right-rot': deg(lerp(0, 17, open)),
    };

    if (zone.id === 'transition-olympus') {
      setVars(zone, {
        ...baseVars,
        '--gate-fall-y': px(lerp(8, 120, fall)),
        '--gate-z': px(lerp(-180, 250, centerPower)),
        '--gate-star-scale': num(lerp(0.75, 1.45, centerPower)),
        '--gate-star-opacity': num(lerp(0.38, 1, centerPower)),
      });
      return;
    }

    if (zone.id === 'transition-clouds') {
      setVars(zone, {
        ...baseVars,
        '--curtain-left-x': vw(lerp(0, -50, open)),
        '--curtain-right-x': vw(lerp(0, 50, open)),
        '--curtain-z': px(lerp(260, -120, open) + centerPower * 120),
      });
      return;
    }

    if (zone.id === 'transition-water') {
      const foam = smoother(clamp01((pass - 0.18) / 0.5));
      setVars(zone, {
        ...baseVars,
        '--curtain-left-x': vw(lerp(0, -46, open)),
        '--curtain-right-x': vw(lerp(0, 46, open)),
        '--curtain-z': px(lerp(300, -80, open) + centerPower * 150),
        '--foam-y': px(lerp(-32, 78, foam)),
        '--foam-z': px(lerp(160, 420, centerPower)),
        '--foam-opacity': num(lerp(0.16, 0.72, centerPower)),
        '--foam-soft-opacity': num(lerp(0.1, 0.5, centerPower)),
      });
      return;
    }

    if (zone.id === 'transition-earth') {
      const veil = smoother(clamp01((pass - 0.04) / 0.58));
      const lateFade = smoother(clamp01((pass - 0.78) / 0.2));
      setVars(zone, {
        ...baseVars,
        '--curtain-left-x': '0vw',
        '--curtain-right-x': '0vw',
        '--curtain-z': px(lerp(80, -90, open) + centerPower * 80),
        '--curtain-left-rot': '0deg',
        '--curtain-right-rot': '0deg',
        '--transition-z': px(lerp(-160, 240, centerPower)),
        '--underworld-veil-opacity': num(lerp(0.18, 0.48, centerPower) * (1 - lateFade * 0.55)),
        '--underworld-veil-scale': num(lerp(0.92, 1.08, veil)),
      });
    }
  }

  const updateScene = () => {
    state.ticking = false;
    const scrollY = window.scrollY;

    navModule.update?.(scrollY);
    backToTopModule.update?.();

    if (parthenon) {
      const rect = parthenon.getBoundingClientRect();
      if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
        const offset = scrollY * 0.045;
        parthenon.style.transform = `translateX(-50%) translateY(${offset}px)`;
      }
    }

    if (!state.reducedMotion) {
      applyHeroDepth();
      transitionZones.forEach(applyTransitionDepth);

      figureShells.forEach(shell => {
        const factor = Number(shell.dataset.parallaxFactor || 0);
        const rect = shell.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;
        const centerOffset = (rect.top + rect.height / 2) - window.innerHeight / 2;
        const translateY = centerOffset * factor;
        shell.style.transform = `translateY(${translateY}px)`;
      });

      sections.forEach(applySectionDepth);
    } else {
      resetHeroDepth();
      transitionZones.forEach(resetTransitionDepth);
      figureShells.forEach(shell => { shell.style.transform = ''; });
      sections.forEach(resetSectionDepth);
    }
  };

  const requestUpdate = () => {
    if (state.ticking) return;
    state.ticking = true;
    window.requestAnimationFrame(updateScene);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  updateScene();

  return { updateScene, requestUpdate };
}

function regenerateParticles() {
  createStars();
  createSeaParticles();
  createAshParticles();
  createWaveBubbles();
}

function initMotionWatcher(updateScene) {
  const handleMotionChange = event => {
    state.reducedMotion = event.matches;
    CONFIG.reducedMotion = event.matches;
    CONFIG_3D.reducedMotion = event.matches;
    regenerateParticles();
    updateScene();
  };

  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', handleMotionChange);
  } else if (typeof motionQuery.addListener === 'function') {
    motionQuery.addListener(handleMotionChange);
  }
}

/*
 * initTransitionObserver
 * ──────────────────────
 * Observa cuándo cada zona de transición entra en el viewport
 * y anima su opacidad de 0.55 → 1.
 *
 * Por qué IntersectionObserver y no scroll:
 *   - No bloquea el hilo principal: el callback solo se dispara
 *     cuando el elemento cruza el umbral, no en cada pixel de scroll.
 *   - threshold:0.15 = se activa cuando el 15% de la zona es visible,
 *     dando tiempo suficiente para que la animación CSS complete.
 *
 * Por qué opacidad 0.55 en lugar de 0:
 *   - Las transiciones tienen elementos animados (nubes, olas, llamas)
 *     que nunca deben desaparecer del todo — solo atenuarse ligeramente
 *     para que el reveal al scrollear sea perceptible sin ser abrupto.
 */
function initTransitionObserver() {
  const zones = document.querySelectorAll('.transition-zone');
  if (!zones.length) return;

  // Estado inicial: ligeramente atenuado hasta que el usuario se acerque
  zones.forEach(zone => {
    zone.style.opacity = '0.55';
    // Transición CSS larga y suave para el reveal (1.2s con ease-out)
    zone.style.transition = 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Al entrar en viewport: opacidad completa → zona completamente viva
        entry.target.style.opacity = '1';
      } else {
        // Al salir: vuelve a atenuarse para que la próxima entrada tenga impacto
        entry.target.style.opacity = '0.55';
      }
    });
  }, {
    // El observer se dispara cuando el 15% del elemento es visible
    threshold: 0.15,
  });

  // Registrar cada zona de transición en el observer
  zones.forEach(zone => observer.observe(zone));
}

/*
 * initSliders
 * ───────────
 * Inicializa todos los sliders [data-slider] de la página.
 *
 * Estructura HTML esperada:
 *   .cards-slider[data-slider]
 *     .cards-track-window   ← overflow:hidden
 *       .cards-track        ← se mueve con translateX
 *         .cards-page × N   ← cada página de 3 tarjetas
 *     .slider-arrow.slider-prev
 *     .slider-arrow.slider-next
 *     .slider-dots
 *       .slider-dot × N
 *
 * Comportamiento:
 *   - Avance automático cada AUTO_MS ms (60 segundos).
 *   - El timer se reinicia si el usuario navega manualmente.
 *   - Las flechas aparecen al mover el ratón cerca del borde lateral.
 *   - Los puntos son clickables para ir a una página concreta.
 *   - Ciclo infinito: tras la última página vuelve a la primera.
 */
function initSliders() {
  const AUTO_MS     = 60_000; // ms entre cambios automáticos
  const EDGE_FRAC   = 0.25;   // fracción del ancho que activa la flecha (25% lateral)

  document.querySelectorAll('[data-slider]').forEach(slider => {
    // Envolver cards-track en cards-track-window si no está ya
    const track = slider.querySelector('.cards-track');
    if (!track) return;
    let window_ = slider.querySelector('.cards-track-window');
    if (!window_) {
      window_ = document.createElement('div');
      window_.className = 'cards-track-window';
      track.parentNode.insertBefore(window_, track);
      window_.appendChild(track);
    }

    const pages   = Array.from(track.querySelectorAll('.cards-page'));
    const dots    = Array.from(slider.querySelectorAll('.slider-dot'));
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const total   = pages.length;
    if (total <= 1) return;

    let current  = 0;
    let autoTimer = null;

    /* ── goTo: navegar a una página concreta ── */
    function goTo(index) {
      // Ciclo infinito
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;

      // Actualizar puntos
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));

      // Deshabilitar flechas en extremos (las oculta el CSS)
      // — ciclo infinito: nunca se deshabilitan
    }

    /* ── Navegación manual: reinicia el timer ── */
    function navigate(dir) {
      goTo(current + dir);
      resetTimer();
    }

    /* ── Timer automático ── */
    function resetTimer() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), AUTO_MS);
    }

    /* ── Botones ── */
    prevBtn?.addEventListener('click', () => navigate(-1));
    nextBtn?.addEventListener('click', () => navigate(1));

    /* ── Puntos clickables ── */
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    });

    /* ── Flechas fantasma: detectar posición del ratón ── */
    // Se añaden clases .show-prev / .show-next al slider según
    // si el cursor está en el tercio izquierdo o derecho.
    slider.addEventListener('mousemove', e => {
      const rect = slider.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const w    = rect.width;
      slider.classList.toggle('show-prev', x < w * EDGE_FRAC);
      slider.classList.toggle('show-next', x > w * (1 - EDGE_FRAC));
    });

    slider.addEventListener('mouseleave', () => {
      slider.classList.remove('show-prev', 'show-next');
    });

    /* ── Pausa el auto-avance cuando el slider es visible ── */
    // No queremos que avance mientras la sección no está en pantalla.
    const visObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        resetTimer();
      } else {
        clearInterval(autoTimer);
      }
    }, { threshold: 0.3 });
    visObs.observe(slider);

    // Arrancar en página 0
    goTo(0);
  });
}

/*
 * initCursorFX
 * ────────────
 * Emite partículas temáticas según la zona donde está el cursor.
 *
 * Zonas y partículas:
 *   hero        → estrellas (✦ pequeñas, blancas/doradas)
 *   olympus     → ráfagas de aire (arcos blancos tenues)
 *   earth       → hojitas (elipses verdes/doradas rotadas)
 *   sea         → burbujas (círculos translúcidos azules)
 *   underworld  → brasas de fuego (puntos naranja/rojo)
 *   transición  → sin efecto
 *
 * Arquitectura:
 *   - Un único <canvas> fijo sobre toda la página (z-index alto,
 *     pointer-events:none para no interferir con clics).
 *   - Pool de objetos Particle reutilizables (evita GC continuo).
 *   - mousemove detecta la zona activa mirando qué elemento está
 *     bajo el cursor con elementFromPoint, sube por el DOM hasta
 *     encontrar una sección conocida o el hero.
 *   - Emisión: solo se crean 1-2 partículas por evento mousemove,
 *     con throttle de 40ms para mantener el efecto muy sutil.
 *   - rAF loop: actualiza posición/opacidad y dibuja. Se detiene
 *     solo si no hay partículas vivas.
 *
 * Todas las partículas son muy pequeñas (2-5px), baja opacidad
 * (máx 0.35) y vida corta (600-900ms) para el efecto "casi imperceptible".
 */
function initCursorFX() {
  if (state.reducedMotion || !PERF_PROFILE.finePointer) return;

  const isConstrained = PERF_PROFILE.lowPower || PERF_PROFILE.compactScreen;
  const MAX_ALPHA = isConstrained ? 0.18 : 0.24;

  // ── Canvas fijo sobre toda la página ─────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:fixed',
    'inset:0',
    'width:100%',
    'height:100%',
    'pointer-events:none',   // no intercepta clics ni hover
    'z-index:9998',          // por encima de todo excepto modales
  ].join(';');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // ── Detección de zona ─────────────────────────────────────────────
  /*
   * Sube por el árbol DOM desde el elemento bajo el cursor hasta
   * encontrar un id de zona conocido. Devuelve el id o null si
   * el cursor está en una zona de transición o fuera de secciones.
   */
  const ZONE_IDS = new Set(['hero', 'olympus', 'earth', 'sea', 'underworld']);

  function getZone(x, y) {
    let el = document.elementFromPoint(x, y);
    while (el && el !== document.body) {
      const id = el.id || el.dataset.zone;
      if (ZONE_IDS.has(id)) return id;
      // El hero no tiene id propio en el element, detectarlo por clase
      if (el.classList.contains('hero-intro')) return 'hero';
      el = el.parentElement;
    }
    return null;
  }

  // ── Pool de partículas ────────────────────────────────────────────
  /*
   * Cada partícula tiene:
   *   x, y       posición actual
   *   vx, vy     velocidad (px/frame)
   *   life       0-1: fracción de vida restante (1=recién nacida, 0=muerta)
   *   decay      cuánto baja life por frame
   *   size       radio o tamaño base
   *   zone       zona que la generó (determina cómo se dibuja)
   *   angle      para ráfagas y hojas (rotación)
   *   spin       velocidad angular
   */
  const POOL_SIZE = isConstrained ? 36 : 56;
  const pool      = Array.from({ length: POOL_SIZE }, () => ({ life: 0 }));

  function spawn(x, y, zone) {
    // Buscar partícula muerta en el pool
    const p = pool.find(p => p.life <= 0);
    if (!p) return;

    p.x     = x + (Math.random() - 0.5) * 6;
    p.y     = y + (Math.random() - 0.5) * 6;
    p.zone  = zone;
    p.life  = 1;
    p.angle = Math.random() * Math.PI * 2;
    p.spin  = (Math.random() - 0.5) * 0.15;

    switch (zone) {
      case 'hero': // estrellas: suben lentamente y se expanden
        p.size  = Math.random() * 1.1 + 0.7;
        p.vx    = (Math.random() - 0.5) * 0.45;
        p.vy    = -(Math.random() * 0.65 + 0.25);
        p.decay = 0.026 + Math.random() * 0.01;
        break;
      case 'olympus': // ráfagas de aire: se dispersan horizontalmente
        p.size  = Math.random() * 3.5 + 2.6;   // longitud del arco
        p.vx    = (Math.random() - 0.5) * 1.8;
        p.vy    = (Math.random() - 0.5) * 0.55;
        p.decay = 0.032 + Math.random() * 0.012;
        break;
      case 'earth': // hojas: caen con ligera rotación
        p.size  = Math.random() * 1.2 + 1.0;
        p.vx    = (Math.random() - 0.5) * 0.9;
        p.vy    = Math.random() * 0.55 + 0.22;
        p.decay = 0.024 + Math.random() * 0.01;
        break;
      case 'sea': // burbujas: suben flotando
        p.size  = Math.random() * 1.6 + 0.9;
        p.vx    = (Math.random() - 0.5) * 0.35;
        p.vy    = -(Math.random() * 0.75 + 0.3);
        p.decay = 0.022 + Math.random() * 0.01;
        break;
      case 'underworld': // brasas: suben y se desvían
        p.size  = Math.random() * 1.2 + 0.75;
        p.vx    = (Math.random() - 0.5) * 1.0;
        p.vy    = -(Math.random() * 0.85 + 0.35);
        p.decay = 0.028 + Math.random() * 0.012;
        break;
    }
  }

  // ── Dibujo de cada partícula ──────────────────────────────────────
  /*
   * La opacidad máxima es 0.32 — muy baja para que sea casi imperceptible.
   * Cada zona tiene su forma y color característico.
   */
  function drawParticle(p) {
    const alpha = p.life * MAX_ALPHA;
    if (alpha <= 0.005) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    switch (p.zone) {
      case 'hero': {
        // Estrella de 4 puntas pequeña
        const r1 = p.size, r2 = p.size * 0.4;
        ctx.fillStyle = Math.random() > 0.5 ? '#fff8d0' : '#ffffff';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r   = i % 2 === 0 ? r1 : r2;
          const ang = (i / 8) * Math.PI * 2;
          i === 0
            ? ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r)
            : ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'olympus': {
        // Arco tenue (ráfaga de viento)
        ctx.strokeStyle = 'rgba(220,235,255,1)';
        ctx.lineWidth   = 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 0.6);
        ctx.stroke();
        break;
      }
      case 'earth': {
        // Hoja: elipse rotada verde-dorada
        const hue = 60 + Math.random() * 60; // amarillo-verde
        ctx.fillStyle = `hsl(${hue},55%,45%)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'sea': {
        // Burbuja: círculo con borde translúcido
        ctx.strokeStyle = 'rgba(100,200,230,1)';
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.stroke();
        // Pequeño reflejo
        ctx.fillStyle = 'rgba(180,230,255,0.4)';
        ctx.beginPath();
        ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'underworld': {
        // Brasa: punto naranja con halo rojo
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
        gradient.addColorStop(0,   'rgba(255,160,30,1)');
        gradient.addColorStop(0.5, 'rgba(220,60,10,0.6)');
        gradient.addColorStop(1,   'rgba(180,20,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }

  // ── Loop de animación ─────────────────────────────────────────────
  let rafId   = null;
  let hasLive = false;

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasLive = false;

    pool.forEach(p => {
      if (p.life <= 0) return;
      hasLive = true;

      // Física
      p.x     += p.vx;
      p.y     += p.vy;
      p.angle += p.spin;
      p.life  -= p.decay;

      // Gravedad suave para hojas y brasas
      if (p.zone === 'earth')      p.vy += 0.015;
      if (p.zone === 'underworld') p.vx += (Math.random() - 0.5) * 0.08; // titileo lateral

      drawParticle(p);
    });

    // Continuar el loop solo mientras haya partículas vivas
    rafId = hasLive ? requestAnimationFrame(tick) : null;
  }

  function ensureLoop() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  // ── Throttle de emisión ───────────────────────────────────────────
  let lastEmit  = 0;
  const THROTTLE = isConstrained ? 110 : 84; // ms mínimos entre emisiones

  window.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastEmit < THROTTLE) return;
    lastEmit = now;

    const zone = getZone(e.clientX, e.clientY);
    if (!zone) return;

    // Emitir 1-2 partículas por evento (muy sutil)
    const count = 1;
    for (let i = 0; i < count; i++) spawn(e.clientX, e.clientY, zone);
    ensureLoop();
  }, { passive: true });
}

/*
 * initProgressBar
 * ───────────────
 * Barra de progreso horizontal en la parte superior que se desplaza
 * según el scroll de la página. Color dorado con efecto glow suave.
 */
function initProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;

  function updateProgressBar() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
  }

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar(); // Inicializar en caso de que la página comience con scroll
}

document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  regenerateParticles();
  initCardAnimations();
  initSliders();
  initHeroEffects();
  initAmbientSound();
  initTransitionObserver();
  initCursorFX();

  const scene = initScrollScene();
  initMotionWatcher(scene.updateScene);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      regenerateParticles();
      scene.requestUpdate();
    }, 250);
  }, { passive: true });
});
