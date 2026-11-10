import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('published markup follows the revised Figma copy and preserves form options', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  for (const expected of [
    'O Fundo IOX 90 é reservado a um grupo seleto de investidores: quem já tem uma carteira consolidada e busca diversificar com crédito privado.',
    'Agendar uma conversa', 'Resultado consistente, mês após mês.', '159%', '20,38%',
    'Nenhum mês no negativo', 'lâmina de outubro de 2026.',
    'Um dos maiores do país em FIDC.', 'Discreto como deve ser.',
    'Top 10', 'Estrutura', 'A partir de R$ 25 mil.', 'Depois, aportes livres.',
    'Sem pressa e sem roteiro pronto.', 'Agende sua conversa.', 'Quero agendar',
    'Crédito Estruturado', 'Estou avaliando', 'Noite'
  ]) assert.ok(text.includes(expected), `Missing revised copy: ${expected}`);
  assert.ok(!html.includes('class="qualification"'));
  assert.ok(!html.includes('data-counter="3.8"'));
  assert.ok(html.includes('class="performance-chart"'));
  assert.ok(!html.includes('Brasil¹'));
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${target}"`), `Missing anchor: ${target}`);
  assert.equal((html.match(/class="essentials-row"/g) || []).length, 4);
});
