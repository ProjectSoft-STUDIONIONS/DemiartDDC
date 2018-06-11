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
		if(msg.message == 'ddc'){
			obddc.url = msg.url;
			obddc.def = msg.def;
			obddc.ddc = msg.ddc;
		}else if(msg.message=='favicon'){
			setFaviconTag(msg.data);
		}
	});
	var preview = document.getElementById('preview'),
		setprev = 'setReturn',
		script = document.createElement('script'),
		text = document.createTextNode('function qpreview(){return;}');
	preview && (
		preview.getAttribute('data-prev') != setprev && (
			preview.value = "Предпросмотр",
			script.appendChild(text),
			document.body.appendChild(script),
			preview.setAttribute('data-prev', setprev)
		)
	);	
}());