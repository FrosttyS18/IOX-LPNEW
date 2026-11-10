export function resolveHeroKey(value) {
  if (typeof value !== 'string') return 'fallback';
  const match = value.trim().toUpperCase().match(/^H([1-5])(?:$|[_-])/);
  return match ? `H${match[1]}` : 'fallback';
}

export const heroImages = {
  fallback: {key: 'heroHouse', alt: 'Família reunida em um sofá, em uma sala com luz natural.', focus: '50% 50%'},
  H1: {key: 'heroDoor', alt: 'Porta entreaberta em um ambiente de arquitetura contemporânea.', focus: '80% 50%'},
  H2: {key: 'heroJet', alt: 'Família reunida no interior de uma aeronave, olhando para a câmera.', focus: '83% 50%'},
  H3: {key: 'audience', alt: 'Ambiente empresarial com fachada de vidro e área de operação.', focus: '70% 50%'},
  H4: {key: 'heroAuthority', alt: '', focus: '70% 65%'},
  H5: {key: 'heroCalm', alt: 'Café sobre uma mesa em um ambiente de arquitetura contemporânea.', focus: '80% 65%'}
};
