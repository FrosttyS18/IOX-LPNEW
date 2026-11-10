export function enhanceCounters() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const running = new Map();

  function start(target) {
    const value = Number(target.dataset.counter);
    const decimals = Number(target.dataset.decimals);
    const format = new Intl.NumberFormat('pt-BR', {minimumFractionDigits:decimals,maximumFractionDigits:decimals});
    const visual = target.querySelector('.counter-visual');
    const write = number => { visual.textContent = `${target.dataset.prefix}${format.format(number)}${target.dataset.suffix}`; };
    const finish = () => {
      const job = running.get(target);
      if (job) window.cancelAnimationFrame(job.frame);
      write(value);
      target.dataset.counterState = 'complete';
      running.delete(target);
    };
    const started = performance.now();
    const job = {frame:0,finish};
    running.set(target, job);
    target.dataset.counterState = 'running';
    write(0);
    const tick = now => {
      const progress = Math.min((now - started) / 1100, 1);
      write(value * (1 - (1 - progress) ** 3));
      if (progress === 1) finish();
      else job.frame = window.requestAnimationFrame(tick);
    };
    job.frame = window.requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (!reducedMotion.matches) start(entry.target);
    }
  }, {threshold:0.4,rootMargin:'0px 0px -24px 0px'});
  for (const target of document.querySelectorAll('[data-counter]')) observer.observe(target);
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    for (const job of [...running.values()]) job.finish();
  });
}
