(function(){
	var u = "undefined" != typeof chrome ? chrome.extension.getBackgroundPage() : opera.extension.bgProcess,
		exId = chrome.i18n.getMessage("@@extension_id"),
		discussURL = options.urlForum,
		optionsURL = 'options.html',
		demiColor = "http://demicolor.demiart.ru/",
		morgoth = 'http://morgoth.ru/',
		youtube = 'http://www.youtube.com/c/demiartru',
		audio = new Audio(options.refreshSoundFile),
		tabDDC, optionsDDC,
		calarm,
		iAni = 0,
		cx = 0,
		dcc_c = 0,
		dcc_u = options.protocolForum+'://demiart.ru/forum/',
		icon = new Image,
		ld = new Image,
		fvi = new Image,
		canvas = document.createElement("canvas"),
		favicon = document.createElement("canvas"),
		ftx = favicon.getContext("2d"),
		ctx = canvas.getContext("2d"),
		pix = window.devicePixelRatio || 1,
		fix = {
			width: 7,
			height: 9,
			font: 'bold ' + (10 * pix) + 'px arial',
			colour: '#ffffff',
			background: '#F03D25',
			size: 16
		},
		ddcGoDemiItemMenu,
		ddcGoMorgoth,
		ddcGoDemiColor,
		ddcGoDemiYouTube,
		statusTab = undefined,
		
		/*
		... Скрипт для всех страниц форума
		*/
		executeDccScript = function(tabId){
			chrome.tabs.insertCSS(tabId, {"file":"assets/css/count-msg.css"}, function(){
				chrome.tabs.executeScript(tabId,{"file":"assets/js/count-msg.js"});
			});
		},
		
		executeScripts = function(tabId){
			chrome.tabs.insertCSS(tabId, {"file":"assets/css/ddc.css"}, function(){
				chrome.tabs.executeScript(tabId,{"file":"assets/js/ddc.js"});
			});
		},
		
		/*
		... Анимация иконки
		*/
		startAnimation = function(){
			clearTimeout(iAni);
			cx = (cx>35) ? 0 : cx;
			var x = cx*19,
			imageData = {};
			ctx.drawImage(ld,x,0,19,19,0,0,19,19);
			imageData['19'] = ctx.getImageData(0, 0, 19, 19);
			chrome.browserAction.setIcon({imageData:imageData});
			++cx;
			iAni = setTimeout(startAnimation, 60);
		},
		stopAnimation = function(){
			clearTimeout(iAni);
			chrome.browserAction.setIcon({path:"assets/images/icon19.png"});
		},
		drawFavicon = function(c){
			ftx.clearRect(0, 0, 16, 16);
			ftx.drawImage(fvi, 0, 0, 16, 16, 0, 0, 16, 16);
			var label = c+"";
			c = parseInt(c);
			if(c){
				c = c > 99 ? 99 : c;
				var right,
				len = (c+'').length-1,
				width = fix.width * pix + (6 * pix * len),
				height = fix.height * pix,
				top = fix.size - height,
				left = fix.size - width - pix,//w - 7,
				bottom = right = 16 * pix,
				radius = 2 * pix;
				ftx.font = fix.font;
				ftx.fillStyle = ftx.strokeStyle = "#F03D25";
				ftx.lineWidth = 1;
				ftx.beginPath();
				ftx.moveTo(left + radius, top);
				ftx.quadraticCurveTo(left, top, left, top + radius);
				ftx.lineTo(left, bottom - radius);
				ftx.quadraticCurveTo(left, bottom, left + radius, bottom);
				ftx.lineTo(right - radius, bottom);
				ftx.quadraticCurveTo(right, bottom, right, bottom - radius);
				ftx.lineTo(right, top + radius);
				ftx.quadraticCurveTo(right, top, right - radius, top);
				ftx.closePath();
				ftx.fill();

				// bottom shadow
				ftx.beginPath();
				ftx.strokeStyle = "rgba(0,0,0,0.3)";
				ftx.moveTo(left + radius / 2.0, bottom);
				ftx.lineTo(right - radius / 2.0, bottom);
				ftx.stroke();

				// label
				ftx.fillStyle = fix.colour;
				ftx.textAlign = "right";
				ftx.textBaseline = "top";

				// unfortunately webkit/mozilla are a pixel different in text positioning
				ftx.fillText((c+''), pix === 2 ? 29 : 15, 6*pix);
			}
			return favicon.toDataURL();
		},
		
		
		/*
		... RESET OPTIONS
		*/
		resetOptions = function(){
			calarm && clearTimeout(calarm);
			chrome.contextMenus.removeAll();
			discussURL = options.urlForum;
			if(!options.refreshInterval){
				calarm = setTimeout(onAlarm, options.refreshInterval * 60000);
			}
			chrome.tabs.query({}, function(tabs) {
				for(var i = 0; i<tabs.length;++i){
					var lt = tabs[i].id,
						req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
					if(req.test(tabs[i].url)){
						chrome.tabs.sendMessage(lt,{ddc:dcc_c,url:dcc_u,def:options.protocolForum + options.urlForum, message:'ddc'});
						if(options.favicon){
							var datauri = drawFavicon(dcc_c);
							chrome.tabs.sendMessage(lt,{'data':datauri, message:'favicon'});
						}else{
							chrome.tabs.sendMessage(lt,{data:"/favicon.ico", message:'favicon'});
						}
					}
				}
			});
			contextMenuShow();
		},
		/*
		... Клик по пунктам меню
		*/
		itemMenuClick = function(info, tab){
			switch(info.menuItemId){
				case ddcGoDemiItemMenu:
					/*
					... setTimeout переместим в начало обработки клика
					... Чистим интервал и запускаем с интервалом 5 сек (актуально для модемного Интернета от сотовых связей)
					*/
					calarm && clearTimeout(calarm);
					calarm = setTimeout(function() { onAlarm() }, 5000);
					/*
					... Проверяем доступность Tab
					*/
					(tabDDC!=undefined) ? chrome.tabs.get(tabDDC.id, getTabDdc) : chrome.tabs.create({'url': options.protocolForum + discussURL, 'active':true}, tabCreate);
					break;
				case ddcGoDemiColor:
					/* Переход на проект DemiColor */
					chrome.tabs.create({'url': demiColor, 'active':true}, null);
					break
				case ddcGoMorgoth:
					/* Переход на Morgoth */
					chrome.tabs.create({'url': morgoth, 'active':true}, null);
					break;
				case ddcGoDemiYouTube:
					/* Переход на YouTube */
					chrome.tabs.create({'url': youtube, 'active':true}, null);
					break;
			}
		},
		tabCreate = function(tab){
			tabDDC = tab;
		},
		getTabDdc = function(tab){
			tabDDC = tab;
			if(tab && options.viewTab){
				/*
				... проверка url вкладки
				*/
				var req = /(https?:\/\/demiart.ru\/forum)/ig;
				if(req.test(tab.url)){
					/*
					... Если таб был закрыт.
					... Данная ошибка свойственна только для Yandex браузера.
					*/
					try{
						chrome.tabs.update(tab.id, {'url': options.protocolForum + discussURL, 'active':true}, tabCreate);
					}catch(e){
						chrome.tabs.create({'url': options.protocolForum + discussURL, 'active':true}, tabCreate);
					}
				}else{
					chrome.tabs.create({'url': options.protocolForum + discussURL, 'active':true}, tabCreate);
				}
			}
			else
				chrome.tabs.create({'url': options.protocolForum + discussURL, 'active':true}, tabCreate);
		},
		/*
		... Показывать/скрывать контекстное меню
		*/
		contextShowClick = function(info, tab){
			options.showContext = info.checked;
			chrome.contextMenus.removeAll();
			contextMenuShow();
		},
		/*
		... Включить/Отключить звук
		*/
		onSoundChange = function(info, tab){
			options.audioOn = info.checked;
		},
		/*
		... Изменить файл звука оповещения
		*/
		onSoundFileChange = function(info, tab){
			options.refreshSoundFile = 'assets/sound/'+info.menuItemId+'.ogg';
			audio.src = options.refreshSoundFile;
			audio.volume = options.sounVolume;
			audio.play();
		},
		/*
		... Изменить громкость оповещения
		*/
		onSoundVolumeChange = function(info, tab){
			options.sounVolume = info.menuItemId;
			audio.src = options.refreshSoundFile;
			audio.volume = options.sounVolume;
			audio.play();
		},
		/*
		... Открывать в той же вкладке
		*/
		onTabChange = function(info, tab){
			options.viewTab = info.checked;
		},
		/*
		... DemiColor в форме комментариев
		*/
		onDemiColorChange = function(info, tab){
			options.demiColor = info.checked;
		},
		/*
		... Обновлять иконку сайта
		*/
		onFavIconChange = function(info, tab){
			options.favicon = info.checked;
			resetOptions();
			chrome.tabs.query({}, function(tabs) {
				var dc = 0;
				for(var i = 0; i<tabs.length;++i){
					var lt = tabs[i].id,
					req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
					if(req.test(tabs[i].url)){
						++dc;
						chrome.tabs.sendMessage(lt,{ddc:dcc_c,url:dcc_u,def:options.protocolForum + options.urlForum, message:'ddc'});
						if(options.favicon){
							var datauri = drawFavicon(dcc_c);
							chrome.tabs.sendMessage(lt,{'data':datauri, message:'favicon'});
						}else{
							chrome.tabs.sendMessage(lt,{data:"/favicon.ico", message:'favicon'});
						}
					}
				}
			});
		},
		
		/*
		... Контекстное меню
		*/		
		contextMenuShow = function(){
			var shcm = (options.showContext) ? "all" : "browser_action";
			var ddcMenu = chrome.contextMenus.create({"title": "Demiart Discussion Count", "contexts":[shcm]});
			chrome.contextMenus.create({"title": lang.get("refresh"), "contexts":[shcm], "parentId": ddcMenu, "onclick": onAlarm});
			chrome.contextMenus.create({"type":"separator","title": "", "contexts":[shcm], "parentId": ddcMenu});
			
			ddcGoDemiItemMenu = chrome.contextMenus.create({"title": lang.get("goTo")+" "+lang.get("forum"), "contexts":[shcm], "parentId": ddcMenu, "onclick": itemMenuClick});
			ddcGoDemiColor = chrome.contextMenus.create({"title": lang.get("goTo")+" DemiColor", "contexts":[shcm], "parentId": ddcMenu, "onclick":itemMenuClick});
			ddcGoMorgoth = chrome.contextMenus.create({"title": lang.get("goTo")+" "+lang.get("hosting"), "contexts":[shcm], "parentId": ddcMenu, "onclick":itemMenuClick});
			ddcGoDemiYouTube = chrome.contextMenus.create({"title": lang.get("goTo")+" "+lang.get("chanel"), "contexts":[shcm], "parentId": ddcMenu, "onclick":itemMenuClick});
			chrome.contextMenus.create({"type":  "separator","title": "", "contexts":[shcm], "parentId": ddcMenu});
			chrome.contextMenus.create({"title": lang.get("contextMenu"), "contexts":[shcm],"type":"checkbox","checked": options.showContext,"parentId":ddcMenu, "onclick":contextShowClick});
			chrome.contextMenus.create({"title": lang.get("soundAlarm"), "type":"checkbox", "checked": options.audioOn, "contexts":[shcm], "parentId": ddcMenu, "onclick": onSoundChange});
			chrome.contextMenus.create({"title": lang.get("openTab"), "type":"checkbox", "checked": options.viewTab, "contexts":[shcm], "parentId": ddcMenu, "onclick": onTabChange});
			chrome.contextMenus.create({"title": lang.get("demiColor"), "type":"checkbox", "checked": options.demiColor, "contexts":[shcm], "parentId": ddcMenu, "onclick": onDemiColorChange});
			chrome.contextMenus.create({"title": lang.get("refreshFavicon"), "type":"checkbox", "checked": options.favicon, "contexts":[shcm], "parentId": ddcMenu, "onclick": onFavIconChange});
			
			chrome.contextMenus.create({"type":"separator","title": "", "contexts":[shcm], "parentId": ddcMenu});
			var ddcsound = chrome.contextMenus.create({"title": lang.get("changeSound"), "contexts":["browser_action"], "type":"normal", "parentId": ddcMenu}),
			ddcsoundfile = chrome.contextMenus.create({"title": lang.get("fileSound"), "contexts":["browser_action"], "type":"normal", "parentId": ddcsound}),
			ddcsoundvolume = chrome.contextMenus.create({"title": lang.get("volumeSound"), "contexts":["browser_action"], "type":"normal", "parentId": ddcsound});
			for(var i=0;i<soundList.length;++i){
				chrome.contextMenus.create({"title": soundList[i].name,"id":soundList[i].id, "contexts":["browser_action"], "type":"radio","checked":(options.refreshSoundFile == ('assets/'+soundList[i].id+'.ogg')) ? true : false, "parentId": ddcsoundfile, "onclick":onSoundFileChange});
			}
			var l = 0;
			while(l<1){
				l += 0.05;
				l = Number(l.toFixed(3));
				chrome.contextMenus.create({"title": (Math.round(l*100)+"%"),"id":String(l), "contexts":["browser_action"], "type":"radio","checked":(options.sounVolume == l) ? true : false, "parentId": ddcsoundvolume, "onclick":onSoundVolumeChange});
			}
			if(options.showContext){
				chrome.contextMenus.create({"title": "separator", "contexts":["page"], "parentId": ddcMenu, "type":"separator"});
				chrome.contextMenus.create({"title": lang.get("settings"), "contexts":["page"], "parentId": ddcMenu, "onclick": function(){chrome.runtime.openOptionsPage();}});
			}
		},
		onAlarm = function(){
			calarm && clearTimeout(calarm);
			var xhr = new XMLHttpRequest();
			xhr.open('GET', options.protocolForum + '://demiart.ru/forum/index.php?act=ST&CODE=discuss&_='+(new Date()).getTime());
			xhr.send('');
			/* Запустить анимацию иконки */
			startAnimation();
			/* Обрабатываем запрос */
			xhr.onreadystatechange = function() {
				if (this.readyState != 4) return;
				
				/* Остановить анимацию */
				stopAnimation();
				//console.log(typeof options.refreshInterval);
				if(options.refreshInterval){
					calarm = setTimeout(onAlarm, options.refreshInterval * 60000);
				}
				
				if (xhr.status != 200) {
					chrome.browserAction.setBadgeText({text: 'Error'});
					
					return;
				}
				var response = _helper.unpack(xhr.response) || {count:0,href:options.protocolForum+'://demiart.ru/forum/'},
					discussCount = parseInt(response.count) || 0;
				
				discussURL = response.href.replace(/^https?/, "");
				
				if(response.href == '://demiart.ru/forum/'){
					discussURL = options.urlForum;
				}
				/*
				... Получим дату из заголовка ответа сервера
				... Для укозания точного текущего года в &copy; Демиарта.
				*/
				var resHeader = xhr.getResponseHeader('Date');
				options.refreshDate = parseInt(resHeader.split(' ')[3]);
				if (discussCount) {
					chrome.browserAction.getBadgeText({}, function(result) {
						result = parseInt(result) || 0;
						if (result < discussCount && options.audioOn){
							audio.src = options.refreshSoundFile;
							audio.volume = options.sounVolume;
							audio.play();
						}
					});
					var comments = lang.get("comments").replace(/\*ddc\*/, String(discussCount));
					var commentsmenu = lang.get("commentsmenu").replace(/\*ddc\*/, String(discussCount));
					chrome.browserAction.setBadgeText({text: String(discussCount)});
					chrome.browserAction.setTitle({'title':  comments});
					chrome.contextMenus.update(ddcGoDemiItemMenu, {"title": commentsmenu});
					
				}else{
					chrome.browserAction.setBadgeText({text: ''});
					chrome.browserAction.setTitle({'title':  lang.get("name")});
					chrome.contextMenus.update(ddcGoDemiItemMenu, {"title": lang.get('goTo') + " " + lang.get('forum')});
					
				}
				dcc_c = discussCount;
				dcc_u = options.protocolForum + discussURL;
				chrome.tabs.query({}, function(tabs) {
					var dc = 0;
					for(var i = 0; i<tabs.length;++i){
						var lt = tabs[i].id,
							req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
						if(req.test(tabs[i].url)){
							++dc;
							chrome.tabs.sendMessage(lt,{ddc:dcc_c, url:dcc_u, def:options.urlForum, message:'ddc'});
							if(localStorage['favicon']=="true"){
								var datauri = drawFavicon(dcc_c);
								chrome.tabs.sendMessage(lt,{'data':datauri, message:'favicon'});
							}else{
								chrome.tabs.sendMessage(lt,{data:"/favicon.ico", message:'favicon'});
							}
						}
					}
				});
			}
		};
	
	icon.src = "assets/images/fi.png";
	ld.src = "assets/images/ld.png";
	fvi.src = "assets/images/favicon.png";
	canvas.width = 19;
	favicon.width = 16;
	canvas.height = 19;
	favicon.height = 16;
	document.body.appendChild(canvas);
	document.body.appendChild(favicon);
	audio.volume = options.sounVolume;
	chrome.browserAction.setBadgeBackgroundColor({color:'#d22d2d'});
	
	/*
	...
	*/
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		statusTab = changeInfo.status;
		var req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig,
			regusr = /(UserCP)/ig
		if(changeInfo.status=='loading' && options.demiColor){
			if(req.test(tab.url) && regusr.test(tab.url)==false){
				executeScripts(tab.id);
			}
		};
		req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
		
		if(changeInfo.status=='loading' && req.test(tab.url)){
			executeDccScript(tab.id);
			setTimeout(function() {
				chrome.tabs.sendMessage(tab.id,{ddc:dcc_c,url:dcc_u,def:options.protocolForum + options.urlForum, message:'ddc'});
				if(localStorage['favicon']=="true"){
					chrome.tabs.sendMessage(tab.id,{data:drawFavicon(dcc_c), message:'favicon'});
				}else{
					chrome.tabs.sendMessage(tab.id,{data:"/favicon.ico", message:'favicon'});
				}
			}, 1500);
			stopAnimation();
			calarm && clearTimeout(calarm);
			calarm = setTimeout(onAlarm, 2500);
		}
	});
	chrome.commands.onCommand.addListener(function(command) {
		switch(command){
			/* Активировать вкладку Demiart
			* Если её нет - создать с выходом на главную
			*/
			case "activate_tab_demi":
				if(tabDDC!=undefined){
					chrome.tabs.query({}, function(tabs){
						var ta = false;
						for(var i = 0; i<tabs.length; ++i){
							var tab = tabs[i],
							req = /(httpS?:\/\/demiart.ru\/forum)/ig;
							if(tabDDC.id==tab.id && req.test(tab.url)){
								chrome.tabs.update(tab.id,{selected : true}, tabCreate);
								ta = true;
								break;
							}
						}
						if(!ta){
							chrome.tabs.create({'url': options.protocolForum + options.urlForum, 'active':true}, tabCreate);
						}
					})
				}else{
					chrome.tabs.create({'url': options.protocolForum + options.urlForum, 'active':true}, tabCreate);
				}
				break;
		}
	});
	
	chrome.browserAction.onClicked.addListener(function(tab) {
		if(tabDDC!=undefined && localStorage['viewtab']=='true'){
			chrome.tabs.query({}, function(tabvs){
				for(var i=0; i<tabvs.length; ++i){
					var req = /(https?:\/\/demiart.ru\/forum)/ig,
					td = tabvs[i];
					if(req.test(td.url) && tabDDC.id==td.id){
						chrome.tabs.update(tabDDC.id, {'url':options.protocolForum + discussURL, 'active':true}, tabCreate);
						return;
						break;
					}
				}
				chrome.tabs.create({'url': options.protocolForum + discussURL, 'active':true}, tabCreate);
			})
		}else{
			chrome.tabs.create({'url': options.protocolForum + discussURL, 'active':true}, tabCreate);
		}
	});
	
	chrome.tabs.query({}, function(tabs) {
		for(var i = 0; i<tabs.length;++i){
			var lt = tabs[i].id,
				req = /(https?:\/\/demiart.ru\/forum\/(.+.php\?)?)/ig;
			if(req.test(tabs[i].url)){
				executeDccScript(tabs[i].id);
				setTimeout(function(){chrome.tabs.sendMessage(lt,{data:"/favicon.ico", message:'favicon'});}, 100);
			}
		}
	});
	
	contextMenuShow();
	u.demiColorVer = '1.0.2';
	u.resetOptions = resetOptions;
	calarm = setTimeout(function() { onAlarm() }, 1000);
}());