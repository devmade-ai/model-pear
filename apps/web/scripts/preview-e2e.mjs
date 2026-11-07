/**
 * Static preview for Playwright: SvelteKit SPA routes + literal `/200.html` (HTTP 200).
 *
 * Requirement: vite preview returns 404 status for `/200.html` while still body-serving
 *   the shell — Workbox install fails and SW never reaches `active` in automation.
 * Approach: minimal static server on `build/` with SPA fallback to `200.html`.
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

function sendFile(res, file) {
  const type = MIME[extname(file)] ?? 'application/octet-stream';
  res.statusCode = 200;
  res.setHeader('Content-Type', type);
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const urlPath = req.url?.split('?')[0] ?? '/';
  let file = safePath(urlPath);
  if (file && existsSync(file) && statSync(file).isFile()) {
    sendFile(res, file);
    return;
  }
  if (urlPath.endsWith('/')) {
    const indexGuess = safePath(`${urlPath}index.html`);
    if (indexGuess && existsSync(indexGuess)) {
      sendFile(res, indexGuess);
      return;
    }
  }
  const htmlGuess = safePath(`${urlPath}.html`);
  if (htmlGuess && existsSync(htmlGuess)) {
    sendFile(res, htmlGuess);
    return;
  }
  const shell = join(root, '200.html');
  if (existsSync(shell)) sendFile(res, shell);
  else {
    res.statusCode = 500;
    res.end('missing 200.html');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`preview-e2e listening on http://127.0.0.1:${port}`);
});
