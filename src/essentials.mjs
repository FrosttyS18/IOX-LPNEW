export function enhanceEssentials(list) {
  const mobile = window.matchMedia('(max-width:639px)');
  const entries = [...list.querySelectorAll('.essentials-row')].map((row, index) => ({
    button: row.querySelector('.essential-toggle'),
    label: row.querySelector('.essential-label'),
    panel: row.querySelector('dd'),
    open: index === 0
  }));

  function update() {
    list.toggleAttribute('data-disclosure', mobile.matches);
    for (const entry of entries) {
      entry.button.hidden = !mobile.matches;
      entry.label.hidden = mobile.matches;
      entry.panel.hidden = mobile.matches && !entry.open;
      entry.button.setAttribute('aria-expanded', String(!mobile.matches || entry.open));
    }
  }

  for (const entry of entries) {
    entry.button.addEventListener('click', () => {
      entry.open = !entry.open;
      update();
    });
  }
  mobile.addEventListener('change', update);
  update();
}
