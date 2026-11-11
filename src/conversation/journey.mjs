import {readLead,nextJourney,previousJourney,validateJourney} from './journey-model.mjs';
import {journeyView,backIcon} from './journey-view.mjs';
import {journeyAssets} from './journey-assets.mjs';

let stylesheet;
let activeDialog;
function loadStyles(){
  if(stylesheet)return stylesheet;
  stylesheet=new Promise((resolve,reject)=>{
    const link=document.createElement('link');
    const url=new URL('./journey.css',import.meta.url);
    url.search=new URL(import.meta.url).search;
    link.rel='stylesheet';link.href=url.href;
    link.onload=resolve;link.onerror=()=>{link.remove();stylesheet=undefined;reject(new Error('Não foi possível carregar as telas. Tente novamente.'));};
    document.head.append(link);
  });
  return stylesheet;
}
export async function launchJourney(form,source){
  if(activeDialog)return;
  let lead;
  try{lead=readLead(new FormData(form),source);}catch(error){
    const field=form.elements.namedItem(error.field);
    if(!field)throw error;
    field.setCustomValidity(error.field==='name'?'Informe seu nome.':error.field==='email'?'Informe um e-mail válido.':'Informe um telefone válido, com DDD.');
    field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});field.reportValidity();return;
  }
  const trigger=form.querySelector('button[type="submit"]');
  const pending=document.createElement('p');pending.className='j-load-error';pending.setAttribute('role','alert');
  trigger.disabled=true;
  try{await loadStyles();}catch(error){pending.textContent=error.message;form.append(pending);trigger.disabled=false;return;}
  form.querySelectorAll('.j-load-error').forEach(node=>node.remove());
  trigger.disabled=false;
  const dialog=document.createElement('dialog');dialog.className='j-dialog';dialog.setAttribute('aria-labelledby','j-title');
  dialog.innerHTML=`<div class="j-shell"><aside class="j-panel" aria-label="Fundo IOX 90"><img src="${journeyAssets.panel}" width="720" height="1760" alt="" decoding="async"></aside><header class="j-header"><img class="j-mobile-logo" src="${journeyAssets.logo}" width="40" height="40" alt="Grupo IOX"><button class="j-return" type="button">${backIcon}<span>Voltar para o site</span></button></header><div class="j-main"></div></div>`;
  let state={step:1,profilePart:0};
  const answers={};
  const mobile=matchMedia('(max-width:800px)');
  const main=dialog.querySelector('.j-main');
  const oldTitle=document.title;
  const oldOverflow=document.body.style.overflow;
  let nameObserver;
  function fitName(){
    const name=main.querySelector('.j-person-name');
    if(!name)return;
    const title=name.parentElement,style=getComputedStyle(title),context=document.createElement('canvas').getContext('2d');
    context.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const width=context.measureText(name.textContent).width;
    const size=parseFloat(style.fontSize)*Math.min(1,(title.clientWidth-1)/width);
    name.style.fontSize=`${size}px`;
  }
  function render(focus=true,errors={}){
    nameObserver?.disconnect();
    main.innerHTML=journeyView(state,answers,lead,mobile.matches,errors);
    dialog.dataset.step=String(state.step);
    document.title=`${state.step==='exit'?'Obrigado pelo interesse':state.step===9?'Obrigado':`Etapa ${state.step} de 9`} | IOX 90`;
    dialog.scrollTop=0;
    if(state.step===9){fitName();nameObserver=new ResizeObserver(fitName);nameObserver.observe(main.querySelector('.j-title'));}
    if(focus)main.querySelector(Object.keys(errors).length?'[aria-invalid="true"] input':'.j-title')?.focus({preventScroll:true});
  }
  function close(){
    if(!dialog.open)return;
    dialog.close();dialog.remove();activeDialog=undefined;
    document.body.style.overflow=oldOverflow;document.title=oldTitle;
    mobile.removeEventListener('change',onResize);
    nameObserver?.disconnect();
    trigger.focus({preventScroll:true});
  }
  function onResize(){if(!mobile.matches)state.profilePart=0;render();}
  dialog.querySelector('.j-return').addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  main.addEventListener('change',event=>{
    if(!event.target.matches('input[type="radio"]'))return;
    answers[event.target.name]=event.target.value;
    const field=event.target.closest('fieldset');field.removeAttribute('aria-invalid');field.removeAttribute('aria-describedby');field.querySelector('.j-error')?.remove();
  });
  main.addEventListener('submit',event=>{
    event.preventDefault();
    const errors=validateJourney(state,answers,mobile.matches);
    if(Object.keys(errors).length){render(true,errors);return;}
    state=nextJourney(state,answers,mobile.matches);render();
  });
  main.addEventListener('click',event=>{if(event.target.closest('[data-back]')){state=previousJourney(state,mobile.matches);render();}});
  mobile.addEventListener('change',onResize);
  render(false);document.body.append(dialog);activeDialog=dialog;document.body.style.overflow='hidden';dialog.showModal();main.querySelector('.j-title').focus({preventScroll:true});
}
