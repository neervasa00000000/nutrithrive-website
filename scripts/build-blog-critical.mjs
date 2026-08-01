#!/usr/bin/env node
/**
 * Build blog-critical.min.css from design tokens, blog shell, and above-fold utilities.
 * Run: node scripts/build-blog-critical.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CleanCSS from 'clean-css';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');

const ABOVE_FOLD_UTILITIES = `
/* Above-fold Tailwind token utilities (blog article shell) */
.bg-background{background-color:#fdf9ee}
.text-on-background{color:#1c1c15}
.text-on-surface-variant{color:#3f4943}
.text-on-surface{color:#1c1c15}
.text-moringa-leaf{color:#0f6b4d}
.text-forest-deep{color:#1a2e22}
.font-body-md{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400}
.font-display{font-family:inherit;font-size:32px;line-height:40px;font-weight:600;letter-spacing:-.02em}
.text-headline-lg{font-size:32px;line-height:40px;font-weight:600}
.text-body-md{font-size:16px;line-height:24px}
.text-body-sm{font-size:14px;line-height:20px}
.text-label-sm{font-size:12px;line-height:16px;letter-spacing:.04em;font-weight:500}
.text-label-lg{font-size:14px;line-height:20px;letter-spacing:.02em;font-weight:600}
.text-xs{font-size:.75rem;line-height:1rem}
.leading-tight{line-height:1.25}
.uppercase{text-transform:uppercase}
.tracking-wider{letter-spacing:.05em}
.font-bold{font-weight:700}
.italic{font-style:italic}
.max-w-container-max{max-width:1280px}
.max-w-none{max-width:none}
.mx-auto{margin-left:auto;margin-right:auto}
.mb-2{margin-bottom:.5rem}
.mb-4{margin-bottom:1rem}
.mb-8{margin-bottom:2rem}
.mb-12{margin-bottom:3rem}
.pt-4{padding-top:1rem}
.pt-6{padding-top:1.5rem}
.pb-2{padding-bottom:.5rem}
.pb-section-gap{padding-bottom:80px}
.px-3{padding-left:.75rem;padding-right:.75rem}
.py-1{padding-top:.25rem;padding-bottom:.25rem}
.px-margin-mobile{padding-left:20px;padding-right:20px}
.flex{display:flex}
.grid{display:grid}
.flex-wrap{flex-wrap:wrap}
.items-center{align-items:center}
.gap-1{gap:.25rem}
.gap-2{gap:.5rem}
.gap-gutter{gap:24px}
.list-none{list-style:none}
.m-0{margin:0}
.p-0{padding:0}
.w-full{width:100%}
.h-full{height:100%}
.rounded-full{border-radius:9999px}
.rounded-xl{border-radius:.75rem}
.overflow-hidden{overflow:hidden}
.overflow-x-hidden{overflow-x:hidden}
.object-cover{object-fit:cover}
.shadow-sm{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}
.bg-surface-container{background-color:#f2eee3}
.bg-primary-fixed\\/30{background-color:rgba(161,243,205,.3)}
.aspect-\\[16\\/9\\]{aspect-ratio:16/9}
.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
.hover\\:underline:hover{text-decoration:underline}
#nt-header.nt-v2-header{min-height:68px}
#nt-header.nt-v2-header:empty::before{content:"";display:block;min-height:68px}
.answer-box{background:#f0fdf4;border:2px solid #16a34a;border-radius:12px;padding:1.5rem;margin:1.5rem 0}
.answer-box h2{margin-top:0;color:#166534;font-size:1.3rem}
.nt-blog-hero-media,.nt-blog-hero-media picture{display:block;aspect-ratio:16/9;width:100%}
.nt-blog-hero-media img{width:100%;height:100%;object-fit:cover}
.nt-sticky-toc,.table-of-contents{min-height:9rem}
.blog-v2-prose table,.nt-comparison-table{min-height:12rem;width:100%}
.blog-v2-prose div[style*="overflow-x: auto"]{min-height:14rem}
@media (min-width:768px){
  .md\\:px-margin-desktop{padding-left:64px;padding-right:64px}
  .md\\:text-display{font-size:48px;line-height:56px;font-weight:700}
}
@media (min-width:1024px){
  .lg\\:grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}
  .lg\\:col-span-8{grid-column:span 8/span 8}
}
`;

const DESIGN_TOKENS = fs.readFileSync(path.join(REPO, 'assets/css/design-system.min.css'), 'utf8')
  .split('}').slice(0, 4).join('}') + '}'; // :root + html + *, body only — trim footer bloat

const V2_EXTRA_CRITICAL = `
.nt-sticky-top{position:sticky;top:0;z-index:1000;width:100%;background:var(--bg,#f5f1e6)}
.nt-promo-bar{background:#1a2e22;color:#fff;text-align:center;padding:.45rem 1rem;font-size:.8125rem;font-weight:500;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
#nt-header{position:relative;width:100%;background:var(--bg,#f5f1e6);border-bottom:1px solid var(--color-border-soft,#e6e2d7)}
`;

const shell = fs.readFileSync(path.join(REPO, 'blog/blog-v2-shell.css'), 'utf8');
const combined = [DESIGN_TOKENS, V2_EXTRA_CRITICAL, shell, ABOVE_FOLD_UTILITIES].join('\n');
const minified = new CleanCSS({ level: 2 }).minify(combined).styles;

const outPath = path.join(REPO, 'shared/css/blog-critical.min.css');
const outSource = path.join(REPO, 'shared/css/blog-critical.css');
fs.writeFileSync(outSource, combined);
fs.writeFileSync(outPath, minified);
console.log(`Wrote ${outPath} (${minified.length} bytes)`);

const fontsMin = new CleanCSS().minify(
  fs.readFileSync(path.join(REPO, 'shared/css/fonts-local.css'), 'utf8')
).styles;
fs.writeFileSync(path.join(REPO, 'shared/css/fonts-local.min.css'), fontsMin);
console.log(`Wrote shared/css/fonts-local.min.css (${fontsMin.length} bytes)`);
