import { existsSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

const PORT = process.env.PORT || 5173;
const DIST_DIR = './dist';
const PUBLIC_DIR = './public';

// MIME type mapping
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.map': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

function getMimeType(filepath) {
  const ext = filepath.substring(filepath.lastIndexOf('.'));
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function resolveFile(pathname) {
  // Handle root path
  if (pathname === '/') {
    const indexPath = join(DIST_DIR, 'index.html');
    if (existsSync(indexPath)) {
      return { path: indexPath, exists: true };
    }
  }

  // Try dist directory first
  const distPath = join(DIST_DIR, pathname);
  if (existsSync(distPath)) {
    return { path: distPath, exists: true };
  }

  // Fall back to public directory
  const publicPath = join(PUBLIC_DIR, pathname);
  if (existsSync(publicPath)) {
    return { path: publicPath, exists: true };
  }

  // For React routing - serve index.html for non-existent routes
  // (but only if it's not a file extension request)
  if (!pathname.includes('.')) {
    const indexPath = join(DIST_DIR, 'index.html');
    if (existsSync(indexPath)) {
      return { path: indexPath, exists: true };
    }
  }

  return { path: null, exists: false };
}

function openBrowser(url) {
  const platform = process.platform;
  let command;

  if (platform === 'darwin') {
    command = 'open';
  } else if (platform === 'win32') {
    command = 'start';
  } else {
    command = 'xdg-open';
  }

  spawn(command, [url], { detached: true, stdio: 'ignore' });
}

// Start the server
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const { path, exists } = resolveFile(pathname);

    if (!exists) {
      return new Response('404 Not Found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    try {
      const file = Bun.file(path);
      const content = await file.arrayBuffer();

      return new Response(content, {
        headers: {
          'Content-Type': getMimeType(path),
        },
      });
    } catch (error) {
      console.error('Error serving file:', error);
      return new Response('500 Internal Server Error', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
});

console.log(`\n✓ Server running at http://localhost:${PORT}`);
console.log(`✓ Serving files from ${DIST_DIR}/`);
console.log(`\n→ Opening browser...\n`);

// Auto-open browser
setTimeout(() => {
  openBrowser(`http://localhost:${PORT}`);
}, 500);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n✓ Shutting down server...');
  process.exit(0);
});
