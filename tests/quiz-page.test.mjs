import test from 'node:test';
import assert from 'node:assert/strict';
import {renderQuiz} from '../scripts/render-quiz.mjs';
import {investedOptions,investmentOptions,intentionOptions,timeOptions} from '../src/conversation/content.mjs';

const html=renderQuiz({logo:'https://cdn.frostty.com.br/logo.webp',heroGlass:'https://cdn.frostty.com.br/glass.webp',fontRegular:'https://cdn.frostty.com.br/regular.ttf',fontSemiBold:'https://cdn.frostty.com.br/semibold.ttf'});
test('quiz keeps all four questions and seven fields with no initial answer',()=>{
  const text=html.replace(/<br>/g,' ').replace(/<[^>]+>/g,'');
  for(const item of [...investedOptions,...investmentOptions,...intentionOptions,...timeOptions])assert.ok(text.includes(item.label),item.label);
  assert.equal((html.match(/data-step="[1-4]"/g)||[]).length,4);
  for(const name of ['invested','investments','intention','name','email','phone','preferredTime'])assert.ok(html.includes(`name="${name}"`),name);
  assert.doesNotMatch(html,/\schecked(?:\s|>)/);
  assert.equal((html.match(/type="checkbox"/g)||[]).length,6);
  assert.ok(html.includes('role="progressbar"'));
  assert.ok(html.includes('Ao enviar, você concorda com a'));
  assert.ok(html.includes('Quero minha conversa.'));
});
