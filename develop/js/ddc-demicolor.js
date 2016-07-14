;
(function($){
	"use strict";
	/**
	** Demiart DemiColor Code
	**/
	var demiColor = {
		version: 	'1.0.2',
		autor: 		'ProjectSoft'
	},
	protocolLoc = window.location.protocol.replace(/:/gi, ""),
	//[url=" + protocolLoc + "://demiart.ru/forum/index.php?showtopic=231647&view=getlastpost]DDC 4.5[/url] [color=#E7AA11]&[/color] 
	$link 	= '\n[right][url=http://demicolor.demiart.ru/]DemiColor '+demiColor.version+'[/url][/right]\n',
	$enc 	= $(document.createElement('div')),
	index = 0;
	$('#titleVersion').text(demiColor.version);
	$.fn.demiColor = function(options){
		var defaults = {
			schemes : {
				'default':		{'str': '#FA0','kwd': '#9E9','com': '#008','lit': '#FF0','pun': '#CCC','pln': '#CCC','tag': '#ADE','atn': '#ADE','atv': '#FF0','dec': '#CCC','typ': '#FA0'},
				'as':			{'str': "#FA0",'kwd': "#9E9",'com': "#008",'lit': "#FF0",'pun': "#CCC",'pln': "#CCC",'tag': "#ADE",'atn': "#ADE",'atv': "#FF0",'dec': "#CCC",'typ': "#0FF",'fun': "#AF0"}
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
			var lan = '';
			for(var s in o.langs){
				var active = s==lang ? ' active' : '';
				lan += '<li class="ddc-item-lang'+active+'"><a class="ddc-lang'+active+'" href="#'+s+'" data-lang="'+s+'" data-scheme="'+o.langs[s]['scheme']+'">'+o.langs[s]['title']+'</a></li>';
			};
			return lan;
		},
		getStyleShema = function(prefs,schemaName){
			var syleText = '', scheme = o.schemes[schemaName];
			for(var s in scheme){
				syleText += "."+prefs+" .ddc-preview span."+s+"{color: "+scheme[s]+";}\n";
			}
			return syleText;
		};
		
		return $(this).each(function(){
			++index;
			if($(this).data('demiColor')) return $(this);
			var $codeLang = 'html',
			rowsCount = 0,
			ti = index,
			$stylePrefs = 'ddc-style-'+index,
			$self = $(this).data('demiCOlor', demiColor).html(
'<div class="demiColor '+$stylePrefs+'">'+
	'<div class="ddc-codes-wrapper">'+
		'<ul class="ddc-code-langs">'+getItemsLang($codeLang)+
		'</ul>'+
		'<div class="ddc-result-insert"><input class="ddc-insert ddc-btn" value="\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0432 \u043f\u043e\u0441\u0442" type="button" disabled="disabled" /></div>'+
		'<div class="ddc-result-calc">\u0414\u043b\u0438\u043d\u0430: <span>0</span> \u0441\u0438\u043c\u0432.</div>'+
		'<div class="ddc-clr"></div>'+
	'</div>'+
	'<div class="ddc-source-wrapper">'+
		'<textarea class="ddc-source"></textarea>'+
	'</div>'+
	'<div class="ddc-result-wrapper">'+
		'<code id="ddc-result-'+ti+'" class="ddc-result" contenteditable="false"></code>'+
		'<div class="wait"></div>'+
	'</div>'+
	'<div class="ddc-clr"></div>'+
	'<div class="ddc-getcode-wrapper">'+
		'<button class="ddc-button-code ddc-btn">\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043a\u043e\u0434</button>'+
	'</div>'+
	'<div class="ddc-preview-wrapper">'+
		'<div class="ddc-hide-code closed hide"><strong><span>[&nbsp;</span><span class="ddc-wore-code">\u0440\u0430\u0437\u0432\u0435\u0440\u043d\u0443\u0442\u044c</span><span>&nbsp;]</span>&nbsp;</strong></div>'+
		'<code class="ddc-preview lang-'+$codeLang+' prettyprint">\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440</code>'+
	'</div>'+
	'<style>'+getStyleShema($stylePrefs, o.langs[$codeLang]['scheme'])+'</style>'+
'</div>'
			),
			$source 	= $self.find('textarea.ddc-source'),
			$result 	= $self.find('code.ddc-result'),
			$wait 		= $self.find('div.wait'),
			$preview 	= $self.find('code.ddc-preview'),
			$style 		= $self.find('style'),
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
							$preview.removeClass('prettyprinted').html(s);
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
							$result.html(a);
							$codeLength.text($result.text().length);
							var e = $result[0];
							if(window.getSelection){
								var s1 = window.getSelection();
								if(s1.setBaseAndExtent){
									s1.setBaseAndExtent(e,0,e,e.innerText.length-1);
								}else{
									var r = document.createRange();
									r.selectNodeContents(e);
									s1.removeAllRanges();
									s1.addRange(r);
								}
							}else if(document.getSelection){
								var s1 = document.getSelection();
								var r  = document.createRange();
								r.selectNodeContents(e);
								s1.removeAllRanges();
								s1.addRange(r);
							}else if(document.selection){
								var r = document.body.createTextRange();
								r.moveToElementText(e);
								r.select();
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
				var l 		= $codeLang;
				$links.parent().removeClass('active');
				$links.removeClass('active');
				$(this).parent().addClass('active');
				$codeLang 	= $(this).addClass('active').data('lang');
				$preview.removeClass('lang-'+l).addClass('lang-'+$codeLang);
				$style.remove();
				$self.append('<style>'+getStyleShema($stylePrefs, $(this).data('scheme'))+'<style>');
				$style 		= $self.find('style');
				getCode();
				return !1;
			});
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
	var $getBtn = $('a[href="javascript:closeall();"], a[onclick="javascript:closeall();"]').length ?  $('a[href="javascript:closeall();"], a[onclick="javascript:closeall();"]') : $('input[value=CODE]'),
	btnDDC = '<span id="ddc-button-demicolor">&nbsp;<input type="button" value="'+ddcwindow+'" class="codebuttons '+ddcwindow+' recinput">&nbsp;&nbsp;</span>',
	$postComment = ($('textarea[name=Post] ~ span').length) ? $('textarea[name=Post] ~ span') : $('textarea[name=Post]'),
	$ddcFrame;
	($postComment.length && $getBtn.length) && (
		($getBtn.selector=='input[value=CODE]') ? $getBtn.after(btnDDC) : $getBtn.before(btnDDC),
		$ddcFrame = $('<div />', {'id':ddcwindow}).css({'border':'border:1px outset #DDD','margin-top':'18px'}),
		$postComment.after($ddcFrame),
		$ddcFrame.demiColor(),
		$('#ddc-button-demicolor input').click(function(){
			$ddcFrame.toggle().is(':visible') && $ddcFrame.trigger('ddcfocus');
			return !1;
		}),
		setTimeout(function(){$ddcFrame.hide();}, 50)
	)
}());