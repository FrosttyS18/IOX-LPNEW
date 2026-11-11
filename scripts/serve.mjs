import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,sep} from 'node:path';

const project = fileURLToPath(new URL('../', import.meta.url));
const directory = resolve(project, 'dist');
const port = Number(process.env.PORT || 4178);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf'};
const server = createServer(async (request,response) => {
  if (!['GET','HEAD'].includes(request.method)) {response.writeHead(405).end();return;}
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let path;
    if (pathname.startsWith('/__assets/')) {
      const local = JSON.parse(await readFile(resolve(project,'dev-assets.json'),'utf8'));
      path = local[pathname.slice('/__assets/'.length)];
      if (!path) {response.writeHead(404).end();return;}
    } else {
      path = resolve(directory, '.' + (pathname === '/' ? '/index.html' : ['/lp-b','/lp-b/'].includes(pathname) ? '/lp-b/index.html' : ['/obrigado','/obrigado/'].includes(pathname) ? '/obrigado/index.html' : ['/conversa','/conversa/'].includes(pathname) ? '/conversa/index.html' : pathname));
      if (!path.startsWith(directory + sep)) {response.writeHead(403).end();return;}
    }
    const info = await stat(path);
    if (!info.isFile()) {response.writeHead(404).end();return;}
    response.writeHead(200,{'Content-Type':mime[extname(path)] || 'application/octet-stream','Cache-Control':'no-store'});
    response.end(request.method === 'HEAD' ? undefined : await readFile(path));
  } catch { response.writeHead(404).end(); }
});
server.listen(port,'127.0.0.1',()=>console.log(`LP A preview http://127.0.0.1:${port}`));
