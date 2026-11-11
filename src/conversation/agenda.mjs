import {demoDays,demoTimes,selectionLabel} from './agenda-model.mjs';
import {returnPath} from '../confirmation.mjs';

export function enhanceDemoAgenda(){
  const trigger=document.querySelector('[data-agenda]');
  const dialog=document.querySelector('.agenda-dialog');
  if(!trigger||!dialog)return;
  const form=dialog.querySelector('form');
  const days=demoDays();
  const dayList=dialog.querySelector('[data-agenda-days]');
  const timeList=dialog.querySelector('[data-agenda-times]');
  const selectionView=dialog.querySelector('.agenda-selection');
  const successView=dialog.querySelector('.agenda-success');
  const submit=dialog.querySelector('[data-agenda-confirm]');
  for(const day of days){
    const label=document.createElement('label');
    label.className='agenda-choice agenda-day';
    const input=document.createElement('input');input.type='radio';input.name='agenda-day';input.value=day.value;input.required=true;
    const weekday=document.createElement('span');weekday.textContent=day.weekday;
    const date=document.createElement('strong');date.textContent=day.date;
    label.append(input,weekday,date);dayList.append(label);
  }
  for(const time of demoTimes){
    const label=document.createElement('label');label.className='agenda-choice agenda-time';
    const input=document.createElement('input');input.type='radio';input.name='agenda-time';input.value=time;input.required=true;
    const text=document.createElement('span');text.textContent=time;label.append(input,text);timeList.append(label);
  }
  trigger.disabled=false;
  trigger.addEventListener('click',()=>{
    selectionView.hidden=false;successView.hidden=true;dialog.classList.remove('is-confirmed');
    dialog.setAttribute('aria-labelledby','agenda-title');dialog.setAttribute('aria-describedby','agenda-description');
    dialog.showModal();
  });
  dialog.querySelector('[data-agenda-close]').addEventListener('click',()=>dialog.close());
  dialog.querySelector('[data-agenda-done]').addEventListener('click',()=>window.location.assign(returnPath(new URLSearchParams(window.location.search).get('origem'))));
  dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
  form.addEventListener('change',()=>{
    submit.disabled=!form.querySelector('input[name="agenda-day"]:checked')||!form.querySelector('input[name="agenda-time"]:checked');
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const day=form.querySelector('input[name="agenda-day"]:checked')?.value;
    const time=form.querySelector('input[name="agenda-time"]:checked')?.value;
    if(!day||!time)return;
    const selection=selectionLabel(days,day,time);
    dialog.querySelector('[data-agenda-selected]').textContent=selection;
    selectionView.hidden=true;successView.hidden=false;dialog.classList.add('is-confirmed');
    dialog.setAttribute('aria-labelledby','agenda-success-title');dialog.setAttribute('aria-describedby','agenda-success-copy');
    dialog.querySelector('#agenda-success-title').focus({preventScroll:true});
  });
}
