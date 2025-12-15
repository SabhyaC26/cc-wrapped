import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, basename } from 'path';

// Ensure dist directory exists
const distDir = './dist';
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Copy public assets if they exist
// Note: data.json is served from public/ directory by the server
// No need to copy it to dist/

// Build the app with Bun
const result = await Bun.build({
  entrypoints: ['./src/main.jsx'],
  outdir: './dist',
  target: 'browser',
  minify: process.env.NODE_ENV === 'production',
  sourcemap: 'external',
  naming: '[dir]/[name].[ext]'
});

if (!result.success) {
  console.error('Build failed:');
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Read the original index.html
const indexHtml = readFileSync('./index.html', 'utf-8');

// Get output filenames
const jsFile = result.outputs.find(f => f.path.endsWith('.js'));
const cssFile = result.outputs.find(f => f.path.endsWith('.css'));
const jsFilename = jsFile ? basename(jsFile.path) : 'main.js';
const cssFilename = cssFile ? basename(cssFile.path) : null;

// Replace the script src in index.html and add CSS link if exists
let updatedHtml = indexHtml.replace(
  '<script type="module" src="/src/main.jsx"></script>',
  `<script type="module" src="/${jsFilename}"></script>`
);

// Add CSS link in the head if CSS file exists
if (cssFilename) {
  updatedHtml = updatedHtml.replace(
    '</head>',
    `  <link rel="stylesheet" href="/${cssFilename}">\n  </head>`
  );
}

// Write the updated index.html to dist
writeFileSync(join(distDir, 'index.html'), updatedHtml);

console.log('✓ Build completed successfully!');
console.log(`✓ Output directory: ${distDir}`);
