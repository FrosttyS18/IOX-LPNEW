import test from 'node:test';
import assert from 'node:assert/strict';
import {validateStep, firstIncompleteStep, normalizeInvestments, returnPath, thankYouPath} from '../src/conversation/model.mjs';

const valid={invested:'one-to-five-million',investments:['fixed-income','property'],intention:'yes',name:'Maria Silva',email:'maria@example.com',phone:'(11) 99999-1234',preferredTime:'afternoon'};

test('qualification requires the same valid choices before accepting contact details',()=>{
  assert.deepEqual(validateStep(1,valid),{});
  assert.deepEqual(validateStep(2,valid),{});
  assert.deepEqual(validateStep(3,valid),{});
  assert.deepEqual(validateStep(4,valid),{});
  assert.equal(firstIncompleteStep(valid),null);
  assert.equal(firstIncompleteStep({...valid,invested:''}),1);
  assert.equal(firstIncompleteStep({...valid,investments:[]}),2);
  assert.equal(firstIncompleteStep({...valid,intention:''}),3);
  assert.equal(firstIncompleteStep({...valid,email:'incompleto'}),4);
  assert.ok(validateStep(1,{...valid,invested:'outside-option'}).invested);
  assert.ok(validateStep(2,{...valid,investments:['outside-option']}).investments);
  assert.ok(validateStep(3,{...valid,intention:'outside-option'}).intention);
});

test('contact validation rejects missing or malformed contact without changing answers',()=>{
  const answers={...valid,name:' ',email:'x@',phone:'123',preferredTime:''};
  const before=structuredClone(answers);
  const errors=validateStep(4,answers);
  assert.deepEqual(Object.keys(errors).sort(),['email','name','phone','preferredTime']);
  assert.deepEqual(answers,before);
  assert.deepEqual(validateStep(4,{...valid,phone:'(11) 3333-4444'}),{});
});

test('the no-investments answer cannot coexist with investment classes',()=>{
  assert.deepEqual(normalizeInvestments(['fixed-income','property','none'],'none'),['none']);
  assert.deepEqual(normalizeInvestments(['none','property'],'property'),['property']);
  assert.deepEqual(normalizeInvestments(['fixed-income','property'],'property'),['fixed-income','property']);
  assert.ok(validateStep(2,{...valid,investments:['none','property']}).investments);
});

test('return and confirmation paths never forward arbitrary URLs or personal data',()=>{
  assert.equal(returnPath('a'),'/');
  assert.equal(returnPath('b'),'/lp-b/');
  assert.equal(returnPath('https://outside.test'),'/');
  assert.equal(thankYouPath('b'),'/obrigado/?origem=b');
  assert.equal(thankYouPath('maria@example.com'),'/obrigado/?origem=a');
});
