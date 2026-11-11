import {journeyOptions} from './journey-content.mjs';

const valid=(name,value)=>journeyOptions[name].some(option=>option[0]===value);
export function validateJourney(state,answers,mobile){
  const step=state.step;
  if(step==='exit'||step===9)return {};
  if(!Number.isInteger(step)||step<1||step>8)throw new RangeError('Etapa inválida.');
  const keys=step===2?['qualified']:step===3?['available']:step===4?(mobile?[state.profilePart===1?'suitability':'wealth']:['wealth','suitability']):step===5?['knowsFidc']:step===7?['moment']:step===8?['contact']:[];
  return Object.fromEntries(keys.filter(key=>!valid(key,answers[key])).map(key=>[key,'Selecione uma opção para continuar.']));
}
export function nextJourney(state,answers,mobile){
  if(Object.keys(validateJourney(state,answers,mobile)).length)return state;
  if([[2,'qualified'],[3,'available'],[5,'knowsFidc']].some(([step,key])=>state.step===step&&answers[key]==='no'))return {step:'exit',profilePart:0};
  if(state.step===4&&mobile&&state.profilePart!==1)return {step:4,profilePart:1};
  if(state.step==='exit'||state.step===9)return state;
  return {step:state.step+1,profilePart:0};
}
export function previousJourney(state,mobile){
  if(state.step===4&&mobile&&state.profilePart===1)return {step:4,profilePart:0};
  if(!Number.isInteger(state.step)||state.step<=1)return {step:1,profilePart:0};
  return {step:state.step-1,profilePart:state.step===5&&mobile?1:0};
}
export function journeyProgress(state){return state.step==='exit'?0:Math.round(state.step/9*100);}
export function journeyDisplayName(fullName){
  if(typeof fullName!=='string')throw new TypeError('Nome inválido.');
  return fullName.trim().split(/\s+/).slice(0,2).join(' ');
}
export function readLead(data,source){
  if(source!=='a'&&source!=='b')throw new TypeError('Origem inválida.');
  const name=String(data.get('name')||'').trim(),email=String(data.get('email')||'').trim(),phone=String(data.get('phone')||'').trim();
  const digits=phone.replace(/\D/g,'');
  const invalid=name.length<2||name.length>100?'name':email.length>254||!/^\S+@[^\s@]+$/.test(email)?'email':digits.length<10||digits.length>15?'phone':null;
  if(invalid){const error=new TypeError('Dados de contato inválidos.');error.field=invalid;throw error;}
  return {source,name,email,phone,invested:String(data.get('invested')||''),investments:data.getAll(source==='a'?'currentInvestments':'investments').map(String),timing:String(data.get('timing')||data.get('intention')||''),preferredTime:String(data.get('preferredTime')||'')};
}
