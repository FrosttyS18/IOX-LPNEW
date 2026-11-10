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
  for (const [id, value] of [['iox','77,70%'],['cdi','48,83%'],['ibov','42,83%']]) assert.ok(html.includes(`data-chart-return="${id}">${value}</strong>`), `Missing visible chart return: ${id}`);
  assert.ok(!html.includes('Brasil¹'));
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${target}"`), `Missing anchor: ${target}`);
  assert.equal((html.match(/class="essentials-row"/g) || []).length, 4);
});

test('HTML and module imports share a version so cached older styles cannot mix with new markup', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const versions = [...html.matchAll(/(?:href|src)="\/(?:styles\.css|performance\.css|main\.mjs)\?v=([a-f0-9]{12})"/g)].map(match => match[1]);
  assert.equal(versions.length, 3);
  assert.equal(new Set(versions).size, 1);
  for (const file of ['main.mjs','performance.mjs']) {
    const module = await readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');
    const imports = [...module.matchAll(/(?:from\s*|import\s*\()['"]\.\/[^'"]+\.mjs\?v=([a-f0-9]{12})['"]/g)];
    assert.ok(imports.length > 0);
    for (const match of imports) assert.equal(match[1], versions[0]);
  }
});
