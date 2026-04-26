const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { regex: /linear-gradient\(135deg,\s*#8b5cf6,\s*#ec4899\)/g, replace: 'var(--accent-primary)' },
  { regex: /linear-gradient\(135deg,\s*rgba\(139,\s*92,\s*246,\s*0\.2\),\s*rgba\(236,\s*72,\s*153,\s*0\.2\)\)/g, replace: 'var(--bg-card-hover)' },
  { regex: /#8b5cf6/g, replace: 'var(--accent-primary)' },
  { regex: /#ec4899/g, replace: 'var(--accent-secondary)' },
  { regex: /rgba\(139,\s*92,\s*246/g, replace: 'rgba(59, 130, 246' }, // Blue 500 rgba
  { regex: /rgba\(236,\s*72,\s*153/g, replace: 'rgba(96, 165, 250' }, // Blue 400 rgba
  { regex: /conic-gradient\(from 0deg, var\(--accent-primary\), var\(--accent-secondary\), #06b6d4, var\(--accent-primary\)\)/g, replace: 'conic-gradient(from 0deg, var(--accent-primary), var(--bg-deep), var(--accent-primary))' },
  { regex: /linear-gradient\(135deg, var\(--accent-primary\), var\(--accent-secondary\), #06b6d4\)/g, replace: 'var(--accent-primary)' },
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.css') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const { regex, replace } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walk(srcDir);
console.log("Color scheme update complete.");
