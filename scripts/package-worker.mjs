import {readFile, writeFile} from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const payload = JSON.parse(await readFile(new URL('output/deployment/payload.json', root), 'utf8'));
const files = {};
for (const [path, entry] of Object.entries(payload.manifest)) {
  const file = payload.uploads[entry.hash];
  files[path] = {body:Buffer.from(file.base64, 'base64').toString('utf8'), mime:file.mime, etag:'"' + entry.hash + '"'};
}
files['/'] = files['/index.html'];
files['/lp-b/'] = files['/lp-b/index.html'];
const code = `const files = ${JSON.stringify(files)};
export default {
  async fetch(request) {
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Método não permitido', {status:405, headers:{Allow:'GET, HEAD'}});
    const url = new URL(request.url);
    if (url.pathname === '/lp-b') {url.pathname = '/lp-b/'; return Response.redirect(url.href, 308);}
    const file = files[url.pathname];
    if (!file) return new Response('Página não encontrada', {status:404, headers:{'Content-Type':'text/plain; charset=utf-8','X-Robots-Tag':'noindex, nofollow'}});
    const headers = {'Content-Type':file.mime, 'ETag':file.etag, 'Cache-Control':file.mime.startsWith('text/html') ? 'no-cache' : 'public, max-age=300', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin', 'X-Robots-Tag':'noindex, nofollow'};
    if (request.headers.get('If-None-Match') === file.etag) return new Response(null, {status:304, headers});
    return new Response(request.method === 'HEAD' ? null : file.body, {headers});
  }
};
`;
await writeFile(new URL('output/deployment/worker.mjs', root), code);
console.log(JSON.stringify({files:Object.keys(files).length, bytes:Buffer.byteLength(code)}));
