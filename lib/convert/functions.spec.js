/* global describe, it, expect */
const convert = require('./functions');

describe('Functions', () => {
  it('should replace escape with unquote', () => {
    expect(convert('width: ~"calc(100vw - 10px)"'))
      .toBe('width: unquote("calc(100vw - 10px)") ');
    expect(convert('width: ~\'calc(100vw - 10px)\''))
      .toBe('width: unquote(\'calc(100vw - 10px)\') ');
    expect(convert('height: ~"calc(2rem - "@heightA + @heightB ~ " - 2rem)";'))
      .toBe('height: unquote("calc(2rem - ") @heightA + @heightB unquote(" - 2rem)") ;');
    expect(convert('width: ~"calc("@varA~" + "@varB~")";'))
      .toBe('width: unquote("calc(") @varA unquote(" + ") @varB unquote(")") ;');
  });
});
