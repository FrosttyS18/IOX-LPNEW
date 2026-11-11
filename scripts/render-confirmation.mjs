const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderConfirmation(copy,assets){
  const message=copy.desktopMessage.split('\n').map(line=>`<span>${escape(line)}</span>`).join(' ');
  const agenda=copy.agendaUrl?`<a class="confirmation-button" href="${escape(copy.agendaUrl)}">${escape(copy.action)}</a>`:`<button class="confirmation-button" type="button" data-agenda disabled>${escape(copy.action)}</button>`;
  return `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#ffffff">
<title>Recebemos seus dados | Grupo IOX</title>
<meta name="description" content="O próximo passo é uma conversa com um especialista do Grupo IOX.">
<meta property="og:type" content="website"><meta property="og:title" content="Grupo IOX"><meta property="og:image" content="${escape(assets.ogImage)}">
<link rel="icon" href="${escape(assets.logo)}" type="image/webp">
<link rel="preload" href="${escape(assets.fontRegular)}" as="font" type="font/ttf" crossorigin>
<link rel="preload" href="${escape(assets.fontSemiBold)}" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="/conversation/styles.css">
</head><body class="confirmation-page">
<a class="confirmation-skip" href="#conteudo">Ir para o conteúdo</a>
<div class="confirmation-shell">
  <header class="confirmation-mobile-brand"><a data-return href="/" aria-label="Grupo IOX — voltar para o site"><img src="${escape(assets.logo)}" alt="Grupo IOX" width="32" height="32"></a></header>
  <aside class="confirmation-context" aria-label="Grupo IOX">
    <a class="confirmation-brand" data-return href="/" aria-label="Grupo IOX — voltar para o site"><img src="${escape(assets.logo)}" alt="Grupo IOX" width="44" height="44"></a>
    <p>O próximo passo<br>é uma conversa.</p>
    <img class="confirmation-glass" src="${escape(assets.heroGlass)}" alt="" width="1052" height="1052" decoding="async">
  </aside>
  <main class="confirmation-main" id="conteudo">
    <a class="confirmation-return" data-return href="/">Voltar para o site</a>
    <div class="confirmation-copy">
      <h1><span>Recebemos</span> <span>seus dados.</span></h1>
      <p class="confirmation-message">${message}</p>
      <div class="confirmation-action">${agenda}</div>
      <p class="confirmation-factsheet"><span>Enquanto isso, conheça</span> <span>a lâmina do Fundo IOX 90.</span></p>
      <a class="confirmation-factsheet-link" href="${escape(copy.factsheetUrl)}" target="_blank" rel="noopener noreferrer">${escape(copy.factsheetAction)}</a>
    </div>
  </main>
</div>
<dialog class="agenda-dialog" aria-labelledby="agenda-title" aria-describedby="agenda-description">
  <button class="agenda-close" type="button" data-agenda-close aria-label="Fechar agenda">×</button>
  <p class="agenda-eyebrow">Agendar uma conversa</p>
  <h2 id="agenda-title">Escolha o melhor horário.</h2>
  <p id="agenda-description" class="agenda-description">Escolha um dia e horário para conversar com um especialista do Grupo IOX.</p>
  <form class="agenda-form">
    <fieldset><legend>Dia da conversa</legend><div class="agenda-days" data-agenda-days></div></fieldset>
    <fieldset><legend>Horário</legend><div class="agenda-times" data-agenda-times></div></fieldset>
    <p class="agenda-timezone">Horário de Brasília</p>
    <button class="confirmation-button agenda-confirm" type="submit" data-agenda-confirm disabled>Selecionar horário</button>
    <div class="agenda-status" data-agenda-status role="status" tabindex="-1" hidden><p>Horário selecionado</p><strong></strong></div>
  </form>
</dialog>
<script type="module" src="/conversation/thanks.mjs"></script>
</body></html>`;
}
