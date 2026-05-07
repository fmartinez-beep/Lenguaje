/* ════════════════════════════════════════════════════════════════════════
   MITOLOGÍA GRIEGA — script.js
   Versión optimizada para entrega final de Lenguaje de Marcas
   - Navegación responsive + progreso de scroll
   - Carruseles accesibles
   - Partículas y atmósferas por mundo
   - Audio ambiental procedural sin archivos externos
   - Oráculo de Delfos con ranking local y preparación backend
   ════════════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const CONFIG = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    compactScreen: window.innerWidth < 900,
    finePointer: window.matchMedia('(pointer: fine)').matches,
    lowPower:
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) ||
      (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4),
  };

  const state = {
    scrollY: 0,
    ticking: false,
    activeZone: 'hero',
    starTimer: null,
  };

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * clamp(t);
  const rand = (min, max) => Math.random() * (max - min) + min;
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function smoothScrollTo(target) {
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  function clearContainer(id) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
    return el;
  }

  function setStyleVars(el, vars) {
    if (!el) return;
    Object.entries(vars).forEach(([key, value]) => el.style.setProperty(key, value));
  }

  /* ================================================================
     Barra de progreso
  ================================================================ */
  function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return { update() {} };

    return {
      update() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        progressBar.style.transform = `scaleX(${clamp(progress)})`;
      },
    };
  }

  /* ================================================================
     Navegación responsive y links activos
  ================================================================ */
  function initNav() {
    const body = document.body;
    const nav = document.getElementById('main-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const links = Array.from(document.querySelectorAll('.nav-links a'));
    const sections = Array.from(document.querySelectorAll('.world-section'));

    if (!nav || !links.length) return { update() {} };

    const closeNav = () => {
      body.classList.remove('nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', 'Abrir menú');
    };

    navToggle?.addEventListener('click', () => {
      const isOpen = body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    links.forEach(link => {
      link.addEventListener('click', event => {
        const href = link.getAttribute('href');
        if (!href?.startsWith('#')) return;
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
    }, { passive: true });

    return {
      update() {
        nav.classList.toggle('scrolled', window.scrollY > 80);

        let currentId = null;
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.46 && rect.bottom >= window.innerHeight * 0.36) {
            currentId = section.id;
            state.activeZone = section.id || 'hero';
          }
        });

        if (window.scrollY < window.innerHeight * 0.45) state.activeZone = 'hero';

        links.forEach(link => {
          const active = currentId && link.getAttribute('href') === `#${currentId}`;
          link.classList.toggle('active', Boolean(active));
          if (active) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      },
    };
  }

  /* ================================================================
     Botón volver arriba
  ================================================================ */
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
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });

    return {
      update() {
        btn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 1.2);
      },
    };
  }

  /* ================================================================
     Estrellas del hero y constelaciones SVG
  ================================================================ */
  function createStars() {
    const container = clearContainer('stars-container');
    if (!container) return;
    if (state.starTimer) clearTimeout(state.starTimer);

    const total = CONFIG.compactScreen || CONFIG.lowPower ? 52 : 96;
    for (let i = 0; i < total; i += 1) {
      const star = document.createElement('span');
      star.className = 'star';
      const size = rand(1, 3.2);
      star.style.cssText = `
        left:${rand(0, 100)}%; top:${rand(0, 100)}%;
        width:${size}px; height:${size}px;
        --dur:${rand(2.5, 6).toFixed(2)}s;
        --delay:${rand(0, 5).toFixed(2)}s;
        --min-op:${rand(0.15, 0.55).toFixed(2)};
      `;
      container.appendChild(star);
    }

    if (prefersReducedMotion()) return;
    createConstellationCycle(container);
  }

  function createConstellationCycle(container) {
    const sets = [
      {
        name: 'Orion',
        points: [[14, 18], [21, 14], [18, 28], [15, 38], [24, 38], [20, 49], [12, 50]],
        lines: [[0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 6]],
      },
      {
        name: 'Perseo',
        points: [[75, 16], [81, 11], [88, 15], [79, 27], [72, 34], [86, 36]],
        lines: [[0, 1], [1, 2], [0, 3], [3, 4], [3, 5]],
      },
      {
        name: 'Casiopea',
        points: [[25, 72], [34, 65], [43, 72], [52, 64], [61, 70]],
        lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
      },
    ];

    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.8;';
    container.appendChild(svg);

    let index = 0;
    const draw = () => {
      svg.innerHTML = '';
      const set = sets[index];
      const group = document.createElementNS(NS, 'g');
      group.style.opacity = '0';
      group.style.transition = 'opacity 1.2s ease';
      svg.appendChild(group);

      set.lines.forEach(([a, b], lineIndex) => {
        const [x1, y1] = set.points[a];
        const [x2, y2] = set.points[b];
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', 'rgba(180,210,255,0.34)');
        line.setAttribute('stroke-width', '0.12');
        line.setAttribute('stroke-linecap', 'round');
        const len = Math.hypot(x2 - x1, y2 - y1);
        line.style.strokeDasharray = len;
        line.style.strokeDashoffset = len;
        line.style.animation = `drawLine 1.8s ease ${lineIndex * 140}ms forwards`;
        group.appendChild(line);
      });

      set.points.forEach(([x, y], pointIndex) => {
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
        dot.setAttribute('r', pointIndex % 2 ? '0.24' : '0.34');
        dot.setAttribute('fill', 'rgba(240,248,255,0.92)');
        dot.style.opacity = '0';
        dot.style.animation = `starFadeIn .9s ease ${pointIndex * 90}ms forwards`;
        group.appendChild(dot);
      });

      requestAnimationFrame(() => { group.style.opacity = '1'; });
      state.starTimer = window.setTimeout(() => {
        group.style.opacity = '0';
        state.starTimer = window.setTimeout(() => {
          index = (index + 1) % sets.length;
          draw();
        }, 1400);
      }, 7000);
    };

    draw();
  }

  /* ================================================================
     Partículas decorativas
  ================================================================ */
  function createParticle(container, className, options = {}) {
    const particle = document.createElement('span');
    particle.className = className;
    const size = rand(options.minSize ?? 3, options.maxSize ?? 9);
    const verticalPosition = options.useTop
      ? `top:${rand(0, 100)}%;`
      : `bottom:${rand(-8, 18)}%;`;
    particle.style.cssText = `
      left:${rand(0, 100)}%;
      ${verticalPosition}
      width:${size}px;
      height:${size}px;
      --dur:${rand(options.minDur ?? 6, options.maxDur ?? 14).toFixed(2)}s;
      --delay:${rand(0, options.maxDelay ?? 8).toFixed(2)}s;
      opacity:${rand(options.minOpacity ?? 0.2, options.maxOpacity ?? 0.65).toFixed(2)};
    `;
    container.appendChild(particle);
  }

  function regenerateParticles() {
    const compact = window.innerWidth < 900 || CONFIG.lowPower;

    const sea = clearContainer('sea-particles');
    if (sea) {
      const count = compact ? 18 : 44;
      for (let i = 0; i < count; i += 1) createParticle(sea, 'sea-particle', { minSize: 3, maxSize: 10, minDur: 7, maxDur: 18 });
    }

    const ash = clearContainer('ash-particles');
    if (ash) {
      const count = compact ? 18 : 42;
      for (let i = 0; i < count; i += 1) createParticle(ash, 'ash-particle', { minSize: 2, maxSize: 6, minDur: 10, maxDur: 20, useTop: true, minOpacity: 0.12, maxOpacity: 0.48 });
    }

    const wave = clearContainer('wave-bubbles');
    if (wave) {
      const count = compact ? 10 : 22;
      for (let i = 0; i < count; i += 1) createParticle(wave, 'sea-particle', { minSize: 2, maxSize: 7, minDur: 4, maxDur: 12 });
    }

    const oracle = document.querySelector('.oracle-stars');
    if (oracle) {
      oracle.innerHTML = '';
      const count = compact ? 30 : 70;
      for (let i = 0; i < count; i += 1) {
        const star = document.createElement('span');
        star.className = 'oracle-star';
        star.style.cssText = `
          left:${rand(0, 100)}%; top:${rand(0, 100)}%;
          --s:${rand(1.5, 4.5).toFixed(1)}px;
          --o:${rand(0.18, 0.72).toFixed(2)};
          --dur:${rand(3, 7).toFixed(2)}s;
          --delay:${rand(0, 5).toFixed(2)}s;
        `;
        oracle.appendChild(star);
      }
    }
  }

  /* ================================================================
     Carruseles accesibles
  ================================================================ */
  function initSliders() {
    const AUTO_MS = 60000;
    const EDGE_FRAC = 0.24;

    document.querySelectorAll('[data-slider]').forEach((slider, sliderIndex) => {
      const track = slider.querySelector('.cards-track');
      if (!track) return;

      let viewport = slider.querySelector('.cards-track-window');
      if (!viewport) {
        viewport = document.createElement('div');
        viewport.className = 'cards-track-window';
        track.parentNode.insertBefore(viewport, track);
        viewport.appendChild(track);
      }

      const pages = Array.from(track.querySelectorAll('.cards-page'));
      const prevBtn = slider.querySelector('.slider-prev');
      const nextBtn = slider.querySelector('.slider-next');
      const dots = Array.from(slider.querySelectorAll('.slider-dot'));
      const total = pages.length;
      if (total <= 1) return;

      slider.setAttribute('role', 'region');
      slider.setAttribute('aria-label', `Carrusel de mitología ${sliderIndex + 1}`);
      viewport.setAttribute('aria-live', 'polite');

      const counter = document.createElement('div');
      counter.className = 'slider-counter';
      counter.setAttribute('aria-hidden', 'true');
      slider.appendChild(counter);

      let current = 0;
      let timer = null;
      let paused = false;

      const render = () => {
        track.style.transform = `translateX(-${current * 100}%)`;
        pages.forEach((page, i) => page.setAttribute('aria-hidden', String(i !== current)));
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === current);
          dot.setAttribute('aria-label', `Ir a la página ${i + 1} de ${total}`);
          dot.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
        counter.textContent = `${current + 1} / ${total}`;
      };

      const goTo = index => {
        current = ((index % total) + total) % total;
        render();
      };

      const resetTimer = () => {
        window.clearInterval(timer);
        if (prefersReducedMotion() || paused) return;
        timer = window.setInterval(() => goTo(current + 1), AUTO_MS);
      };

      const navigate = direction => {
        goTo(current + direction);
        resetTimer();
      };

      [prevBtn, nextBtn].forEach(btn => {
        if (!btn) return;
        btn.removeAttribute('tabindex');
        btn.type = 'button';
      });

      prevBtn?.addEventListener('click', () => navigate(-1));
      nextBtn?.addEventListener('click', () => navigate(1));

      dots.forEach((dot, i) => {
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.addEventListener('click', () => { goTo(i); resetTimer(); });
        dot.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            goTo(i);
            resetTimer();
          }
        });
      });

      slider.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') navigate(-1);
        if (event.key === 'ArrowRight') navigate(1);
      });

      slider.addEventListener('mouseenter', () => { paused = true; resetTimer(); });
      slider.addEventListener('mouseleave', () => { paused = false; resetTimer(); });
      slider.addEventListener('focusin', () => { paused = true; resetTimer(); });
      slider.addEventListener('focusout', () => { paused = false; resetTimer(); });

      if (CONFIG.finePointer) {
        slider.addEventListener('mousemove', event => {
          const rect = slider.getBoundingClientRect();
          const x = event.clientX - rect.left;
          slider.classList.toggle('show-prev', x < rect.width * EDGE_FRAC);
          slider.classList.toggle('show-next', x > rect.width * (1 - EDGE_FRAC));
        });
        slider.addEventListener('mouseleave', () => slider.classList.remove('show-prev', 'show-next'));
      }

      render();
      resetTimer();
    });
  }

  /* ================================================================
     Animación de entrada de tarjetas y secciones
  ================================================================ */
  function initCardAnimations() {
    const cards = document.querySelectorAll('.info-card, .oracle-panel, .backend-note');
    if (!cards.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      cards.forEach(card => card.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -70px 0px' });

    cards.forEach(card => observer.observe(card));
  }

  /* ================================================================
     Scroll cinematográfico: variables CSS ligeras
  ================================================================ */
  function initScrollScene(modules) {
    const hero = document.querySelector('.hero-intro');
    const sections = Array.from(document.querySelectorAll('.world-section'));
    const transitions = Array.from(document.querySelectorAll('.transition-zone'));

    const updateHero = () => {
      if (!hero || prefersReducedMotion()) return;
      const rect = hero.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(1, rect.height * 0.78));
      setStyleVars(hero, {
        '--hero-text-y': `${lerp(0, 80, progress).toFixed(1)}px`,
        '--hero-text-z': `${lerp(0, 180, progress).toFixed(1)}px`,
        '--hero-text-scale': lerp(1, 1.12, progress).toFixed(3),
        '--hero-text-tilt': `${lerp(0, -5, progress).toFixed(2)}deg`,
        '--hero-text-opacity': lerp(1, 0.2, progress).toFixed(3),
        '--hero-stars-y': `${lerp(0, -80, progress).toFixed(1)}px`,
        '--hero-stars-z': `${lerp(0, -120, progress).toFixed(1)}px`,
        '--hero-stars-scale': lerp(1, 1.18, progress).toFixed(3),
        '--hero-stars-opacity': lerp(1, 0.35, progress).toFixed(3),
        '--hero-column-y': `${lerp(0, 60, progress).toFixed(1)}px`,
        '--hero-column-z': `${lerp(0, 120, progress).toFixed(1)}px`,
        '--hero-column-scale': lerp(1, 1.06, progress).toFixed(3),
        '--hero-left-x': `${lerp(0, -24, progress).toFixed(1)}px`,
        '--hero-right-x': `${lerp(0, 24, progress).toFixed(1)}px`,
        '--hero-left-rot': `${lerp(0, 5, progress).toFixed(2)}deg`,
        '--hero-right-rot': `${lerp(0, -5, progress).toFixed(2)}deg`,
        '--hero-glow-y': `${lerp(0, 26, progress).toFixed(1)}px`,
        '--hero-glow-blur': `${lerp(0, 38, progress).toFixed(1)}px`,
        '--hero-glow-alpha': lerp(0, 0.24, progress).toFixed(3),
        '--hero-bottom-fade-opacity': clamp(progress * 1.25).toFixed(3),
      });
    };

    const updateSections = () => {
      if (prefersReducedMotion()) return;
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const centerDelta = (rect.top + rect.height * 0.5 - window.innerHeight * 0.5) / window.innerHeight;
        const active = 1 - clamp(Math.abs(centerDelta), 0, 1);
        const entry = clamp((window.innerHeight - rect.top) / Math.max(1, window.innerHeight * 0.8));

        setStyleVars(section, {
          '--badge-y': `${lerp(28, 0, entry).toFixed(1)}px`,
          '--badge-z': `${lerp(-60, 24, active).toFixed(1)}px`,
          '--badge-scale': lerp(0.96, 1.03, active).toFixed(3),
          '--title-y': `${lerp(40, 0, entry).toFixed(1)}px`,
          '--title-z': `${lerp(-80, 40, active).toFixed(1)}px`,
          '--title-scale': lerp(0.96, 1.035, active).toFixed(3),
          '--cards-y': `${lerp(54, 0, entry).toFixed(1)}px`,
          '--cards-z': `${lerp(-90, 32, active).toFixed(1)}px`,
          '--cards-scale': lerp(0.97, 1.015, active).toFixed(3),
          '--cards-tilt': `${lerp(3, 0, active).toFixed(2)}deg`,
        });
      });
    };

    const updateTransitions = () => {
      if (prefersReducedMotion()) return;
      transitions.forEach(zone => {
        const rect = zone.getBoundingClientRect();
        const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
        const open = Math.sin(progress * Math.PI);
        setStyleVars(zone, {
          '--transition-y': `${lerp(28, -24, progress).toFixed(1)}px`,
          '--transition-z': `${lerp(-60, 80, open).toFixed(1)}px`,
          '--transition-label-y': `${lerp(32, -18, progress).toFixed(1)}px`,
          '--transition-label-z': `${lerp(-80, 120, open).toFixed(1)}px`,
          '--transition-label-scale': lerp(0.94, 1.05, open).toFixed(3),
          '--curtain-left-x': `${lerp(0, -14, open).toFixed(2)}vw`,
          '--curtain-right-x': `${lerp(0, 14, open).toFixed(2)}vw`,
          '--curtain-z': `${lerp(-80, 130, open).toFixed(1)}px`,
          '--curtain-left-rot': `${lerp(0, -8, open).toFixed(2)}deg`,
          '--curtain-right-rot': `${lerp(0, 8, open).toFixed(2)}deg`,
          '--gate-fall-y': `${lerp(-18, 36, progress).toFixed(1)}px`,
          '--gate-z': `${lerp(-40, 80, open).toFixed(1)}px`,
          '--gate-star-scale': lerp(0.88, 1.24, open).toFixed(3),
          '--gate-star-opacity': lerp(0.45, 0.9, open).toFixed(3),
          '--underworld-veil-opacity': lerp(0.2, 0.48, open).toFixed(3),
          '--underworld-veil-scale': lerp(0.96, 1.06, open).toFixed(3),
          '--foam-y': `${lerp(22, -14, progress).toFixed(1)}px`,
          '--foam-z': `${lerp(-40, 80, open).toFixed(1)}px`,
          '--foam-opacity': lerp(0.2, 0.54, open).toFixed(3),
          '--foam-soft-opacity': lerp(0.14, 0.36, open).toFixed(3),
        });
      });
    };

    const update = () => {
      state.ticking = false;
      state.scrollY = window.scrollY;
      modules.forEach(module => module.update?.());
      updateHero();
      updateSections();
      updateTransitions();
    };

    const requestUpdate = () => {
      if (state.ticking) return;
      state.ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    requestUpdate();

    return { requestUpdate };
  }

  /* ================================================================
     Audio ambiental procedural — sin depender de MP3 externos
  ================================================================ */
  function initAmbientSound() {
    const btn = document.getElementById('ambient-btn');
    if (!btn) return { update() {} };

    /*
      Música ambiental con archivos MP3 del proyecto.
      Optimización aplicada:
      - preload="none": no descarga pistas hasta que el usuario activa el sonido.
      - Solo hay una pista activa por zona.
      - Crossfade corto entre zonas.
      - Volumen bajo por defecto.
      - Reutilización de elementos Audio para evitar crear nodos constantemente.
    */
    const tracks = {
      hero: 'audio/cabecera.mp3',
      olympus: 'audio/olympus.mp3',
      earth: 'audio/earth.mp3',
      sea: 'audio/sea.mp3',
      underworld: 'audio/underworld.mp3',
      oracle: 'audio/cabecera.mp3',
    };

    const volumes = {
      hero: 0.26,
      olympus: 0.24,
      earth: 0.24,
      sea: 0.23,
      underworld: 0.22,
      oracle: 0.22,
    };

    const audioCache = new Map();
    let started = false;
    let currentZone = null;
    let currentAudio = null;
    let fadeTimer = null;

    const getAudio = zone => {
      const safeZone = tracks[zone] ? zone : 'hero';
      if (audioCache.has(safeZone)) return audioCache.get(safeZone);

      const audio = new Audio(tracks[safeZone]);
      audio.loop = true;
      audio.preload = 'none';
      audio.volume = 0;
      audioCache.set(safeZone, audio);
      return audio;
    };

    const fadeTo = (audio, targetVolume, duration = 900, onDone = null) => {
      if (!audio) return;
      const startVolume = audio.volume;
      const startTime = performance.now();

      const step = now => {
        const t = Math.min(1, (now - startTime) / duration);
        audio.volume = startVolume + (targetVolume - startVolume) * t;

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          audio.volume = targetVolume;
          onDone?.();
        }
      };

      requestAnimationFrame(step);
    };

    const pauseAudio = audio => {
      if (!audio) return;
      fadeTo(audio, 0, 650, () => {
        audio.pause();
        audio.currentTime = 0;
      });
    };

    const setZoneSound = async zone => {
      if (!started) return;

      const safeZone = tracks[zone] ? zone : 'hero';
      if (safeZone === currentZone && currentAudio && !currentAudio.paused) return;

      const nextAudio = getAudio(safeZone);
      const previousAudio = currentAudio;

      currentZone = safeZone;
      currentAudio = nextAudio;

      try {
        if (nextAudio.paused) {
          nextAudio.currentTime = nextAudio.currentTime || 0;
          await nextAudio.play();
        }
        fadeTo(nextAudio, volumes[safeZone] ?? 0.22, 950);
      } catch {
        stop();
        return;
      }

      if (previousAudio && previousAudio !== nextAudio) {
        pauseAudio(previousAudio);
      }
    };

    const start = async () => {
      started = true;
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', 'Desactivar música ambiental');
      await setZoneSound(state.activeZone || 'hero');
    };

    const stop = () => {
      started = false;
      currentZone = null;
      btn.classList.remove('is-active');
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Activar música ambiental');

      audioCache.forEach(audio => {
        fadeTo(audio, 0, 450, () => {
          audio.pause();
        });
      });
    };

    btn.setAttribute('aria-label', 'Activar música ambiental');

    btn.addEventListener('click', () => {
      if (started) stop();
      else start().catch(() => stop());
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && currentAudio && started) {
        currentAudio.pause();
      } else if (!document.hidden && currentAudio && started) {
        currentAudio.play().catch(() => stop());
      }
    });

    return {
      update() {
        if (started && state.activeZone !== currentZone) {
          window.clearTimeout(fadeTimer);
          fadeTimer = window.setTimeout(() => {
            setZoneSound(state.activeZone || 'hero');
          }, 160);
        }
      },
    };
  }

  /* ================================================================
     Oráculo de Delfos: test, resultado, ranking y backend-ready
  ================================================================ */
  function initOracle() {
    const form = document.getElementById('oracle-form');
    const hint = document.getElementById('oracle-hint');
    const title = document.getElementById('oracle-result-title');
    const text = document.getElementById('oracle-result-text');
    const scoreBox = document.getElementById('oracle-score');
    const scoreNumber = scoreBox?.querySelector('.oracle-score-number');
    const ranking = document.getElementById('oracle-ranking');
    const resetBtn = document.getElementById('oracle-reset');
    const questionsContainer = document.getElementById('oracle-questions');
    const backendStatus = document.getElementById('backend-status');

    if (!form || !ranking || !questionsContainer) return;

    const STORAGE_KEY = 'mitologia-oraculo-ranking';
    const SESSION_QUESTIONS_KEY = 'mitologia-oraculo-preguntas-sesion';
    const QUESTIONS_PER_SESSION = 5;
    const FIREBASE_COLLECTION = 'resultados_oraculo';
    const JSON_BACKUP_ENDPOINT = 'api/guardar_resultado_json.php';
    const firebaseConfig = {
      apiKey: 'AIzaSyA38WW5QQ_ou_6v9r7TrOV5yoG5YsBvrlU',
      authDomain: 'landing-4c063.firebaseapp.com',
      projectId: 'landing-4c063',
      storageBucket: 'landing-4c063.firebasestorage.app',
      messagingSenderId: '1092712513900',
      appId: '1:1092712513900:web:0e8dc98b43f42ae1243349',
      measurementId: 'G-HYQ16KFM3P',
    };
    let firebaseClientPromise;
    const questionPool = [
      {
        id: 'mares-poseidon',
        question: '¿Quién gobierna los mares?',
        answers: [
          { text: 'Zeus', correct: false },
          { text: 'Poseidón', correct: true },
          { text: 'Hades', correct: false },
        ],
      },
      {
        id: 'minotauro-teseo',
        question: '¿Qué héroe venció al Minotauro?',
        answers: [
          { text: 'Teseo', correct: true },
          { text: 'Orfeo', correct: false },
          { text: 'Jasón', correct: false },
        ],
      },
      {
        id: 'almas-hermes',
        question: '¿Qué dios guiaba las almas al inframundo?',
        answers: [
          { text: 'Apolo', correct: false },
          { text: 'Hermes', correct: true },
          { text: 'Ares', correct: false },
        ],
      },
      {
        id: 'estigia-caronte',
        question: '¿Cómo se llama el barquero del Estigia?',
        answers: [
          { text: 'Minos', correct: false },
          { text: 'Morfeo', correct: false },
          { text: 'Caronte', correct: true },
        ],
      },
      {
        id: 'medusa-pegaso',
        question: '¿Qué criatura nació de la sangre de Medusa?',
        answers: [
          { text: 'Pegaso', correct: true },
          { text: 'Cerbero', correct: false },
          { text: 'Tritón', correct: false },
        ],
      },
      {
        id: 'rayo-zeus',
        question: '¿Qué dios empuña el rayo?',
        answers: [
          { text: 'Zeus', correct: true },
          { text: 'Hefesto', correct: false },
          { text: 'Dioniso', correct: false },
        ],
      },
      {
        id: 'sabiduria-atenea',
        question: '¿Quién es la diosa de la sabiduría y la estrategia?',
        answers: [
          { text: 'Atenea', correct: true },
          { text: 'Hera', correct: false },
          { text: 'Artemisa', correct: false },
        ],
      },
      {
        id: 'inframundo-hades',
        question: '¿Qué dios reina en el inframundo?',
        answers: [
          { text: 'Hades', correct: true },
          { text: 'Apolo', correct: false },
          { text: 'Poseidón', correct: false },
        ],
      },
      {
        id: 'mensajero-hermes',
        question: '¿Quién era el mensajero de los dioses?',
        answers: [
          { text: 'Hermes', correct: true },
          { text: 'Ares', correct: false },
          { text: 'Helios', correct: false },
        ],
      },
      {
        id: 'amor-afrodita',
        question: '¿Qué diosa está asociada al amor y la belleza?',
        answers: [
          { text: 'Afrodita', correct: true },
          { text: 'Deméter', correct: false },
          { text: 'Hécate', correct: false },
        ],
      },
      {
        id: 'aquiles-tetis',
        question: '¿Quién fue la madre de Aquiles?',
        answers: [
          { text: 'Tetis', correct: true },
          { text: 'Medea', correct: false },
          { text: 'Casandra', correct: false },
        ],
      },
      {
        id: 'prometeo-fuego',
        question: '¿Qué entregó Prometeo a los humanos?',
        answers: [
          { text: 'El fuego', correct: true },
          { text: 'El olivo', correct: false },
          { text: 'El vellocino', correct: false },
        ],
      },
      {
        id: 'doce-trabajos',
        question: '¿Qué héroe realizó los doce trabajos?',
        answers: [
          { text: 'Heracles', correct: true },
          { text: 'Perseo', correct: false },
          { text: 'Belerofonte', correct: false },
        ],
      },
      {
        id: 'manzana-discordia',
        question: '¿Qué diosa lanzó la manzana de la discordia?',
        answers: [
          { text: 'Eris', correct: true },
          { text: 'Iris', correct: false },
          { text: 'Nike', correct: false },
        ],
      },
      {
        id: 'icaro-alas',
        question: '¿De qué material estaban unidas las alas de Ícaro?',
        answers: [
          { text: 'Cera', correct: true },
          { text: 'Bronce', correct: false },
          { text: 'Lino', correct: false },
        ],
      },
      {
        id: 'vellocino-jason',
        question: '¿Qué héroe buscó el vellocino de oro?',
        answers: [
          { text: 'Jasón', correct: true },
          { text: 'Teseo', correct: false },
          { text: 'Odiseo', correct: false },
        ],
      },
      {
        id: 'ciclope-polifemo',
        question: '¿Qué cíclope fue cegado por Odiseo?',
        answers: [
          { text: 'Polifemo', correct: true },
          { text: 'Argos', correct: false },
          { text: 'Brontes', correct: false },
        ],
      },
      {
        id: 'helena-paris',
        question: '¿Qué príncipe troyano se llevó a Helena?',
        answers: [
          { text: 'Paris', correct: true },
          { text: 'Héctor', correct: false },
          { text: 'Eneas', correct: false },
        ],
      },
      {
        id: 'pandora-caja',
        question: '¿Quién abrió la caja que liberó los males del mundo?',
        answers: [
          { text: 'Pandora', correct: true },
          { text: 'Europa', correct: false },
          { text: 'Dánae', correct: false },
        ],
      },
      {
        id: 'orfeo-euridice',
        question: '¿Qué músico bajó al inframundo por Eurídice?',
        answers: [
          { text: 'Orfeo', correct: true },
          { text: 'Lino', correct: false },
          { text: 'Anfión', correct: false },
        ],
      },
      {
        id: 'atenas-olivo',
        question: '¿Qué diosa regaló el olivo a Atenas?',
        answers: [
          { text: 'Atenea', correct: true },
          { text: 'Perséfone', correct: false },
          { text: 'Hera', correct: false },
        ],
      },
      {
        id: 'caza-artemisa',
        question: '¿Quién es la diosa de la caza?',
        answers: [
          { text: 'Artemisa', correct: true },
          { text: 'Afrodita', correct: false },
          { text: 'Hestia', correct: false },
        ],
      },
      {
        id: 'vino-dioniso',
        question: '¿Qué dios representa el vino y el éxtasis?',
        answers: [
          { text: 'Dioniso', correct: true },
          { text: 'Ares', correct: false },
          { text: 'Hefesto', correct: false },
        ],
      },
      {
        id: 'cerbero-cabezas',
        question: '¿Qué criatura custodiaba la entrada del inframundo?',
        answers: [
          { text: 'Cerbero', correct: true },
          { text: 'La Esfinge', correct: false },
          { text: 'La Quimera', correct: false },
        ],
      },
      {
        id: 'atlas-cielo',
        question: '¿Qué titán sostiene la bóveda celeste?',
        answers: [
          { text: 'Atlas', correct: true },
          { text: 'Cronos', correct: false },
          { text: 'Océano', correct: false },
        ],
      },
    ];

    const shuffle = items => items
      .map(item => ({ item, order: Math.random() }))
      .sort((a, b) => a.order - b.order)
      .map(({ item }) => item);

    const getQuestionById = id => questionPool.find(question => question.id === id);

    const getSessionQuestions = () => {
      try {
        const savedIds = JSON.parse(sessionStorage.getItem(SESSION_QUESTIONS_KEY) || '[]');
        const savedQuestions = savedIds.map(getQuestionById).filter(Boolean);
        if (savedQuestions.length === QUESTIONS_PER_SESSION) return savedQuestions;
      } catch {
        // Si sessionStorage no está disponible, se genera una selección nueva.
      }

      const selected = shuffle(questionPool).slice(0, QUESTIONS_PER_SESSION);
      try {
        sessionStorage.setItem(SESSION_QUESTIONS_KEY, JSON.stringify(selected.map(question => question.id)));
      } catch {
        // La experiencia sigue funcionando aunque no se pueda guardar la sesión.
      }
      return selected;
    };

    const selectedQuestions = getSessionQuestions();

    const renderQuestions = questions => {
      questionsContainer.innerHTML = '';
      questions.forEach((question, questionIndex) => {
        const fieldset = document.createElement('fieldset');
        fieldset.className = 'oracle-question';

        const legend = document.createElement('legend');
        legend.textContent = `${questionIndex + 1}. ${question.question}`;
        fieldset.appendChild(legend);

        shuffle(question.answers).forEach(answer => {
          const label = document.createElement('label');
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = `q${questionIndex + 1}`;
          input.value = answer.correct ? '1' : '0';
          input.required = true;
          label.append(input, document.createTextNode(answer.text));
          fieldset.appendChild(label);
        });

        questionsContainer.appendChild(fieldset);
      });
    };

    const setBackendStatus = (message, mode = 'local') => {
      if (!backendStatus) return;
      backendStatus.textContent = message;
      backendStatus.className = `backend-status backend-status-${mode}`;
    };

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

    const getTitleByScore = score => {
      if (score === QUESTIONS_PER_SESSION) return 'Elegido del Olimpo';
      if (score === QUESTIONS_PER_SESSION - 1) return 'Héroe de los Mitos';
      if (score >= 2) return 'Discípulo del Oráculo';
      return 'Aspirante Mortal';
    };

    const getMessage = (score, mythicTitle, world) => {
      const messages = {
        5: `El Oráculo reconoce una memoria digna de los aedos. Tu dominio de los mitos roza lo divino y tu reino afín es ${world}.`,
        4: `Has cruzado casi todos los umbrales del mito. ${mythicTitle}, tu destino queda unido al reino de ${world}.`,
        3: `Tu sabiduría despierta, pero Delfos aún guarda secretos. Sigue explorando ${world} y volverás con mayor gloria.`,
        2: `Has escuchado parte de la profecía. Los dioses te conceden una segunda oportunidad para estudiar los mundos.`,
        1: `Los ecos del Olimpo todavía son lejanos. Vuelve al viaje, observa las tarjetas y reta de nuevo al Oráculo.`,
        0: `Ni Hermes podría salvar esta profecía. Pero todo héroe empieza perdido antes de encontrar su camino.`,
      };
      return messages[score] || messages[0];
    };

    const getEntryDate = entry => {
      if (entry.fecha?.toDate) return entry.fecha.toDate();
      if (entry.fecha?.seconds) return new Date(entry.fecha.seconds * 1000);
      return new Date(entry.fecha || Date.now());
    };

    const saveEntryToJsonFile = async entry => {
      try {
        const response = await fetch(JSON_BACKUP_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(entry),
        });
        if (!response.ok) throw new Error('No se pudo guardar la copia JSON');
      } catch (error) {
        console.warn('No se pudo guardar el resultado en resultados_oraculo.json:', error);
      }
    };

    const sortRanking = entries => entries
      .sort((a, b) => b.puntuacion - a.puntuacion || getEntryDate(b) - getEntryDate(a))
      .slice(0, 8);

    const renderRanking = entries => {
      const sorted = sortRanking(entries);
      ranking.innerHTML = '';
      if (!sorted.length) {
        const empty = document.createElement('li');
        empty.className = 'empty-ranking';
        empty.textContent = 'Todavía no hay profecías guardadas.';
        ranking.appendChild(empty);
        return;
      }

      sorted.forEach(entry => {
        const item = document.createElement('li');
        const date = getEntryDate(entry).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        const total = Number(entry.total || QUESTIONS_PER_SESSION);
        item.innerHTML = `<strong>${escapeHTML(entry.nombre)}</strong> — ${entry.puntuacion}/${total} · ${escapeHTML(entry.titulo)} <small>(${escapeHTML(entry.mundo)}, ${date})</small>`;
        ranking.appendChild(item);
      });
    };

    const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    }[char]));

    const loadRanking = async () => {
      try {
        const { db, firestore } = await getFirebaseClient();
        const rankingQuery = firestore.query(
          firestore.collection(db, FIREBASE_COLLECTION),
          firestore.orderBy('puntuacion', 'desc'),
          firestore.orderBy('fecha', 'desc'),
          firestore.limit(8)
        );
        const snapshot = await firestore.getDocs(rankingQuery);
        const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBackendStatus('Firebase conectado. El ranking se está leyendo desde Firestore.', 'remote');
        renderRanking(entries);
        return;
      } catch (error) {
        console.warn('No se pudo cargar el ranking desde Firebase:', error);
        setBackendStatus('Firebase no disponible ahora. El Oráculo funciona con ranking local de respaldo.', 'local');
      }
      renderRanking(getLocalRanking());
    };

    const saveEntry = async entry => {
      const current = getLocalRanking();
      const next = sortRanking([entry, ...current]);
      setLocalRanking(next);
      renderRanking(next);
      saveEntryToJsonFile(entry);

      try {
        const { db, firestore } = await getFirebaseClient();
        await firestore.addDoc(firestore.collection(db, FIREBASE_COLLECTION), {
          nombre: entry.nombre,
          puntuacion: entry.puntuacion,
          total: entry.total,
          titulo: entry.titulo,
          mundo: entry.mundo,
          fecha: firestore.serverTimestamp(),
        });
        setBackendStatus('Resultado guardado en Firebase y en la copia local de respaldo.', 'remote');
        loadRanking();
      } catch (error) {
        console.warn('No se pudo guardar el resultado en Firebase:', error);
        setBackendStatus('No se pudo guardar en Firebase. El resultado queda protegido en localStorage.', 'local');
      }
    };

    const validate = () => {
      let valid = true;
      form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

      const nameField = form.querySelector('#visitor-name');
      const worldField = form.querySelector('#favorite-world');

      if (!nameField.value.trim()) {
        nameField.closest('.oracle-field')?.classList.add('is-invalid');
        valid = false;
      }
      if (!worldField.value) {
        worldField.closest('.oracle-field')?.classList.add('is-invalid');
        valid = false;
      }

      for (let i = 1; i <= selectedQuestions.length; i += 1) {
        const checked = form.querySelector(`input[name="q${i}"]:checked`);
        const fieldset = form.querySelector(`input[name="q${i}"]`)?.closest('fieldset');
        if (!checked) {
          fieldset?.classList.add('is-invalid');
          valid = false;
        }
      }

      return valid;
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validate()) {
        hint.textContent = 'El Oráculo exige nombre, reino favorito y todas las respuestas.';
        hint.classList.add('is-error');
        return;
      }

      hint.classList.remove('is-error');
      const formData = new FormData(form);
      const score = selectedQuestions.reduce((sum, _, index) => sum + Number(formData.get(`q${index + 1}`) || 0), 0);
      const name = String(formData.get('nombre')).trim().slice(0, 24);
      const world = String(formData.get('mundo'));
      const mythicTitle = getTitleByScore(score);
      const entry = {
        nombre: name,
        puntuacion: score,
        titulo: mythicTitle,
        mundo: world,
        total: QUESTIONS_PER_SESSION,
        fecha: new Date().toISOString(),
      };

      title.textContent = mythicTitle;
      text.textContent = getMessage(score, mythicTitle, world);
      scoreBox.hidden = false;
      scoreNumber.textContent = `${score}/${QUESTIONS_PER_SESSION}`;
      hint.textContent = 'Profecía revelada y guardada en el ranking local.';
      saveEntry(entry);
    });

    form.addEventListener('input', event => {
      event.target.closest('.is-invalid')?.classList.remove('is-invalid');
      hint.classList.remove('is-error');
      hint.textContent = 'Completa todas las preguntas para revelar la profecía.';
    });

    resetBtn?.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      renderRanking([]);
      hint.textContent = 'Ranking local limpiado. El backend, si está activo, no se modifica desde este botón.';
    });

    renderQuestions(selectedQuestions);
    loadRanking();
  }

  /* ================================================================
     Inicialización general
  ================================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    const progress = initProgressBar();
    const nav = initNav();
    const backToTop = initBackToTop();
    const audio = initAmbientSound();

    createStars();
    regenerateParticles();
    initSliders();
    initCardAnimations();
    initOracle();

    const scene = initScrollScene([progress, nav, backToTop, audio]);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        CONFIG.compactScreen = window.innerWidth < 900;
        regenerateParticles();
        createStars();
        scene.requestUpdate();
      }, 220);
    }, { passive: true });
  });
})();
