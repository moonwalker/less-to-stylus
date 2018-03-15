/* global describe, it, expect */
const replace = require('./variables');

describe('Variables', () => {
  describe('without prefix', () => {
    const convert = replace();

    it('should replace declarations', () => {
      expect(convert('@color : red;')).toBe('$color = red;');
      expect(convert('@_color : red;')).toBe('$_color = red;');
      expect(convert('@_font-color : black;')).toBe('$_font-color = black;');
      expect(convert('// @color    :   red;')).toBe('// $color    =   red;');
    });

    it('should wrap -varName in ()', () => {
      expect(convert('0px 0px 0px -@varA black;')).toBe('0px 0px 0px (- $varA) black;');
      expect(convert('0px 0px 0px -@var-a black;')).toBe('0px 0px 0px (- $var-a) black;');
      expect(convert('-@varA 0px 0px black;')).toBe('(- $varA) 0px 0px black;');
      expect(convert('0px 0px (0px -@varA) black;')).toBe('0px 0px (0px - $varA) black;');
      expect(convert('0px 0px (0px -@var-a) black;')).toBe('0px 0px (0px - $var-a) black;');
    });

    it('should replace dynamic variable names', () => {
      expect(convert('@color : @@red;')).toBe('$color = lookup("$" + $red);');
      expect(convert('@color : @@custom-color-name;')).toBe('$color = lookup("$" + $custom-color-name);');
    });

    it('should replace usage', () => {
      expect(convert('color: @red;')).toBe('color: $red;');
      expect(convert('color: @custom-red;')).toBe('color: $custom-red;');
    });

    it('should replace interpolation', () => {
      expect(convert('@media (min-width: @{minWidth})')).toBe('@media (min-width: {$minWidth})');
      expect(convert('@media (min-width: @{min-width})')).toBe('@media (min-width: {$min-width})');
      expect(convert('url("some/@{color}.svg")')).toBe('url("some/" + $color + ".svg")');
      expect(convert('url(\'some/@{color}.svg\')')).toBe('url(\'some/\' + $color + \'.svg\')');
      expect(convert('url("some/@{color-name}.svg")')).toBe('url("some/" + $color-name + ".svg")');
    });

    it('should replace usage inside calc', () => {
      expect(convert('~"calc(2rem - "@heightA + $heightB ~ " - 2rem)";'))
        .toBe('unquote("calc(2rem - " + $heightA + " + " + $heightB + "  - 2rem)");');
      expect(convert('~"calc(2rem - "@height-a + $height-b ~ " - 2rem)";'))
        .toBe('unquote("calc(2rem - " + $height-a + " + " + $height-b + "  - 2rem)");');
    });

    it('should remove first and last new line', () => {
      expect(convert('=\n0px 10px black,\n0px 10px pink\n;'))
        .toBe('=0px 10px black,\n0px 10px pink;');
    });
  });

  describe('with prefix', () => {
    const convert = replace({
      variableNamePrefix: 'ui_',
    });

    it('should replace declarations', () => {
      expect(convert('@color : red;')).toBe('$ui_color = red;');
      expect(convert('@_color : red;')).toBe('$ui__color = red;');
      expect(convert('@_font-color : black;')).toBe('$ui__font-color = black;');
      expect(convert('// @color    :   red;')).toBe('// $ui_color    =   red;');
    });

    it('should wrap -varName in ()', () => {
      expect(convert('0px 0px 0px -@varA black;')).toBe('0px 0px 0px (- $ui_varA) black;');
      expect(convert('0px 0px 0px -@var-a black;')).toBe('0px 0px 0px (- $ui_var-a) black;');
      expect(convert('-@varA 0px 0px black;')).toBe('(- $ui_varA) 0px 0px black;');
      expect(convert('0px 0px (0px -@varA) black;')).toBe('0px 0px (0px - $ui_varA) black;');
      expect(convert('0px 0px (0px -@var-a) black;')).toBe('0px 0px (0px - $ui_var-a) black;');
    });

    it('should replace dynamic variable names', () => {
      expect(convert('@color : @@red;')).toBe('$ui_color = lookup("$" + $ui_red);');
      expect(convert('@color : @@custom-color-name;')).toBe('$ui_color = lookup("$" + $ui_custom-color-name);');
    });

    it('should replace usage', () => {
      expect(convert('color: @red;')).toBe('color: $ui_red;');
      expect(convert('color: @custom-red;')).toBe('color: $ui_custom-red;');
    });

    it('should replace interpolation', () => {
      expect(convert('@media (min-width: @{minWidth})')).toBe('@media (min-width: {$ui_minWidth})');
      expect(convert('@media (min-width: @{min-width})')).toBe('@media (min-width: {$ui_min-width})');
      expect(convert('url("some/@{color}.svg")')).toBe('url("some/" + $ui_color + ".svg")');
      expect(convert('url(\'some/@{color}.svg\')')).toBe('url(\'some/\' + $ui_color + \'.svg\')');
      expect(convert('url("some/@{color-name}.svg")')).toBe('url("some/" + $ui_color-name + ".svg")');
    });

    it('should replace usage inside calc', () => {
      expect(convert('~"calc(2rem - "@heightA + $ui_heightB ~ " - 2rem)";'))
        .toBe('unquote("calc(2rem - " + $ui_heightA + " + " + $ui_heightB + "  - 2rem)");');
      expect(convert('~"calc(2rem - "@height-a + $ui_height-b ~ " - 2rem)";'))
        .toBe('unquote("calc(2rem - " + $ui_height-a + " + " + $ui_height-b + "  - 2rem)");');
    });

    it('should remove first and last new line', () => {
      expect(convert('=\n0px 10px black,\n0px 10px pink\n;'))
        .toBe('=0px 10px black,\n0px 10px pink;');
    });
  });

  it('should use conditional assignment', () => {
    const convert = replace({
      conditionalAssignment: true,
    });

    expect(convert('@color : red;')).toBe('$color ?= red;');
    expect(convert('@_color : red;')).toBe('$_color ?= red;');
    expect(convert('@_font-color : black;')).toBe('$_font-color ?= black;');
    expect(convert('// @color    :   red;')).toBe('// $color    ?=   red;');
  });
});
