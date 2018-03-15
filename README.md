# Less-to-Stylus

*Basic* `.less` to `.stylus` conversion.

Based on https://github.com/vio/semantic-ui-stylu://gist.github.com/MoOx/3490671

## Usage

### CLI
```shell
$ npm install -g @moonwalker/less-to-stylus

$ less-to-stylus -h
less-to-stylus <file> > output.styl

Convert .less to .stylus

Positionals:
  file  Less file                                                       [string]

Options:
  --version          Show version number                               [boolean]
  --variable-prefix  Prefix variable names with a string,
                     default `''` (`$` is added automatically)          [string]
  --help             Show help                                         [boolean]
```

### Javascript

```shell
$ npm install -D @moonwalker/less-to-stylus
```

```js
const fs = require('fs');
const less2Stylus = require('@moonwalker/less-to-stylus');

fs.readFile('./source.less', 'utf8', (err, source) => {
  const output = less2Stylus.convert(source);

  console.log(output);
});
```

## Use Stylus plugin

Some Less functionality does not have a Stylus correspondent. The plugin can help bridge some of the
differences:

- `@import (optional)`
