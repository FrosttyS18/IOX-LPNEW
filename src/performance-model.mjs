export function periodStart(end, period, earliest) {
  const months = { '6M':6, '1A':12, '2A':24, '3A':36, '5A':60 }[period];
  if (!months) return earliest;
  const date = new Date(end);
  const month = date.getUTCMonth() - months;
  const day = Math.min(date.getUTCDate(), new Date(Date.UTC(date.getUTCFullYear(), month + 1, 0)).getUTCDate());
  return Math.max(earliest, Date.UTC(date.getUTCFullYear(), month, day));
}

export function normalizeSeries(data, start = data.start, end = data.end) {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) throw new RangeError('Escolha um intervalo com pelo menos duas datas de cotação.');
  const dates = data.series.map(series => new Set(series.quotes.map(quote => quote[0])));
  const common = data.series[0].quotes.filter(([date]) => date >= start && date <= end && dates.every(set => set.has(date)));
  if (common.length < 2) throw new RangeError('Escolha um intervalo com pelo menos duas datas de cotação.');
  const first = common[0][0];
  const last = common.at(-1)[0];
  const series = data.series.map(asset => {
    const quotes = asset.quotes.filter(([date]) => date >= first && date <= last);
    const base = quotes[0][1];
    if (!Number.isFinite(base) || base <= 0) throw new RangeError('Cotação inicial indisponível.');
    return {id:asset.id, name:asset.name, color:asset.color, points:quotes.map(([date, value]) => [date, (value / base - 1) * 100])};
  });
  return {start:first, end:last, series};
}

export const formatDate = value => new Intl.DateTimeFormat('pt-BR', {timeZone:'UTC'}).format(value);
export const formatReturn = value => `${value.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})}%`;

export function renderPlot(result, {width = 604, height = 194, visible = ['iox','cdi','ibov']} = {}) {
  const shown = result.series.filter(series => visible.includes(series.id));
  const values = shown.flatMap(series => series.points.map(point => point[1]));
  const lowest = Math.min(0, ...values);
  const highest = Math.max(1, ...values);
  const rawStep = (highest - lowest) / 5;
  const power = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1,2,5,10,20].map(value => value * power).find(value => value >= rawStep);
  const min = Math.floor(lowest / step) * step;
  const max = Math.max(step, Math.ceil(highest / step) * step);
  const left = 26;
  const right = width - 1;
  const top = 10;
  const bottom = height - 30;
  const x = date => left + (date - result.start) / (result.end - result.start) * (right - left);
  const y = value => top + (max - value) / (max - min) * (bottom - top);
  let grid = '';
  for (let value = min; value <= max + step / 100; value += step) {
    const position = y(value);
    const label = `${Number(value.toFixed(2)).toLocaleString('pt-BR')}%`;
    grid += `<path d="M${left} ${position.toFixed(3)}H${right}" fill="none" stroke="#303633" stroke-width=".7" ${value === 0 ? '' : 'stroke-dasharray="2 5"'}/><text x="14" y="${(position + 3.5).toFixed(3)}" text-anchor="end">${label}</text>`;
  }
  const paths = shown.slice().reverse().map(series => `<path data-series="${series.id}" d="${series.points.map(([date, value], index) => `${index ? 'L' : 'M'}${x(date).toFixed(3)} ${y(value).toFixed(3)}`).join(' ')}" fill="none" stroke="${series.color}" stroke-width="${series.id === 'iox' ? 2.5 : series.id === 'cdi' ? 1.7 : 1.4}" stroke-linejoin="round" stroke-linecap="round"/>`).join('');
  const middle = [];
  if (width >= 360) for (let year = new Date(result.start).getUTCFullYear() + 1; year <= new Date(result.end).getUTCFullYear(); year++) {
    const date = Date.UTC(year, 0, 1);
    if (x(date) - left > 45 && right - x(date) > 45) middle.push([date, String(year)]);
  }
  const month = date => new Intl.DateTimeFormat('pt-BR', {month:'short', year:'2-digit', timeZone:'UTC'}).format(date).replace('.', '').replace(' de ', '/');
  const ticks = [[result.start, month(result.start)], ...middle, [result.end, month(result.end)]];
  const axis = ticks.map(([date, label], index) => `<text x="${x(date).toFixed(3)}" y="${height - 3}" text-anchor="${index === 0 ? 'start' : index === ticks.length - 1 ? 'end' : 'middle'}">${label}</text>`).join('');
  const description = shown.map(series => `${series.name}: ${formatReturn(series.points.at(-1)[1])}`).join('; ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" data-min="${min}" data-max="${max}" role="img" aria-label="Rentabilidade acumulada de ${formatDate(result.start)} a ${formatDate(result.end)}. ${description}"><g fill="#8c9690" font-family="Plus Jakarta Sans,Arial,sans-serif" font-size="10">${grid}${paths}${axis}${shown.length ? '' : `<text x="${width / 2}" y="${height / 2}" text-anchor="middle">Selecione um ativo para exibir.</text>`}</g><g data-chart-cursor visibility="hidden" aria-hidden="true"></g></svg>`;
}
