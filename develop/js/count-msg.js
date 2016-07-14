(function(){
	"use strict";
	var protocolLoc = window.location.protocol.replace(/:/gi, "");
		var obddc = {
			url: protocolLoc + '://demiart.ru/forum/index.php',
			def: protocolLoc + '://demiart.ru/forum/index.php',
			ddc: 0
		},
		insetrLink = function(o){
			return '<a href="'+o.url+'" class="noty" title="(+'+o.ddc+') непрочитанные комментарии">+'+o.ddc+'</a>';
		},
		removeFavicon = function(){
			var links = document.getElementsByTagName('link');
			var head = document.getElementsByTagName('head')[0];
			for(var i=0, len=links.length; i < len; i++) {
				var exists = (typeof(links[i]) !== 'undefined');
				if (exists && (links[i].getAttribute('type') || '').match(/image\/x-icon/)) {
					head.removeChild(links[i]);
				}
			}
		},
		setFaviconTag = function(url){
			removeFavicon();
			var link = document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut Icon';
			link.href = url;
			document.getElementsByTagName('head')[0].appendChild(link);
		};
		chrome.runtime.onMessage.addListener(function(msg, ob, sendResponse) {
			var s = document.getElementById('scrolldiscuss'),
				su = document.getElementById('scrollup'),
				adiscuss2 = document.getElementById('adiscuss2'),
				adiscuss = document.getElementById('adiscuss');
			if(msg.message == 'ddc'){
				obddc.url = msg.url;
				obddc.def = msg.def;
				obddc.ddc = msg.ddc;
				if(obddc.ddc){
					if(s){
						s.innerHTML = insetrLink(obddc);
					}else{
						if(su){
							s = document.createElement('div');
							s.id = 'scrolldiscuss';
							su.parentNode.insertBefore(s,su);
							s.innerHTML = insetrLink(obddc);
						}
					}
					if(adiscuss2){
						adiscuss2.innerHTML = insetrLink(obddc);
					}
					if(adiscuss){
						adiscuss.innerHTML = insetrLink(obddc);
					}
				}else{
					if(s){
						s.parentNode.removeChild(s);
					}
				}
			}else if(msg.message=='favicon'){
				setFaviconTag(msg.data);
			}
		});
}());