import { loadScript, getSearch, getBackToMediaUrlText, createMediaBackDom } from './util';

export default function() {
  // 在deeplink的请求参数中声明渠道名称(有回端定制需求的渠道)的键名
  const BAILING_SEARCH_MEDIA_IN_URL = 'bailing_media';
  // 不同渠道的回端方式配置文件地址
  const BAILING_MEDIA_BACK_CONFIG_URL = 'https://dsp-bp-public.oss-cn-hangzhou.aliyuncs.com/.....';
  // 不同渠道的回端方式配置文件异步加载后存储到全局window中的指定变量上
  const BAILING_MEDIA_BACK_CONFIG_GLOBALNAME = 'bailingMediaBackConfig';
  // 渠道定制返回按键的dom节点id
  const BAILING_MEDIA_BACK_DOM_ID = 'bailingMediaBackTrigger';
  // 客户端缓存控制 (ref: http://jsapi.alipay.net/fe/fe-intro.html#2_FAQ  1 概况): 保证缓存有效时间为一天
  const STATIC_FILE_CACHE_OF_CONFIG = 'bailingBackConfigCacheDuration';
  
  window
  .addEventListener("load", function(event) {
    const searchInUrl = getSearch();
    // deeplink url中指定的渠道名
    const mediaSrc = searchInUrl[BAILING_SEARCH_MEDIA_IN_URL];
    // 当deeplink参数中指定了定制的渠道名时才请求渠道返回配置文件
    if (mediaSrc) {
      loadScript(BAILING_MEDIA_BACK_CONFIG_URL, function () {
        const asyncConfig = window[BAILING_MEDIA_BACK_CONFIG_GLOBALNAME] || {};
        const { backToMediaUrl, backToMediaText } = getBackToMediaUrlText(mediaSrc, asyncConfig, STATIC_FILE_CACHE_OF_CONFIG);

        // 当deeplink参数中指定的渠道名有效时才动态创建返回的dom节点
        if (backToMediaUrl) {
          // aplipay app api
          document
            .addEventListener('back', goback, false);
          
          createMediaBackDom(backToMediaUrl, BAILING_MEDIA_BACK_DOM_ID, backToMediaText);
          
          // html dom api
          document
            .querySelector('#' + BAILING_MEDIA_BACK_DOM_ID)
            .addEventListener('click', goback, false);

          function goback(e) {
            e.preventDefault();
            
            setTimeout(function() {
              location.href = backToMediaUrl;
            }, 50);
          }
        }
      });
    }
});
}