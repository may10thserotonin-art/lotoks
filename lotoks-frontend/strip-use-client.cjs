const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/pages/Home.tsx',
  'src/pages/About.tsx',
  'src/pages/Apply.tsx',
  'src/pages/Contact.tsx',
  'src/pages/Documents.tsx',
  'src/pages/Eligibility.tsx',
  'src/pages/Login.tsx',
  'src/pages/Opportunities.tsx',
  'src/pages/Payment.tsx',
  'src/pages/Services.tsx',
  'src/pages/Testimonials.tsx',
];

for (const rel of targetFiles) {
  const full = path.join(__dirname, rel);
  if (!fs.existsSync(full)) {
    console.log('NOT FOUND:', full);
    continue;
  }
  // Read as buffer to inspect raw bytes
  const buf = fs.readFileSync(full);
  let content = buf.toString('utf8');
  
  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  
  const original = content;
  
  // Replace first line if it's 'use client'; or "use client";
  const lines = content.split('\n');
  const firstLine = lines[0].replace(/\r$/, '');
  if (firstLine === "'use client';" || firstLine === '"use client";') {
    lines.shift(); // remove first line
    content = lines.join('\n');
    fs.writeFileSync(full, content, 'utf8');
    console.log('Stripped:', rel, '| First line was:', JSON.stringify(firstLine));
  } else {
    console.log('Skipped:', rel, '| First line:', JSON.stringify(firstLine.slice(0, 40)));
  }
}
console.log('Done.');
