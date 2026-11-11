export function returnPath(source){
  return source==='b'?'/lp-b/':'/';
}

export function thankYouPath(source){
  return '/obrigado/?origem='+(source==='b'?'b':'a');
}
