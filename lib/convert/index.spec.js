/* global test, expect */
const convert = require('./');

const source = `
@import 'some.less';
@import (multiple) 'other.less';
@import (optional) 'other.less';

@red : red;
@colorRed    : @@red;
@colorLightBlue: blue;
@minWidth:1024px;
@type : colors;

@heightA : 10x;
@heightB : 20px;
@top : ~"calc(2rem - "@heightA + $heightB ~ " - 2rem)";
@boxShadowA = 0px 0px 0px -@heightA black;
@boxShadowB = 0px 0px (0px -@heightA) black;

@floatingShadow=
  0px 2px 4px 0px rgba(34, 36, 38, 0.12),
  0px 2px 10px 0px rgba(34, 36, 38, 0.15)
;

testMixin() when (@colorRed) {
  overflow: hidden;
  border: 0;
}

@keyframes animation {
  from {
    left: 0;
  }
  to {
    left: 100%;
  }
}

.element {
  background: @colorLightBlue;
  color: @colorRed;
  width: ~"calc(100vh - 10px)";
}

@media (min-width: @{minWidth}) {
  .element {
    display: none;
    background-image: url("assets/@{type}/@{colorRed}.png")
  }
}
`;

const output = `
@require 'some.styl';
@import 'other.styl';
@require 'other.styl' if file-exists('other.styl');

$red = red;
$colorRed    = lookup("$" + $red);
$colorLightBlue= blue;
$minWidth=1024px;
$type = colors;

$heightA = 10x;
$heightB = 20px;
$top = unquote("calc(2rem - ") $heightA + $heightB unquote(" - 2rem)") ;
$boxShadowA = 0px 0px 0px (- $heightA) black;
$boxShadowB = 0px 0px (0px - $heightA) black;

$floatingShadow=0px 2px 4px 0px rgba(34, 36, 38, 0.12),
  0px 2px 10px 0px rgba(34, 36, 38, 0.15);

testMixin() {
  return unless $colorRed;
  overflow: hidden;
  border: 0;
}

@keyframes animation {
  from {
    left: 0;
  }
  to {
    left: 100%;
  }
}

.element {
  background: $colorLightBlue;
  color: $colorRed;
  width: unquote("calc(100vh - 10px)") ;
}

@media (min-width: {$minWidth}) {
  .element {
    display: none;
    background-image: url("assets/" + $type + "/" + $colorRed + ".png")
  }
}
`;

test('convert', () => {
  const actual = convert(source);
  expect(actual).toBe(output);
});
