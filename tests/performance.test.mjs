import test from 'node:test';
import assert from 'node:assert/strict';

test('chart preserves the real common-period return for all three assets', async () => {
  const {normalizeSeries} = await import('../src/performance-model.mjs');
  const {performanceData} = await import('../src/performance-data.mjs');
  const result = normalizeSeries(performanceData);
  assert.equal(result.series.length, 3);
  assert.deepEqual(result.series.map(series => series.points.length), [815, 820, 815]);
  for (const series of result.series) assert.equal(series.points[0][1], 0);
  const expected = [77.70136223, 48.8301148664, 42.8328151821];
  result.series.forEach((series, index) => assert.ok(Math.abs(series.points.at(-1)[1] - expected[index]) < 1e-7));
  assert.ok(result.series[2].points.some(point => point[1] < 0));
});

test('period filter rebases real quotes and rejects empty or inverted windows', async () => {
  const {normalizeSeries, periodStart} = await import('../src/performance-model.mjs');
  const {performanceData} = await import('../src/performance-data.mjs');
  const start = periodStart(performanceData.end, '6M', performanceData.start);
  assert.equal(new Date(start).toISOString().slice(0, 10), '2026-05-09');
  const result = normalizeSeries(performanceData, start, performanceData.end);
  assert.ok(result.start >= start);
  assert.ok(result.series.every(series => series.points.length < 150 && series.points[0][1] === 0));
  assert.throws(() => normalizeSeries(performanceData, performanceData.end, performanceData.start), RangeError);
  assert.throws(() => normalizeSeries(performanceData, performanceData.end, performanceData.end), RangeError);
});

test('narrow chart SVG retains legible axes and original daily curves', async () => {
  const {normalizeSeries, renderPlot} = await import('../src/performance-model.mjs');
  const {performanceData} = await import('../src/performance-data.mjs');
  const svg = renderPlot(normalizeSeries(performanceData), {width:260, height:194});
  assert.equal((svg.match(/data-series=/g) || []).length, 3);
  assert.ok(svg.includes('viewBox="0 0 260 194"'));
  assert.ok(!svg.includes('NaN'));
  assert.ok(!svg.includes('Infinity'));
  assert.ok(svg.includes('77,70%'));
});
