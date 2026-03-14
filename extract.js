const fs = require('fs');
const sw = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));
const res = Object.entries(sw.paths).flatMap(([path, methods]) => {
  return Object.entries(methods)
    .filter(([method, details]) => details.tags && details.tags.includes('SystemConfigurations'))
    .map(([method, details]) => `${method.toUpperCase()} ${path}: ${details.summary || ''}`);
});
console.log(res.join('\n'));
