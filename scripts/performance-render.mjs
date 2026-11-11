import {performanceData} from '../src/performance-data.mjs';
import {normalizeSeries, renderPlot, formatReturn} from '../src/performance-model.mjs';

const calendar = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M7 3v5m10-5v5M4 10h16" stroke="currentColor" stroke-width="1.4"/></svg>';

export function renderPerformance(accent) {
  const data = accent ? {...performanceData, series:performanceData.series.map(series => series.id === 'iox' ? {...series, color:accent} : series)} : performanceData;
  const result = normalizeSeries(data);
  const checks = (items, group) => items.map(([id, name]) => `<label><input type="checkbox" data-chart-series="${id}" data-control-group="${group}" checked disabled> ${name}</label>`).join('');
  return `<figure class="performance-chart"${accent ? ` data-chart-accent="${accent}"` : ''} aria-labelledby="performance-title">
    <header class="performance-heading"><h3 id="performance-title">Rentabilidade histórica</h3></header>
    <div class="performance-toolbar">
      <div class="performance-periods" role="group" aria-label="Período do gráfico">${['Ótimo','6M','1A','2A','3A','5A'].map(period => `<button type="button" data-chart-period="${period}" aria-pressed="${period === 'Ótimo'}" disabled>${period}</button>`).join('')}
        <details class="chart-filter chart-dates"><summary aria-label="Selecionar datas">${calendar}</summary><div class="chart-popover"><label>De<input type="date" data-chart-start min="2023-08-03" max="2026-11-09" value="2023-08-03"></label><label>Até<input type="date" data-chart-end min="2023-08-03" max="2026-11-09" value="2026-11-09"></label><button type="button" data-chart-apply disabled>Aplicar</button></div></details>
      </div>
      <div class="performance-filters">
        <details class="chart-filter"><summary>Exibir ativos<span class="chart-chevron" aria-hidden="true"></span></summary><div class="chart-popover">${checks([['iox','IOX 90'],['cdi','CDI'],['ibov','Ibovespa']], 'assets')}</div></details>
        <details class="chart-filter"><summary>Indicadores<span class="chart-chevron" aria-hidden="true"></span></summary><div class="chart-popover">${checks([['cdi','CDI'],['ibov','Ibovespa']], 'benchmarks')}</div></details>
      </div>
    </div>
    <div class="performance-legend" role="group" aria-label="Séries e retornos acumulados no período">${result.series.map(series => `<button type="button" data-chart-legend="${series.id}" aria-pressed="true" style="--series-color:${series.color}" disabled><span class="chart-legend-swatch" aria-hidden="true"></span><span class="chart-legend-name">${series.name}</span><strong data-chart-return="${series.id}">${formatReturn(series.points.at(-1)[1])}</strong></button>`).join('')}</div>
    <div class="performance-plot" tabindex="0" aria-label="Gráfico de rentabilidade. Toque para consultar os dados ou use as setas do teclado.">${renderPlot(result)}<output class="chart-tooltip" hidden></output></div>
    <figcaption class="performance-caption"><span><span data-chart-range>03/08/2023 — 09/11/2026</span> · Fonte: <a href="https://maisretorno.com/app/comparador-ativos?a=50901127000150%3Afi%2Ccdi%3Aidx%2Cibov%3Aidx&amp;p=39" target="_blank" rel="noopener noreferrer">Mais Retorno</a></span><span>Rentabilidade passada não é garantia de rentabilidade futura.</span></figcaption>
    <p class="chart-status visually-hidden" aria-live="polite"></p>
  </figure>`;
}
