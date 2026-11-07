/**
 * Production static preview (`pnpm preview`, Playwright webServer).
 *
 * Requirement: `vite preview` served `/200.html` with HTTP 404 (breaks Workbox precache).
 * Approach: serve `build/` directly so GET/HEAD `/200.html` return 200 and SPA routes work.
 */

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '../build');
const port = Number(process.env.PORT ?? 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const rel = decoded.replace(/^\//, '');
  const file = join(root, rel);
  if (!file.startsWith(root)) return null;
  return file;
}

function sendFile(req, res, file) {
  const type = MIME[extname(file)] ?? 'application/octet-stream';
  res.statusCode = 200;
  res.setHeader('Content-Type', type);
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const urlPath = req.url?.split('?')[0] ?? '/';
  let file = safePath(urlPath);
  if (file && existsSync(file) && statSync(file).isFile()) {
    sendFile(req, res, file);
    return;
  }
  if (urlPath.endsWith('/')) {
    const indexGuess = safePath(`${urlPath}index.html`);
    if (indexGuess && existsSync(indexGuess)) {
      sendFile(req, res, indexGuess);
      return;
    }
  }
  const htmlGuess = safePath(`${urlPath}.html`);
  if (htmlGuess && existsSync(htmlGuess)) {
    sendFile(req, res, htmlGuess);
    return;
  }
  const shell = join(root, '200.html');
  if (existsSync(shell)) sendFile(req, res, shell);
  else {
    res.statusCode = 500;
    res.end('missing 200.html');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`preview-e2e listening on http://127.0.0.1:${port}`);
});
