const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourceFile = path.join(repoRoot, 'shared-links.js');
const targets = [
  path.join(repoRoot, 'docs', 'shared-links.js'),
  path.join(repoRoot, 'wss-digital', 'shared-links.js'),
];

if (!fs.existsSync(sourceFile)) {
  console.error('Quelle fehlt:', sourceFile);
  process.exit(1);
}

targets.forEach((target) => {
  fs.copyFileSync(sourceFile, target);
  console.log('Kopiert:', target.replace(repoRoot + path.sep, ''));
});
