'use strict';
// draw number

const fs = require('fs');
const path = require('path');
const Captcha = require('..');

let png = new Captcha(200, 100);

for (let i = 0; i < 10; ++i) {
  const font = Captcha.font8x16;
  let ch = String(i);
  console.log(ch);
  png.drawChar(ch, 0 + 2 * i * font.w, 50, font, '#00FF00');
}

fs.writeFileSync(path.resolve(__dirname, './char.png'), png.getBuffer());
