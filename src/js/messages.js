(function(){
	"use strict";
	Element.prototype.appendAfter = function(element) {
		element.parentNode.insertBefore(this, element.nextSibling);
	};
	var ddc = {
			id: 0,
			url: 'https://demiart.ru/forum/index.php',
			def: 'https://demiart.ru/forum/index.php',
			ddc: 0,
			favicon: null
		},
		linkFav = 'https://demiart.ru/forum/favicon.ico',
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
		},
		DEMICOLOR_CHECKBOX = false;
	chrome.runtime.onMessage.addListener(function(msg, ob, sendResponse) {
		switch(msg.message){
			case 'ddc':
				ddc = {
					id: msg.idtab,
					url: msg.url,
					def: msg.def,
					ddc: msg.ddc,
					favicon: msg.favicon,
					demicolor: msg.demicolor
				};
				ddc.ddc ? setFaviconTag(ddc.favicon) : setFaviconTag(linkFav);
				if(DEMICOLOR_CHECKBOX != msg.demicolor){
					if(msg.demicolor){
						console.log('add demicolor');
					}else{
						console.log('remove demicolor');
					}
				}
				DEMICOLOR_CHECKBOX = msg.demicolor;
				break;
		}
	});
	/**
	 * Set message FETCH
	 **/
	chrome.runtime.sendMessage(
		chrome.i18n.getMessage("@@extension_id"),
		{
			message: 'FETCH'
		},
		{},
		function(){}
	);
	/**
	 * Set Favicon
	 **/
	setFaviconTag(linkFav);
	console.log('get demicolor', DEMICOLOR_CHECKBOX);
}());