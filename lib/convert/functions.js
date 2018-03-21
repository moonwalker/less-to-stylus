module.exports = source => source
  // ~ -> unqoute
  // https://regex101.com/r/EzokoV/3
  .replace(/(?:\s*)~\s?("|')(.*?)\1(?:\s*)/g, (_, quote, val) =>
    ` unquote(${quote}${val}${quote}) `);
