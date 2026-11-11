import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {renderQuiz} from './render-quiz.mjs';

export async function buildQuiz(){
  const root=new URL('../',import.meta.url);
  const assets=JSON.parse(await readFile(new URL('src/lp-b/assets.json',root),'utf8'));
  const css=await readFile(new URL('src/conversation/quiz.css',root),'utf8');
  const shared=await readFile(new URL('dist/conversation/styles.css',root),'utf8');
  const modules=new Map(await Promise.all(['quiz.mjs','model.mjs','content.mjs'].map(async file=>[file,await readFile(new URL('src/conversation/'+file,root),'utf8')])));
  const html=renderQuiz(assets);
  const revision=createHash('sha256').update(html).update(css).update(shared).update([...modules.values()].join('\n')).digest('hex').slice(0,12);
  await mkdir(new URL('dist/conversa/',root),{recursive:true});
  await writeFile(new URL('dist/conversa/index.html',root),html.replaceAll('/conversation/styles.css"',`/conversation/styles.css?v=${revision}"`).replaceAll('/conversation/quiz.css"',`/conversation/quiz.css?v=${revision}"`).replaceAll('/conversation/quiz.mjs"',`/conversation/quiz.mjs?v=${revision}"`));
  await writeFile(new URL('dist/conversation/quiz.css',root),css);
  for(const [file,code]of modules)await writeFile(new URL('dist/conversation/'+file,root),code.replace(/(from\s+['"])(\.{1,2}\/[^'"]+\.mjs)(['"])/g,`$1$2?v=${revision}$3`));
  console.log('P4 built from approved four-step layout.');
}
