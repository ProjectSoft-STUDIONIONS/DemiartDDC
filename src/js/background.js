(function(chrome, document, window){
	var INTERVAL = OPTIONS.get('INTERVAL', 0.1666666666666667, 'number'),
		AUDIO_CHECKBOX = OPTIONS.get('AUDIO_CHECKBOX', true, 'boolean'),
		SOUNDS = OPTIONS.get('SOUNDS', '/sound/alarm0.ogg', 'string'),
		AUDIO_VOLUME = OPTIONS.get('AUDIO_VOLUME', 0.5, 'number'),
		TAB_CHECKBOX = OPTIONS.get('TAB_CHECKBOX', true, 'boolean'),
		DEMICOLOR_CHECKBOX = OPTIONS.get('DEMICOLOR_CHECKBOX', true, 'boolean'),
		URL = "https://demiart.ru/forum/",
		tabDDC = null,
		DDC = 0,
		runtimeInterval,
		responseInterval;
	const URL_CONST = "https://demiart.ru/forum/",
		I_19 = chrome.runtime.getURL("/images/icon19.png"),
		F_19 = chrome.runtime.getURL("/images/fi.png"),
		EXT_ID = chrome.i18n.getMessage("@@extension_id"),
		AUDIO = new Audio(),
		ON_OFF = function(e){
			clearTimeout(responseInterval);
			responseInterval = setTimeout(FETCH, 100);
		},
		FETCH = async function(){
			let winStatus = window.navigator.onLine;
			clearTimeout(responseInterval);
			chrome.browserAction.setIcon({path: I_19});
			if(INTERVAL && winStatus){
				chrome.browserAction.setIcon({path: F_19});
				let url = 'https://demiart.ru/forum/index.php?act=ST&CODE=discuss&_='+(new Date()).getTime();
				fetch(url).then(function(response){
					response.json().then(function(json){
						json.year = new Date(response.headers.get('date')).getFullYear();
						OPTIONS.set('YEAR', json.year);
						console.table(json);
						URL = json.href;
						chrome.browserAction.setIcon({path: I_19});
						chrome.browserAction.setBadgeText({text: json.count ? String(json.count) : ''});
						if(json.count > DDC && AUDIO_CHECKBOX) {
							AUDIO.volume = parseFloat(AUDIO_VOLUME);
							AUDIO.currentTime = 0;
							AUDIO.src = chrome.runtime.getURL(SOUNDS);
							AUDIO.play();
						}
						DDC = json.count;
						sendMessages();
					}).catch(function(){
						URL = URL_CONST;
						DDC = 0;
						chrome.browserAction.setIcon({path: I_19});
						chrome.browserAction.setBadgeText({text: winStatus ? 'Error' : 'Off'});
						sendMessages();
					});
					chrome.browserAction.setIcon({path: I_19});
					responseInterval = setTimeout(FETCH, INTERVAL * 60000);
				}).catch(function(){
					URL = URL_CONST;
					DDC = 0;
					chrome.browserAction.setIcon({path: I_19});
					chrome.browserAction.setBadgeText({text: winStatus ? 'Error' : 'Off'});
					sendMessages();
					responseInterval = setTimeout(FETCH, INTERVAL * 60000);
				});
			}else{
				let sec = INTERVAL ? INTERVAL : 0.1;
				URL = URL_CONST;
				DDC = 0;
				chrome.browserAction.setIcon({path: I_19});
				chrome.browserAction.setBadgeText({text: !winStatus ? 'Off' : ''});
				sendMessages();
				responseInterval = setTimeout(FETCH, sec * 60000);
			}
		},
		tabCreate = function(tab){
			tabDDC = tab;
		},
		executeMessages = function(id){
			//chrome.tabs.insertCSS(id, {"file":"assets/css/count-msg.css"}, function(){
			chrome.tabs.executeScript(id, {"file": "/js/messages.js"}, function(){});
			//});
		},
		sendMessages = function(){
			chrome.tabs.query({}, function(tabs) {
				for(let i = 0; i < tabs.length; ++i){
					let lt = tabs[i].id,
						req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
					if(req.test(tabs[i].url)){
						chrome.tabs.sendMessage(lt, {ddc: DDC, url: URL, message: 'ddc'});
						//if(localStorage['favicon']=="true"){
						//	let datauri = drawFavicon(dcc_c);
						//	chrome.tabs.sendMessage(lt,{'data':datauri, message:'favicon'});
						//}else{
						//	chrome.tabs.sendMessage(lt,{data:"/favicon.ico", message:'favicon'});
						//}
					}
				}
			});
		}
		/*,
		getTabDdc = function(tab){
			tabDDC = tab;
			if(tab && TAB_CHECKBOX){
				let req = /(https?:\/\/demiart.ru\/forum)/ig;
				if(req.test(tab.url)){
					// ... Если таб был закрыт.
					// ... Данная ошибка свойственна только для Yandex браузера.
					try{
						chrome.tabs.update(tab.id, {'url': URL, 'active':true}, tabCreate);
					}catch(e){
						chrome.tabs.create({'url': URL, 'active':true}, tabCreate);
					}
				}else{
					chrome.tabs.create({'url': URL, 'active':true}, tabCreate);
				}
			} else {
				chrome.tabs.create({'url': URL, 'active':true}, tabCreate);
			}
		}*/;
	/**
	 * onMessage options
	 **/
	chrome.runtime.onMessage.addListener(function(rq, sender, sendResponse) {
		setTimeout(function() {
			sendResponse({status: true});
			clearTimeout(runtimeInterval);
			if(rq == 'REFRRESH'){
				INTERVAL = OPTIONS.get('INTERVAL', 0.16667, 'number');
				AUDIO_CHECKBOX = OPTIONS.get('AUDIO_CHECKBOX', true, 'boolean');
				SOUNDS = OPTIONS.get('SOUNDS', '/sound/alarm0.ogg', 'string');
				AUDIO_VOLUME = OPTIONS.get('AUDIO_VOLUME', 0.5, 'number');
				TAB_CHECKBOX = OPTIONS.get('TAB_CHECKBOX', true, 'boolean');
				DEMICOLOR_CHECKBOX = OPTIONS.get('DEMICOLOR_CHECKBOX', true, 'boolean');
				runtimeInterval = setTimeout(() => {
					AUDIO.volume = parseFloat(AUDIO_VOLUME);
					AUDIO.currentTime = 0;
					AUDIO.src = chrome.runtime.getURL(SOUNDS);
				}, 200);
				clearTimeout(responseInterval);
				responseInterval = setTimeout(FETCH, INTERVAL);
			}
		}, 1);
		return true;
	});
	/**
	 * Click Icon Extension
	 **/
	chrome.browserAction.onClicked.addListener(function(tab) {
		if(tabDDC!=undefined && TAB_CHECKBOX){
			chrome.tabs.query({}, function(tabvs){
				for(var i=0; i<tabvs.length; ++i){
					var req = /^(https?:\/\/demiart.ru\/forum)/ig,
					td = tabvs[i];
					if(req.test(td.url) && tabDDC.id == td.id){
						chrome.tabs.update(tabDDC.id, {'url': URL, 'active':true}, tabCreate);
						return;
						break;
					}
				}
				chrome.tabs.create({'url': URL, 'active':true}, tabCreate);
			})
		}else{
			chrome.tabs.create({'url': URL, 'active':true}, tabCreate);
		}
	});
	/**
	 * Updated (loading) tabs
	 **/
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		var req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig,
			regusr = /(UserCP)/ig,
			userPage = new RegExp("showuser", "ig"),
			regex = /(showtopic=(\d+))/ig;
		switch(changeInfo.status) {
			case "loading":
				if(req.test(tab.url)){
					executeMessages(tab.id);
					clearTimeout(responseInterval);
					responseInterval = setTimeout(FETCH, INTERVAL);
				}
				break;
		}
		
		req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
		
		if(changeInfo.status=='loading' && req.test(tab.url)){
			
		}
	});
	chrome.tabs.query({}, function(tabs) {
		for(let i = 0; i<tabs.length;++i){
			let lt = tabs[i].id,
				req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
			if(req.test(tabs[i].url)){
				//executeDccScript(tabs[i].id);
				executeMessages(tabs[i].id);
				setTimeout(function(){chrome.tabs.sendMessage(lt,{data: "/favicon.ico", message: 'favicon'});}, 100);
			}
		}
	});
	chrome.browserAction.setIcon({path: I_19});
	chrome.browserAction.setBadgeBackgroundColor({color:'#d22d2d'});
	window.addEventListener('online', ON_OFF);
	window.addEventListener('offline', ON_OFF);
	AUDIO.controls = false;
	AUDIO.style.display = "none";
	AUDIO.crossOrigin="anonymous";
	AUDIO.preload = "none";
	AUDIO.src = chrome.runtime.getURL(SOUNDS);
	FETCH();
}(chrome, document, window));