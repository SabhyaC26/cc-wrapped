import { watch } from 'fs';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const PORT = process.env.PORT || 5173;
const DIST_DIR = './dist';
const PUBLIC_DIR = './public';
const WATCH_DIRS = ['./src', './index.html'];

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
  if (pathname === '/') {
    const indexPath = join(DIST_DIR, 'index.html');
    if (existsSync(indexPath)) {
      return { path: indexPath, exists: true };
    }
  }

  const distPath = join(DIST_DIR, pathname);
  if (existsSync(distPath)) {
    return { path: distPath, exists: true };
  }

  const publicPath = join(PUBLIC_DIR, pathname);
  if (existsSync(publicPath)) {
    return { path: publicPath, exists: true };
  }

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

// Build function
async function build() {
  console.log('\n🔨 Building...');
  const buildProcess = spawn('bun', ['run', 'build.js'], {
    stdio: 'inherit',
    shell: true
  });

  return new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build complete!\n');
        resolve();
      } else {
        console.error('❌ Build failed\n');
        reject(new Error('Build failed'));
      }
    });
  });
}

// Initial build
await build();

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
          'Cache-Control': 'no-cache',
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

console.log(`\n✨ Dev server running at http://localhost:${PORT}`);
console.log(`📁 Serving files from ${DIST_DIR}/`);
console.log(`👀 Watching for changes in: ${WATCH_DIRS.join(', ')}`);
console.log(`\n→ Opening browser...\n`);

// Auto-open browser
setTimeout(() => {
  openBrowser(`http://localhost:${PORT}`);
}, 500);

// Watch for file changes
let isBuilding = false;
let buildQueued = false;

async function handleFileChange() {
  if (isBuilding) {
    buildQueued = true;
    return;
  }

  isBuilding = true;
  try {
    await build();
    console.log('💫 Refresh your browser to see changes\n');
  } catch (error) {
    console.error('Build error:', error);
  } finally {
    isBuilding = false;
    if (buildQueued) {
      buildQueued = false;
      handleFileChange();
    }
  }
}

// Watch source directories
WATCH_DIRS.forEach(dir => {
  watch(dir, { recursive: true }, (eventType, filename) => {
    if (filename && !filename.includes('node_modules')) {
      console.log(`\n📝 File changed: ${filename}`);
      handleFileChange();
    }
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n✓ Shutting down dev server...');
  process.exit(0);
});
