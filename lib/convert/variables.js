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
const replaceDeclarations = source => source
  // `@variableName : ` -> `$variableName = `
  .replace(/@(\w+)( *):( *)/g, (_, name, spaceBeforeColor, spaceAfterColon) =>
    `$${name}${spaceBeforeColor}=${spaceAfterColon}`)

  // fix multiline variable declarations
  .replace(/=(?:\s*)((?:.*,\n)*)(.*)(?:\n;)/g, '=$1$2;');

// Usage - negative sign in front of the variable
// Add a space between variable and `-` (stylus isn't parsing correctly the sign)
const replaceNegativeVariables = source => source
  // 1. replace all
  .replace(/-@(\w+)/g, '(- $$$1)')

  // 2. unwrap (- $varName) when already wrapped in `()` - arithmentical operations
  .replace(/\((.*)(?=\()(.*)\)/g, content =>
    content.replace(/\((- \$\w+)\)/g, '$1'));

// Usage
// `@variableName` -> `$variableName`
const replaceUsage = source => source
  .replace(/@(\w+)/g, (match, keyword) =>
    (AT_RULES.includes(keyword) ? match : `$${keyword}`));

// Variable iterpolation
const replaceInterpolations = source => source
  // 1. all instances:
  // `min-width: @{desktop}` -> `min-width: {$desktop}`
  .replace(/@\{(\w+)\}/g, '{$$$1}')

  // 2. change to concatenation when inside strings:
  // `url("@imgFolder/icon.svg)"` -> `url($imgFolder + "/icon.svg")
  .replace(/(["|'])(.*)\1/g, (_, quote, text) => {
    const newText = text.replace(/\{(\$\w+)\}/g, `${quote} + $1 + ${quote}`);
    return `${quote}${newText}${quote}`;
  })

  // 3. fix calc interpolation
  // `~"calc(100% - "$variableName~")" -> `unquote("calc(100% - " + $variableName + ")")`
  .replace(/~(["|'])calc\((.*)(?:\s*~\s*)\1(.*)\)\1/g, (_, quote, content, restContent) => {
    const output = content.replace(/(["|'])/, '').replace(/(\$\w+)/g, (__, variable) =>
      `${quote} + ${variable} + ${quote}`);

    return `unquote(${quote}calc(${output}${restContent})${quote})`;
  });


// Dynamic variable name
// `@@red` -> `lookup('$' + $red)`
const replaceDynamicNames = source => source
  .replace(/@(\$\w+)/, 'lookup("$" + $1)');

module.exports = source => flow(
  replaceDeclarations,
  replaceNegativeVariables,
  replaceUsage,
  replaceInterpolations,
  replaceDynamicNames,
)(source);
