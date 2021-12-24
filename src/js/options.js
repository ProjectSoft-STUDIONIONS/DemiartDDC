(function(document, window){
	Math.inInterval = Math.inInterval || function(val, min, max){
		return Math.min(max, Math.max(min, val));
	}
	var INIT = false;
	const LANG = {
		get: function(message, def = ''){
			let mess = chrome.i18n.getMessage(message);
			return mess == '' ? def : mess;
		}
	},
	AUDIO_EVENTS = [
		'emptied',
		'ended',
		'waiting',
		'ended',
		'play',
		'playing',
		'pause',
		'abort'
	],
	UPDATE_RANGE = function(){
		let min = parseFloat(AUDIO.min),
			max = parseFloat(AUDIO.max),
			val = parseFloat(AUDIO.value),
			mi = 0,
			ma = max - min,
			v = val - min,
			s = (v * 100) / ma;
		AUDIO.volume = AUDIO_VOLUME.value;
		AUDIO_VOLUME.setAttribute('style', `--background-range: ${parseInt(AUDIO.volume * 100)}%`);
		document.getElementById('range').setAttribute('range', parseInt(AUDIO.volume * 100));
		WRITE_SETTINGS(false);
	},
	AUDIO_HANDLER = function(e){
		// Упрощаем всё
		switch(e.type){
			case 'play':
			case 'waiting':
			case 'playing':
				BTN_SOUND.classList.add("play");
				break;
			case 'ended':
			case 'abort':
			case 'emptied':
			case 'error':
			case 'pause':
				BTN_SOUND.classList.remove("play");
				break;
		}
	},
	WRITE_SETTINGS = function(writer = false){
		if (writer) {
			INIT = true;
		}
		if(writer){
			OPTIONS.set('INTERVAL', INTERVAL.value);
			OPTIONS.set('AUDIO_CHECKBOX', AUDIO_CHECKBOX.checked);
			OPTIONS.set('SOUNDS', SOUNDS.value);
			OPTIONS.set('AUDIO_VOLUME', AUDIO_VOLUME.value);
			OPTIONS.set('TAB_CHECKBOX', TAB_CHECKBOX.checked);
			OPTIONS.set('DEMICOLOR_CHECKBOX', DEMICOLOR_CHECKBOX.checked);
			if(INIT) {
				/**
				 * Send Message Options
				 **/
				chrome.runtime.sendMessage(
					chrome.i18n.getMessage("@@extension_id"),
					'OPTIONS',
					{},
					function(){}
				);
			}
			INIT = true;
		}
	},
	READ_SETTINGS = function(){
		INTERVAL.value = OPTIONS.get('INTERVAL', 0.1666666666666667, 'number');
		AUDIO_CHECKBOX.checked = OPTIONS.get('AUDIO_CHECKBOX', true, 'boolean');
		SOUNDS.value = OPTIONS.get('SOUNDS', '/sound/alarm0.ogg', 'string');
		AUDIO_VOLUME.value = OPTIONS.get('AUDIO_VOLUME', 0.5, 'number');
		TAB_CHECKBOX.checked = OPTIONS.get('TAB_CHECKBOX', true, 'boolean');
		DEMICOLOR_CHECKBOX.checked = OPTIONS.get('DEMICOLOR_CHECKBOX', true, 'boolean');
		YEAR.innerHTML = OPTIONS.get('YEAR', (new Date()).getFullYear(), 'number');
		UPDATE_RANGE();
	},
	COUNT_SOUND = 25,
	AUDIO = new Audio(),
	INTERVAL = document.getElementById('interval'),
	AUDIO_VOLUME = document.getElementById('audio_volume'),
	AUDIO_CHECKBOX = document.getElementById('audio_checkbox'),
	BTN_SOUND = document.getElementById('playButton'),
	SOUNDS = document.getElementById('sounds'),
	TAB_CHECKBOX = document.getElementById('tab_checkbox'),
	DEMICOLOR_CHECKBOX = document.getElementById('demicolor_checkbox'),
	SAVE = document.getElementById('save'),
	YEAR = document.getElementById('year');
	AUDIO.controls = false;
	AUDIO.style.display = "none";
	AUDIO.crossOrigin="anonymous";
	AUDIO.preload = "none";
	AUDIO_EVENTS.forEach(function(event, index, arr){
		AUDIO.addEventListener(event, AUDIO_HANDLER);
	});
	SAVE.innerHTML = LANG.get('save', 'Сохранить');
	SAVE.addEventListener('click', function(){
		WRITE_SETTINGS(true);
		setTimeout(function(){
			window.close();
		}, 500);
	});
	BTN_SOUND.addEventListener('click', function(e){
		if(!BTN_SOUND.classList.contains("play")){
			BTN_SOUND.classList.add("play");
			AUDIO.src = chrome.runtime.getURL(SOUNDS.options[SOUNDS.selectedIndex].value);
			AUDIO.currentTime = 0;
			AUDIO.play();
		}
	});
	document.getElementById('nameext').innerHTML = LANG.get('name');
	document.getElementById('param-02-title').innerHTML = LANG.get('title02');
	document.getElementById('param-03-title').innerHTML = LANG.get('title03');
	document.getElementById('param-04-title').innerHTML = LANG.get('title04');
	document.getElementById('param-05-title').innerHTML = LANG.get('title05');
	document.getElementById('param-06-title').innerHTML = LANG.get('title06');
	for (let i = 0; i<= COUNT_SOUND; ++i){
		let curFile = `alarm${i}`,
			curPath = `/sound/${curFile}.ogg`,
			el = document.createElement('option');
				el.value = curPath;
				el.innerHTML = LANG.get(curFile, 'Звук №' + (i + 1));
				SOUNDS.append(el);
	}
	for(let i = 0; i <= INTERVAL.options.length-1; ++i){
		INTERVAL.options[i].innerHTML = LANG.get('option02_' + i, 'Option ' + (i + 1));
	}
	AUDIO_VOLUME.addEventListener('input', function(e){
		AUDIO.volume = parseFloat(this.value);
		UPDATE_RANGE();
	});
	AUDIO_VOLUME.addEventListener('change', function(e){
		AUDIO.volume = parseFloat(this.value);
		UPDATE_RANGE();
	});
	AUDIO_VOLUME.addEventListener('mousewheel', function(e){
		let o = e.wheelDelta,
			min = parseFloat(this.min),
			max = parseFloat(this.max),
			val = parseFloat(this.value),
			step = parseFloat(this.step);
		this.value = Math.inInterval(val + (o > 0 ? step : -step), min, max);
		AUDIO.volume = parseFloat(this.value);
		UPDATE_RANGE();
	});
	SOUNDS.addEventListener('change', function(e){
		BTN_SOUND.classList.add("play");
		AUDIO.src = chrome.runtime.getURL(SOUNDS.options[SOUNDS.selectedIndex].value);
		AUDIO.currentTime = 0;
		AUDIO.play();
	});
	READ_SETTINGS();
}(document, window));