import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {renderPage} from './render.mjs';

const root = new URL('../', import.meta.url);
const source = JSON.parse(await readFile(new URL('src/content.json', root), 'utf8'));
const legal = JSON.parse(await readFile(new URL('src/legal.json', root), 'utf8'));
const approved = JSON.parse(await readFile(new URL('src/approved-lines.json', root), 'utf8'));
const configured = JSON.parse(await readFile(new URL('src/assets.json', root), 'utf8'));
const local = process.argv.includes('--local-assets');
const required = ['logo','ogImage','headerShape','headerShapeMobile','heroHouse','heroHouseMobile','heroDoor','heroJet','heroAuthority','heroCalm','glass','office','audience','expert1','expert2','expert3','expert4','fontLight','fontRegular','fontMedium','fontSemiBold','essentialsGlass','metricsGlass','essentialsGlassComplete'];
const assets = {};
for (const key of required) {
  if (local) assets[key] = `/__assets/${key}`;
  else {
    const value = configured[key];
    if (typeof value !== 'string' || !value.startsWith('https://')) throw new Error(`CDN URL missing or invalid: ${key}`);
    assets[key] = value;
  }
}
await mkdir(new URL('dist/', root), {recursive:true});
await writeFile(new URL('dist/index.html', root), renderPage(source, assets, legal, approved));
const css = await readFile(new URL('src/styles.css', root), 'utf8');
await writeFile(new URL('dist/styles.css', root), css.replaceAll('__FONT_LIGHT__', assets.fontLight).replaceAll('__FONT_REGULAR__', assets.fontRegular).replaceAll('__FONT_MEDIUM__', assets.fontMedium).replaceAll('__FONT_SEMIBOLD__', assets.fontSemiBold));
for (const file of ['main.mjs','hero.mjs','select.mjs','essentials.mjs','navigation.mjs','reveal.mjs','counters.mjs']) await copyFile(new URL(`src/${file}`, root), new URL(`dist/${file}`, root));
await writeFile(new URL('dist/page-data.mjs', root), `export const heroVariants=${JSON.stringify(source.sections[0].copy.titleAndSubtitleVariants)};\nexport const assets=${JSON.stringify(assets)};\n`);
console.log(`LP A built with ${local ? 'local preview' : 'CDN'} assets.`);
