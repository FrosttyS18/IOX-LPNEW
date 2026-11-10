export function enhanceReveals() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const targets = [...document.querySelectorAll('.section-title,.metrics-mosaic>.metric,.group-intro,.group-mosaic>*,.audience-grid>*,.steps>li,.essentials-grid>*,.experts-intro,.expert-list>figure,.contact-intro,.form-fields>.field,.submit-button,.form-consent')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, {threshold:0.1,rootMargin:'0px 0px -24px 0px'});

  for (const target of targets) {
    if (target.parentElement.matches('.metrics-mosaic,.steps,.expert-list,.form-fields')) {
      const index = [...target.parentElement.children].indexOf(target);
      const delay = target.parentElement.matches('.steps') ? index * 140 : Math.min(index * 70, 210);
      target.style.setProperty('--reveal-delay', `${delay}ms`);
    }
    target.classList.add('reveal-pending');
    observer.observe(target);
  }
  document.addEventListener('focusin', event => {
    const target = event.target.closest('.reveal-pending');
    if (target) target.classList.add('is-revealed');
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    for (const target of targets) target.classList.add('is-revealed');
  });
}
