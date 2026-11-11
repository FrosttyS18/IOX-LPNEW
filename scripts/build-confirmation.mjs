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
  const html=renderConfirmation(confirmationCopy,assets);
  const revision=createHash('sha256').update(html).update(css).update(script).update(shared).digest('hex').slice(0,12);
  await mkdir(new URL('dist/obrigado/',root),{recursive:true});
  await mkdir(new URL('dist/conversation/',root),{recursive:true});
  await writeFile(new URL('dist/obrigado/index.html',root),html.replace('/conversation/styles.css"',`/conversation/styles.css?v=${revision}"`).replace('/conversation/thanks.mjs"',`/conversation/thanks.mjs?v=${revision}"`));
  await writeFile(new URL('dist/conversation/styles.css',root),css);
  await writeFile(new URL('dist/conversation/thanks.mjs',root),script.replace('../confirmation.mjs',`../confirmation.mjs?v=${revision}`));
  console.log('P3 built from approved Figma layout with existing CDN assets.');
}
