function Hemisphere(context, x0, y0, radius) {
	this.context = context;
	this.x = x0;
	this.y = y0;
	this.radius = radius;
}

Hemisphere.prototype.labelStar = function(star, coords){
	if(this.text(star.name,coords.x, coords.y + 10, 8))
		star.labelled = true;
};

Hemisphere.prototype.subc = function(d) {
	var points = [];
	var p = new Path2D();
	for(var i = 0;i<180;i+=5) {
		points.push(this.translate(i,d));
	}
	points.push(this.translate(179.99,d));
	
	p.moveTo(points[0].x, points[0].y);
	for(i=1;i<points.length;i++){
		p.lineTo(points[i].x, points[i].y);
	}
	
	this.context.stroke(p);
	p=null;
};

Hemisphere.prototype.translate = function(ascension,declination) {
	// equatorial stereographic azimuth projection
	var longitude = (ascension % 180) / 180 * Math.PI;
	var latitude = declination / 180 * Math.PI;
	
	var ox = Math.PI / 2;
	var oy = 0;
	
	var q = 1 / (1 + Math.cos(latitude) * Math.cos(longitude - ox));
		
	var x = q * Math.cos(latitude) * Math.sin(longitude - ox);
	var y = q * Math.sin(latitude);
	
	x *= this.radius;
	y *= this.radius;
	
	x += this.x;
	y = this.y - y;
		
	return { 
		x : x,
		y : y
	};
};

Hemisphere.prototype.render = function() {
	ctx.lineWidth = 6;
	this.context.strokeStyle = 'rgba(0,0,0,.5)';
	this.context.beginPath();
	this.context.arc(this.x +3, this.y +3, this.radius + 1, 0, Math.PI*2, true);
	this.context.stroke();

	var c = new Path2D();
	c.moveTo(this.x - this.radius, this.y+3);
	c.lineTo(this.x + this.radius, this.y+3);
	this.context.stroke(c);
	
	ctx.lineWidth = .5;
	
	this.context.strokeStyle = 'rgba(255,255,255,.6)';
	
	this.subc(15);
	this.subc(30);
	this.subc(45);
	this.subc(60);
	this.subc(75);
	
	this.subc(-15);
	this.subc(-30);
	this.subc(-45);
	this.subc(-60);
	this.subc(-75);
	
	ctx.lineWidth = 1;
	this.context.strokeStyle = 'rgba(255,180,0,.5)';
	c = new Path2D();
	c.moveTo(this.x - this.radius, this.y-2);
	c.lineTo(this.x + this.radius, this.y-2);
	this.context.stroke(c);
	
	c = new Path2D();
	c.moveTo(this.x - this.radius, this.y+2);
	c.lineTo(this.x + this.radius, this.y+2);
	this.context.stroke(c);
	
	ctx.lineWidth = 2;
	c = new Path2D();
	this.context.setLineDash([5]);
	c.moveTo(this.x - this.radius, this.y);
	c.lineTo(this.x + this.radius, this.y);
	this.context.stroke(c);
	
	this.context.setLineDash([]);
	ctx.lineWidth = 1;
	
	ctx.lineWidth = 1;
	this.context.strokeStyle = 'rgba(255,180,0,.5)';
	var globe = new Path2D();
	globe.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
	this.context.stroke(globe);
	
	this.context.beginPath();
	this.context.setLineDash([5]);
	this.context.arc(this.x, this.y, this.radius + 1, 0, Math.PI*2, true);
	this.context.stroke();
	
	this.context.beginPath();
	this.context.setLineDash([]);
	this.context.arc(this.x, this.y, this.radius + 2, 0, Math.PI*2, true);
	this.context.stroke();
	
	this.context.beginPath();
	this.context.strokeStyle = 'rgba(255,180,0,.2)';
	this.context.arc(this.x, this.y, this.radius + 8, 0, Math.PI*2, true);
	this.context.stroke();
	
	this.context.setLineDash([]);
	ctx.lineWidth = 1;
	
};

Hemisphere.prototype.texts = [];
Hemisphere.prototype.text = function(text, x, y, size) {
	size = size || 8;
	ctx.font = size.toString() + "px 'Arimo'";
	ctx.textAlign = 'center';
	this.context.shadowColor = "rgba(0, 0, 0, 1)";
	//this.context.shadowBlur = 5;
	var m = this.texts.filter(function(r) { return Math.abs(r.x - x) < 35 && Math.abs(r.y - y) < 12; });
	
	// Check if this name is colliding with another name
	//if(m.length > 0)
	//	return false;
	
	ctx.fillStyle = 'rgba(0,0,0,.8)';
	ctx.fillText(text, x+1, y+1);
	ctx.fillText(text, x+1, y-1);
	ctx.fillText(text, x-1, y+1);
	ctx.fillText(text, x-1, y-1);
	ctx.fillStyle = 'rgba(230,240,255,1)';
	ctx.fillText(text, x, y);
	this.texts.push({x:x,y:y});
	return true;
};
 
Hemisphere.prototype.renderStar = function(star) {
	return true;
};
