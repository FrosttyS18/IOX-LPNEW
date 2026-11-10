const upgradedForms = new WeakMap();

export function upgradeSelects(form) {
  if (upgradedForms.has(form)) return upgradedForms.get(form);
  const document = form.ownerDocument;
  const window = document.defaultView;
  const fields = [];
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

  for (const select of form.querySelectorAll('select:not([multiple])')) {
    const required = select.required;
    const base = select.id || `custom-select-${fields.length + 1}`;
    const labels = Array.from(select.labels || []);
    const description = select.getAttribute('aria-describedby');
    const wrapper = document.createElement('span');
    wrapper.className = 'custom-select';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.id = `${base}-trigger`;
    trigger.className = 'custom-select__trigger';
    trigger.disabled = select.disabled;
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', `${base}-list`);
    if (required) trigger.setAttribute('aria-required', 'true');
    if (description) trigger.setAttribute('aria-describedby', description);
    if (labels.length) {
      trigger.setAttribute('aria-labelledby', labels.map((label, index) => {
        if (!label.id) label.id = `${base}-label-${index}`;
        return label.id;
      }).join(' '));
    } else {
      trigger.setAttribute('aria-label', select.getAttribute('aria-label') || select.name || 'Opção');
    }

    const value = document.createElement('span');
    value.className = 'custom-select__value';
    const arrow = document.createElement('span');
    arrow.className = 'custom-select__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    trigger.append(value, arrow);
    const list = document.createElement('span');
    list.id = `${base}-list`;
    list.className = 'custom-select__list';
    list.setAttribute('role', 'listbox');
    if (trigger.hasAttribute('aria-labelledby')) list.setAttribute('aria-labelledby', trigger.getAttribute('aria-labelledby'));
    list.hidden = true;
    const error = document.createElement('span');
    error.id = `${base}-error`;
    error.className = 'custom-select__error';
    error.setAttribute('role', 'alert');
    error.textContent = 'Selecione uma opção.';
    error.hidden = true;
    const items = Array.from(select.options)
      .filter(option => !option.disabled && !option.hidden && !option.parentElement.disabled)
      .map((option, index) => {
        const element = document.createElement('span');
        element.id = `${base}-option-${index}`;
        element.className = 'custom-select__option';
        element.setAttribute('role', 'option');
        element.textContent = option.textContent;
        list.append(element);
        return {option, element};
      });
    let active = 0;
    let buffer = '';
    let lastTyped = 0;
    let open = false;

    function clearError() {
      error.hidden = true;
      trigger.removeAttribute('aria-invalid');
      trigger.removeAttribute('aria-errormessage');
      if (description) trigger.setAttribute('aria-describedby', description);
      else trigger.removeAttribute('aria-describedby');
    }

    function sync() {
      value.textContent = select.selectedOptions[0]?.textContent || '';
      wrapper.dataset.placeholder = String(!select.value);
      for (const item of items) item.element.setAttribute('aria-selected', String(item.option.selected));
      if (select.value) clearError();
    }

    function markActive(index) {
      active = Math.max(0, Math.min(items.length - 1, index));
      for (const [i, item] of items.entries()) {
        if (i === active) item.element.dataset.active = 'true';
        else delete item.element.dataset.active;
      }
      if (open && items[active]) {
        trigger.setAttribute('aria-activedescendant', items[active].element.id);
        items[active].element.scrollIntoView({block: 'nearest'});
      }
    }

    function commit() {
      if (!items[active]) return;
      const previous = select.selectedIndex;
      select.selectedIndex = items[active].option.index;
      sync();
      if (select.selectedIndex !== previous) {
        select.dispatchEvent(new window.Event('input', {bubbles: true}));
        select.dispatchEvent(new window.Event('change', {bubbles: true}));
      }
    }

    function close(accept = false) {
      if (!open) return;
      if (accept) commit();
      open = false;
      list.hidden = true;
      delete wrapper.dataset.open;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.removeAttribute('aria-activedescendant');
      buffer = '';
    }

    function show() {
      if (open || select.disabled || !items.length) return;
      for (const field of fields) field.close(true);
      open = true;
      list.hidden = false;
      wrapper.dataset.open = 'true';
      trigger.setAttribute('aria-expanded', 'true');
      const rect = trigger.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom;
      const height = Math.min(list.getBoundingClientRect().height, 320);
      wrapper.dataset.placement = below < height && rect.top > below ? 'above' : 'below';
      markActive(Math.max(0, items.findIndex(item => item.option.selected)));
    }

    function search(character) {
      const now = Date.now();
      buffer = now - lastTyped > 700 ? character : buffer + character;
      lastTyped = now;
      const normalized = normalize(buffer);
      const repeated = [...normalized].every(letter => letter === normalized[0]);
      const query = repeated ? normalized[0] : normalized;
      const start = repeated ? active + 1 : 0;
      for (let offset = 0; offset < items.length; offset++) {
        const index = (start + offset) % items.length;
        if (normalize(items[index].option.textContent.trim()).startsWith(query)) {
          markActive(index);
          break;
        }
      }
    }

    trigger.addEventListener('click', () => open ? close() : show());
    trigger.addEventListener('blur', () => close(true));
    trigger.addEventListener('keydown', event => {
      const key = event.key;
      if (key === 'Tab') {
        close(true);
        return;
      }
      if (key === 'Escape') {
        if (open) event.preventDefault();
        close();
        return;
      }
      if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        if (open) close(true);
        else show();
        return;
      }
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
        event.preventDefault();
        const wasOpen = open;
        show();
        if (key === 'Home') markActive(0);
        else if (key === 'End') markActive(items.length - 1);
        else if (wasOpen) markActive(active + (key === 'ArrowDown' ? 1 : -1));
        return;
      }
      if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        show();
        search(key);
      }
    });
    for (const [index, item] of items.entries()) {
      item.element.addEventListener('pointerdown', event => event.preventDefault());
      item.element.addEventListener('pointermove', () => markActive(index));
      item.element.addEventListener('click', () => {
        markActive(index);
        close(true);
        trigger.focus({preventScroll: true});
      });
    }
    select.addEventListener('change', sync);
    wrapper.append(trigger, list, error);
    select.after(wrapper);
    for (const label of labels) label.htmlFor = trigger.id;
    select.required = false;
    select.hidden = true;
    sync();
    fields.push({select, trigger, wrapper, close, reset() {close(); clearError(); sync();}, validate() {
      const valid = !required || select.disabled || select.value !== '';
      if (valid) clearError();
      else {
        error.hidden = false;
        trigger.setAttribute('aria-invalid', 'true');
        trigger.setAttribute('aria-errormessage', error.id);
        trigger.setAttribute('aria-describedby', [description, error.id].filter(Boolean).join(' '));
      }
      return valid;
    }});
  }

  document.addEventListener('pointerdown', event => {
    for (const field of fields) if (!field.wrapper.contains(event.target)) field.close();
  });
  form.addEventListener('reset', () => window.setTimeout(() => fields.forEach(field => field.reset()), 0));
  const controller = {reportValidity() {
    const invalid = fields.filter(field => !field.validate());
    if (invalid.length) invalid[0].trigger.focus();
    return invalid.length === 0;
  }};
  upgradedForms.set(form, controller);
  return controller;
}
