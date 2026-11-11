import {normalizeSeries, periodStart, renderPlot, formatDate, formatReturn} from './performance-model.mjs';

export function enhancePerformance(chart) {
  if (!chart) return;
  const plot = chart.querySelector('.performance-plot');
  const tooltip = chart.querySelector('.chart-tooltip');
  const status = chart.querySelector('.chart-status');
  const details = [...chart.querySelectorAll('details')];
  const visible = new Set(['iox','cdi','ibov']);
  let data;
  let result;
  let start;
  let end;
  let ready;
  let activeIndex = 0;

  const close = () => details.forEach(detail => detail.open = false);
  const error = message => {status.classList.remove('visually-hidden'); status.textContent = message;};
  const draw = () => {
    if (!result) return;
    plot.querySelector('svg').outerHTML = renderPlot(result, {width:Math.max(220, Math.round(plot.clientWidth)), height:194, visible:[...visible]});
    chart.querySelector('[data-chart-range]').textContent = `${formatDate(result.start)} — ${formatDate(result.end)}`;
    chart.querySelectorAll('[data-chart-series]').forEach(input => input.checked = visible.has(input.dataset.chartSeries));
    chart.querySelectorAll('[data-chart-legend]').forEach(button => button.setAttribute('aria-pressed', String(visible.has(button.dataset.chartLegend))));
    result.series.forEach(series => chart.querySelector(`[data-chart-return="${series.id}"]`).textContent = formatReturn(series.points.at(-1)[1]));
    tooltip.hidden = true;
    activeIndex = 0;
    status.classList.add('visually-hidden');
    status.textContent = `Período de ${formatDate(result.start)} a ${formatDate(result.end)}. ${visible.size} séries visíveis.`;
  };
  const load = () => ready ||= import('./performance-data.mjs').then(module => {
    data = module.performanceData;
    start = data.start;
    end = data.end;
    result = normalizeSeries(data, start, end);
    chart.querySelectorAll('button:disabled,input:disabled').forEach(control => control.disabled = false);
    draw();
  }).catch(() => {error('Não foi possível carregar os controles. O gráfico completo continua disponível.');});

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {if (entries.some(entry => entry.isIntersecting)) {load();observer.disconnect();}}, {rootMargin:'250px'});
    observer.observe(chart);
  } else load();
  chart.addEventListener('focusin', load, {once:true});
  new ResizeObserver(draw).observe(plot);

  chart.querySelectorAll('[data-chart-period]').forEach(button => button.addEventListener('click', async () => {
    await load();
    if (!data) return;
    end = data.end;
    start = periodStart(end, button.dataset.chartPeriod, data.start);
    result = normalizeSeries(data, start, end);
    chart.querySelectorAll('[data-chart-period]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    chart.querySelector('[data-chart-start]').value = new Date(start).toISOString().slice(0,10);
    chart.querySelector('[data-chart-end]').value = new Date(end).toISOString().slice(0,10);
    close();
    draw();
  }));
  const toggle = (id, checked) => {
    if (checked) visible.add(id); else visible.delete(id);
    draw();
  };
  chart.querySelectorAll('[data-chart-series]').forEach(input => input.addEventListener('change', () => toggle(input.dataset.chartSeries, input.checked)));
  chart.querySelectorAll('[data-chart-legend]').forEach(button => button.addEventListener('click', () => toggle(button.dataset.chartLegend, !visible.has(button.dataset.chartLegend))));
  chart.querySelector('[data-chart-apply]').addEventListener('click', async () => {
    await load();
    if (!data) return;
    const first = chart.querySelector('[data-chart-start]').valueAsNumber;
    const last = chart.querySelector('[data-chart-end]').valueAsNumber;
    try {
      if (first < data.start || last > data.end) throw new RangeError('Escolha datas entre 03/08/2023 e 09/11/2026.');
      const next = normalizeSeries(data, first, last);
      start = first; end = last; result = next;
      chart.querySelectorAll('[data-chart-period]').forEach(button => button.setAttribute('aria-pressed', 'false'));
      close(); draw();
    } catch (cause) {error(cause.message);}
  });
  details.forEach(detail => detail.addEventListener('toggle', () => {if (detail.open) details.filter(item => item !== detail).forEach(item => item.open = false);}));
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.chart-filter')) close();
    if (!plot.contains(event.target)) hideInspection();
  });
  chart.addEventListener('keydown', event => {
    if (event.key === 'Escape') {const open = details.find(detail => detail.open);close();open?.querySelector('summary').focus();hideInspection();}
  });
  const hideInspection = () => {
    tooltip.hidden = true;
    plot.querySelector('[data-chart-cursor]')?.setAttribute('visibility', 'hidden');
  };
  const inspect = (index, pointer) => {
    if (!result || !visible.size) {hideInspection();return;}
    const points = result.series[0].points;
    activeIndex = Math.max(0, Math.min(points.length - 1, index));
    const date = points[activeIndex][0];
    const dateLabel = document.createElement('strong');
    dateLabel.className = 'chart-tooltip-date';
    dateLabel.textContent = formatDate(date);
    tooltip.replaceChildren(dateLabel);
    const svg = plot.querySelector('svg');
    const cursor = svg.querySelector('[data-chart-cursor]');
    const width = svg.viewBox.baseVal.width;
    const height = svg.viewBox.baseVal.height;
    const x = 26 + (date - result.start) / (result.end - result.start) * (width - 27);
    const min = Number(svg.dataset.min);
    const max = Number(svg.dataset.max);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', `M${x} 10V${height - 30}`);
    line.setAttribute('stroke', '#a4aca7');
    line.setAttribute('stroke-dasharray', '3 4');
    cursor.replaceChildren(line);
    for (const series of result.series.filter(item => visible.has(item.id))) {
      const point = series.points.reduce((nearest, candidate) => Math.abs(candidate[0] - date) < Math.abs(nearest[0] - date) ? candidate : nearest);
      const row = document.createElement('span');
      row.className = 'chart-tooltip-row';
      row.style.color = series.color;
      const swatch = document.createElement('i');
      swatch.setAttribute('aria-hidden', 'true');
      const name = document.createElement('span');
      name.textContent = series.name;
      const value = document.createElement('b');
      value.textContent = formatReturn(point[1]);
      row.append(swatch, name, value);
      tooltip.append(row);
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', String(x));
      dot.setAttribute('cy', String(10 + (max - point[1]) / (max - min) * (height - 40)));
      dot.setAttribute('r', '3.5');
      dot.setAttribute('fill', series.color);
      dot.setAttribute('stroke', '#000');
      dot.setAttribute('stroke-width', '1.5');
      cursor.append(dot);
    }
    cursor.setAttribute('visibility', 'visible');
    tooltip.hidden = false;
    const anchorX = pointer?.x ?? x;
    const anchorY = pointer?.y ?? 30;
    const left = anchorX + tooltip.offsetWidth + 16 > plot.clientWidth ? anchorX - tooltip.offsetWidth - 16 : anchorX + 16;
    tooltip.style.left = `${Math.max(0, Math.min(plot.clientWidth - tooltip.offsetWidth, left))}px`;
    tooltip.style.top = `${Math.max(0, Math.min(plot.clientHeight - tooltip.offsetHeight, anchorY - tooltip.offsetHeight - 12))}px`;
  };
  const inspectPointer = event => {
    if (!result) return;
    const box = plot.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - box.left - 26) / (box.width - 27)));
    const target = result.start + ratio * (result.end - result.start);
    const points = result.series[0].points;
    const index = points.reduce((nearest, point, i) => Math.abs(point[0] - target) < Math.abs(points[nearest][0] - target) ? i : nearest, 0);
    inspect(index, {x:event.clientX - box.left, y:event.clientY - box.top});
  };
  plot.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse') return;
    plot.setPointerCapture(event.pointerId);
    inspectPointer(event);
  });
  plot.addEventListener('pointermove', inspectPointer);
  plot.addEventListener('pointerup', event => {if (event.pointerType !== 'mouse') inspectPointer(event);});
  plot.addEventListener('pointerleave', event => {if (event.pointerType === 'mouse') hideInspection();});
  plot.addEventListener('pointercancel', event => {if (event.pointerType === 'mouse') hideInspection();});
  plot.addEventListener('blur', hideInspection);
  plot.addEventListener('keydown', event => {
    if (!result || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    inspect(event.key === 'Home' ? 0 : event.key === 'End' ? result.series[0].points.length - 1 : activeIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  });
}
