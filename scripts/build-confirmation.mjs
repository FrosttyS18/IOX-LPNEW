import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {renderConfirmation} from './render-confirmation.mjs';
import {confirmationCopy} from '../src/conversation/content.mjs';

export async function buildConfirmation(){
  const root=new URL('../',import.meta.url);
  const assets=JSON.parse(await readFile(new URL('src/lp-b/assets.json',root),'utf8'));
  let css=await readFile(new URL('src/conversation/styles.css',root),'utf8');
  for(const [token,key] of [['LIGHT','fontLight'],['REGULAR','fontRegular'],['MEDIUM','fontMedium'],['SEMIBOLD','fontSemiBold']])css=css.replaceAll(`__FONT_${token}__`,assets[key]);
  const script=await readFile(new URL('src/conversation/thanks.mjs',root),'utf8');
  const shared=await readFile(new URL('src/confirmation.mjs',root),'utf8');
  const modules=new Map(await Promise.all(['agenda.mjs','agenda-model.mjs'].map(async name=>[name,await readFile(new URL('src/conversation/'+name,root),'utf8')])));
  const html=renderConfirmation(confirmationCopy,assets);
  const revision=createHash('sha256').update(html).update(css).update(script).update(shared).update([...modules.values()].join('\n')).digest('hex').slice(0,12);
  await mkdir(new URL('dist/obrigado/',root),{recursive:true});
  await mkdir(new URL('dist/conversation/',root),{recursive:true});
  await writeFile(new URL('dist/obrigado/index.html',root),html.replace('/conversation/styles.css"',`/conversation/styles.css?v=${revision}"`).replace('/conversation/thanks.mjs"',`/conversation/thanks.mjs?v=${revision}"`));
  await writeFile(new URL('dist/conversation/styles.css',root),css);
  const version=code=>code.replace(/(from\s+['"])(\.{1,2}\/[^'"]+\.mjs)(['"])/g,`$1$2?v=${revision}$3`);
  await writeFile(new URL('dist/conversation/thanks.mjs',root),version(script));
  for(const [name,code]of modules)await writeFile(new URL('dist/conversation/'+name,root),version(code));
  console.log('P3 built from approved Figma layout with existing CDN assets.');
}
