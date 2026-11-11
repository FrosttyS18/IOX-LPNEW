import {validateStep,firstIncompleteStep,normalizeInvestments,returnPath,thankYouPath} from './model.mjs';

const form=document.querySelector('#conversation-form');
const steps=[...form.querySelectorAll('[data-step]')];
const source=new URLSearchParams(window.location.search).get('origem')==='b'?'b':'a';
for(const link of document.querySelectorAll('[data-return]'))link.href=returnPath(source);
let current=1;

function answers(){
  const data=new FormData(form);
  return {invested:data.get('invested'),investments:data.getAll('investments'),intention:data.get('intention'),name:data.get('name'),email:data.get('email'),phone:data.get('phone'),preferredTime:data.get('preferredTime')};
}

function show(step){
  current=step;
  for(const section of steps)section.hidden=Number(section.dataset.step)!==step;
  document.querySelector('[data-progress-label]').textContent=`Etapa ${step} de 4`;
  document.querySelector('[data-progress-percent]').textContent=`${step*25}%`;
  document.querySelector('[data-progress-fill]').style.width=`${step*25}%`;
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',String(step*25));
  document.querySelector('.quiz-shell').dataset.current=String(step);
  document.title=`Etapa ${step} de 4 | Grupo IOX`;
  window.scrollTo({top:0,behavior:'instant'});
  steps[step-1].querySelector('h1').focus({preventScroll:true});
}

function report(step){
  const errors=validateStep(step,answers());
  const section=steps[step-1];
  for(const notice of section.querySelectorAll('[data-error]')){
    const message=errors[notice.dataset.error];notice.textContent=message||'';notice.hidden=!message;
    const controls=section.querySelectorAll(`[name="${notice.dataset.error}"]`);
    for(const input of controls)if(message)input.setAttribute('aria-invalid','true');else input.removeAttribute('aria-invalid');
  }
  const invalid=Object.keys(errors)[0];
  if(invalid)section.querySelector(`[name="${invalid}"]`).focus();
  return !invalid;
}

form.addEventListener('change',event=>{
  if(event.target.name==='investments'){
    const selected=normalizeInvestments(answers().investments,event.target.value);
    for(const input of form.querySelectorAll('[name="investments"]'))input.checked=selected.includes(input.value);
  }
  const name=event.target.name;
  const notice=form.querySelector(`[data-error="${name}"]`);
  if(notice&&!notice.hidden&&!validateStep(current,answers())[name]){
    notice.hidden=true;
    for(const input of form.querySelectorAll(`[name="${name}"]`))input.removeAttribute('aria-invalid');
  }
});
form.addEventListener('input',event=>{
  const name=event.target.name;
  const notice=form.querySelector(`[data-error="${name}"]`);
  if(notice&&!notice.hidden&&!validateStep(current,answers())[name]){notice.hidden=true;event.target.removeAttribute('aria-invalid');}
});
for(const button of form.querySelectorAll('[data-next]'))button.addEventListener('click',()=>{if(report(current))show(current+1);});
for(const button of form.querySelectorAll('[data-back]'))button.addEventListener('click',()=>show(current-1));
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(current<4){if(report(current))show(current+1);return;}
  const incomplete=firstIncompleteStep(answers());
  if(incomplete){if(incomplete!==current)show(incomplete);report(incomplete);return;}
  window.location.assign(thankYouPath(source));
});
for(const button of form.querySelectorAll('button'))button.disabled=false;
