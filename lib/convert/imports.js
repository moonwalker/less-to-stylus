module.exports = source => source
  // Optional import (requires stylus plugin)
  // `@import (optional) 'other-file'` -> `@import 'other-file' if file-exists('other-file')`
  .replace(/(@import\s*)\(optional\)\s*((["|']).*\3)/g, (_, importStatement, url) =>
    `${importStatement}${url} if file-exists(${url})`)

  // other imports
  // `@import 'other.less` -> `@import 'other.styl`
  .replace(/@import(\s*)\(.*\)(\s*)/g, '@import$1');
