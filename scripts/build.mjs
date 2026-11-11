import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {renderPage} from './render.mjs';
import {buildPageB} from './build-b.mjs';
import {buildConfirmation} from './build-confirmation.mjs';
import {buildQuiz} from './build-quiz.mjs';

const root = new URL('../', import.meta.url);
const source = JSON.parse(await readFile(new URL('src/content.json', root), 'utf8'));
const legal = JSON.parse(await readFile(new URL('src/legal.json', root), 'utf8'));
const approved = JSON.parse(await readFile(new URL('src/approved-lines.json', root), 'utf8'));
const configured = JSON.parse(await readFile(new URL('src/assets.json', root), 'utf8'));
const local = process.argv.includes('--local-assets');
const required = ['logo','ogImage','headerShape','headerShapeMobile','heroHouse','heroHouseMobile','heroDoor','heroJet','heroAuthority','heroCalm','glass','office','audience','groupOffice','groupGlass','groupGlassComplete','expert1','expert2','expert3','expert4','fontLight','fontRegular','fontMedium','fontSemiBold','essentialsGlass','metricsGlass','essentialsGlassComplete'];
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
const html = renderPage(source, assets, legal, approved);
const css = await readFile(new URL('src/styles.css', root), 'utf8');
const runtimeFiles = ['main.mjs','hero.mjs','select.mjs','essentials.mjs','navigation.mjs','reveal.mjs','counters.mjs','performance.mjs','performance-model.mjs','performance-data.mjs','performance.css','confirmation.mjs'];
const runtime = new Map(await Promise.all(runtimeFiles.map(async file => [file, await readFile(new URL(`src/${file}`, root), 'utf8')])));
const revision = createHash('sha256').update(html).update(css).update([...runtime.values()].join('\n')).digest('hex').slice(0,12);
await writeFile(new URL('dist/index.html', root), html.replace(/((?:href|src)="\/)(styles\.css|performance\.css|main\.mjs)(")/g, `$1$2?v=${revision}$3`));
await writeFile(new URL('dist/styles.css', root), css.replaceAll('__FONT_LIGHT__', assets.fontLight).replaceAll('__FONT_REGULAR__', assets.fontRegular).replaceAll('__FONT_MEDIUM__', assets.fontMedium).replaceAll('__FONT_SEMIBOLD__', assets.fontSemiBold));
for (const [file, content] of runtime) await writeFile(new URL(`dist/${file}`, root), file.endsWith('.mjs') ? content.replace(/(from\s*|import\s*\()(['"])(\.\/[^'"]+\.mjs)\2/g, `$1$2$3?v=${revision}$2`) : content);
await writeFile(new URL('dist/page-data.mjs', root), `export const heroVariants=${JSON.stringify(source.sections[0].copy.titleAndSubtitleVariants)};\nexport const assets=${JSON.stringify(assets)};\n`);
console.log(`LP A built with ${local ? 'local preview' : 'CDN'} assets.`);
await buildPageB(revision);
await buildConfirmation();
await buildQuiz();
