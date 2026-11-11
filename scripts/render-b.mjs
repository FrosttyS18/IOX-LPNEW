import {renderLegal} from './legal-render.mjs';
import {renderPerformance} from './performance-render.mjs';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lines = value => escape(value).replace(/\n/g, '<br class="b-desktop-break"> ');
const text = value => escape(value.replace(/\s+/g, ' ').trim());
const img = (src, alt, classes, width, height, eager = false) => `<img class="${classes}" src="${escape(src)}" alt="${escape(alt)}" width="${width}" height="${height}" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy" decoding="async"'}>`;

function renderFields(fields) {
  return fields.map(field => {
    const id = `b-${field.id}`;
    if (field.id === 'investments') return `<fieldset class="field b-field b-field-wide b-investments"><legend>${escape(field.label)}</legend><details class="b-multiselect"><summary><span data-multiple-value>Selecione uma ou mais opções</span><span class="custom-select__arrow" aria-hidden="true"></span></summary><div class="b-multi-options">${field.options.map((option, index) => `<label><input type="checkbox" name="investments" value="${index + 1}">${escape(option)}</label>`).join('')}</div></details><p class="b-multi-error" hidden>Selecione ao menos uma opção.</p></fieldset>`;
    let control;
    if (field.options.length) control = `<span class="select-shell"><select id="${id}" name="${field.id}" required><option value="" selected disabled>Selecione uma opção</option>${field.options.map((option, index) => `<option value="${index + 1}">${escape(option)}</option>`).join('')}</select></span>`;
    else {
      const [type, complete, placeholder, length] = {name:['text','name','Seu nome',100],email:['email','email','Seu e-mail',254],phone:['tel','tel','DDD + número',22]}[field.id];
      control = `<input id="${id}" type="${type}" name="${field.id}" autocomplete="${complete}" placeholder="${placeholder}" maxlength="${length}" ${type === 'tel' ? 'inputmode="tel" minlength="10"' : ''} required>`;
    }
    return `<div class="field b-field${['email','phone'].includes(field.id) ? '' : ' b-field-wide'}"><label for="${id}">${escape(field.label)}</label>${control}</div>`;
  }).join('');
}

export function renderPageB(copy, assets, legal) {
  const links = ['#quem-e-a-iox','#o-fundo','#perguntas-frequentes'];
  const nav = copy.nav.map((label, i) => `<a href="${links[i]}">${escape(label)}</a>`).join('');
  return `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#090a0a">
<title>Conheça a IOX | Fundo IOX 90</title>
<meta name="description" content="Conheça o Grupo IOX e o Fundo IOX 90: entenda o mercado de crédito, o prazo, os riscos e converse com um especialista.">
<meta property="og:type" content="website"><meta property="og:title" content="Conheça a IOX | Fundo IOX 90"><meta property="og:description" content="O grupo que você talvez ainda não conheça."><meta property="og:image" content="${escape(assets.ogImage)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Símbolo IOX em vidro sobre fundo preto.">
<link rel="icon" href="${escape(assets.logo)}" type="image/webp">
<link rel="preload" href="${escape(assets.fontRegular)}" as="font" type="font/ttf" crossorigin>
<link rel="preload" href="${escape(assets.fontSemiBold)}" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/performance.css"><link rel="stylesheet" href="/lp-b/styles.css">
</head><body class="lp-b">
<a class="skip-link" href="#conteudo-b">Ir para o conteúdo</a>
<main id="conteudo-b">
  <section class="b-hero" aria-labelledby="hero-title">
    ${img(assets.heroRim,'','b-hero-rim',568,450,true)}
    ${img(assets.heroGlass,'Monograma IOX em vidro transparente.','b-hero-glass',1052,1052,true)}
    <header class="site-header b-header"><a class="brand" href="#conteudo-b" aria-label="Grupo IOX — início">${img(assets.logo,'Grupo IOX','',88,88,true)}</a><span class="b-nav-cut" aria-hidden="true"></span><nav class="b-nav" aria-label="Navegação principal">${nav}</nav><button class="menu-toggle" type="button" aria-label="Abrir menu" aria-controls="mobile-menu" aria-expanded="false"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5h20M2 12h20M2 19h20" stroke="currentColor" stroke-width="1.5"/></svg></button></header>
    <div class="b-hero-copy"><h1 id="hero-title">${lines(copy.hero.title)}</h1><p>${lines(copy.hero.body)}</p><a class="button button-gold b-hero-cta" href="#o-fundo">${escape(copy.hero.cta)}</a></div>
  </section>
  <section id="quem-e-a-iox" class="b-about b-shell" aria-labelledby="b-about-title">
    <h2 class="section-title" id="b-about-title" tabindex="-1">${escape(copy.group.title)}</h2><p class="b-about-intro">${lines(copy.group.body)}</p>
    <div class="b-about-grid">${img(assets.office,'Sede do Grupo IOX, com o símbolo da marca na parede.','b-office',1440,840)}<div class="b-authority"><article class="b-authority-years"><h3>${escape(copy.group.years)}</h3><p>${escape(copy.group.yearsLabel)}</p></article><article class="b-authority-assets"><h3>${escape(copy.group.assets)}</h3><p>${escape(copy.group.assetsLabel)}</p></article></div></div>
  </section>
  <section id="o-fundo" class="b-fund b-shell" aria-labelledby="b-fund-title">
    <div class="b-fund-copy"><h2 id="b-fund-title" tabindex="-1">${escape(copy.fund.title)}</h2><p>${lines(copy.fund.body)}</p><h3>${escape(copy.fund.fidcTitle)}</h3><p>${text(copy.fund.fidcBody)}</p></div>
    ${renderPerformance('#e6c27a')}
  </section>
  <section class="b-numbers b-shell" aria-labelledby="b-numbers-title"><h2 class="section-title" id="b-numbers-title">${escape(copy.numbers.title)}</h2><div class="b-number-grid"><article class="b-number-history"><h3>${lines(copy.numbers.history)}</h3></article><article class="b-number-volatility"><p>${lines(copy.numbers.volatilityLabel)}</p><h3>${escape(copy.numbers.volatility)}</h3></article><article class="b-number-fees"><h3>${lines(copy.numbers.fees)}</h3></article></div><p class="b-number-note">${escape(copy.numbers.note)}</p></section>
  <section class="b-liquidity b-wide" aria-labelledby="b-liquidity-title">${img(assets.jet,'Família reunida no interior de um jatinho.','b-jet',1920,790)}<div class="b-liquidity-copy"><h2 id="b-liquidity-title">${escape(copy.liquidity.title)}</h2>${copy.liquidity.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</div></section>
  <section class="b-audience b-shell" aria-labelledby="b-audience-title"><h2 class="section-title" id="b-audience-title">${escape(copy.audience.title)}</h2><p>${lines(copy.audience.body)}</p></section>
  <section id="perguntas-frequentes" class="b-faq b-shell" aria-labelledby="b-faq-title"><h2 class="section-title" id="b-faq-title" tabindex="-1">${escape(copy.faq.title)}</h2><div class="b-faq-list">${copy.faq.items.map(item=>`<details class="b-faq-item" open><summary>${escape(item.question)}<span aria-hidden="true"></span></summary><p>${escape(item.answer)}</p></details>`).join('')}</div></section>
  <section id="formulario" class="b-contact b-shell" aria-labelledby="b-contact-title"><div class="b-advisor">${img(assets.advisor,'Especialista de camisa preta sentado à mesa com MacBook.','b-advisor-image',1080,1200)}<h2 id="b-contact-title">${lines(copy.contact.title)}</h2></div><div class="b-form-scene">${img(assets.formBacking,'','b-form-backing',600,731)}<form id="specialist-form" class="b-form" novalidate><div class="form-fields b-fields">${renderFields(copy.contact.fields)}</div><button class="button button-gold submit-button" type="submit" disabled>${escape(copy.contact.cta)}</button><p class="form-consent">${lines(copy.contact.consent)}</p><p id="form-status" class="form-status" role="status" tabindex="-1" hidden></p><noscript><p>Ative o JavaScript para preencher as opções e validar o formulário.</p></noscript></form></div></section>
</main>
<footer class="site-footer b-footer b-shell">${img(assets.logo,'Grupo IOX','b-footer-logo',88,88)}${renderLegal(legal)}</footer>
<dialog class="mobile-menu" id="mobile-menu" aria-label="Menu de navegação"><div class="mobile-menu-top">${img(assets.logo,'Grupo IOX','mobile-menu-logo',88,88)}<button class="mobile-menu-close" type="button" aria-label="Fechar menu"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.5"/></svg></button></div><nav class="mobile-menu-links" aria-label="Navegação móvel">${nav}</nav></dialog>
<script type="module" src="/lp-b/main.mjs"></script></body></html>`;
}
