import {upgradeSelects} from '../select.mjs';
import {enhanceNavigation} from '../navigation.mjs';
import {enhanceReveals} from '../reveal.mjs';
import {enhancePerformance} from '../performance.mjs';

document.documentElement.dataset.inputMode = 'pointer';
document.addEventListener('pointerdown', () => document.documentElement.dataset.inputMode = 'pointer', true);
document.addEventListener('keydown', event => {
  if (['Tab','ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End','PageUp','PageDown','Enter',' '].includes(event.key)) document.documentElement.dataset.inputMode = 'keyboard';
}, true);

enhanceNavigation();
enhanceReveals();
enhancePerformance(document.querySelector('.performance-chart'));

const form = document.querySelector('#specialist-form');
const selects = upgradeSelects(form);
const phone = form.querySelector('input[type="tel"]');
const status = document.querySelector('#form-status');
const multiple = form.querySelector('.b-multiselect');
const choices = [...multiple.querySelectorAll('input')];
const multipleError = form.querySelector('.b-multi-error');
const multipleValue = multiple.querySelector('[data-multiple-value]');

multiple.addEventListener('change', () => {
  const checked = choices.filter(input => input.checked);
  multipleValue.textContent = checked.length ? checked.map(input => input.parentElement.textContent.trim()).join(', ') : 'Selecione uma ou mais opções';
  if (checked.length) {
    multipleError.hidden = true;
    multiple.querySelector('summary').removeAttribute('aria-invalid');
  }
});
multiple.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !multiple.open) return;
  event.preventDefault();
  multiple.open = false;
  multiple.querySelector('summary').focus();
});
document.addEventListener('pointerdown', event => {
  if (!multiple.contains(event.target)) multiple.open = false;
});
phone.addEventListener('input', () => {
  const length = phone.value.replace(/\D/g, '').length;
  phone.setCustomValidity(length >= 10 && length <= 15 ? '' : 'Informe um telefone válido, com DDD.');
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!selects.reportValidity()) return;
  if (!choices.some(input => input.checked)) {
    multipleError.hidden = false;
    multiple.querySelector('summary').setAttribute('aria-invalid','true');
    multiple.open = true;
    multiple.querySelector('summary').focus();
    return;
  }
  if (!form.reportValidity()) return;
  multiple.open = false;
  status.textContent = 'O envio ainda não está disponível nesta versão. Nenhum dado foi enviado.';
  status.hidden = false;
  status.focus({preventScroll:true});
});
form.querySelector('button[type="submit"]').disabled = false;
