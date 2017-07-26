'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PNGlib = require('node-pnglib');
var RGBA = PNGlib.RGBA;
var FONTS = require('./font');

var Captcha = function (_PNGlib) {
  _inherits(Captcha, _PNGlib);

  function Captcha(w, h) {
    _classCallCheck(this, Captcha);

    return _possibleConstructorReturn(this, (Captcha.__proto__ || Object.getPrototypeOf(Captcha)).call(this, w, h));
  }

  _createClass(Captcha, [{
    key: 'drawChar',
    value: function drawChar(ch) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var font = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : FONTS.font8x16;
      var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '#ff0000';

      var idx = font.chars.indexOf(ch);

      if (idx >= 0) {
        var rgba = color;
        // 预解析颜色，避免在setPixel中进行频繁的解析操作
        if (typeof color === 'string') {
          rgba = RGBA(color);
        }

        var fontData = font.data[idx];
        var w = font.w;
        var y0 = y;
        var l = Math.ceil(w / 8);

        for (var i = 0, len = font.h; i < len; ++i) {
          for (var j = 0; j < l; ++j) {
            // 每一排的第几个字节
            var d = fontData[l * i + j];
            var width = 8;
            var x0 = j * 8;
            // 假如到了这一排的最后一个字节
            if (j === l - 1) {
              width = w - x0;
            }

            var mask = 1;
            for (var bitPos = width - 1; bitPos >= 0; --bitPos) {
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
  }]);

  return Captcha;
}(PNGlib);

module.exports = Captcha;
module.exports.font8x16 = FONTS.font8x16;
module.exports.font12x24 = FONTS.font12x24;
module.exports.font16x32 = FONTS.font16x32;