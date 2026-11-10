import {resolveHeroKey, heroImages} from './hero.mjs';
import {heroVariants, assets} from './page-data.mjs';
import {upgradeSelects} from './select.mjs';

document.documentElement.dataset.inputMode = 'pointer';
document.addEventListener('pointerdown', () => {
  document.documentElement.dataset.inputMode = 'pointer';
}, true);
document.addEventListener('keydown', event => {
  const navigationKey = ['Tab','ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End','PageUp','PageDown','Enter'].includes(event.key);
  const controlSpace = event.key === ' ' && !event.target.matches('input,textarea');
  if (navigationKey || controlSpace) document.documentElement.dataset.inputMode = 'keyboard';
}, true);

const key = resolveHeroKey(new URLSearchParams(window.location.search).get('utm_content'));
const variant = heroVariants.find(item => item.id === key);
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image');

if (variant && key !== 'fallback') {
  document.querySelector('#hero-title').textContent = variant.title;
  document.querySelector('#hero-subtitle').textContent = variant.subtitle;
  hero.dataset.variant = key;
  const picture = heroImages[key];
  heroImage.src = assets[picture.key];
  heroImage.alt = picture.alt;
  hero.style.setProperty('--hero-focus', picture.focus);
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');

function closeMenu(returnFocus = false) {
  navigation.removeAttribute('data-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.toggleAttribute('data-open', open);
});

navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});

const form = document.querySelector('#specialist-form');
const submit = form.querySelector('button[type="submit"]');
const formStatus = document.querySelector('#form-status');
const phone = form.querySelector('input[type="tel"]');
const customSelects = upgradeSelects(form);

phone.addEventListener('input', () => {
  const length = phone.value.replace(/\D/g, '').length;
  phone.setCustomValidity(length >= 10 && length <= 15 ? '' : 'Informe um telefone válido, com DDD.');
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!customSelects.reportValidity()) return;
  if (!form.reportValidity()) return;
  formStatus.textContent = 'O envio ainda não está disponível nesta versão. Nenhum dado foi enviado.';
  formStatus.hidden = false;
  formStatus.focus({preventScroll: true});
});

submit.disabled = false;
