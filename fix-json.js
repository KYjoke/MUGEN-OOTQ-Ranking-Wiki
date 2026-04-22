const fs = require('fs');
const path = require('path');

const chars = fs.readdirSync('content/characters', { encoding: 'utf8' });
chars.forEach(name => {
  const f = path.join('content/characters', name, 'meta.json');
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/审核/g, '参照');
  fs.writeFileSync(f, c);
  console.log('Fixed:', name);
});

console.log('All done');