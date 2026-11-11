import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const files = ['index.html', 'styles.css', 'main.mjs', 'hero.mjs', 'page-data.mjs', 'select.mjs', 'essentials.mjs', 'navigation.mjs', 'reveal.mjs', 'counters.mjs', 'performance.css', 'performance.mjs', 'performance-model.mjs', 'performance-data.mjs'];
files.push('lp-b/index.html','lp-b/styles.css','lp-b/main.mjs');
const mime = {html:'text/html; charset=utf-8', css:'text/css; charset=utf-8', mjs:'text/javascript; charset=utf-8', txt:'text/plain; charset=utf-8'};
const manifest = {};
const uploads = {};

function include(name, bytes) {
  const hash = createHash('md5').update(bytes).digest('hex');
  manifest['/' + name] = {hash, size:bytes.length};
  uploads[hash] = {name, mime:mime[name.split('.').at(-1)], base64:bytes.toString('base64')};
}

for (const name of files) {
  const bytes = await readFile(new URL('dist/' + name, root));
  if (bytes.includes(Buffer.from('/__assets/'))) throw new Error('Build local não pode ser publicado.');
  include(name, bytes);
}
include('robots.txt', Buffer.from('User-agent: *\nDisallow: /\n'));

const payload = {
  workerName:'iox-lpnew',
  accountId:'6956261fcbf42aef5f8dc84f39508203',
  manifest,
  uploads,
  workerCode:'export default { async fetch(request, env) { if (!["GET", "HEAD"].includes(request.method)) return new Response("Método não permitido", {status:405, headers:{Allow:"GET, HEAD"}}); return env.ASSETS.fetch(request); } };',
  metadata:{
    main_module:'worker.mjs',
    compatibility_date:'2026-11-10',
    bindings:[{type:'assets', name:'ASSETS'}],
    observability:{enabled:true, redact_query_string:true, logs:{enabled:true, invocation_logs:true}, traces:{enabled:true}},
    assets:{config:{html_handling:'auto-trailing-slash', not_found_handling:'none', _headers:'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Robots-Tag: noindex, nofollow\n\n/\n  Cache-Control: no-cache\n\n/index.html\n  Cache-Control: no-cache\n\n/styles.css\n  Cache-Control: public, max-age=300\n\n/*.mjs\n  Cache-Control: public, max-age=300\n'}}
  }
};
await mkdir(new URL('output/deployment/', root), {recursive:true});
await writeFile(new URL('output/deployment/payload.json', root), JSON.stringify(payload));
console.log(JSON.stringify({files:Object.keys(manifest).length, bytes:Object.values(manifest).reduce((sum, value)=>sum+value.size, 0)}));
