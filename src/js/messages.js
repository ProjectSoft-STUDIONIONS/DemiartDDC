(function(){
	"use strict";
	var ddc = {
			id: 0,
			url: 'https://demiart.ru/forum/index.php',
			def: 'https://demiart.ru/forum/index.php',
			ddc: 0,
			favicon: null
		},
		linkFav = 'https://demiart.ru/forum/favicon.ico',
		/**
		 * Удаление favcon в контенте сайта форума
		 **/
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
		/**
		 * Установка favicon в контент сайта форума
		 **/
		setFaviconTag = function(url){
			removeFavicon();
			var link = document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut Icon';
			link.href = url;
			document.getElementsByTagName('head')[0].appendChild(link);
		},
		DEMICOLOR_CHECKBOX = false,
		/**
		 * Запускаем DemiColor
		 * DemiColor присутствует всегда, но в зависимости от настроек он включён или нет
		 * Поэтому мы сразу его убиваем (чистим)
		 **/
		demiColor = new DemiColor();
	demiColor.remove(true);
	/**
	 * Зона приёма изображений на форуме присутствует при быстром ответе.
	 * Поэтому мы чуть-чуть делаем её шире, иконку и описание, что данная зона может сделать
	 * Так сказать чуть твикуем
	 **/
	let dzone = document.getElementById('dzone');
	if(dzone) dzone.innerHTML = '';
	/**
	 * Слушаем сообщения от background.js
	 * Устанавливаем счётчик на иконку
	 * Если показ DemiColor разрешён - добавляем, нет - удаляем. Вся логика отображения в плагине parser.js
	 **/
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
						demiColor.add();
					}else{
						demiColor.remove();
					}
				}
				DEMICOLOR_CHECKBOX = msg.demicolor;
				break;
		}
	});
	/**
	 * Просим background.js сделать запрос
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
	 * Устанавливаем иконку по умолчанию
	 **/
	setFaviconTag(linkFav);
	console.log('%c Demiart DDC && DemiartColor Code ','background:#4C5D55;color:#e7aa11;font-size:40px;');
}());