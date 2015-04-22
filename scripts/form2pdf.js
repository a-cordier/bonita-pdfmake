/* CONSTRUCTOR */
var Form2Pdf = function(title){
	this.title = title;
	this.docDef = {
		content:[
		{
			image: this.imgToUri('logo','image/jpeg'),
			width: 150,
			margin: [10, 0, 0, 0],
			alignment: 'center'
		},
		{
			text: this.title.toUpperCase(),
			style: 'h1',
			alignment: 'center',
			margin: [70,2,70,0]
		},
		{
			margin: [0, -15, 0, 0],
			columns: [
			{ width: '*', text: '' },
			{
				width: '*',
				table: {
					widths: ['*'],
					body: [[" "], [" "]]
				},
				layout: {
					hLineWidth: function(i, node) {
						return (i === 0 || i === node.table.body.length) ? 0 : 0.5;
					},
					vLineWidth: function(i, node) {
						return 0;
					},
					hLineColor: function(i, node){
					    return '#AE2573';
					}
				}
			},
			{ width: '*', text: '' },
			]
		},
		],
		styles: {
			h1: {
				fontSize: 20,
				bold: true
			},
			h2: {
				fontSize: 18,
				bold: true,			
			},
			h3: {
				fontSize: 16,
				bold: true,			
			},
			p: {
				fontSize: 12,
				alignment: 'justify'
			}
		},
		defaultStyle: {
			fontSize: 12
		}
	};
};

/* ADDING OR SETTING A NEW STYLE DECLARATION */
Form2Pdf.prototype.style = function(name, props) {
	var style = this.docDef.styles[name]||{};
	for(var k in props){
		style[k] = props[k];
	}
	this.docDef.styles[name] = style;
	return this;
};

/* ADDING SOME CONTENT TO THE DOCUMENT */
Form2Pdf.prototype.pushContent = function(content){
	this.docDef.content.push(content);
	return this;
};

/* PARSING BONITA FORM DOCUMENT OBJECT MODEL*/
Form2Pdf.prototype.parseForm = function(){
	window.console.log('parsing');
	var self = this;
	$('[pdf-export="true"]').each(
	function(){
		self.pushLabel($(this));
		if($(this).hasClass('bonita_form_text')){
			self.pushText($(this));
		} else if ($(this).hasClass('bonita_form_table')){
			self.pushTable($(this));
		}
	});
	return this;
};

/* STROKE LABEL AS A SUBTITLE IF ANY, LINE FEED OTHERWISE */
Form2Pdf.prototype.pushLabel = function(node){
		var label = node.siblings('.bonita_form_label');
		if(!node.text().trim().length){
			this.lineFeed();
		}
		else if( label.length ) {
			this.pushContent(
			{
				text: label.text(),
				style: 'h3',
				margin: [0, 15, 0, 5]
			});
		} else { 
			this.lineFeed();
		} 
};

/* STROKE TEXT CONTENT AS A PARAGRAPH */
Form2Pdf.prototype.pushText = function(node){
	this.pushContent(
	{
		text: node.text(),
		style: 'p',
	});
};

/* STROKE A SIMPLE TABLE */
Form2Pdf.prototype.pushTable = function(node){
	var content = {table:{body:[]}}, body = content.table.body;
	var row = [];
	var th = node.find('th');
	if(th.length){
		content.table.headerRows=1;
		th.each(function(){
			row.push($(this).text());
		});
		body.push(row);
		row = [];
	}
	var tr = node.find('tr');
	tr.each(function(){
		$(this).find('td').each(function(){
			row.push($(this).text());
		});
		body.push(row);
		row = [];
	});
	this.pushContent(content);
};

/* PUT SOME ROOM SPACE BETWEEN CONTENTS */
Form2Pdf.prototype.lineFeed = function(){
	this.pushContent(
		{
			text: '',
			margin: [0, 10, 0, 0]
		});
};
/* CONVERT DOM IMG SRC TO DATA URI */
Form2Pdf.prototype.imgToUri = function(id, mime){
	var img = document.getElementById(id);
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL(mime);
};



