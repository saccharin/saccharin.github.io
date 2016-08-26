function Demisphere(context, x0, y0, radius) {
	Hemisphere.call(this, context, x0, y0, radius);
}
Demisphere.prototype = new Hemisphere();
Demisphere.prototype.constructor = Demisphere;

Demisphere.prototype.labelStar = function(star, coords){
	if(star.labelled)
		this.text(star.name,coords.x, coords.y + 10, 8);
};

Demisphere.prototype.subc = function(d) {
	var points = [];
	var p = new Path2D();
	for(var i = 0;i<360;i+=5) {
		points.push(this.translate(i,d));
	}
	points.push(this.translate(359.99,d));
	
	p.moveTo(points[0].x, points[0].y);
	for(i=1;i<points.length;i++){
		p.lineTo(points[i].x, points[i].y);
	}
	
	this.context.stroke(p);
	p=null;
};

Demisphere.prototype.translate = function(ascension,declination) {
	// north polar stereographic azimuth projection
	var longitude = ascension / 180 * Math.PI;
	var latitude = declination / 180 * Math.PI;
	
	var ox = Math.PI / 2;
	var oy = 0;
	
	//var q = 1 / (1 + Math.cos(latitude) * Math.cos(longitude - ox));
	var q = Math.tan(Math.PI/4 - latitude/2);
		
	var x = q * Math.sin(longitude - ox);
	var y = -1 * q * Math.cos(longitude - ox);
	
	x *= this.radius;
	y *= this.radius;
	
	x += this.x;
	y = this.y - y;
		
	return { 
		x : x,
		y : y
	};
};

Demisphere.prototype.render = function() {
	ctx.lineWidth = 4;
	this.context.strokeStyle = 'rgba(0,0,0,.5)';
	this.context.beginPath();
	this.context.arc(this.x +3, this.y +3, this.radius + 1, 0, Math.PI*2, true);
	this.context.stroke();
	
	ctx.lineWidth = .5;
	
	this.context.strokeStyle = 'rgba(255,255,255,.6)';
	
	this.subc(15);
	this.subc(30);
	this.subc(45);
	this.subc(60);
	this.subc(75);

	this.context.setLineDash([]);
	ctx.lineWidth = 1;
	
	ctx.lineWidth = 1;
	this.context.strokeStyle = 'rgba(255,180,0,.5)';
	var globe = new Path2D();
	globe.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
	this.context.stroke(globe);
	 
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

Demisphere.prototype.renderStar = function(star) {
	if(star.brightness > 3)
		return true;
	
	return false;
};