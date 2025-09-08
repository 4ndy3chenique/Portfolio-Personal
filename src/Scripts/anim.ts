// helpers
const isIOS = () =>
  /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

interface AnimOptions {
  // Add properties as needed, or leave empty if no options are used
}

export function initAnimations(opts: AnimOptions = {}) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skipHeavy = isIOS() || reduceMotion;

  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-anim]'));
  if (!els.length) return;

  // Estado inicial – sin will-change global
  els.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)'; // algo ligero por defecto
  });

  const io = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;

      // si es iOS o reduceMotion, usa animación mínima
      const type = skipHeavy ? 'fade' : (el.dataset.anim ?? 'fade-up');
      const delay = el.dataset.animDelay ?? '0';
      const duration = skipHeavy ? '300' : (el.dataset.animDuration ?? '600');
      const easing = 'cubic-bezier(0.22,1,0.36,1)';

      // activar will-change solo mientras anima
      el.style.willChange = 'transform, opacity';
      el.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      el.style.transitionDelay = `${delay}ms`;
      el.style.opacity = '1';

      switch (type) {
        case 'fade': el.style.transform = 'none'; break;
        case 'fade-up': el.style.transform = 'translateY(0)'; break;
        case 'slide-left': el.style.transform = 'translateX(0)'; break;
        case 'slide-right': el.style.transform = 'translateX(0)'; break;
      }

      // limpiar will-change al terminar (libera memoria/GPU)
      const cleanup = () => { el.style.willChange = ''; el.removeEventListener('transitionend', cleanup); };
      el.addEventListener('transitionend', cleanup);

      obs.unobserve(el);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: skipHeavy ? 0.2 : 0.12 });

  els.forEach((el) => io.observe(el));
}
