import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeExclusiveSelection} from '../src/investment-selection.mjs';

test('single-screen and stepped forms share the exclusive no-investments rule',()=>{
  for(const [first,second,none]of [['1','4','6'],['fixed-income','property','none']]){
    assert.deepEqual(normalizeExclusiveSelection([first,second],second,none),[first,second]);
    assert.deepEqual(normalizeExclusiveSelection([first,second,none],none,none),[none]);
    assert.deepEqual(normalizeExclusiveSelection([none,second],second,none),[second]);
    assert.deepEqual(normalizeExclusiveSelection([],none,none),[]);
  }
});

test('normalization preserves the input and rejects malformed selection values',()=>{
  const values=['1','4'];
  assert.deepEqual(normalizeExclusiveSelection(values,'4','6'),['1','4']);
  assert.deepEqual(values,['1','4']);
  assert.throws(()=>normalizeExclusiveSelection(null,'4','6'),TypeError);
  assert.throws(()=>normalizeExclusiveSelection([1],'4','6'),TypeError);
});
