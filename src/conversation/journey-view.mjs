import {journeyCopy as copy,journeyTitles as titles,journeyOptions} from './journey-content.mjs';
import {journeyProgress} from './journey-model.mjs';
import {journeyLines} from './journey-lines.mjs';

export const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const backIcon='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const downloadIcon='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const checkIcon='<svg class="j-success" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="26" fill="#000"/><path d="m14 26 8 8 16-18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>';

function formatted(text,mobile){
  const safe=escapeHtml(mobile?text:journeyLines.desktop[text]||text);
  if(mobile)return safe.replace(/IOX 90|R\$\s\d+(?:[.,]\d+)*(?:\s(?:milhão|milhões|mil))?|90 dias|aporte inicial|aplicações financeiras/g,part=>`<span class="j-keep">${part}</span>`);
  return safe.replaceAll('\n',' <br class="j-line-break">');
}
function choices(key,legend,answers,errors,mobile){
  return `<fieldset class="j-fieldset" data-field="${key}" ${errors[key]?'aria-describedby="j-error-'+key+'" aria-invalid="true"':''}><legend${legend?'':' class="j-sr-only"'}>${formatted(legend||titles[key==='qualified'?2:key==='knowsFidc'?5:key==='moment'?7:8],mobile)}</legend><div class="j-options">${journeyOptions[key].map(([value,label])=>`<label class="j-choice"><input type="radio" name="${key}" value="${value}" ${answers[key]===value?'checked':''}><span>${formatted(label,mobile)}</span></label>`).join('')}</div>${errors[key]?`<p class="j-error" id="j-error-${key}">${errors[key]}</p>`:''}</fieldset>`;
}
export function journeyView(state,answers,lead,mobile,errors={}){
  const step=state.step,terminal=step===9||step==='exit',percent=journeyProgress(state);
  const label=`Etapa ${step} de 9${step===4&&mobile?' · '+(state.profilePart===1?'2':'1')+' de 2':''}`;
  let body='';
  if(step===1)body=`<p class="j-body">${formatted(copy.introduction,mobile)}</p><p class="j-requirement-label">Para investir, você precisa:</p><ul class="j-requirements">${copy.requirements.map(text=>`<li><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4 10-11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${formatted(text,mobile)}</span></li>`).join('')}</ul>`;
  if(step===2)body=choices('qualified','',answers,errors,mobile);
  if(step===3)body=`<p class="j-body">${formatted(copy.contribution,mobile)}</p>${choices('available',copy.availability,answers,errors,mobile)}`;
  if(step===4)body=`${!mobile||state.profilePart!==1?choices('wealth',copy.wealth,answers,errors,mobile):''}${!mobile||state.profilePart===1?choices('suitability',copy.suitability,answers,errors,mobile):''}`;
  if(step===5)body=choices('knowsFidc','',answers,errors,mobile);
  if(step===6)body=`<p class="j-body">${formatted(copy.fund,mobile)}</p><p class="j-performance">${formatted(copy.performance,mobile)}</p><p class="j-legal">${formatted(copy.legal,mobile)}</p><div class="j-links"><a href="${copy.comparisonUrl}" target="_blank" rel="noopener noreferrer">Ver o fundo no Mais Retorno</a><a class="j-download" href="${copy.factsheetUrl}" target="_blank" rel="noopener noreferrer" download>${downloadIcon}<span>Baixar a lâmina do mês</span></a></div>`;
  if(step===7)body=choices('moment','',answers,errors,mobile);
  if(step===8)body=choices('contact','',answers,errors,mobile);
  if(terminal)body=`<p class="j-body">${formatted(step===9?copy.final:copy.exit,mobile)}</p>`;
  return `${step==='exit'?'':`<div class="j-progress"><div class="j-progress-label"><span>${label}</span><span>${percent}%</span></div><div class="j-progress-track" role="progressbar" aria-label="Progresso da jornada" aria-valuemin="0" aria-valuemax="9" aria-valuenow="${step}" aria-valuetext="${label}"><span style="width:${percent}%"></span></div></div>`}<form class="j-form" novalidate data-step="${step}" data-profile-part="${state.profilePart||0}"><div class="j-content"><div class="j-title-row">${step===9?checkIcon:''}<h1 class="j-title" id="j-title" tabindex="-1">${formatted(step===9?titles[9].replace('{nome}',lead.name):titles[step],mobile)}</h1></div>${body}</div>${terminal?'':`<footer class="j-actions">${step===1?'<span></span>':`<button class="j-back" type="button" data-back>${backIcon}<span>Voltar</span></button>`}<button type="submit" class="j-next">${step===1?'Quero ver se me enquadro':'Continuar'}</button></footer>`}</form>`;
}
