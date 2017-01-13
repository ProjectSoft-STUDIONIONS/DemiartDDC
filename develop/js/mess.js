window.styleSheetWriter = (
	function () {
		var selectorMap = {},
			supportsInsertRule;	
		return {
			getSheet: (function () {
				var sheet = false;
				return function () {
					if (!sheet) {
						var style = document.createElement("style");
						style.appendChild(document.createTextNode(""));
						style.title = "DDC_StyleSheet";
						document.head.appendChild(style);
						sheet = style.sheet;
						supportsInsertRule = (sheet.insertRule == undefined) ? false : true;
					};
					return sheet;
				}
			})(),
			setRule: function (selector, property, value) {
				var sheet = this.getSheet(),
					rules = sheet.rules || sheet.cssRules;
				property = property.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
				if (!selectorMap.hasOwnProperty(selector)){
					var index = rules.length;
					if (supportsInsertRule) {
						sheet.insertRule([selector, " {", property, ": ", value, ";}"].join(""), index);
					} else {
						sheet.addRule(selector, [property, ": ", value].join(""), index);
					}
					selectorMap[selector] = index;
				} else {
					rules[selectorMap[selector]].style.setProperty(property, value);
				}
			},
			clear: function(){
				var sheet = this.getSheet();
				if(sheet.rules.length){
					while(sheet.rules.length){
						sheet.deleteRule(0);
					}
				}
				selectorMap = [];
			}
		};
	}
)();