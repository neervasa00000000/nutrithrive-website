import fs from 'fs';
import path from 'path';

const root = path.join(import.meta.dirname, '..');
const shell = fs
  .readFileSync(path.join(root, 'blog/blog-v2-shell.css'), 'utf8')
  .replace(/@import[^;]+;/g, '');
const prose = fs
  .readFileSync(path.join(root, 'blog/blog-v2-prose.css'), 'utf8')
  .replace(/@import[^;]+;/g, '');
const combined = shell + '\n' + prose;
const min = combined
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .trim();
fs.writeFileSync(path.join(root, 'blog/blog-v2-prose.min.css'), min);
console.log('blog-v2-prose.min.css', min.length, 'bytes');
