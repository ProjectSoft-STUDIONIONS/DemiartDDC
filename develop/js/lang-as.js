/**
 * @fileoverview
 * Registers a language handler for ActionScript.
 *
 *
 * To use, include prettify.js and this file in your HTML page.
 * Then put your code in an HTML tag like
 *      <pre class="prettyprint lang-as">(my ActionScript code)</pre>
 * Based on keywords, functions, methods and types of reference taken ActionScript
 * http://help.adobe.com/ru_RU/FlashPlatform/reference/actionscript/3/index.html
 * 
 * https://github.com/ProjectSoft-STUDIONIONS/prettify/blob/master/src/lang-as.js
 *
 * @author projectsoft2009@yandex.ru or projectsoft@studionions.com
 */
PR.PR_FUNCTION="fun";
PR.registerLangHandler(
	PR.createSimpleLexer(
		[
			[PR.PR_PLAIN,/^[\t\n\r \xA0]+/,null,"\t\n\r \u00a0"],
			[PR.PR_STRING,/^(?:"(?:[^\"\\]|\\.)*"|'(?:[^\'\\]|\\.)*')/,null,"\"'"]
		],
		[
			[PR.PR_KEYWORD,/^(?:undefined|false|null|this|true|flash_proxy|object_proxy|default|xml|namespace|import|include|use|break|case|continue|do|while|else|for|in|each|if|label|return|switch|throw|try|catch|finally|with|dynamic|final|internal|native|override|private|protected|public|static|class|const|extends|function|get|implements|interface|package|set|var|as|new|void)\b/],
			[PR.PR_TYPE,/^[A-Z][_$A-Z0-9]*[a-z][\w$]*\b/,null],
			[PR.PR_TYPE,/^(\.\v)?[A-Z][_$A-Z0-9][\w$]*\b/,null],
			[PR.PR_TYPE,/^(?:(u)?int)\b/,null],
			[PR.PR_FUNCTION,/^(?:super|trace|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|isFinite|isNaN|isXMLName|parseFloat|parseInt|unescape)\b/],
			[PR.PR_COMMENT,/^\/\/[^\r\n]*/,null],
			[PR.PR_COMMENT,/^\/\*[\s\S]*?(?:.*\*\/|$)/,null],
			[PR.PR_PLAIN,/^[a-z_$][a-z_$@0-9]*/i,null],
			[PR.PR_LITERAL,/^(?:0x[a-f0-9]+|(?:\d(?:\.\d)?|\.\d\+)(?:e[+\-]?\d+)?)[a-z]*/i,null,"0123456789"]
		]
	),
	["ActionScript","as"]
);