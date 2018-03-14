#!/usr/bin/env node

const fs = require('fs');
const { convert } = require('../lib');

const { argv } = require('yargs')
  .usage('$0 <file>', 'Convert .less to .stylus', (yargs) => {
    yargs.positional('file', {
      description: 'Less file',
      type: 'string',
    });
  })
  .help();

const filepath = require.resolve(argv.file, {
  paths: [
    process.cwd(),
  ],
});

fs.readFile(filepath, 'utf8', (err, content) => {
  if (err) {
    return console.error(err.message); // eslint-disable-line no-console
  }

  return console.log(convert(content)); // eslint-disable-line no-console
});
