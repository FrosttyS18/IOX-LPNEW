import test from 'node:test';
import assert from 'node:assert/strict';
import {demoDays,demoTimes,selectionLabel} from '../src/conversation/agenda-model.mjs';

test('demonstration offers the next five weekdays in Sao Paulo, never the current day',()=>{
  const days=demoDays(new Date('2026-11-13T15:00:00Z'));
  assert.deepEqual(days.map(day=>day.value),['2026-11-16','2026-11-17','2026-11-18','2026-11-19','2026-11-20']);
  assert.equal(demoDays(new Date('2026-11-14T01:00:00Z'))[0].value,'2026-11-16');
});

test('demonstration selection must match one of the offered days and times',()=>{
  const days=demoDays(new Date('2026-11-13T15:00:00Z'));
  assert.ok(demoTimes.includes('10:00'));
  assert.match(selectionLabel(days,'2026-11-16','10:00'),/16.*novembro.*10:00/);
  assert.throws(()=>selectionLabel(days,'2026-11-15','10:00'),RangeError);
  assert.throws(()=>selectionLabel(days,'2026-11-16','03:00'),RangeError);
});
