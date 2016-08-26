
function Star(declination, ascension, brightness, color, name) {
	this.declination = 0;
	this.brightness = brightness;
	this.ascension = 0;
	this.color = color.map(function(c) { return Math.floor(c); });
	
	this.modifyAscension(ascension);
	this.modifyDeclination(declination);
	
	this.name = null;
	this.labelled = false;
	
	if(this.brightness > 8) {
		this.setName(name);
	}
}

Star.prototype.modifyAscension = function(x) {
	this.ascension += x;
	this.ascension = this.ascension % 360;
	this.hemisphere = this.ascension < 180 ? 0 : 1;
};
Star.prototype.modifyDeclination = function(y) {
	this.declination += y + 90;
	this.declination = this.declination % 180;
	this.declination -= 90;
	
	this.demisphere = this.declination > 0 ? 0 : 1;
};

Star.prototype.setName = function(name) {
	if(typeof name == "string")
		this.name = name;
	else if (typeof name == "undefined")
		this.name = "";
	else if (name == null)
		this.name = "";
	else if (typeof name == "function")
		this.name = name();
	
	if(this.name.length > 0)
		this.labelled = true;
}

Star.prototype.getRenderingColors = function() {
	//return this.colors.join(',');
	
	var tilt = .6;
	if(this.brightness > 3)
		tilt = .85;
	if(this.brightness > 5)
		tilt = 1;
	
	
	var colors = '';
	var b = this.brightness;
	this.color.forEach(function(c) {
		//var minimumBrightness = .75;
		//colors += Math.floor(c * Math.pow(minimumBrightness + ((1 - minimumBrightness) * (b / 10)), 2)).toString();
		//colors += Math.floor(c * minimumBrightness + ((1 - minimumBrightness) * (b / 10))).toString();
		
		colors += Math.floor(c * tilt).toString();
		colors += ','
	});
	colors = colors.substring(0, colors.length - 1);
	
	return colors;
	
}

Star.prototype.render = function(context, hemisphere) {
	if(!hemisphere.renderStar(this))
		return;
	/*
	*/
	context.fillStyle = 'rgb(' + this.getRenderingColors() + ')';
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 0;
	context.shadowColor = "rgba(" + this.color.join(',') + ",255)"; 
	
	var coords = hemisphere.translate(this.ascension, this.declination);
	
	var d = 1;
	
	if(this.brightness > 6) {
		d = 1.5;
	}
	if(this.brightness > 7)
		context.shadowBlur = 3;
	if(this.brightness > 8) {
		d = 2;
	}
	if(this.brightness > 7)
		context.shadowBlur = this.brightness / 2;
	
	context.fillRect(coords.x, coords.y, d, d);
	
	context.shadowBlur = 0;
	
	if(this.name == null || this.name == "")
		return;
	
	if(hemisphere.text(this.name, coords.x, coords.y + 10, 8))
		this.labelled = true;
}