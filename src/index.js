'use strict';

const PNGlib = require('node-pnglib');
const RGBA = PNGlib.RGBA;
const FONTS = require('./font');

class Captcha extends PNGlib {
  constructor(w, h) {
    super(w, h);
  }

  drawChar(ch, x = 0, y = 0, font = FONTS.font8x16, color = '#ff0000') {
    let idx = font.chars.indexOf(ch);

    if (idx >= 0) {
      let rgba = color;
      // 预解析颜色，避免在setPixel中进行频繁的解析操作
      if (typeof color === 'string') {
        rgba = RGBA(color);
      }

      let fontData = font.data[idx];
      let w = font.w;
      let y0 = y;
      let l = Math.ceil(w / 8);

      for (let i = 0, len = font.h; i < len; ++i) {
        for (let j = 0; j < l; ++j) {
          // 每一排的第几个字节
          let d = fontData[l * i + j];
          let width = 8;
          let x0 = j * 8;          
          // 假如到了这一排的最后一个字节
          if (j === (l - 1)) {
            width = w - x0;
          }

          let mask = 1;
          for (let bitPos = width - 1; bitPos >= 0; --bitPos) {
            mask = 1 << bitPos;
            if ((d & mask) === mask) {
              this.setPixel(x + x0 + (8 - bitPos), y0, rgba);
            }
          }
        }
        ++y0;
      }
    }
  }
}

module.exports = Captcha;
module.exports.font8x16= FONTS.font8x16;
module.exports.font12x24 = FONTS.font12x24;
module.exports.font16x32 = FONTS.font16x32;
