import {investedOptions,investmentOptions,intentionOptions,timeOptions,confirmationCopy} from '../src/conversation/content.mjs';

const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const choice=(name,option,multiple=false)=>`<label class="quiz-choice"><input type="${multiple?'checkbox':'radio'}" name="${name}" value="${escape(option.value)}"><span>${name==='invested'?escape(option.label).replace(' a R$','<br>a R$'):escape(option.label)}</span></label>`;
const actions=(step)=>`<div class="quiz-actions">${step>1?'<button class="quiz-back" type="button" data-back>← Voltar</button>':'<span></span>'}<button class="confirmation-button quiz-next" type="${step===4?'submit':'button'}" ${step===4?'':'data-next'} disabled>${step===4?'Quero minha conversa.':'Continuar'}</button></div>`;
const error=name=>`<p class="quiz-error" id="error-${name}" data-error="${name}" role="alert" hidden></p>`;

export function renderQuiz(assets){
  const steps=[
    {question:'Quanto você tem<br>investido hoje?',name:'invested',options:investedOptions},
    {question:'Onde você já investe?',name:'investments',options:investmentOptions,multiple:true},
    {question:'Pretende investir nos<br>próximos 30 dias?',name:'intention',options:intentionOptions}
  ];
  const sections=steps.map((step,i)=>`<section class="quiz-step" data-step="${i+1}" ${i?'hidden':''} aria-labelledby="question-${i+1}">
    <h1 class="quiz-title" id="question-${i+1}" tabindex="-1">${step.question}</h1>
    <fieldset class="quiz-options" aria-labelledby="question-${i+1}" aria-describedby="error-${step.name}${step.multiple?' investment-hint':''}">${step.options.map(option=>choice(step.name,option,step.multiple)).join('')}</fieldset>
    ${step.multiple?'<p class="quiz-hint" id="investment-hint">Você pode selecionar mais de uma opção.</p>':''}${error(step.name)}${actions(i+1)}
  </section>`).join('');
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#ffffff"><title>Converse com um especialista | Grupo IOX</title><meta name="description" content="Responda quatro perguntas para preparar sua conversa com um especialista do Grupo IOX."><link rel="icon" href="${escape(assets.logo)}" type="image/webp"><link rel="preload" href="${escape(assets.fontRegular)}" as="font" type="font/ttf" crossorigin><link rel="preload" href="${escape(assets.fontSemiBold)}" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/conversation/styles.css"><link rel="stylesheet" href="/conversation/quiz.css"></head>
<body class="confirmation-page quiz-page"><a class="confirmation-skip" href="#conteudo">Ir para o conteúdo</a>
<div class="confirmation-shell quiz-shell">
  <header class="confirmation-mobile-brand"><a data-return href="/" aria-label="Grupo IOX — voltar para o site"><img src="${escape(assets.logo)}" alt="Grupo IOX" width="32" height="32"></a></header>
  <aside class="confirmation-context quiz-context" aria-label="Grupo IOX"><a class="confirmation-brand" data-return href="/" aria-label="Grupo IOX — voltar para o site"><img src="${escape(assets.logo)}" alt="Grupo IOX" width="44" height="44"></a><p>Fundo IOX 90</p><p class="quiz-context-copy">Responda 4 perguntas<br>rápidas para o especialista<br>preparar a sua conversa.</p><img class="confirmation-glass" src="${escape(assets.heroGlass)}" alt="" width="1052" height="1052" decoding="async"></aside>
  <main class="confirmation-main quiz-main" id="conteudo"><a class="confirmation-return" data-return href="/">Voltar para o site</a>
    <div class="quiz-progress"><div class="quiz-progress-label"><span data-progress-label>Etapa 1 de 4</span><span data-progress-percent>25%</span></div><div class="quiz-progress-track" role="progressbar" aria-label="Progresso do formulário" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25"><span data-progress-fill></span></div></div>
    <form id="conversation-form" novalidate>${sections}
      <section class="quiz-step quiz-contact" data-step="4" hidden aria-labelledby="question-4"><h1 class="quiz-title" id="question-4" tabindex="-1">Para quem o especialista<br>deve ligar?</h1>
        <div class="quiz-fields">
          <div class="quiz-field quiz-field-name"><label for="quiz-name">Nome</label><input id="quiz-name" name="name" type="text" autocomplete="name" maxlength="100" placeholder="Digite seu nome" required aria-describedby="error-name">${error('name')}</div>
          <div class="quiz-field"><label for="quiz-email">E-mail</label><input id="quiz-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="seu@email.com" required aria-describedby="error-email">${error('email')}</div>
          <div class="quiz-field"><label for="quiz-phone">Celular (WhatsApp)</label><input id="quiz-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="22" placeholder="(99) 99999-9999" required aria-describedby="error-phone">${error('phone')}</div>
        </div>
        <fieldset class="quiz-time" aria-describedby="error-preferredTime"><legend>Qual o melhor horário para falarmos?</legend><div class="quiz-time-options">${timeOptions.map(option=>choice('preferredTime',option)).join('')}</div>${error('preferredTime')}</fieldset>
        ${actions(4)}
        <p class="quiz-consent">Ao enviar, você concorda com a <a href="${escape(confirmationCopy.privacyUrl)}" target="_blank" rel="noopener noreferrer">Política de Privacidade</a> e em receber contato do Grupo IOX.</p>
      </section>
      <noscript><p>Ative o JavaScript para continuar com este formulário.</p></noscript>
    </form>
  </main>
</div><script type="module" src="/conversation/quiz.mjs"></script></body></html>`;
}
