!function(){"use strict";var a=window.location.protocol.replace(/:/gi,""),b={url:a+"://demiart.ru/forum/index.php",def:a+"://demiart.ru/forum/index.php",ddc:0},c=function(a){return'<a href="'+a.url+'" class="noty" title="(+'+a.ddc+') непрочитанные комментарии">+'+a.ddc+"</a>"},d=function(){for(var a=document.getElementsByTagName("link"),b=document.getElementsByTagName("head")[0],c=0,d=a.length;c<d;c++){var e="undefined"!=typeof a[c];e&&(a[c].getAttribute("type")||"").match(/image\/x-icon/)&&b.removeChild(a[c])}},e=function(a){d();var b=document.createElement("link");b.type="image/x-icon",b.rel="shortcut Icon",b.href=a,document.getElementsByTagName("head")[0].appendChild(b)};chrome.runtime.onMessage.addListener(function(a,d,f){var g=document.getElementById("scrolldiscuss"),h=document.getElementById("scrollup"),i=document.getElementById("adiscuss2"),j=document.getElementById("adiscuss");"ddc"==a.message?(b.url=a.url,b.def=a.def,b.ddc=a.ddc,b.ddc?(g?g.innerHTML=c(b):h&&(g=document.createElement("div"),g.id="scrolldiscuss",h.parentNode.insertBefore(g,h),g.innerHTML=c(b)),i&&(i.innerHTML=c(b)),j&&(j.innerHTML=c(b))):g&&g.parentNode.removeChild(g)):"favicon"==a.message&&e(a.data)})}();