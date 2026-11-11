import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {renderPageB} from './render-b.mjs';

export async function buildPageB(sharedRevision) {
  const root = new URL('../', import.meta.url);
  const copy = JSON.parse(await readFile(new URL('src/lp-b/content.json',root),'utf8'));
  const assets = JSON.parse(await readFile(new URL('src/lp-b/assets.json',root),'utf8'));
  const legal = JSON.parse(await readFile(new URL('src/legal.json',root),'utf8'));
  for (const [name,url] of Object.entries(assets)) if (typeof url !== 'string' || !url.startsWith('https://cdn.frostty.com.br/')) throw new Error(`CDN inválido na LP B: ${name}`);
  const html = renderPageB(copy,assets,legal);
  const css = `:root{--b-header-mask:url("${assets.headerShape}");--b-mobile-mask:url("${assets.headerShapeMobile}")}\n` + await readFile(new URL('src/lp-b/styles.css',root),'utf8');
  const script = await readFile(new URL('src/lp-b/main.mjs',root),'utf8');
  const revision = createHash('sha256').update(html).update(css).update(script).update(sharedRevision).digest('hex').slice(0,12);
  await mkdir(new URL('dist/lp-b/',root),{recursive:true});
  await writeFile(new URL('dist/lp-b/index.html',root),html.replace(/((?:href|src)="\/)(styles\.css|performance\.css|lp-b\/styles\.css|lp-b\/main\.mjs)(")/g,`$1$2?v=${revision}$3`));
  await writeFile(new URL('dist/lp-b/styles.css',root),css);
  await writeFile(new URL('dist/lp-b/main.mjs',root),script.replace(/(from\s*)(['"])(\.\.\/[^'"]+\.mjs)\2/g,`$1$2$3?v=${revision}$2`));
  console.log(`LP B built from Figma ${copy.figma.frame} with CDN assets.`);
}
