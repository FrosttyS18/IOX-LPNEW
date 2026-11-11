import test from 'node:test';
import assert from 'node:assert/strict';
import {renderConfirmation} from '../scripts/render-confirmation.mjs';
import {confirmationCopy} from '../src/conversation/content.mjs';

const assets={logo:'https://cdn.frostty.com.br/logo.webp',heroGlass:'https://cdn.frostty.com.br/glass.webp',ogImage:'https://cdn.frostty.com.br/og.jpg',fontRegular:'https://cdn.frostty.com.br/regular.ttf',fontSemiBold:'https://cdn.frostty.com.br/semibold.ttf'};
const html=renderConfirmation(confirmationCopy,assets);
const normalized=html.replace(/<br[^>]*>/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();

test('confirmation retains the complete approved message and next actions',()=>{
  for(const value of [confirmationCopy.title,confirmationCopy.message,confirmationCopy.action,confirmationCopy.factsheet])assert.ok(normalized.includes(value),value);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.ok(html.includes('<main'));
  assert.ok(html.includes(confirmationCopy.factsheetUrl));
  assert.ok(html.includes('data-return'));
  assert.ok(!html.includes('Nenhum dado foi enviado'));
  assert.ok(!html.includes('activecampaign'));
});

test('confirmation does not invent an agenda destination or a P5',()=>{
  assert.ok(html.includes('data-agenda disabled'));
  assert.ok(!html.includes('href="/agenda'));
  assert.ok(html.includes('rel="noopener noreferrer"'));
});
