(function (global) {
  'use strict';

  var bailingMediaBackConfig = {
    url: {
      "oppo": "oppobrowser://resume?from=alipay",
      "iqiyi": "iqiyi://mobile/back?pkg=alipay"
    },
    text: {
      "default": "< 返回浏览器",
      "oppo": "< 返回oppo",
      "iqiyi": "< 返回爱奇艺"      
    }
  };

  global.bailingMediaBackConfig = bailingMediaBackConfig;
})(this);



