const DemiColor = function(){
	let el1 = document.getElementById('DemiColor_BTN'),
		el2 = document.getElementById('DemiColor_CODE');
	el1 && el1.remove();
	el2 && el2.remove();
	this.schemes = {};
	this.schemes.default = {
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
	};
	this.version = '3.0.0';
	this.status = false;
	this.post = this.resourcer = this.preview = this.result = this.btn = this.btndiv = null;
	this.tplDiv = document.createElement('div');
	this.tplDiv.setAttribute('id','DemiColor_CODE');
	this.tplDiv.classList.add('demicolor_wrapper');
	this.tplDiv.setAttribute('style','margin-top: 18px;');
	this.tplDiv.innerHTML = `
	<div class="demiColor ddc-style-1">
		<div class="ddc-codes-outer order-1">
			<ul class="ddc-code-langs">
				<li class="ddc-item-lang">
					<span class="ddc-lang active" data-lang="html">HTML</span>
				</li>
				<li class="ddc-item-lang">
					<span class="ddc-lang" data-lang="css">CSS</span>
				</li>
				<li class="ddc-item-lang">
					<span class="ddc-lang" data-lang="js">JavaScript</span>
				</li>
				<li class="ddc-item-lang">
					<span class="ddc-lang" data-lang="php">PHP</span>
				</li>
				<li class="ddc-item-lang">
					<span class="ddc-lang" data-lang="sql">SQL</span>
				</li>
				<li class="ddc-item-lang">
					<span class="ddc-lang" data-lang="as">ActionScript</span>
				</li>
				<li class="ddc-item-lang">
					<span class="ddc-lang" data-lang="py">Python</span>
				</li>
			</ul>
			<div class="ddc-source-wrapper">
				<textarea class="ddc-source"></textarea>
			</div>
		</div>
		<div class="ddc-codes-outer order-2">
			<div class="ddc-codes-wrapper ddc-codes-outer-button">
				<div class="ddc-result-insert">
					<input class="ddc-insert codebuttons" value="Вставить в пост" type="button" disabled="disabled">
				</div>
				<div class="ddc-result-calc">Длина: <span>0</span> симв.</div>
			</div>
			<div class="ddc-result-wrapper ddc-codes-outer-result">
				<code id="ddc-result-1" class="ddc-result" contenteditable="false"></code>
			</div>
		</div>
		<div class="ddc-preview-wrapper order-4">
			<code id="QUOTE" class="ddc-preview prettyprint lang-html"></code>
		</div>
	</div>`;

};
DemiColor.prototype.add = function(){
	var self = this;
	if(!self.status && !self.post){
		self.post = document.getElementsByName('Post')[0];
		if(self.post){
			self.btn = document.createElement('input');
			self.btndiv = document.createElement('div');
			self.btndiv.id = 'DemiColor_BTN'
			self.btndiv.classList.add('qr-nav');
			self.btn.classList.add('codebuttons');
			self.btn.value = "DemiColor Code";
			self.btn.setAttribute('style', 'font-weight: bold;');
			self.btn.type = 'button';
			self.btndiv.append(self.btn);

			self.post.before(self.btndiv);

			self.codeType = 'html';
			self.codeLang = self.codeType.toUpperCase();

			self.codeDiv = self.tplDiv.cloneNode(true);
			self.post.closest('td').append(self.codeDiv);
			self.insert = self.codeDiv.getElementsByClassName('ddc-insert')[0];
			self.editor = CodeMirror.fromTextArea(self.codeDiv.getElementsByClassName('ddc-source')[0], {
				lineNumbers: true,
				mode: "text/plain",
				matchBrackets: true,
				indentWithTabs: true
			});

			self.result = document.getElementById('ddc-result-1');
			self.preview = self.codeDiv.getElementsByClassName('ddc-preview')[0];

			self.editor.doc.cm.on('change', function(e, i){
				self.parse();
			});
			self.btn.addEventListener('click', function(e){
				e.preventDefault();
				self.codeDiv.classList.contains('hidden') ? self.codeDiv.classList.remove('hidden') : self.codeDiv.classList.add('hidden');
				return !1;
			});
			self.insert.addEventListener('click', function(e){
				e.preventDefault();
				if(self.result.textContent.length){
					let post = self.post,
						text = self.result.textContent,
						postLen = post.textLength,
						scrollTop = post.scrollTop,
						postSelStart = post.selectionStart,
						postSelEnd = post.selectionEnd,
						textSelStart = post.value.substring(0, postSelStart),
						textSelEnd = post.value.substring(postSelStart, postSelEnd);
					postVal = post.value.substring(postSelEnd, postLen);
					postSelStart != postSelEnd ? (textSelEnd = text + textSelEnd, post.value = textSelStart + textSelEnd + postVal, post.selectionStart = postSelStart, post.selectionEnd = postSelStart + textSelEnd.length) : (post.value = textSelStart + text + postVal, postSelStart += text.length, post.selectionStart = postSelStart, post.selectionEnd = postSelStart);
					post.scrollTop = scrollTop;
					post.focus();
				}
				return !1;
			})
			self.btnLang = self.codeDiv.getElementsByClassName('ddc-lang');
			Array.from(self.btnLang).forEach(btn => {
				btn.addEventListener('click', function(e){
					e.preventDefault();
					Array.from(self.btnLang).forEach(item => {
						item.classList.remove('active');
						self.preview.classList.remove('lang-' + item.getAttribute('data-lang'));
					});
					this.classList.add('active');
					self.preview.classList.remove('prettyprinted');
					self.preview.classList.add('lang-' + this.getAttribute('data-lang'));
					self.codeLang = this.textContent;
					/** Run Parser **/
					self.parse();
					return !1;
				});
			});
			setTimeout(()=>{self.codeDiv.classList.add('hidden')}, 10);
		}
	}
	self.status = true;
	return self;
};
DemiColor.prototype.remove = function(msg = false){
	var self = this;
	function remove(){
		self.btn && self.btn.remove();
		self.btndiv && self.btndiv.remove();
		self.codeDiv && self.codeDiv.remove();
		self.post = 
		self.btn = 
		self.btndiv = 
		self.editor = 
		self.btnLang =
		self.preview = null;
		self.status = false;
	}
	if(msg){
		remove();
		return;
	}
	if(self.status && self.post){
		remove();
	}
	self.status = false;
	return self;
};
DemiColor.prototype.parse = function(){
	var self = this;
	if(self.status && self.post && self.editor) {
		let str = self.editor.doc.getValue()
			.replace(/[\t]/g, "\xA0\xA0\xA0\xA0")
			.replace(/[<>]/gmi, function (p){return (p == '<') ? '&lt;' : '&gt;'})
			.replace(/\n\r?/g, '<br>');
		self.preview.innerHTML = self.result.innerHTML = '';
		self.preview.innerHTML = str;
		self.preview.classList.remove('prettyprinted');
		prettyPrint();
		str = self.preview.innerHTML.replace(/<span class="dec">?(.+?)<\/span>/gmi,function(g1, g2){return g2;})
			.replace(/<span class="pln">?(.+?)<\/span>/gmi,function(g1, g2){return g2;})
			.replace(/<span class="pun">?(.+?)<\/span>/gmi,function(g1, g2){return g2;})
			.replace(/<span class="?(\w+)"?>/gmi, function (g1, g2){return "[color=" + self.schemes.default[g2] + "]"})
			.replace(/<\/span>/gmi, "[/color]");
		if(str.length){
			str = "[quote=" + self.codeLang + "]" + str + "[/quote]";
			self.result.innerHTML = str;
			self.insert.removeAttribute('disabled');
		}else{
			self.result.innerHTML = self.preview.innerHTML = '';
			self.insert.setAttribute('disabled', 'disabled');
		}
	}
}