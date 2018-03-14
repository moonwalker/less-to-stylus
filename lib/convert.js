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

module.exports = source => source
  // Variable declaration
  // `@variableName : ` -> `$variableName = `
  .replace(/@(\w+)( *):( *)/g, '$$$1$2=$3')

  // Variable usage

  // Add a space between variable and `-` (stylus isn't parsing correctly the sign)
  // 1. replace all
  .replace(/-@(\w+)/g, '(- $$$1)')

  // 2. unwrap (- $varName) when already wrapped in `()` - arithmentical operations
  .replace(/\((.*)(?=\()(.*)\)/g, content =>
    content.replace(/\((- \$\w+)\)/g, '$1'))

  // `@variableName` -> `$variableName`
  .replace(/@(\w+)/g, (match, keyword) =>
    (AT_RULES.includes(keyword) ? match : `$${keyword}`))

  // Variable iterpolation
  // `min-width: @{desktop}` -> `min-width: {$desktop}`
  .replace(/@\{(\w+)\}/g, '{$$$1}')

  // Variable interpolation in strings
  // `url("@imgFolder/icon.svg)"` -> `url($imgFolder + "/icon.svg")
  .replace(/(["|'])(.*)\1/g, (_, quote, text) => {
    const newText = text.replace(/\{(\$\w+)\}/g, `${quote} + $1 + ${quote}`);
    return `${quote}${newText}${quote}`;
  })

  // Dynamic variable name
  // `@@red` -> `lookup('$' + $red)`
  .replace(/@(\$\w+)/, 'lookup("$" + $1)')

  // Calc introspection
  // `~"calc(100% - "$variableName~")" -> `unquote("calc(100% - " + $variableName + ")")`
  .replace(/~(["|'])calc\((.*)(?:\s*~\s*)\1(.*)\)\1/g, (_, quote, content, restContent) => {
    const output = content.replace(/(["|'])/, '').replace(/(\$\w+)/g, (__, variable) =>
      `${quote} + ${variable} + ${quote}`);

    return `unquote(${quote}calc(${output}${restContent})${quote})`;
  })

  // Optional import (requires stylus plugin)
  // `@import (optional) 'other-file'` -> `@import 'other-file' if file-exists('other-file')`
  .replace(/(@import\s*)\(optional\)\s*((["|']).*\3)/g, (_, importStatement, url) =>
    `${importStatement}${url} if file-exists(${url})`)

  // other imports
  // `@import 'other.less` -> `@import 'other.styl`
  .replace(/@import(\s*)\(.*\)(\s*)/g, '@import$1')

  // replace mixins from .border-radius(4px) to border-radius(4px)
  .replace(/\.([\w-]+) ?\(/g, '$1(')

  // conditional mixin
  // replace `mixin() when` with a stylus conditional
  .replace(/(\w+\(.*\))(?:\s*when\s*)\((\$\w+)\)(\s*)(\{)(?:\n*)(\s*)/, (_, mixin, condition, space, bracket, indent) =>
    `${mixin}${space}${bracket}\n${indent}if${space}(!(${condition}))${space}{${space}return;${space}}\n${indent}`)

  // fix multiline variable declarations
  .replace(/(\$\w+)(\s*)=(?:\s*)((?:.*,\n)*)(.*)(\n;)/g, '$1$2=$2$3$4;')

  // rename filenames
  .replace(/\.less/g, '.styl');
