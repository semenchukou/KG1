var colorconv = {
    RGB2CMYK : function (RGB) {
      "use strict";
      var r = RGB[0],
          g = RGB[1],
          b = RGB[2],
          c, m, y, k;

      k = Math.min(1 - r/255, 1 - g/255, 1 - b /255);
      c = (1 - r/255 - k) * (1 - k);
      m = (1 - g/255 - k) * (1 - k);
      y = (1 - b/255 - k) * (1 - k);
      return [c * 100, m * 100, y * 100, k * 100];
    },

    CMYK2RGB : function (CMYK) {
      "use strict";
      var c = CMYK[0] / 100,
          m = CMYK[1] / 100,
          y = CMYK[2] / 100,
          k = CMYK[3] / 100,
          r, g, b;

      r = 255 * (1 - c) * (1 - k);
      g = 255 * (1 - m) * (1 - k);
      b = 255 * (1 - y) * (1 - k);
      return [r, g, b];
    },

    RGB2XYZ : function(rgb) {
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;

      r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
      g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
      b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

      var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
      var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
      var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

      return [x, y, z];
    },

    XYZ2RGB : function(xyz){
      var x = xyz[0];
      var y = xyz[1];
      var z = xyz[2];
      var r;
      var g;
      var b;

      r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
      g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
      b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

      r = r > 0.0031308
        ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
        : r * 12.92;

      g = g > 0.0031308
        ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
        : g * 12.92;

      b = b > 0.0031308
        ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
        : b * 12.92;

      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);

      return [r * 255, g * 255, b * 255];
    },

    XYZ2LABFUNC : function(x){
      if(x >= 0.008856) {
        return Math.cbrt(x);
      } else {
        return 7.787 * x + (16 / 116);
      }
    },

    LAB2XYZFUNC : function(x){
      if(Math.pow(x, 3) >= 0.008856) {
        return Math.pow(x, 3);
      } else {
        return (x - (16 / 116)) / 7.787;
      }
    },

    XYZ2LAB : function(xyz){
      var x = xyz[0];
      var y = xyz[1];
      var z = xyz[2];
      var l;
      var a;
      var b;

      l = 116 * colorconv.XYZ2LABFUNC(y / 100) - 16;
      a = 500 * (colorconv.XYZ2LABFUNC(x / 95.047) - colorconv.XYZ2LABFUNC(y / 100));
      b = 200 * (colorconv.XYZ2LABFUNC(y / 100) - colorconv.XYZ2LABFUNC(z / 108.883));
      return [l, a, b];
    },

    LAB2XYZ : function(lab){
      var l = lab[0];
      var a = lab[1];
      var b = lab[2];
      var x;
      var y;
      var z;
      y = colorconv.LAB2XYZFUNC((l + 16) / 116) * 95.047;
      x = colorconv.LAB2XYZFUNC((a / 500) + ((l + 16) / 116)) * 100;
      z = colorconv.LAB2XYZFUNC(((l + 16) / 116) - (b / 200)) * 108.883;
      return [x, y, z];
    },

    HEX2RGB : function (hex) {
      "use strict";
      if (hex.charAt(0) === '#') {
        hex = hex.substr(1);
      }
      if ((hex.length < 2) || (hex.length > 6)) {
        return false;
      }
      var values = hex.split(''),
        r,
        g,
        b;
  
      if (hex.length === 2) {
        r = parseInt(values[0].toString() + values[1].toString(), 16);
        g = r;
        b = r;
      } else if (hex.length === 3) {
        r = parseInt(values[0].toString() + values[0].toString(), 16);
        g = parseInt(values[1].toString() + values[1].toString(), 16);
        b = parseInt(values[2].toString() + values[2].toString(), 16);
      } else if (hex.length === 6) {
        r = parseInt(values[0].toString() + values[1].toString(), 16);
        g = parseInt(values[2].toString() + values[3].toString(), 16);
        b = parseInt(values[4].toString() + values[5].toString(), 16);
      } else {
        return false;
      }
      return [r, g, b];
    },

    LAB2RGB : function(labParams) {
      let y = (labParams[0] + 16) / 116,
      x = labParams[1] / 500 + y,
      z = y - labParams[2] / 200,
      r, g, b;

      x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
      y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
      z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);
  
      r = x *  3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y *  1.8758 + z *  0.0415;
      b = x *  0.0557 + y * -0.2040 + z *  1.0570;
  
      r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
      g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
      b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;
  
      return [Math.trunc(Math.max(0, Math.min(1, r)) * 255), 
              Math.trunc(Math.max(0, Math.min(1, g)) * 255), 
              Math.trunc(Math.max(0, Math.min(1, b)) * 255)]
  },

  RGB2LAB : function(rgbParams) {
      let r = rgbParams[0] / 255,
      g = rgbParams[1] / 255,
      b = rgbParams[2] / 255,
      x, y, z;

      r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  
      x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
      y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
      z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  
      x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
      y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
      z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  
      return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
  }
  };