export function normalizeExclusiveSelection(values,changedValue,exclusiveValue){
  if(!Array.isArray(values)||values.some(value=>typeof value!=='string')||typeof changedValue!=='string'||typeof exclusiveValue!=='string'||!exclusiveValue)throw new TypeError('Seleção inválida.');
  const unique=[...new Set(values)];
  if(changedValue===exclusiveValue&&unique.includes(exclusiveValue))return [exclusiveValue];
  return unique.length>1?unique.filter(value=>value!==exclusiveValue):unique;
}
