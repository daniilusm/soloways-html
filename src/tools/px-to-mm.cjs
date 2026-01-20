// tools/px-to-mm.cjs
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src', 'styles');

function convertPxToMmInText(text) {
  // matches numbers like 12, 12.5, .5 followed by px
  return text.replace(/(\d*\.?\d+)\s*px\b/g, (_, num) => {
    const px = parseFloat(num);
    const mm = +(px * 0.3527).toFixed(3); // adjust precision if needed
    return `${mm}mm`;
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && full.endsWith('.scss')) {
      const src = fs.readFileSync(full, 'utf8');
      const converted = convertPxToMmInText(src);
      if (converted !== src) {
        fs.writeFileSync(full, converted, 'utf8');
        console.log('Updated', path.relative(ROOT, full));
      }
    }
  }
}

walk(ROOT);