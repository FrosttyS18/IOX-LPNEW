export function enhanceNavigation() {
  const button = document.querySelector('.menu-toggle');
  const dialog = document.querySelector('.mobile-menu');
  const mobile = window.matchMedia('(max-width:1100px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
  let closeTimer = null;

  function reset() {
    dialog.removeAttribute('data-visible');
    document.documentElement.removeAttribute('data-menu-open');
    button.setAttribute('aria-expanded', 'false');
  }

  function closeMenu(afterClose, immediate = false) {
    if (!dialog.open) return;
    if (closeTimer !== null) {
      if (!immediate) return;
      window.clearTimeout(closeTimer);
    }
    dialog.removeAttribute('data-visible');
    const finish = () => {
      closeTimer = null;
      dialog.close();
      reset();
      afterClose?.();
    };
    if (immediate || reducedMotion.matches) finish();
    else closeTimer = window.setTimeout(finish, 280);
  }

  button.addEventListener('click', () => {
    if (!mobile.matches || dialog.open) return;
    button.setAttribute('aria-expanded', 'true');
    dialog.showModal();
    document.documentElement.setAttribute('data-menu-open', '');
    dialog.getBoundingClientRect();
    window.requestAnimationFrame(() => {
      if (dialog.open) dialog.setAttribute('data-visible', '');
    });
  });

  dialog.querySelector('.mobile-menu-close').addEventListener('click', () => closeMenu());
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeMenu();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button,a[href]')];
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener('close', reset);
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeMenu();
  });
  dialog.querySelector('nav').addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    event.preventDefault();
    closeMenu(() => { window.location.hash = link.hash; });
  });
  mobile.addEventListener('change', () => {
    if (!mobile.matches) closeMenu(undefined, true);
  });
}
