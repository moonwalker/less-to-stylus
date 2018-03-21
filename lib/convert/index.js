const flow = require('lodash.flow');
const replaceVariables = require('./variables');
const replaceImports = require('./imports');
const replaceMixins = require('./mixins');
const replaceFunctions = require('./functions');

const renameLessToStylus = source => source.replace(/\.less/g, '.styl');

module.exports = (source, options = { variableNamePrefix: '' }) => flow(
  replaceVariables(options),
  replaceImports,
  replaceMixins,
  replaceFunctions,
  renameLessToStylus,
)(source);
