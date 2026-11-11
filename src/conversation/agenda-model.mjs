export const demoTimes=['09:00','10:00','11:00','14:00','15:00','16:00','17:00'];

export function demoDays(now=new Date()){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const value=type=>parts.find(part=>part.type===type).value;
  const cursor=new Date(`${value('year')}-${value('month')}-${value('day')}T12:00:00Z`);
  const days=[];
  while(days.length<5){
    cursor.setUTCDate(cursor.getUTCDate()+1);
    if([0,6].includes(cursor.getUTCDay()))continue;
    days.push({value:cursor.toISOString().slice(0,10),weekday:new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',weekday:'short'}).format(cursor).replace('.',''),date:new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',day:'2-digit',month:'2-digit'}).format(cursor),full:new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long'}).format(cursor)});
  }
  return days;
}

export function selectionLabel(days,day,time){
  const selected=days.find(item=>item.value===day);
  if(!selected||!demoTimes.includes(time))throw new RangeError('Selecione um dia e horário da demonstração.');
  return `${selected.full}, às ${time}`;
}
