/* global describe, it, expect */
const convert = require('./imports');

describe('Imports', () => {
  it('should replace import (multiple) with import', () => {
    expect(convert('@import (multiple) "other"'))
      .toBe('@import "other"');
  });

  it('should codemod optional import', () => {
    expect(convert('@import (optional) "other"'))
      .toBe('@require "other" if file-exists("other")');
    expect(convert('@import (optional) \'other\''))
      .toBe('@require \'other\' if file-exists(\'other\')');
  });

  it('should replace other imports with require', () => {
    expect(convert('@import (inline) "other"'))
      .toBe('@require "other"');
    expect(convert('@import (inline) \'other\''))
      .toBe('@require \'other\'');
    expect(convert('@import "other"'))
      .toBe('@require "other"');
    expect(convert('@import url("../font.ttf")'))
      .toBe('@import url("../font.ttf")');
  });
});
