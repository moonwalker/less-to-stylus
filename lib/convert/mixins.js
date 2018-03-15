module.exports = source => source
  // replace mixins from .border-radius(4px) to border-radius(4px)
  .replace(/\.([\w-]+) ?\(/g, '$1(')

  // conditional mixin
  // replace `mixin() when` with a stylus conditional
  .replace(/(\w+\(.*\))(?:\s*when\s*)\((\$\w+)\)(\s*)(\{)(?:\n*)(\s*)/, (_, mixin, condition, space, bracket, indent) =>
    `${mixin}${space}${bracket}\n${indent}if${space}(!(${condition}))${space}{${space}return;${space}}\n${indent}`);
