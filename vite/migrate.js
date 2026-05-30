const fs   = require('fs');
const path = require('path');

const ROOT     = path.join(__dirname, '..');
const SRC_NEXT = path.join(ROOT, 'vite', 'client', 'src_next', 'src');
const DEST     = path.join(ROOT, 'vite', 'client', 'src');

// ── Helpers ──────────────────────────────────────────────────
function copyRecursive(src, dst) {
  if (!fs.existsSync(src)) { console.log(`SKIP (not found): ${src}`); return; }
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const f of fs.readdirSync(src)) copyRecursive(path.join(src, f), path.join(dst, f));
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

function removeRecursive(p) {
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) {
    for (const f of fs.readdirSync(p)) removeRecursive(path.join(p, f));
    fs.rmdirSync(p);
  } else {
    fs.unlinkSync(p);
  }
}

// ── Step 1: Copy directories ──────────────────────────────────
for (const dir of ['app', 'components', 'store', 'hooks', 'types']) {
  const from = path.join(SRC_NEXT, dir);
  const to   = path.join(DEST, dir);
  copyRecursive(from, to);
  console.log(`Copied ${dir}/`);
}

// ── Step 2: Copy globals.css → index.css ─────────────────────
const globalsCss = path.join(SRC_NEXT, 'app', 'globals.css');
const indexCss   = path.join(DEST, 'index.css');
if (fs.existsSync(globalsCss)) {
  fs.copyFileSync(globalsCss, indexCss);
  console.log('Copied globals.css -> index.css');
}

// ── Step 3: Remove temp folder ────────────────────────────────
removeRecursive(path.join(ROOT, 'vite', 'client', 'src_next'));
console.log('Cleaned up src_next');

// ── Step 4: Rewrite Next.js imports in all .tsx/.ts files ─────
function getAllFiles(dir, exts, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) getAllFiles(full, exts, results);
    else if (exts.some(e => f.endsWith(e))) results.push(full);
  }
  return results;
}

const files = getAllFiles(DEST, ['.tsx', '.ts']);
let rewritten = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // 1. Remove 'use client' / "use client" directives
  content = content.replace(/^['"]use client['"];?\n?/gm, '');
  content = content.replace(/^['"]use server['"];?\n?/gm, '');

  // 2. Remove Next.js metadata/dynamic/revalidate exports
  content = content.replace(/^export const metadata\s*=[\s\S]*?^};?$/gm, '');
  content = content.replace(/^export const dynamic\s*=.*$/gm, '');
  content = content.replace(/^export const revalidate\s*=.*$/gm, '');

  // 3. Replace next/link import
  content = content.replace(/import\s+Link\s+from\s+["']next\/link["'];?/g,
    "import { Link } from 'react-router-dom';");

  // 4. Replace href= with to= on Link elements (JSX prop)
  // Only replace href when it's on a Link component (heuristic: after <Link)
  content = content.replace(/(<Link\b[^>]*?)\bhref=/g, '$1to=');

  // 5. Replace next/navigation imports
  // useRouter only
  content = content.replace(
    /import\s*\{\s*useRouter\s*\}\s*from\s*["']next\/navigation["'];?/g,
    "import { useNavigate } from 'react-router-dom';"
  );
  // usePathname only
  content = content.replace(
    /import\s*\{\s*usePathname\s*\}\s*from\s*["']next\/navigation["'];?/g,
    "import { useLocation } from 'react-router-dom';"
  );
  // usePathname + useRouter combined
  content = content.replace(
    /import\s*\{\s*usePathname\s*,\s*useRouter\s*\}\s*from\s*["']next\/navigation["'];?/g,
    "import { useNavigate, useLocation } from 'react-router-dom';"
  );
  content = content.replace(
    /import\s*\{\s*useRouter\s*,\s*usePathname\s*\}\s*from\s*["']next\/navigation["'];?/g,
    "import { useNavigate, useLocation } from 'react-router-dom';"
  );

  // 6. Replace useRouter() call → useNavigate()
  content = content.replace(/const\s+(\w+)\s*=\s*useRouter\(\)/g, 'const $1 = useNavigate()');
  // Replace router.push( → navigate(  (handles any variable name)
  content = content.replace(/(\w+)\.push\(/g, (match, varName) => {
    // Only replace if looks like router usage (not e.g. array.push)
    if (['router', 'navigate'].includes(varName)) return 'navigate(';
    return match;
  });
  content = content.replace(/router\.back\(\)/g, 'navigate(-1)');
  content = content.replace(/router\.replace\(/g, 'navigate(');

  // 7. Replace usePathname() → useLocation().pathname
  content = content.replace(/const\s+(\w+)\s*=\s*usePathname\(\)/g,
    'const { pathname: $1 } = useLocation()');
  // Standalone usePathname() not assigned
  content = content.replace(/usePathname\(\)/g, 'useLocation().pathname');

  // 8. Remove next/font/google imports (handled by index.html link tag)
  content = content.replace(/import\s*\{[^}]*\}\s*from\s*["']next\/font\/google["'];?\n?/g, '');
  // Remove font variable usage patterns like inter.variable
  content = content.replace(/\$\{inter\.variable\}\s*/g, '');
  content = content.replace(/\$\{lexend\.variable\}\s*/g, '');
  content = content.replace(/const\s+inter\s*=.*\n(.*\n)*?.*\}\);/g, '');
  content = content.replace(/const\s+lexend\s*=.*\n(.*\n)*?.*\}\);/g, '');

  // 9. Remove Metadata type import from next
  content = content.replace(/import\s+type\s*\{\s*Metadata\s*\}\s*from\s*["']next["'];?\n?/g, '');

  // 10. Remove next/image imports (plain <img> already in code or handled)
  content = content.replace(/import\s+Image\s+from\s+["']next\/image["'];?\n?/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    rewritten++;
    console.log(`  Rewritten: ${path.relative(DEST, file)}`);
  }
}

console.log(`\nDone! Rewrote ${rewritten} of ${files.length} files.`);
