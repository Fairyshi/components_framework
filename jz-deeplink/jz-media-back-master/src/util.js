/**
 * @param {String} url
 * @param {Function} callback on onloaded
*/
export function loadScript(url, callback) {
  // create script element
  var script = document.createElement('script');
  script.async = true;
  script.src = url;

  // attach it to DOM
  var entry = document.getElementsByTagName('script')[0];
  entry.parentNode.insertBefore(script, entry);

  // execute callback after script is loaded
  script.onload = script.onreadystatechange = () => {
    var readyState = script.readyState;

    if (!readyState || /complete|loaded/.test(script.readyState)) {
      if (typeof callback === 'function') callback();

      // detach event handler to avoid memory leaks in IE
      script.onload = null;
      script.onreadystatechange = null;
    }
  };
}

/**
 * 获取url中"?"符后的字串
*/
export function getSearch() {
  var url = location.search; 
  var theRequest = new Object();  
  if (url.indexOf("?") != -1) {  
     var str = url.substr(1);  
     var strs = str.split("&");  
     for(var i = 0; i < strs.length; i ++) {  
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);  
     }  
  }  
  return theRequest;
}

/**
 * @param {String} urlMediaName
 * @param {Object} allAvailableMedias all medias of recall app needed in bailing
 * @param {String} configCacheDuration cache me
*/
export function getBackToMediaUrlText(urlMediaName, allAvailableMedias = { url: {}, text: {}}, configCacheDuration) {
  const urlWithCacheController = `${allAvailableMedias.url[urlMediaName]}`;
  return {
    backToMediaUrl: urlMediaName 
      ? urlWithCacheController
      : undefined,
    backToMediaText: urlMediaName 
      ? (allAvailableMedias.text[urlMediaName] || allAvailableMedias.text.default)
      : undefined
  };
}

export function createEle(id, nodeType) {
  let $ele = document.querySelector(`#${id}`);

  if (!$ele) {
    $ele = document.createElement(nodeType);
    $ele.setAttribute('id', id);
    document.body.appendChild($ele);
  }

  return $ele;
}

/**
 * @param {String} backToMediaUrl recall media app url
 * @param {Object} backDomId recall media app trigger dom name
 * @param {Object} backDomId recall media app trigger dom text
*/
export function createMediaBackDom(backToMediaUrl, backDomId, backDomText) {
  const link = createEle(backDomId, 'a');
  const tiggerStyle = link.style;

  tiggerStyle.position = 'fixed';
  tiggerStyle.top = '77vh';
  tiggerStyle.left = 0;
  tiggerStyle.zIndex = 1000;
  tiggerStyle.padding = '.12rem .12rem .12rem .08rem';
  tiggerStyle.background = 'rgb(0, 161, 244)';
  tiggerStyle.display = 'inline-block';
  tiggerStyle.cursor = 'pointer';
  tiggerStyle.lineHeight = '.24rem';
  tiggerStyle.textAlign = 'center';
  tiggerStyle.fontSize = '.24rem';
  tiggerStyle.borderRadius = '0 .18rem .18rem 0';
  tiggerStyle.border = '1px solid rgb(0, 161, 244)';
  tiggerStyle.color = 'rgb(255, 255, 255)';
  tiggerStyle.textDecoration = 'none';

  link.href = backToMediaUrl;
  link.innerHTML = backDomText;
}