const flow = require('lodash.flow');
const replaceVariables = require('./variables');
const replaceImports = require('./imports');
const replaceMixins = require('./mixins');

const renameLessToStylus = source => source.replace(/\.less/g, '.styl');

module.exports = source => flow(
  replaceVariables,
  replaceImports,
  replaceMixins,
  renameLessToStylus,
)(source);
