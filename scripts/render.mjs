import {renderLegal} from './legal-render.mjs';
import {renderPerformance} from './performance-render.mjs';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image = (src, alt, classes, width, height, priority = false) => `<img class="${classes}" src="${escape(src)}" alt="${escape(alt)}" width="${width}" height="${height}" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy" decoding="async"'}>`;

const desktopLines = value => String(value).split("\n").map(escape).join('<br class="desktop-break"> ');
const mobilePhrases = (html, phrases) => phrases.reduce((result, phrase) => result.replace(escape(phrase), `<span class="mobile-phrase">${escape(phrase)}</span>`), html);

export function renderPage(source, assets, legal, approved) {
  const sections = source.sections;
  const top = sections[0].copy;
  const hero = top.titleAndSubtitleVariants.find(v => v.id === 'fallback');
  const flow = sections[3].copy;
  const essentials = sections[4].copy;
  const experts = sections[5].copy;
  const form = sections[6].copy;
  const fieldHtml = form.fields.map(field => {
    const fieldId = `field-${field.id}`;
    const wide = field.id === 'preferredTime' ? ' field-wide' : '';
    const label = `<label for="${fieldId}">${escape(field.label)}</label>`;
    let control;
    if (field.options) {
      control = `<span class="select-shell"><select id="${fieldId}" name="${field.id}" required><option value="" disabled selected>Selecione</option>${field.options.map((value, i) => `<option value="${i + 1}">${escape(value)}</option>`).join('')}</select></span>`;
    } else {
      const configs = {name: ['text','name','100','Digite seu nome'], email: ['email','email','254','seu@email.com'], phone: ['tel','tel','22','(99) - 00000-0000']};
      const [type, autocomplete, max, placeholder] = configs[field.id];
      control = `<input id="${fieldId}" name="${field.id}" type="${type}" autocomplete="${autocomplete}" maxlength="${max}" placeholder="${escape(placeholder)}" ${type === 'tel' ? 'inputmode="tel" minlength="10"' : ''} required>`;
    }
    return `<div class="field${wide}">${label}${control}</div>`;
  }).join('');
  const regularType = assets.fontRegular.endsWith('.woff2') ? 'font/woff2' : 'font/ttf';
  const semiType = assets.fontSemiBold.endsWith('.woff2') ? 'font/woff2' : 'font/ttf';
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Fundo IOX 90 | Grupo IOX</title>
  <meta name="description" content="Conheça o Fundo IOX 90, do Grupo IOX, destinado a investidores qualificados. Converse com um especialista sobre o fundo, o prazo e os riscos.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Fundo IOX 90 | Grupo IOX">
  <meta property="og:description" content="Para quem já construiu patrimônio. Conheça o Fundo IOX 90.">
  <meta property="og:image" content="${escape(assets.ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="Símbolo IOX em vidro sobre fundo preto.">
  <meta name="theme-color" content="#090a0a">
  <link rel="icon" href="${escape(assets.logo)}" type="image/png">
  <link rel="preload" href="${escape(assets.fontRegular)}" as="font" type="${regularType}" crossorigin>
  <link rel="preload" href="${escape(assets.fontSemiBold)}" as="font" type="${semiType}" crossorigin>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/performance.css">
  <script type="module" src="/main.mjs"></script>
</head>
<body>
  <a class="skip-link" href="#main-content">Pular para o conteúdo</a>
  <main id="main-content">
    <section class="hero" data-variant="fallback" aria-labelledby="hero-title">
      <picture class="hero-picture"><source class="hero-mobile-source" media="(max-width:639px)" srcset="${escape(assets.heroHouseMobile)}" width="1252" height="1272">${image(assets.heroHouse, 'Família reunida em um sofá, em uma sala com luz natural.', 'hero-image', 1774, 887, true)}</picture>
      <header class="site-header">
        <a class="brand" href="#main-content" aria-label="Grupo IOX, início">${image(assets.logo, '', '', 44, 44, true)}</a>
        <picture><source media="(max-width:1100px)" srcset="${escape(assets.headerShapeMobile)}">${image(assets.headerShape, '', 'nav-shape', 760, 64, true)}</picture>
        <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-haspopup="dialog" aria-controls="mobile-menu" aria-expanded="false"><span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button>
        <nav id="primary-nav" class="primary-nav" aria-label="Navegação principal">
          <a href="#para-quem">Para quem é</a><a href="#como-funciona">Como funciona</a><a href="#especialistas">Especialistas</a>
        </nav>
      </header>
      <div class="hero-content">
        <h1 id="hero-title">${desktopLines(approved.heroTitle)}</h1>
        <p id="hero-subtitle" class="hero-subtitle">${desktopLines(approved.heroSubtitle)}</p>
        <a class="button hero-cta" href="#formulario">${escape(top.cta)}</a>
      </div>
    </section>

    <section class="metrics container" aria-labelledby="metrics-title">
      <h2 id="metrics-title" class="section-title">${mobilePhrases(escape(approved.metricTitle), ['mês após mês.'])}</h2>
      <div class="metrics-mosaic">
        <div class="metric metric-positive">
          ${image(assets.metricsGlass, '', 'metric-glass', 780, 674)}
          <p class="metric-value"><span class="metric-gold">159%</span> do CDI</p><p class="metric-label">${escape(approved.metricPositivePeriod)}</p>
        </div>
        <div class="metric metric-twelve"><p class="metric-value">${escape(approved.metricAnnualValue)}</p><p class="metric-period">${escape(approved.metricAnnualPeriod)}</p><p class="metric-comparison">${escape(approved.metricAnnualComparison)}</p></div>
        <div class="metric metric-volatility"><p class="metric-value" data-counter="0.48" data-decimals="2" data-prefix="" data-suffix="%"><span class="counter-visual" aria-hidden="true">0,48%</span><span class="visually-hidden">0,48%</span></p><p class="metric-label">de volatilidade anualizada</p></div>
        <div class="metric metric-consistency"><p class="metric-value">${escape(approved.metricConsistency)}</p><p class="metrics-note">${escape(approved.metricNote)}</p></div>
        <a class="button metrics-cta" href="#formulario">${escape(top.cta)}</a>
      </div>
    </section>

    <section class="group container" aria-labelledby="group-title">
      <h2 id="group-title" class="section-title">${source.group.title.split('\n').map(line => `<span class="group-title-line">${escape(line)}</span>`).join(' ')}</h2>
      <p class="group-intro">${source.group.intro.map(line => `<span>${mobilePhrases(escape(line), ['do Brasil','de crédito','já investe.'])}</span>`).join(' ')}</p>
      <div class="group-mosaic">
        <div class="group-card group-top"><p class="group-value">${escape(source.group.topTitle)}</p><p>${desktopLines(source.group.topLabel)}</p></div>
        <div class="group-card group-years"><p class="group-value">${escape(source.group.yearsTitle)}</p><p>${escape(source.group.yearsLabel)}</p></div>
        <div class="group-card group-structure"><picture><source media="(max-width:639px)" srcset="${escape(assets.groupGlassComplete)}">${image(assets.groupGlass, '', 'group-glass', 532, 762)}</picture><p class="group-value">${escape(source.group.structureTitle)}</p><p>${desktopLines(source.group.structureLabel)}</p></div>
        <div class="group-office">${image(assets.groupOffice, 'Sala de reuniões do Grupo IOX, com símbolo da marca na parede e vista da cidade.', '', 1070, 762)}</div>
      </div>
      <p class="group-note">${desktopLines(source.group.note)}</p>
    </section>

    <section id="para-quem" class="audience container" aria-labelledby="audience-title">
      <h2 id="audience-title" class="section-title" tabindex="-1">${desktopLines(approved.audienceTitle)}</h2>
      <div class="audience-grid">
        <div class="audience-copy"><div class="audience-text">${approved.audienceParagraphs.map(text => `<p>${desktopLines(text)}</p>`).join('')}<a class="button audience-cta" href="#formulario">${escape(approved.heroCta)}</a></div></div>
        ${renderPerformance()}
      </div>
    </section>

    <section id="como-funciona" class="flow container" aria-labelledby="flow-title">
      <h2 id="flow-title" class="section-title" tabindex="-1">${desktopLines(approved.flowTitle)}</h2>
      <ol class="steps">${flow.steps.map((step, i) => `<li><span class="step-number" aria-hidden="true">${i + 1}</span><h3>${escape(step.label)}</h3><p>${desktopLines(approved.stepBodies[i])}</p></li>`).join('')}</ol>
    </section>

    <section class="essentials container" aria-labelledby="essentials-title">
      <h2 id="essentials-title" class="section-title">O essencial do fundo</h2>
      <div class="essentials-grid"><dl class="essentials-list">${essentials.items.map((item, i) => `<div class="essentials-row"><dt><span class="essential-label">${escape(item.label)}:</span><button class="essential-toggle" type="button" aria-expanded="true" aria-controls="essential-detail-${i}" hidden>${escape(item.label)}:<span class="essential-arrow" aria-hidden="true"></span></button></dt><dd id="essential-detail-${i}">${desktopLines(approved.essentialValues[i])}</dd></div>`).join('')}</dl><picture class="essentials-art"><source media="(max-width:639px)" srcset="${escape(assets.essentialsGlassComplete)}">${image(assets.essentialsGlass, '', 'essentials-glass', 614, 800)}</picture></div>
    </section>

    <section id="especialistas" class="experts container" aria-labelledby="experts-title">
      <h2 id="experts-title" class="section-title" tabindex="-1">${desktopLines(approved.expertsTitle)}</h2>
      <p class="experts-intro">${desktopLines(approved.expertsIntro)}</p>
      <div class="expert-list">${experts.names.map((name, i) => `<figure>${image(assets[`expert${i + 1}`], `${name}, especialista de investimentos do Grupo IOX.`, 'expert-image', 540, 676)}<figcaption>${escape(name)}<span class="expert-role">${escape(experts.role)}</span></figcaption></figure>`).join('')}</div>
    </section>

    <section id="formulario" class="contact container" aria-labelledby="contact-title">
      <div class="contact-intro"><h2 id="contact-title" tabindex="-1">${desktopLines(approved.contactTitle)}</h2><p>${desktopLines(approved.contactIntro)}</p><p class="contact-proof">${desktopLines(approved.contactProof)}</p></div>
      <form id="specialist-form" method="post" action="#formulario" aria-describedby="form-consent">
        <div class="form-fields">${fieldHtml}</div>
        <button class="button button-green submit-button" type="submit" disabled>${escape(form.cta)}</button>
        <p id="form-consent" class="form-consent">${desktopLines(form.consent)}</p>
        <p id="form-status" class="form-status" role="status" tabindex="-1" hidden></p>
        <noscript><p class="form-status">Ative o JavaScript para preencher e continuar com este formulário.</p></noscript>
      </form>
    </section>
  </main>
  <dialog id="mobile-menu" class="mobile-menu" aria-label="Menu de navegação">
    <div class="mobile-menu-top">${image(assets.logo, 'Grupo IOX', 'mobile-menu-logo', 44, 44)}<button class="mobile-menu-close" type="button" aria-label="Fechar menu" autofocus><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div>
    <nav class="mobile-menu-links" aria-label="Navegação mobile"><a href="#para-quem">Para quem é</a><a href="#como-funciona">Como funciona</a><a href="#especialistas">Especialistas</a></nav>
  </dialog>
  <footer class="site-footer"><div class="container">${image(assets.logo, 'Grupo IOX', 'footer-logo', 48, 48)}${renderLegal(legal)}</div></footer>
</body>
</html>`;
}
