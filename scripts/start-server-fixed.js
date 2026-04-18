const liveServer = require('live-server');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const demoPath = path.join(projectRoot, 'demo');
const distPath = path.join(projectRoot, 'dist');

const params = {
  port: 8080,
  host: '127.0.0.1',
  root: demoPath,
  watch: [path.join(distPath, '**'), path.join(demoPath, '**')],
  open: process.env.NODE_ENV !== 'test',
  mount: [['/dist', distPath]],
  noCssInject: true
};

console.log('Starting server with:');
console.log('  Demo path:', demoPath);
console.log('  Dist path:', distPath);
console.log('  Mounting /dist to:', distPath);
console.log('  URL: http://127.0.0.1:8080');

const server = liveServer.start(params);

module.exports = server;
