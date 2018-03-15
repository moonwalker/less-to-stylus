/* global describe, it, expect */
const replace = require('./variables');

describe('Variables', () => {
  describe('without prefix', () => {
    const convert = replace();

    it('should replace declarations', () => {
      expect(convert('@color : red;')).toBe('$color = red;');
      expect(convert('// @color    :   red;')).toBe('// $color    =   red;');
    });

    it('should wrap -varName in ()', () => {
      expect(convert('0px 0px 0px -@varA black;')).toBe('0px 0px 0px (- $varA) black;');
      expect(convert('-@varA 0px 0px black;')).toBe('(- $varA) 0px 0px black;');
      expect(convert('0px 0px (0px -@varA) black;')).toBe('0px 0px (0px - $varA) black;');
    });

    it('should replace dynamic variable names', () => {
      expect(convert('@color : @@red;')).toBe('$color = lookup("$" + $red);');
    });

    it('should replace usage', () => {
      expect(convert('color: @red;')).toBe('color: $red;');
      expect(convert('color: @red;')).toBe('color: $red;');
    });

    it('should replace interpolation', () => {
      expect(convert('@media (min-width: @{minWidth})')).toBe('@media (min-width: {$minWidth})');
      expect(convert('url("some/@{color}.svg")')).toBe('url("some/" + $color + ".svg")');
      expect(convert('url(\'some/@{color}.svg\')')).toBe('url(\'some/\' + $color + \'.svg\')');
    });

    it('should replace usage inside calc', () => {
      expect(convert('~"calc(2rem - "@heightA + $heightB ~ " - 2rem)";'))
        .toBe('unquote("calc(2rem - " + $heightA + " + " + $heightB + "  - 2rem)");');
    });

    it('should remove first and last new line', () => {
      expect(convert('=\n0px 10px black,\n0px 10px pink\n;'))
        .toBe('=0px 10px black,\n0px 10px pink;');
    });
  });

  describe('with prefix', () => {
    const convert = replace({
      variableNamePrefix: 'ui',
    });

    it('should replace declarations', () => {
      expect(convert('@color : red;')).toBe('$uicolor = red;');
      expect(convert('// @color    :   red;')).toBe('// $uicolor    =   red;');
    });

    it('should wrap -varName in ()', () => {
      expect(convert('0px 0px 0px -@varA black;')).toBe('0px 0px 0px (- $uivarA) black;');
      expect(convert('-@varA 0px 0px black;')).toBe('(- $uivarA) 0px 0px black;');
      expect(convert('0px 0px (0px -@varA) black;')).toBe('0px 0px (0px - $uivarA) black;');
    });

    it('should replace dynamic variable names', () => {
      expect(convert('@color : @@red;')).toBe('$uicolor = lookup("$" + $uired);');
    });

    it('should replace usage', () => {
      expect(convert('color: @red;')).toBe('color: $uired;');
      expect(convert('color: @red;')).toBe('color: $uired;');
    });

    it('should replace interpolation', () => {
      expect(convert('@media (min-width: @{minWidth})')).toBe('@media (min-width: {$uiminWidth})');
      expect(convert('url("some/@{color}.svg")')).toBe('url("some/" + $uicolor + ".svg")');
      expect(convert('url(\'some/@{color}.svg\')')).toBe('url(\'some/\' + $uicolor + \'.svg\')');
    });

    it('should replace usage inside calc', () => {
      expect(convert('~"calc(2rem - "@heightA + $uiheightB ~ " - 2rem)";'))
        .toBe('unquote("calc(2rem - " + $uiheightA + " + " + $uiheightB + "  - 2rem)");');
    });

    it('should remove first and last new line', () => {
      expect(convert('=\n0px 10px black,\n0px 10px pink\n;'))
        .toBe('=0px 10px black,\n0px 10px pink;');
    });
  });
});
