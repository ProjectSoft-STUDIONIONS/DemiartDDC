window.HELPER = {
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
window.OPTIONS = {
		get: function(key, defValue, typeValue){
			var val = (typeof localStorage[key] == "undefined" || typeof localStorage[key] == "null") ? HELPER.pack(defValue) : localStorage[key];
			val = HELPER.unpack(val) == null ? defValue : HELPER.unpack(val);
			switch (typeValue){
				case 'number':
					if(HELPER.isNull(val) || HELPER.isEmpty(val))
						val = 0;
					if(!HELPER.isNumber(val))
						val = parseFloat(val);
					this.set(key, val);
					break;
				case 'boolean':
					val = (HELPER.isBoolean(val)) ? val : (defValue ? true : false);
					this.set(key, val);
					break;
				case 'object':
				case 'array':
					val = HELPER.isObject(val) || HELPER.isArray(val) ? val : (typeValue == "array" ? [] : {});
					this.set(key, val);
					break;
				default:
					this.set(key, val);
					break;
			}
			return val;
		},
		set: function(key, value){
			value = HELPER.pack(value);
			localStorage[key] = value;
		}
	};