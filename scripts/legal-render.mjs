export const privacyPolicyLink = '<a href="https://grupoiox.com.br/politica-de-privacidade/" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>';

const approvedLinks = [
  ['https://iox.com.vc/investimento/fic-de-fidc-iox-90/', 'https://iox.com.vc/investimento/fic-de-fidc-iox-90/'],
  ['qiajuda@qitech.com.br', 'mailto:qiajuda@qitech.com.br'],
  ['tercon@terconbr.com.br', 'mailto:tercon@terconbr.com.br']
];

const escapeHTML = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

export function renderLegal(legal) {
  if (!Array.isArray(legal.paragraphs) || legal.paragraphs.length !== 14 || !legal.paragraphs.every(paragraph => typeof paragraph === 'string')) {
    throw new TypeError('O texto legal deve conter os 14 parágrafos fornecidos.');
  }
  if (!Array.isArray(legal.links) || legal.links.length !== 3 || !approvedLinks.every(([text, href]) => legal.links.some(link => link.text === text && link.href === href))) {
    throw new TypeError('Os três links legais devem corresponder aos destinos fornecidos.');
  }
  const paragraphs = legal.paragraphs.map(paragraph => {
    let html = escapeHTML(paragraph);
    for (const [text, href] of approvedLinks) {
      html = html.replaceAll(escapeHTML(text), `<a href="${escapeHTML(href)}">${escapeHTML(text)}</a>`);
    }
    return `<p>${html}</p>`;
  });
  return `<div class="footer-legal">\n${paragraphs[0]}\n<details class="legal-details"><summary class="legal-toggle"><span class="legal-expand-label">Ver mais</span><span class="legal-collapse-label">Ver menos</span></summary><div class="legal-remainder">\n${paragraphs.slice(1).join('\n')}\n</div></details>\n</div>`;
}
