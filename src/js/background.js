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
		forumMenu = 0,
		runtimeInterval = 0,
		responseInterval = 0,
		favicon = document.createElement('canvas').getContext('2d'),
		image = document.createElement('img');
	favicon.canvas.width = 16;
	favicon.canvas.height = 16;
	image.width = 16;
	image.height = 16;
	image.src = chrome.runtime.getURL("/images/favicon.png");
  const URL_CONST = "https://demiart.ru/forum/",
		I_19 = chrome.runtime.getURL("/images/icon19.png"),
		F_19 = chrome.runtime.getURL("/images/fi.png"),
		EXT_ID = chrome.i18n.getMessage("@@extension_id"),
		AUDIO = new Audio(),
		/**
		 * Слушатель, который определяет подключение, отключение от интернета
		 * При изменении состояния - запрос
		 **/
		ON_OFF = function(e){
			clearTimeout(responseInterval);
			responseInterval = setTimeout(FETCH, 100);
		},
		/**
		 * Сам запрос
		 **/
		FETCH = async function(){
			let winStatus = window.navigator.onLine;
			clearTimeout(responseInterval);
			chrome.browserAction.setIcon({path: I_19});
			/**
			 * Если задан INTERVAL и подключен к Интернет 
			 **/
			if(INTERVAL && winStatus){
				chrome.browserAction.setIcon({path: F_19});
				let url = 'https://demiart.ru/forum/index.php?act=ST&CODE=discuss&_='+(new Date()).getTime();
				fetch(url).then(function(response){
					/**
					 * Если ответ в норме
					 **/
					response.json().then(function(json){
						json.year = new Date(response.headers.get('date')).getFullYear();
						OPTIONS.set('YEAR', json.year);
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
						/**
						 * Если неудачный ответ
						 **/
						URL = URL_CONST;
						DDC = 0;
						chrome.browserAction.setIcon({path: I_19});
						chrome.browserAction.setBadgeText({text: winStatus ? 'Error' : 'Off'});
						sendMessages();
					});
					chrome.browserAction.setIcon({path: I_19});
					responseInterval = setTimeout(FETCH, INTERVAL * 60000);
				}).catch(function(){
					/**
					 * Если неудачный запрос
					 **/
					URL = URL_CONST;
					DDC = 0;
					chrome.browserAction.setIcon({path: I_19});
					chrome.browserAction.setBadgeText({text: winStatus ? 'Error' : 'Off'});
					sendMessages();
					responseInterval = setTimeout(FETCH, INTERVAL * 60000);
				});
			}else{
				/**
				 * Если не задан INTERVAL и не подключен к Интернет 
				 **/
				let sec = INTERVAL ? INTERVAL : 0.1;
				URL = URL_CONST;
				DDC = 0;
				chrome.browserAction.setIcon({path: I_19});
				/** 
				 * Если не подключен к интернет, то выводим сообщение Off
				 * Если подключен, но не задан INTERVAL обнуляем сообщения
				 **/
				chrome.browserAction.setBadgeText({text: !winStatus ? 'Off' : ''});
				sendMessages();
				responseInterval = setTimeout(FETCH, sec * 60000);
			}
		},
		GO_FORUM = function(){
			/**
			 * Обработка клика по иконке
			 * Отправка сообщения всем табам форума
			 * Если открытого таб нет, то создаём его
			 **/
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
		},
		tabCreate = function(tab){
			/**
			 * Таб создан, установим глобальную переменную tabDDC
			 **/
			tabDDC = tab;
		},
		executeMessages = function(id){
			/**
			 * Подключение наших скриптов к странице форума
			 **/
			chrome.tabs.insertCSS(id, {"file": "/css/messages.css"}, function(){});
			chrome.tabs.executeScript(id, {"file": "/js/messages.js"}, function(){});
		},
		sendMessages = function(){
			/**
			 * Отправляем сообщение всем вкладкам форума
			 **/
			chrome.tabs.query({}, function(tabs) {
				for(let i = 0; i < tabs.length; ++i){
					let lt = tabs[i].id,
						req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
					if(req.test(tabs[i].url)){
						// get favicon and set favicon
						chrome.tabs.sendMessage(lt, {
							idtab: lt,
							ddc: DDC,
							url: URL,
							def: URL_CONST,
							favicon: getFavicon(),
							message: 'ddc',
							demicolor: DEMICOLOR_CHECKBOX,
						});
					}
				}
			});
			/** 
			 * Обновляем контекстное меню
			 **/
			forumMenu && chrome.contextMenus.update(forumMenu, {
			    title: DDC <= 0 ? chrome.i18n.getMessage('forum') : chrome.i18n.getMessage('comments').replace('*ddc*', DDC)
			});
		},
		getFavicon = function(){
			/**
			 * Создание favicon форума
			 **/
			let c = String(DDC > 99 ? '+99' : DDC) + '';
			favicon.clearRect(0, 0, 16, 16);
			favicon.drawImage(image, 0, 0, 16, 16, 0, 0, 16, 16);
			if(DDC){
				var pix = window.devicePixelRatio || 1,
					right = 0,
					len = c.length-1,
					width = 7 * pix + (6 * pix * len),
					height = 9 * pix,
					top = 16 - height,
					left = 16 - width - pix,//w - 7,
					bottom = right = 16 * pix,
					radius = 2 * pix;
				favicon.font = 'bold ' + (8 * pix) + 'px arial';
				favicon.fillStyle = favicon.strokeStyle = "#F03D25";
				favicon.lineWidth = 1;
				favicon.beginPath();
				favicon.moveTo(left + radius, top);
				favicon.quadraticCurveTo(left, top, left, top + radius);
				favicon.lineTo(left, bottom - radius);
				favicon.quadraticCurveTo(left, bottom, left + radius, bottom);
				favicon.lineTo(right - radius, bottom);
				favicon.quadraticCurveTo(right, bottom, right, bottom - radius);
				favicon.lineTo(right, top + radius);
				favicon.quadraticCurveTo(right, top, right - radius, top);
				favicon.closePath();
				favicon.fill();
				// bottom shadow
				favicon.beginPath();
				favicon.strokeStyle = "rgba(0,0,0,0.3)";
				favicon.moveTo(left + radius / 2.0, bottom);
				favicon.lineTo(right - radius / 2.0, bottom);
				favicon.stroke();
				// label
				favicon.fillStyle = '#ffffff';
				favicon.textAlign = "right";
				favicon.textBaseline = "top";
				
				favicon.fillText((c+''), pix === 2 ? 29 : 15, 6*  pix);
			}
			return favicon.canvas.toDataURL();
		},
		contextMenuShow = function(){
			/**
			 * Создание контекстного меню
			 **/
			ddcMenu = chrome.contextMenus.create({
				"title": "Demiart DDC",
				"contexts": ["all"]
			});
			forumMenu = chrome.contextMenus.create({
				"title": chrome.i18n.getMessage('forum'),
				"contexts":["all"],
				"parentId": ddcMenu,
				"onclick": GO_FORUM
			});
			chrome.contextMenus.create({
				"title": chrome.i18n.getMessage('hosting'),
				"contexts":["all"],
				"parentId": ddcMenu,
				"onclick": function(){
					chrome.tabs.create({'url': 'https://morgoth.ru/', 'active':true}, function(tab){});
				}
			});
			chrome.contextMenus.create({
				"title": chrome.i18n.getMessage('youtube'),
				"contexts":["all"],
				"parentId": ddcMenu,
				"onclick": function(){
					chrome.tabs.create({'url': 'https://www.youtube.com/c/demiartru', 'active':true}, function(tab){});
				}
			});
			chrome.contextMenus.create({
				"title": chrome.i18n.getMessage('demicolor'),
				"contexts":["all"],
				"parentId": ddcMenu,
				"onclick": function(){
					chrome.tabs.create({'url': 'https://demicolor.demiart.ru/', 'active':true}, function(tab){});
				}
			});
			chrome.contextMenus.create({
				"title": "",
				"contexts":["all"],
				"parentId": ddcMenu,
				"type":"separator"
			});
			chrome.contextMenus.create({
				"title": chrome.i18n.getMessage("refresh"),
				"contexts":["all"],
				"parentId": ddcMenu,
				"onclick": FETCH
			});
			chrome.contextMenus.create({
				"title": "",
				"contexts":["all"],
				"parentId": ddcMenu,
				"type":"separator"
			});
			chrome.contextMenus.create({
				"title": chrome.i18n.getMessage("settings"),
				"contexts":["all"],
				"parentId": ddcMenu,
				"onclick": function(){
					chrome.runtime.openOptionsPage();
				}
			});
		};

	/**
	 * onMessage options
	 **/
	chrome.runtime.onMessage.addListener(function(rq, sender, sendResponse) {
		setTimeout(function() {
			sendResponse({status: true});
			clearTimeout(runtimeInterval);
			switch(rq.message){
				/**
				 * Get Message Options
				 **/
				case 'OPTIONS':
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
					}, 1);
					FETCH();
					chrome.tabs.query({}, function(tabs) {
						for(let i = 0; i<tabs.length;++i){
							let lt = tabs[i].id,
								req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
							if(req.test(tabs[i].url)){
								setTimeout(function(){
									chrome.tabs.sendMessage(lt, {
										demicolor: DEMICOLOR_CHECKBOX,
										message: 'demicolor'
									});
								}, 100);
							}
						}
					});
					break;
				/**
				 * FETCH
				 **/
				case 'FETCH':
					FETCH();
					break;
			}
		}, 1);
		return true;
	});
	/**
	 * Click Icon Extension
	 **/
	chrome.browserAction.onClicked.addListener(function(tab) {
		GO_FORUM();
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
					FETCH();
				}
				break;
		}
		
		req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
		
		if(changeInfo.status=='loading' && req.test(tab.url)){
			
		}
	});

	/**
	 * Запускаем наше расширение на всех вкладках форума
	 **/
	chrome.tabs.query({}, function(tabs) {
		for(let i = 0; i<tabs.length;++i){
			let lt = tabs[i].id,
				req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
			if(req.test(tabs[i].url)){
				executeMessages(tabs[i].id);
				chrome.tabs.sendMessage(lt, {
					idtab: lt,
					url: URL,
					def: URL_CONST,
					ddc: DDC,
					favicon: getFavicon(),
					demicolor: DEMICOLOR_CHECKBOX,
					message: 'ddc'
				});
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
	contextMenuShow();
	sendMessages();
	FETCH();
	console.log('%c Demiart DDC && DemiartColor Code ','background:#4C5D55;color:#e7aa11;font-size:40px;');
}(chrome, document, window));