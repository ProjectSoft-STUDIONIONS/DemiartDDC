;
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
(function($){
	"use strict";
	/**
	** Demiart DemiColor Code
	**/
	var demiColor = {
		version: 	'7.0.1',
		autor: 		'ProjectSoft'
	},
	protocolLoc = window.location.protocol.replace(/:/gi, ""),
	$link 	= '\n[right][url=https://chrome.google.com/webstore/detail/demiart-discussion-count/jpbpbenadfnimgnmgipcbbplldlalohm]DDC '+demiColor.version+'[/url][/right]\n',
	index = 0;
	$('#titleVersion').text(demiColor.version);
	$.fn.demiColor = function(options){
		var defaults = {
			schemes : {
				'default':		{
					'str': '#FA0',
					'kwd': '#9E9',
					'com': '#008',
					'lit': '#FF0',
					'pun': '#CCC',
					'pln': '#CCC',
					'tag': '#ADE',
					'atn': '#ADE',
					'atv': '#FF0',
					'dec': '#CCC',
					'typ': '#FA0'
				},
				'as':			{
					'str': "#FA0",
					'kwd': "#9E9",
					'com': "#008",
					'lit': "#FF0",
					'pun': "#CCC",
					'pln': "#CCC",
					'tag': "#ADE",
					'atn': "#ADE",
					'atv': "#FF0",
					'dec': "#CCC",
					'typ': "#0FF",
					'fun': "#AF0"
				}
			},
			langs 	: {
				html: 			{title: 'HTML', 		scheme: 'default'},
				css: 			{title: 'CSS', 			scheme: 'default'},
				js: 			{title: 'JavaScript', 	scheme: 'default'},
				php:			{title: 'PHP', 			scheme: 'default'},
				sql: 			{title: 'SQL', 			scheme: 'default'},
				as: 			{title: 'ActionScript', scheme: 'as'},
				cc: 			{title: 'C#', 			scheme: 'default'}
			},
			maxRow 	: 50
		},
		o = $.extend({}, defaults, options || {}),
		getItemsLang = function(lang){
			var wrapp = $("<div>",
					{
						class: "ddc-codes-wrapper"
					}),
				list = $("<ul>",
					{
						class: "ddc-code-langs"
					}),
				ins = $("<div>", {
					class: "ddc-result-insert"
				}).append(
					$("<input>", {
						class: "ddc-insert ddc-btn",
						value: "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0432 \u043f\u043e\u0441\u0442",
						type: "button",
						disabled: "disabled"
					})
				),
				calc = $("<div>", {
					class: "ddc-result-calc",
				}).append("\u0414\u043b\u0438\u043d\u0430: ").append(
					$("<span>", {
						text: "0"
					})
				).append(" \u0441\u0438\u043c\u0432.");
					
			for(var s in o.langs){
				var active = s==lang ? ' active' : '';
				list.append(
					$("<li>", {
						class: "ddc-item-lang"+active
					}).append(
						$("<a>", {
							class: "ddc-lang"+active,
							href: "javascript:;",
							"data-lang": s,
							"data-scheme": o.langs[s]['scheme'],
							text: o.langs[s]['title']
						})
					)
				);
			};
			return wrapp.append(list).append(ins).append(calc).append($("<div>", {class: "ddc-clr"}));
		},
		getSourceWrapp = function(){
			return $("<div>", {
				class: "ddc-source-wrapper"
			}).append($("<textarea>", {
				class: "ddc-source"
			}));
		},
		getResultWrapp = function(ind){
			return $("<div>", {
				class: "ddc-result-wrapper"
			}).append(
				$("<code>", {
					id: "ddc-result-"+ind,
					class: "ddc-result",
					contenteditable: "false"
				})
			).append(
				$("<div>", {
					class: "wait"
				})
			);
		},
		getCodeWrapp = function(){
			return $("<div>", {
				class: "ddc-getcode-wrapper"
			}).append(
				$("<button>", {
					class: "ddc-button-code ddc-btn",
					text: "\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043a\u043e\u0434"
				})
			);
		},
		getPrevWrapp = function(lang){
			return $("<div>", {
				class: "ddc-preview-wrapper"
			}).append(
				$("<div>", {
					class: "ddc-hide-code closed hide"
				}).append(
					$("<strong>").append(
						$("<span>").append("[&nbsp;")
					).append(
						$("<span>", {
							class: "ddc-wore-code",
							text: "\u0440\u0430\u0437\u0432\u0435\u0440\u043d\u0443\u0442\u044c"
						})
					).append(
						$("<span>").append("&nbsp;]")
					).append("&nbsp;")
				)
			).append(
				//'<code calss="ddc-preview lang-"'+lang+' prettyprint>\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440</code>'
				$('<code>', {
					class: "ddc-preview prettyprint lang-"+lang,
					text: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440"
				})
			);
		},
		getTemplate = function (pref, lng, ind){
			var $ddcSelf = $("<div>", {
				class: 'demiColor '+pref
			}).append(
				getItemsLang(lng)
			).append(
				getSourceWrapp()
			).append(
				getResultWrapp(ind)
			).append(
				$("<div>", {
					class:"ddc-clr"
				})
			).append(
				getCodeWrapp()
			).append(
				getPrevWrapp(lng)
			);
			return $ddcSelf;
		},
		getStyleShema = function(prefs,schemaName){
			var syleText = '',
			scheme = o.schemes[schemaName];
			window.styleSheetWriter.clear();
			for(var s in scheme){
				window.styleSheetWriter.setRule("."+prefs+" .ddc-preview span."+s, "color", scheme[s]);
			}
			//return syleText;
		};
		
		return $(this).each(function(){
			++index;
			
			if($(this).data('demiColor')) return $(this);
			var $codeLang = 'html',
			rowsCount = 0,
			ti = index,
			$stylePrefs = 'ddc-style-'+index,
			$self = $(this).data('demiCOlor', demiColor).append(
				getTemplate($stylePrefs, $codeLang, ti)
			),
			$source 	= $self.find('textarea.ddc-source'),
			$result 	= $self.find('code.ddc-result'),
			$wait 		= $self.find('div.wait'),
			$preview 	= $self.find('code.ddc-preview'),
			$codeLength = $self.find('.ddc-result-calc span'),
			$insertBlock = $self.find('.ddc-result-insert'),
			$insertPost = $self.find('input.ddc-insert'),
			$codemirror = CodeMirror.fromTextArea($source[0], {
							theme:"ddc-codemirror",
							lineNumbers: true,
							dragDrop: true,
							indentWithTabs: true,
							styleActiveLine: true,
							lineWrapping: true,
							fixedGutter: false
			}),
			getCode 	= function(){
				$result.text('');
				$insertPost.attr('disabled','disabled');
				$preview.text($result.text('').text());
				$codeLength.text('0');
				$self.find('.ddc-hide-code').removeClass('show').addClass('hide');
				$preview.html("\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440");
				var s = $codemirror.doc.getValue();
				if($.trim(s).length){
					$wait.fadeIn(500,
						function(){
							s = s.replace(/\[color=[^\]]+\]/g, "").replace(/\[\/color]/g, "")
							.replace(/[\t]/g, "\xA0\xA0\xA0\xA0")
							.replace(/[<>]/gmi, function (p){return (p == '<') ? '&lt;' : '&gt;'})
							.replace(/\x0D/g, '<br />');
							rowsCount = 0;
							$preview.removeClass('prettyprinted').empty().append(s);
							prettyPrint();
							var a = $preview.html().replace(/<span class="dec">?(.+?)<\/span>/gmi,function(g1,g2){return g2;})
							.replace(/<span class="pln">?(.+?)<\/span>/gmi,function(g1,g2){return g2;})
							.replace(/<span class="pun">?(.+?)<\/span>/gmi,function(g1,g2){return g2;})
							.replace(/<span class="?(\w+)"?>/gmi, function (c1, c){return "[color=" + o.schemes[o.langs[$codeLang]['scheme']][c] + "]"})
							.replace(/<\/span>/gmi, "[/color]"),
							//.replace(/\[color=[^\]]+\]\s\[\/color\]/gmi, " "),
							b = a.match(/<br>/gmi);
							(b!=null||undefined) && (rowsCount = b.length);
							$self.find('.ddc-hide-code').addClass((rowsCount>10) ? 'show' : 'hide');
							a = "[quote=" + o.langs[$codeLang]['title'] + "]\n" + a + $link + "[/quote]";
							rowsCount > o.maxRow && (a = "[color=yellow]\u041a\u043e\u0434 " +o. langs[$codeLang]['title'] + ":[/color][more]" + a + "[/more]");
							$result.empty().append(a);
							$codeLength.text($result.text().length);
							var range,
								selection;
							if (document.body.createTextRange) {
								range = document.body.createTextRange();
								range.moveToElementText($result[0]);
								range.select();
							} else if (window.getSelection) {
								selection = window.getSelection();
								range = document.createRange();
								range.selectNodeContents($result[0]);
								selection.removeAllRanges();
								selection.addRange(range);
							}
							$(this).fadeOut(500,function(){$insertPost.removeAttr('disabled');});
						}
					);
				}
				return !1;
			},
			insertResultPost = function() {
				var a = $("textarea[name=Post]")[0],
					e = $result[0].innerText,
					c = a.textLength,
					h = a.scrollTop,
					b = a.selectionStart,
					f = a.selectionEnd,
					g = a.value.substring(0, b),
					d = a.value.substring(b, f),
					c = a.value.substring(f, c);
				b != f ? (d = e + d, a.value = g + d + c, a.selectionStart = b, a.selectionEnd = b + d.length) : (a.value = g + e + c, b += e.length, a.selectionStart = b, a.selectionEnd = b);
				a.scrollTop = h;
				a.focus();
				return!1;
			},
			$links = $self.find('li.ddc-item-lang a').click(function(){
				var l = $codeLang;
				$links.parent().removeClass('active');
				$links.removeClass('active');
				$(this).parent().addClass('active');
				$codeLang 	= $(this).addClass('active').data('lang');
				$preview.removeClass('lang-'+l).addClass('lang-'+$codeLang);
				getStyleShema($stylePrefs, $(this).data('scheme'));
				getCode();
				return !1;
			});
			getStyleShema($stylePrefs, o.langs[$codeLang]['scheme']);
			$self.bind('ddcfocus', function(){
				$codemirror.doc.cm.focus();
			});
			//$insertBlock.hide();
			$self.find('.ddc-hide-code').click(function(){
				$(this).hasClass('closed') ? ($(this).removeClass('closed').addClass('open').find('span.ddc-wore-code').text('\u0441\u0432\u0435\u0440\u043d\u0443\u0442\u044c'), $preview.css({'max-height':'none'})) : ($(this).removeClass('open').addClass('closed').find('span.ddc-wore-code').text('\u0440\u0430\u0437\u0432\u0435\u0440\u043d\u0443\u0442\u044c'),$preview.removeAttr('style'));
			})
			$self.find('button.ddc-button-code').click(getCode);
			$insertPost.click(insertResultPost);
			return $self;
		});
	};
}(window.jQuery || window.$));
(function(){
	var ddcwindow = "DemiColor"
	if($(document).data('DemiColor') == ddcwindow) return;
	$(document).data('DemiColor', ddcwindow);
	var $getBtn = $('input[name=CODE_]') || $('input[name=MEDIA]') || $('input[name=img]'),
	btnDDC = '<span id="ddc-button-demicolor"> <input type="button" value=" '+ddcwindow+' CODE " class="codebuttons '+ddcwindow+' recinput"> </span>',
	$postComment = $('textarea[name=Post]'),
	$ddcFrame;
	($postComment.length && $getBtn.length && $("#DemiColor").length == 0) && (
		$getBtn.after(btnDDC),
		$ddcFrame = $('<div />', {'id':ddcwindow}).css({'border':'border:1px outset #DDD','margin-top':'18px'}),
		// Определить место вставки в зависимости от url страницы
		$(".dropzone").length ? $(".dropzone").after($ddcFrame) : $postComment.after($ddcFrame),
		
		$ddcFrame.demiColor(),
		$('#ddc-button-demicolor input').click(function(){
			$ddcFrame.toggle().is(':visible') ? $ddcFrame.trigger('ddcfocus') : $postComment.focus();
			return !1;
		}),
		$("#scrolldown").unbind("click").click(function(e){
			e.preventDefault();
			window.scrollTo(0, $($("body")[0]).height());
			console.log($(".post_hr").length-2);
			return !1;
		}),
		$(".chat2.qms").css({
			"min-width" : "829px"
		}),
		setTimeout(function(){$ddcFrame.hide();}, 50)
	);
}());