const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'build', 'index.html');

const html = fs.readFileSync(filepath, 'utf-8');
const fixed = html.replace(/\/static/g, 'static');

fs.writeFileSync(filepath, fixed, 'utf-8');
