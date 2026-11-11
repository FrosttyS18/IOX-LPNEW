import test from 'node:test';
import assert from 'node:assert/strict';
import {validateJourney,nextJourney,previousJourney,readLead,journeyProgress} from '../src/conversation/journey-model.mjs';
import {journeyView} from '../src/conversation/journey-view.mjs';

test('qualificação, disponibilidade e conhecimento de FIDC controlam as três saídas',()=>{
  for(const [step,key] of [[2,'qualified'],[3,'available'],[5,'knowsFidc']]){
    assert.deepEqual(nextJourney({step,profilePart:0},{[key]:'no'},false),{step:'exit',profilePart:0});
    assert.deepEqual(nextJourney({step,profilePart:0},{[key]:'yes'},false),{step:step+1,profilePart:0});
    assert.ok(Object.keys(validateJourney({step,profilePart:0},{[key]:'invalid'},false)).length);
  }
});
test('perfil mobile pagina as duas perguntas sem alterar as nove etapas',()=>{
  const state={step:4,profilePart:0},answers={wealth:'1-3'};
  assert.deepEqual(validateJourney(state,answers,true),{});
  assert.deepEqual(nextJourney(state,answers,true),{step:4,profilePart:1});
  assert.equal(journeyProgress({step:4,profilePart:1}),44);
  assert.ok(validateJourney({step:4,profilePart:1},answers,true).suitability);
  answers.suitability='moderate';
  assert.deepEqual(nextJourney({step:4,profilePart:1},answers,true),{step:5,profilePart:0});
  assert.deepEqual(previousJourney({step:4,profilePart:1},true),state);
  assert.deepEqual(previousJourney({step:5,profilePart:0},true),{step:4,profilePart:1});
  assert.ok(validateJourney(state,{wealth:'1-3'},false).suitability);
});
test('momento e preferência de contato são obrigatórios, inclusive a opção sem contato',()=>{
  assert.ok(validateJourney({step:7},{},false).moment);
  assert.ok(validateJourney({step:8},{},false).contact);
  for(const contact of ['phone','whatsapp','none']){
    assert.deepEqual(validateJourney({step:8},{contact},false),{});
    assert.equal(nextJourney({step:8},{contact},false).step,9);
  }
});
test('contato é capturado de FormData sem confundir a seleção múltipla das LPs',()=>{
  const form=new FormData();form.set('name','  Ana Silva  ');form.set('email','ana@example.com');form.set('phone','(11) 99999-9999');form.set('invested','3');form.append('currentInvestments','1');form.append('currentInvestments','4');form.set('timing','1');form.set('preferredTime','2');
  const lead=readLead(form,'a');
  assert.equal(lead.name,'Ana Silva');assert.equal(lead.email,'ana@example.com');assert.deepEqual(lead.investments,['1','4']);assert.equal(lead.source,'a');
  form.delete('currentInvestments');form.append('investments','2');form.append('investments','3');assert.deepEqual(readLead(form,'b').investments,['2','3']);
  form.set('name','');assert.throws(()=>readLead(form,'a'),/contato/i);
});

test('final personaliza com texto escapado e o mobile apresenta uma pergunta de perfil por vez',()=>{
  const lead={name:'<img src=x onerror=alert(1)>'};
  const final=journeyView({step:9},{},lead,true);
  assert.ok(final.includes('Obrigado, &lt;img'));assert.ok(!final.includes('<img src=x'));
  assert.ok(final.includes('class="j-success"'));assert.ok(!final.includes('agenda'));
  const first=journeyView({step:4,profilePart:0},{},lead,true);
  const second=journeyView({step:4,profilePart:1},{},lead,true);
  assert.ok(first.includes('name="wealth"'));assert.ok(!first.includes('name="suitability"'));
  assert.ok(second.includes('name="suitability"'));assert.ok(!second.includes('name="wealth"'));
  assert.ok(first.includes('1 de 2'));assert.ok(second.includes('2 de 2'));
  const fund=journeyView({step:6},{},lead,true);assert.ok(fund.includes('class="j-download"'));assert.ok(fund.includes('download>'));assert.ok(fund.includes('Ver o fundo no Mais Retorno'));
  const contribution=journeyView({step:3},{},lead,true);
  assert.ok(!contribution.includes('j-line-break'));assert.ok(contribution.includes('<span class="j-keep">IOX 90</span>'));assert.ok(contribution.includes('<span class="j-keep">R$ 25 mil</span>'));
});
