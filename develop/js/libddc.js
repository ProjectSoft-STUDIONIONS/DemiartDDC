Math.inInterval = Math.inInterval || function(val, min, max){
	return Math.min(max, Math.max(min, val));
}
window.lang = {
		get: function(val){
			return chrome.i18n.getMessage(val);
		}
	};
window._helper = {
		pack: function(data){
			return JSON.stringify(data);
		},
		unpack: function(data){
			try {
				return JSON.parse(data);
			} catch(ex) {
				return null;
			}
		},
		isNumber: function(value){
			return (!isNaN(parseFloat(value)) && isFinite(value) && !this.isString && !this.isBoolean && !this.isObject && !this.isArray);
		},
		isArray: function (value){
			return (!this.isNull(value) && (Object.prototype.toString.call(value) === '[object Array]'));
		},
		isObject: function(value){
			return (!this.isEmpty(value) && (typeof value == 'object'));
		},
		isBoolean: function(value){
			return (typeof value == 'boolean');
		},
		isString: function(value){
			return (typeof value == 'string');
		},
		isNull: function(value){
			return ((value === undefined) || (value === null));
		},
		isEmpty: function(value){
			return ( this.isNull(value) || ((typeof value.length != 'undefined') && (value.length == 0)) );
		}
	};
window.storage = {
		get: function(key, defValue, typeValue){
			var val = (typeof localStorage[key] == "undefined" || typeof localStorage[key] == "null") ? _helper.pack(defValue) : localStorage[key];
			val = _helper.unpack(val) == null ? defValue : _helper.unpack(val);
			switch (typeValue){
				case 'number':
					if(_helper.isNull(val) || _helper.isEmpty(val))
						val = 0;
					if(!_helper.isNumber(val))
						val = parseFloat(val);
					this.set(key, val);
					break;
				case 'boolean':
					val = (_helper.isBoolean(val)) ? val : (defValue ? true : false);
					this.set(key, val);
					break;
				case 'object':
				case 'array':
					val = _helper.isObject(val) || _helper.isArray(val) ? val : (typeValue == "array" ? [] : {});
					this.set(key, val);
					break;
				default:
					this.set(key, val);
					break;
			}
			return val;
		},
		set: function(key, value){
			value = _helper.pack(value);
			localStorage[key] = value;
		}
	};
window.options = {
		/* Getters */
		get refreshInterval(){return storage.get("refresh_interval", 0.1666666666666667, 'number');},
		get audioOn(){return storage.get("audioOn", true, 'boolean');},
		get showContext(){return storage.get("showContext", true, 'boolean');},
		get refreshSoundFile(){return storage.get("refresh_sound_file", 'assets/sound/click.ogg', 'string');},
		get urlForum(){return storage.get('url_forum', "://demiart.ru/forum/", 'string');},
		get refreshDate(){return storage.get('refresh_date', (new Date()).getFullYear(), 'number');},
		get viewTab(){return storage.get('viewtab', true, 'boolean');},
		get sounVolume(){return storage.get('sounVolume', 0.5, 'number');},
		get favicon(){return storage.get('favicon', true, 'boolean');},
		get demiColor(){return storage.get('demiColor', true, 'boolean');},
		get protocolForum(){return storage.get('protocol', "https", 'string');},
		/* Setters */
		set refreshInterval(val){storage.set("refresh_interval",val);},
		set audioOn(val){storage.set("audioOn", val);},
		set showContext(val){storage.set("showContext", val);},
		set refreshSoundFile(val){storage.set("refresh_sound_file", val);},
		set urlForum(val){storage.set("url_forum", val);},
		set refreshDate(val){storage.set("refresh_date", val);},
		set viewTab(val){storage.set("viewtab", val);},
		set sounVolume(val){ val = Math.inInterval(val, 0, 1); storage.set("sounVolume", val);},
		set favicon(val){ storage.set("favicon", val);},
		set demiColor(val){ storage.set("demiColor", val);},
		set protocolForum(val){ storage.set("protocol", val);},
	};
window.soundList = [
		{
			name:	lang.get("defaulSound"),
			value:	'assets/sound/click.ogg',
			id:		'click'
		},
		{
			name:	lang.get("messengerSound"),
			value:	'assets/sound/ding.ogg',
			id:		'ding'
		},
		{
			name:	lang.get("alarmSound"),
			value:	'assets/sound/alert-0000.ogg',
			id:		'alert-0000'
		},
		{
			name:	lang.get("water1Sound"),
			value:	'assets/sound/water-0000.ogg',
			id:		'water-0000'
		},
		{
			name:	lang.get("water2Sound"),
			value:	'assets/sound/water-0001.ogg',
			id:		'water-0001'
		},
		{
			name: 	lang.get("water3Sound"),
			value:	'assets/sound/water-0002.ogg',
			id:		'water-0002'
		},
		{
			name:	lang.get("android1Sound"),
			value:	'assets/sound/android-0000.ogg',
			id:		'android-0000'
		},
		{
			name:	lang.get("android2Sound"),
			value:	'assets/sound/android-0001.ogg',
			id:		'android-0001'
		},
		{
			name:	lang.get("android3Sound"),
			value:	'assets/sound/android-0002.ogg',
			id:		'android-0002'
		},
		{
			name:	lang.get("android4Sound"),
			value:	'assets/sound/android-0003.ogg',
			id:		'android-0003'
		},
		{
			name:	lang.get("android5Sound"),
			value:	'assets/sound/animal-0000.ogg',
			id:		'animal-0000'
		},
		{
			name:	lang.get("kickSound"),
			value:	'assets/sound/kick-0000.ogg',
			id:		'kick-0000'
		},
		{
			name:	lang.get("laser1Sound"),
			value:	'assets/sound/lazer-0000.ogg',
			id:		'lazer-0000'
		},
		{
			name:	lang.get("laser2Sound"),
			value:	'assets/sound/lazer-0001.ogg',
			id:		'lazer-0001'
		},
		{
			name:	lang.get("sequence1Sound"),
			value:	'assets/sound/sequence-0000.ogg',
			id:		'sequence-0000'
		},
		{
			name:	lang.get("sequence2Sound"),
			value:	'assets/sound/sequence-0001.ogg',
			id:		'sequence-0001'
		},
		{
			name:	lang.get("sundry1Sound"),
			value:	'assets/sound/misc-0000.ogg',
			id:		'misc-0000'
		},
		{
			name:	lang.get("sundry2Sound"),
			value:	'assets/sound/misc-0001.ogg',
			id:		'misc-0001'
		},
		{
			name:	lang.get("sundry3Sound"),
			value:	'assets/sound/misc-0002.ogg',
			id:		'misc-0002'
		},
		{
			name:	lang.get("sundry4Sound"),
			value:	'assets/sound/animal-0001.ogg',
			id:		'animal-0001'
		},
		{
			name: 	lang.get("chat1Sound"),
			value: 	'assets/sound/sound_1.ogg',
			id:		'sound_1'
		},
		{
			name: 	lang.get("chat2Sound"),
			value: 	'assets/sound/sound_2.ogg',
			id:		'sound_2'
		},
		{
			name: 	lang.get("chat3Sound"),
			value: 	'assets/sound/sound_3.ogg',
			id:		'sound_3'
		},
		{
			name: 	lang.get("chat4Sound"),
			value: 	'assets/sound/sound_4.ogg',
			id:		'sound_4'
		},
		{
			name: 	lang.get("chat5Sound"),
			value: 	'assets/sound/sound_5.ogg',
			id:		'sound_5'
		},
		{
			name: 	lang.get("chat6Sound"),
			value: 	'assets/sound/sound_6.ogg',
			id:		'sound_6'
		}
	];
window.urlList = [
		{
			optiongroup:	"Форум",
			options:		[
				{
					name: 	"Главная страница форума",
					value:	"://demiart.ru/forum/index.php"
				},
				{
					name: 	"Раздел «Photoshop»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=2"
				},
				{
					name: 	"Раздел «Art»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=3"
				},
				{
					name: 	"Раздел «Фото»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=11"
				},
				{
					name: 	"Раздел «Креатив и Созидание»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=9"
				},
				{
					name: 	"Раздел «Векторные редакторы»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=8"
				},
				{
					name: 	"Раздел «Flash»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=13"
				},
				{
					name: 	"Раздел «Handmade. Декоративно-прикладное искусство.»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=18"
				},
				{
					name: 	"Раздел «Изо»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=15"
				},
				{
					name: 	"Раздел «3D редакторы»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=10"
				},
				{
					name: 	"Раздел «Обработка и создание Видео»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=6"
				},
				{
					name: 	"Раздел «Фракталы»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=19"
				},
				{
					name: 	"Раздел «Painter и Планшеты»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=17"
				},
				{
					name: 	"Раздел «Музыка»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=14"
				},
				{
					name: 	"Раздел «Литература»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=16"
				},
				{
					name: 	"Раздел «Компьютерные программы»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=20"
				},
				{
					name: 	"Раздел «Работа»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=21"
				},
				{
					name: 	"Раздел «Соревнования»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=7"
				},
				{
					name: 	"Раздел «НАШЕ ВСЁ»",
					value:	"://demiart.ru/forum/index.php?act=SC&c=4"
				}
			]
		},
		{
			optiongroup:	"Гильдии",
			options:		[
				{
					name: 	"Главная страница Гильдий",
					value:	"://demiart.ru/forum/index.php?act=SC&c=12"
				},
				{
					name: 	"Форум гильдии Темных",
					value:	"://demiart.ru/forum/index.php?showforum=53"
				},
				{
					name: 	"Форум гильдии Фантазеров",
					value:	"://demiart.ru/forum/index.php?showforum=56"
				},
				{
					name: 	"Форум гильдии Фотографов",
					value:	"://demiart.ru/forum/index.php?showforum=60"
				},
				{
					name: 	"Форум гильдии новичков",
					value:	"://demiart.ru/forum/index.php?showforum=62"
				},
				{
					name: 	"Форум гильдии Светлых",
					value:	"://demiart.ru/forum/index.php?showforum=63"
				},
				{
					name: 	"Форум гильдии Вампиров",
					value:	"://demiart.ru/forum/index.php?showforum=68"
				},
				{
					name: 	"Форум гильдии мир анимэ и манги",
					value:	"://demiart.ru/forum/index.php?showforum=69"
				},
				{
					name: 	"Форум гильдии Художников",
					value:	"://demiart.ru/forum/index.php?showforum=74"
				},
				{
					name: 	"Форум гильдии Живописцев",
					value:	"://demiart.ru/forum/index.php?showforum=77"
				},
				{
					name: 	"Форум гильдии бездельников",
					value:	"://demiart.ru/forum/index.php?showforum=79"
				},
				{
					name: 	"Форум гильдии Графиков",
					value:	"://demiart.ru/forum/index.php?showforum=84"
				},
				{
					name: 	"Форум гильдии Фотоарта",
					value:	"://demiart.ru/forum/index.php?showforum=89"
				},
				{
					name: 	"Форум гильдии Векторщиков",
					value:	"://demiart.ru/forum/index.php?showforum=92"
				},
				{
					name: 	"Форум гильдии NuArt",
					value:	"://demiart.ru/forum/index.php?showforum=112"
				},
				{
					name: 	"Форум гильдии Мафии",
					value:	"://demiart.ru/forum/index.php?showforum=114"
				},
				{
					name: 	"Форум гильдии Трёхмерщиков",
					value:	"://demiart.ru/forum/index.php?showforum=115"
				},
				{
					name: 	"Форум гильдии Оригиналов",
					value:	"://demiart.ru/forum/index.php?showforum=116"
				},
				{
					name: 	"Форум гильдии Фрактальщиков",
					value:	"://demiart.ru/forum/index.php?showforum=122"
				},
				{
					name: 	"Форум гильдии Комиксов",
					value:	"://demiart.ru/forum/index.php?showforum=123"
				},
				{
					name: 	"Форум гильдии Анималистов",
					value:	"://demiart.ru/forum/index.php?showforum=125"
				},
				{
					name: 	"Форум гильдии Лингвистов",
					value:	"://demiart.ru/forum/index.php?showforum=126"
				}
			]
		}
	];