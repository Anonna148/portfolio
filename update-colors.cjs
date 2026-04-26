const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Gradients
  { regex: /linear-gradient\(135deg,\s*#8b5cf6,\s*#ec4899\)/g, replace: 'var(--accent-primary)' },
  { regex: /linear-gradient\(135deg,\s*#8b5cf6,\s*#ec4899,\s*#06b6d4\)/g, replace: 'var(--accent-primary)' },
  { regex: /linear-gradient\(135deg,\s*rgba\(139,\s*92,\s*246,\s*0\.2\),\s*rgba\(236,\s*72,\s*153,\s*0\.2\)\)/g, replace: 'var(--bg-card-hover)' },
  { regex: /linear-gradient\(to bottom,\s*transparent,\s*#8b5cf6 20%,\s*#ec4899 80%,\s*transparent\)/g, replace: 'linear-gradient(to bottom, transparent, var(--accent-primary) 20%, var(--accent-secondary) 80%, transparent)' },
  
  // Hardcoded hex colors
  { regex: /#8b5cf6/gi, replace: 'var(--accent-primary)' },
  { regex: /#ec4899/gi, replace: 'var(--accent-secondary)' },
  
  // RGBA purple and pink equivalents to subtle blue
  { regex: /rgba\(139,\s*92,\s*246/g, replace: 'rgba(59, 130, 246' }, // Blue 500 rgba
  { regex: /rgba\(236,\s*72,\s*153/g, replace: 'rgba(96, 165, 250' }, // Blue 400 rgba
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
