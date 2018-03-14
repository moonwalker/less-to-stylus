// Stylus plugin to __polyfill__ less features
const stylus = require('stylus');

module.exports = () => style =>
  style.define('file-exists', function fileExists(filepath) {
    return !!stylus.utils.lookup(filepath.string, this.paths);
  });
