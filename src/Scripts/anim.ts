export function initAnimations() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isIOS =
    /iP(hone|od|ad)/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (reduce) document.documentElement.classList.add('reduced-motion');
  if (isIOS)  document.documentElement.classList.add('ios');

  const els = document.querySelectorAll<HTMLElement>('[data-anim]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      (e.target as HTMLElement).classList.add('in-view');
      obs.unobserve(e.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  els.forEach(el => io.observe(el));
}
