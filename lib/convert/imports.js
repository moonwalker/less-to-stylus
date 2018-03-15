module.exports = source => source
  // `@import (keyword) 'other.less` -> `@require 'other.styl`
  .replace(/@import(?!\s*(\((multiple|optional)))(\s*\(.*\))?/g, '@require')

  // Multiple
  // `@import (multiple) 'other-file'` -> `@require 'other-file'`
  .replace(/(@import\s*)\(multiple\)\s*((["|']).*\3)/g, (_, importStatement, url) =>
    `${importStatement}${url}`)

  // Optional import (requires stylus plugin)
  // `@import (optional) 'other-file'` -> `@import 'other-file' if file-exists('other-file')`
  .replace(/(?:@import\s*)\(optional\)\s*((["|']).*\2)/g, (_, url) =>
    `@require ${url} if file-exists(${url})`);
