// Stylus plugin to __polyfill__ less features
const stylus = require('stylus');

module.exports = () => style =>
  style.define('file-exists', function fileExists(node) {
    const filepath = node.string.match(/\w(\.[a-z|0-9]{3,4})$/) ?
      node.string :
      `${node.string}.styl`;

    return !!stylus.utils.lookup(filepath, this.paths);
  });
