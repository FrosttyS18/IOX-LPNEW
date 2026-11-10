import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('built page retains all shared source copy, fields, options and supplied legal', async () => {
  const source = JSON.parse(await readFile(new URL('../src/content.json', import.meta.url), 'utf8'));
  const legal = JSON.parse(await readFile(new URL('../src/legal.json', import.meta.url), 'utf8'));
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8').catch(() => '');
  const text = html.replace(/<\/?a(?:\s[^>]*)?>/g, '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ');
  const strings = [];
  const add = value => { if (typeof value === 'string') strings.push(value); };
  const sections = source.sections;
  sections[1].copy.items.forEach(add); add(sections[1].copy.note);
  add(sections[2].copy.title); add(sections[2].copy.text);
  add(sections[3].copy.title); sections[3].copy.steps.forEach(s => {add(s.label); add(s.text);});
  sections[4].copy.items.forEach(s => {add(s.label); add(s.text);});
  add(sections[5].copy.title); add(sections[5].copy.text); sections[5].copy.names.forEach(add);
  add(sections[6].copy.title); add(sections[6].copy.text);
  sections[6].copy.fields.forEach(f => {add(f.label); (f.options || []).forEach(add);});
  add(sections[6].copy.cta); add(sections[6].copy.consent); legal.paragraphs.forEach(add);
  for (const value of strings) assert.ok(text.includes(value.replace(/\s+/g, ' ')), `Missing source copy: ${value}`);
  assert.equal((html.match(/<form\b/g) || []).length, 1);
  assert.equal((html.match(/<div class="footer-legal">/g) || []).length, 1);
  for (const link of legal.links) assert.ok(html.includes(`href="${link.href}"`));
  assert.ok(!html.includes('class="illustration-caption"'), 'Visible editorial caption was removed by the designer');
});
