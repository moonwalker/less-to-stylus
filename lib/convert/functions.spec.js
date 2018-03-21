/* global describe, it, expect */
const convert = require('./functions');

describe('Functions', () => {
  it('should replace escape with unquote', () => {
    expect(convert('width: ~"calc(100vw - 10px)"'))
      .toBe('width: unquote("calc(100vw - 10px)")');
    expect(convert('width: ~\'calc(100vw - 10px)\''))
      .toBe('width: unquote(\'calc(100vw - 10px)\')');
  });
});
