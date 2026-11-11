import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderPerformance} from '../scripts/performance-render.mjs';

const clean = value => value.replace(/<br[^>]*>/g,' ').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();

test('LP B retains the current Figma copy, complete FAQ and field options',async()=>{
  const copy=JSON.parse(await readFile(new URL('../src/lp-b/content.json',import.meta.url),'utf8'));
  const html=await readFile(new URL('../dist/lp-b/index.html',import.meta.url),'utf8');
  const content=clean(html);
  const values=[...copy.nav,...Object.values(copy.hero),...Object.values(copy.group),...Object.values(copy.fund),...Object.values(copy.numbers),copy.liquidity.title,...copy.liquidity.paragraphs,...Object.values(copy.audience),copy.faq.title,...copy.faq.items.flatMap(i=>[i.question,i.answer]),copy.contact.title,copy.contact.cta,copy.contact.consent,...copy.contact.fields.flatMap(f=>[f.label,...f.options])];
  for(const value of values) assert.ok(content.includes(clean(value)),`Missing LP B text: ${value}`);
  assert.equal((html.match(/class="b-faq-item"/g)||[]).length,7);
  assert.equal((html.match(/class="b-faq-item" open/g)||[]).length,0);
  assert.equal((html.match(/name="investments"/g)||[]).length,6);
  assert.equal((html.match(/<select /g)||[]).length,3);
  assert.equal((html.match(/<h1 /g)||[]).length,1);
  for(const [,target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${target}"`),`Missing B anchor: ${target}`);
  for(const [,attributes] of html.matchAll(/<img ([^>]+)>/g)) assert.ok(/alt="[^"]*"/.test(attributes));
  assert.ok(!content.includes('Aguardando o compliance'));
  const legal=JSON.parse(await readFile(new URL('../src/legal.json',import.meta.url),'utf8'));
  for(const paragraph of legal.paragraphs) assert.ok(content.includes(clean(paragraph)), 'Missing supplied legal paragraph');
});

test('LP B uses a gold chart without changing the LP A series color or quotes',()=>{
  assert.ok(renderPerformance().includes('--series-color:#1f9d5c'));
  const b=renderPerformance('#e6c27a');
  assert.ok(b.includes('data-chart-accent="#e6c27a"'));
  assert.ok(b.includes('--series-color:#e6c27a'));
  for(const value of ['77,70%','48,83%','42,83%']) assert.ok(b.includes(value));
  assert.ok(renderPerformance().includes('--series-color:#1f9d5c'));
});

test('LP B styles and entry point are versioned and assets use the own CDN',async()=>{
  const html=await readFile(new URL('../dist/lp-b/index.html',import.meta.url),'utf8');
  const versions=[...html.matchAll(/(?:href|src)="\/(?:styles\.css|performance\.css|lp-b\/styles\.css|lp-b\/main\.mjs)\?v=([a-f0-9]{12})"/g)].map(m=>m[1]);
  assert.equal(versions.length,4);
  assert.equal(new Set(versions).size,1);
  const assets=JSON.parse(await readFile(new URL('../src/lp-b/assets.json',import.meta.url),'utf8'));
  for(const asset of Object.values(assets)) assert.ok(asset.startsWith('https://cdn.frostty.com.br/'));
});
