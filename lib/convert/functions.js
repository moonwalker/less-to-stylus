module.exports = source => source
  // ~ -> unqoute
  .replace(/~("|')(.*?)\1/, (_, quote, val) =>
    `unquote(${quote}${val}${quote})`);
