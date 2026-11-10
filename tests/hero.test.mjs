import test from 'node:test';
import assert from 'node:assert/strict';
const heroModule = await import('../src/hero.mjs').catch(() => ({}));

test('UTM resolves the five hypotheses and current creative names', () => {
  assert.equal(typeof heroModule.resolveHeroKey, 'function');
  for (const key of ['H1', 'H2', 'H3', 'H4', 'H5']) {
    assert.equal(heroModule.resolveHeroKey(key), key);
    assert.equal(heroModule.resolveHeroKey(`${key}_FEED_V4`), key);
    assert.equal(heroModule.resolveHeroKey(key.toLowerCase()), key);
  }
});

test('missing, unknown and hostile UTM values retain the default hero', () => {
  assert.equal(typeof heroModule.resolveHeroKey, 'function');
  for (const value of [null, undefined, '', 'H10', 'unrelated', '<img src=x onerror=alert(1)>']) {
    assert.equal(heroModule.resolveHeroKey(value), 'fallback');
  }
});
