import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';

export async function buildJourney(){
  const root=new URL('../',import.meta.url);
  const assets=JSON.parse(await readFile(new URL('src/conversation/journey-assets.json',root),'utf8'));
  for(const value of Object.values(assets))if(typeof value!=='string'||!value.startsWith('https://cdn.frostty.com.br/'))throw new Error('Asset da jornada fora do CDN.');
  const modules=new Map(await Promise.all(['journey.mjs','journey-view.mjs','journey-content.mjs','journey-model.mjs','journey-lines.mjs'].map(async file=>[file,await readFile(new URL('src/conversation/'+file,root),'utf8')])));
  const css=await readFile(new URL('src/conversation/journey.css',root),'utf8');
  const revision=createHash('sha256').update(JSON.stringify(assets)).update(css).update([...modules.values()].join('\n')).digest('hex').slice(0,12);
  await mkdir(new URL('dist/conversation/',root),{recursive:true});
  for(const [name,code]of modules)await writeFile(new URL('dist/conversation/'+name,root),code.replace(/(from\s*|import\s*\()(['"])(\.\/[^'"]+\.mjs)\2/g,`$1$2$3?v=${revision}$2`));
  await writeFile(new URL('dist/conversation/journey-assets.mjs',root),`export const journeyAssets=${JSON.stringify(assets)};\n`);
  await writeFile(new URL('dist/conversation/journey.css',root),css);
  const returnScript="const source=new URLSearchParams(location.search).get('origem');location.replace(source==='b'?'/lp-b/':'/');\n";
  await writeFile(new URL('dist/conversation/return.mjs',root),returnScript);
  const legacy='<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Grupo IOX</title><script type="module" src="/conversation/return.mjs?v='+revision+'"></script><body><main><a href="/">Voltar para o site</a></main></body></html>';
  for(const path of ['obrigado','conversa']){await mkdir(new URL('dist/'+path+'/',root),{recursive:true});await writeFile(new URL('dist/'+path+'/index.html',root),legacy);}
  console.log('Jornada v2 built for LP A/B; old confirmation and quiz URLs return to the source LP.');
  return revision;
}
