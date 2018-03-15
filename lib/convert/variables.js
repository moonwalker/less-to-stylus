const flow = require('lodash.flow');

const AT_RULES = [
  'charset',
  'import',
  'namespace',
  'document',
  'font-face',
  'keyframes',
  'media',
  'page',
  'supports',
];

// Declarations
const replaceDeclarations = ({ variableNamePrefix, conditionalAssignment }) => source => source
  // `@variableName : ` -> `$variableName = `
  .replace(/@([\w|-]+)( *):( *)/g, (_, variableName, spaceBeforeColor, spaceAfterColon) => {
    const assignment = conditionalAssignment ? '?=' : '=';

    return `$${variableNamePrefix}${variableName}${spaceBeforeColor}${assignment}${spaceAfterColon}`;
  })

  // fix multiline variable declarations
  .replace(/=(?:\s*)((?:.*,\n)*)(.*)(?:\n;)/g, '=$1$2;');

// Usage - negative sign in front of the variable
// Add a space between variable and `-` (stylus isn't parsing correctly the sign)
const replaceNegativeVariables = ({ variableNamePrefix }) => (source) => {
  // 1. replace all
  const newSource = source.replace(/-@([\w|-]+)/g, (_, variableName) =>
    `(- $${variableNamePrefix}${variableName})`);

  // 2. unwrap (- $varName) when already wrapped in `()` - arithmentical operations
  return newSource.replace(/\((.*)(?=\()(.*)\)/g, (content) => {
    const pattern = new RegExp(`\\((- \\$${variableNamePrefix}[\\w|-]+)\\)`, 'g');
    return content.replace(pattern, '$1');
  });
};

// Usage
// `@variableName` -> `$variableName`
const replaceUsage = ({ variableNamePrefix }) => source => source
  .replace(/@([\w|-]+)/g, (match, variableName) =>
    (AT_RULES.includes(variableName) ? match : `$${variableNamePrefix}${variableName}`));

// Variable iterpolation
const replaceInterpolations = ({ variableNamePrefix }) => source => source
  // 1. all instances:
  // `min-width: @{desktop}` -> `min-width: {$desktop}`
  .replace(/@\{([\w|-]+)\}/g, (_, variableName) =>
    `{$${variableNamePrefix}${variableName}}`)

  // 2. change to concatenation when inside strings:
  // `url("@imgFolder/icon.svg)"` -> `url($imgFolder + "/icon.svg")
  .replace(/(["|'])(.*)\1/g, (_, quote, text) => {
    const pattern = new RegExp(`\\{(\\$${variableNamePrefix}[\\w|-]+)\\}`, 'g');
    const newText = text.replace(pattern, `${quote} + $1 + ${quote}`);
    return `${quote}${newText}${quote}`;
  })

  // 3. fix calc interpolation
  // `~"calc(100% - "$variableName~")" -> `unquote("calc(100% - " + $variableName + ")")`
  .replace(/~(["|'])calc\((.*)(?:\s*~\s*)\1(.*)\)\1/g, (_, quote, content, restContent) => {
    const output = content.replace(/(["|'])/, '').replace(/(\$[\w|-]+)/g, (__, variable) =>
      `${quote} + ${variable} + ${quote}`);

    return `unquote(${quote}calc(${output}${restContent})${quote})`;
  });


// Dynamic variable name
// `@@red` -> `lookup('$' + $red)`
const replaceDynamicNames = () => source =>
  source.replace(/@(\$[\w|-]+)/, 'lookup("$" + $1)');

const DEFAULT_OPTIONS = {
  variableNamePrefix: '',
  conditionalAssignment: false,
};

module.exports = (customOptions = {}) => (source) => {
  const options = Object.assign({}, DEFAULT_OPTIONS, customOptions);

  const transforms = [
    replaceDeclarations,
    replaceNegativeVariables,
    replaceUsage,
    replaceInterpolations,
    replaceDynamicNames,
  ].map(transform => transform(options));

  return flow(transforms)(source);
};
