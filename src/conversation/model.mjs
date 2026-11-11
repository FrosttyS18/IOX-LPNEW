import {investedOptions,investmentOptions,intentionOptions,timeOptions} from './content.mjs';
import {normalizeExclusiveSelection} from '../investment-selection.mjs';
export {returnPath,thankYouPath} from '../confirmation.mjs';

const includes=(options,value)=>options.some(option=>option.value===value);

export function validateStep(step,answers){
  if(!Number.isInteger(step)||step<1||step>4)throw new RangeError('Etapa inválida.');
  if(!answers||typeof answers!=='object'||Array.isArray(answers))throw new TypeError('Respostas inválidas.');
  const errors={};
  if(step===1&&!includes(investedOptions,answers.invested))errors.invested='Selecione quanto você tem investido hoje.';
  if(step===2){
    const values=answers.investments;
    if(!Array.isArray(values)||values.length===0||values.some(value=>!includes(investmentOptions,value))||(values.includes('none')&&values.length>1))errors.investments='Selecione onde você já investe.';
  }
  if(step===3&&!includes(intentionOptions,answers.intention))errors.intention='Selecione uma opção para continuar.';
  if(step===4){
    if(typeof answers.name!=='string'||answers.name.trim().length<2||answers.name.length>100)errors.name='Digite seu nome.';
    if(typeof answers.email!=='string'||answers.email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim()))errors.email='Informe um e-mail válido.';
    const digits=typeof answers.phone==='string'?answers.phone.replace(/\D/g,''):'';
    if(digits.length<10||digits.length>15)errors.phone='Informe um número válido com DDD.';
    if(!includes(timeOptions,answers.preferredTime))errors.preferredTime='Selecione o melhor horário para falarmos.';
  }
  return errors;
}

export function firstIncompleteStep(answers){
  for(let step=1;step<=4;step++)if(Object.keys(validateStep(step,answers)).length)return step;
  return null;
}

export function normalizeInvestments(values,changedValue){
  if(!Array.isArray(values)||values.some(value=>!includes(investmentOptions,value)))throw new TypeError('Opções de investimento inválidas.');
  return normalizeExclusiveSelection(values,changedValue,'none');
}
