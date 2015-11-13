//"use strict";

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//log('Welcome');

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function Star(declination, ascension, brightness, color){
	this.declination = declination;
	this.brightness = brightness;
	this.ascension = ascension;
	this.color = color.map(function(c) { return Math.floor(c); });
	this.hemisphere = this.ascension < 180 ? 0 : 1;
	this.name = null;
	this.labelled = false;
	
	if(this.brightness > 6.5) {
		this.name = buildName();
	}
}
// http://fantasynamegenerators.com/#fantasyNames
var seeds = [
"Omniel",
"Ambriel",
"Sopheriel",
"Charmeine",
"Pahaliah",
"Karlel",
"Hayyel",
"Theliel",
"Cathetel",
"Nahaliel",
"Tolthe",
"Tanithil",
"Ethlando",
"Durothil",
"Ailmon",
"Folmar",
"Aithlin",
"Gormer",
"Pelleas",
"Larrence",
"Leviye",
"Jastin",
"Damaris",
"Graeme",
"Fynnegun",
"Briyan",
"Paxt",
"Yos",
"Weyland-Yutani"
];
var posts = [
'\u03b1',
'\u03b2',
'\u03b3',
'\u03b4',
'\u03b5',
'\u03b6',
'\u03b7',
'\u03b8',
'\u03b9',
]
function buildName() {
	var index = Math.floor(Math.random() * seeds.length);
	var name = seeds[index];
	//seeds.splice(index,1);
	if(Math.random() > .70)
		name += ' ' + posts[Math.floor(Math.random() * posts.length)];
	return name;
};


function Hemisphere(context, x0, y0, radius) {
	this.context = context;
	this.x = x0;
	this.y = y0;
	this.radius = radius;
}

function Demisphere(context, x0, y0, radius) {
	Hemisphere.call(this, context, x0, y0, radius);
}
Demisphere.prototype = new Hemisphere();
Demisphere.prototype.constructor = Demisphere;


Hemisphere.prototype.drawStar = function(star) {
	this.context.fillStyle = 'rgb(' + star.color.join(',') + ')';

	var coords = this.translate(star.ascension,star.declination);
	
	this.context.shadowOffsetX = 0;
	this.context.shadowOffsetY = 0;

	this.context.shadowBlur = 0;
	this.context.shadowColor = "rgba(" + star.color.join(',') + ",255)"; 
	//this.context.shadowColor = "rgba(0,0,255,1)"; 
	// + (star.brightness / 20 + 5) + ")";
	
	var d = 1;
	//if(star.brightness > 4)
	//	this.context.shadowBlur = 5;
	if(star.brightness > 6) {
		d = 2;
	}
	if(star.brightness > 7)
		this.context.shadowBlur = 3;
	if(star.brightness > 8) {
		d = 3;
		//this.context.shadowBlur = 4;
	}
	if(star.brightness > 9)
		this.context.shadowBlur = 10;

	//this.context.shadowBlur = 15;

	this.context.fillRect(coords.x,coords.y,d,d);
	
	if(star.name == null)
		return;
	
	this.labelStar(star, coords);
	
};
Hemisphere.prototype.labelStar = function(star, coords){
	if(this.text(star.name,coords.x, coords.y + 10, 8))
		star.labelled = true;
};
Demisphere.prototype.labelStar = function(star, coords){
	if(star.labelled)
		this.text(star.name,coords.x, coords.y + 10, 8);
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

Hemisphere.prototype.draw = function() {
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
Demisphere.prototype.draw = function() {
	ctx.lineWidth = 4;
	this.context.strokeStyle = 'rgba(0,0,0,.5)';
	this.context.beginPath();
	this.context.arc(this.x +3, this.y +3, this.radius + 1, 0, Math.PI*2, true);
	this.context.stroke();
	
	/*
	var c = new Path2D();
	c.moveTo(this.x - this.radius, this.y+3);
	c.lineTo(this.x + this.radius, this.y+3);
	this.context.stroke(c);
	*/
	
	ctx.lineWidth = .5;
	
	this.context.strokeStyle = 'rgba(255,255,255,.6)';
	
	this.subc(15);
	this.subc(30);
	this.subc(45);
	this.subc(60);
	this.subc(75);

	/*
	ctx.lineWidth = 1;
	this.context.strokeStyle = 'rgba(255,180,0,.4)';
	c = new Path2D();
	c.moveTo(this.x - this.radius, this.y-2);
	c.lineTo(this.x + this.radius, this.y-2);
	this.context.stroke(c);
	
	c = new Path2D();
	c.moveTo(this.x - this.radius, this.y+2);
	c.lineTo(this.x + this.radius, this.y+2);
	this.context.stroke(c);
	*/
	/*ctx.lineWidth = 2;
	c = new Path2D();
	this.context.setLineDash([5]);
	c.moveTo(this.x - this.radius, this.y);
	c.lineTo(this.x + this.radius, this.y);
	this.context.stroke(c);*/
	
	this.context.setLineDash([]);
	ctx.lineWidth = 1;
	
	ctx.lineWidth = 1;
	this.context.strokeStyle = 'rgba(255,180,0,.5)';
	var globe = new Path2D();
	globe.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
	this.context.stroke(globe);
	/*
	this.context.beginPath();
	this.context.setLineDash([5]);
	this.context.arc(this.x, this.y, this.radius + 1, 0, Math.PI*2, true);
	this.context.stroke();
	*/
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

Hemisphere.prototype.subCircle = function(y2, r2) {
	var yc = Math.abs(this.y - y2);
	var y1 = (Math.pow(this.radius,2) - Math.pow(r2,2) + Math.pow(yc,2))/(2 * yc);
	var x2 = Math.sqrt(Math.abs(Math.pow(this.radius,2) - Math.pow(y1,2)));
	var t = Math.atan(Math.abs((this.radius - y1)/x2));
	//var t = Math.acos((
	//log({ y2:y2, r2:r2, y: y1, x: x2, t: t });
	
	var p = new Path2D();
	if(y2 < this.y)
		p.arc(this.x, y2, r2, Math.PI - t, t, true);
	else
		p.arc(this.x, y2, r2, -Math.PI + t, -t, false);
	
	this.context.stroke(p);
	p = null;
	this.context.fillRect(this.x, y1, 2, 2);
}
Hemisphere.prototype.drawGradient = function() {
	var gradient = this.context.createRadialGradient(
		this.x,
		this.y,
		0,
		this.x,
		this.y,
		this.radius * 3);
	
	
	gradient.addColorStop(0,"rgba(0,32,64,.5)");
	gradient.addColorStop(1,"rgba(0,0,0,0)");
	
	return gradient;
};
Hemisphere.prototype.texts = [];
Hemisphere.prototype.text = function(text, x, y, size) {
	size = size || 8;
	ctx.font = size.toString() + "px 'Arimo'";
	ctx.fillStyle = 'rgba(230,240,255,1)';
	ctx.textAlign = 'center';
	this.context.shadowColor = "rgba(0, 0, 0,1)";
	this.context.shadowBlur = 2;
	var m = this.texts.filter(function(r) { return Math.abs(r.x - x) < 35 && Math.abs(r.y - y) < 12; });
	if(m.length > 0)
		return false;
	
	ctx.fillText(text, x, y);
	this.texts.push({x:x,y:y});
	return true;
};
Hemisphere.prototype.drawGalaxy = function() {
	var x = this.x + this.radius - (2 * Math.random() * this.radius);
	var y = this.y + this.radius - (2 * Math.random() * this.radius);
	var step = this.radius * .04;
	
	//var labelled = false;
	
	var color = [];
	for(var i=0;i<3;i++) {
		color.push(Math.round(220 + (Math.floor(Math.random() * 35))));
	}
	var fs =  'rgba('+ color.join(",") + ',.6)';
	this.context.fillStyle = fs;
	//this.context.shadowOffsetX = 0;
	//this.context.shadowOffsetY = 0;
	//this.context.shadowBlur = 1;
	//this.context.shadowColor = "rgba(255, 255, 255,0)";
	var name = 'The ' + buildName();
	if(name.substr(name.length - 1) !== "s") {
		var endings = ["Cluster", "Nebula", "Formation", "Disc"];
		name = name + " " + endings[Math.floor(Math.random() * endings.length)];
	} 
	
	var avgx = x;
	var avgy = y;
	var num = 0;

	for(var i=0; i<1200; i++) {
		var x = x + step - (2 * Math.random() * step);
		var y = y + step - (2 * Math.random() * step);
		

		var r = Math.pow(this.radius - 3, 2);
		var d = Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
		
		if(d < r) {
			num++;
			avgx += x;
			avgy += y;
			this.context.fillRect(x,y,.5,.5);
		}
		/*
			if(labelled === false && d < (.8 * r)) {
				labelled = this.text(name, x, y, 10);
			}
		}
		*/
	}
	
	avgx /= num;
	avgy /= num;
	this.text(name, avgx, avgy, 10);
	
	this.context.shadowBlur = 0;
	this.context.shadowColor = "rgba(255, 255, 255,0)";
};
Demisphere.prototype.drawGalaxy = function() {
	// do nothing
}


function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
}

Vector.prototype.getMagnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.getAngle = function () {
  return Math.atan2(this.y,this.x);
};

Vector.fromAngle = function (angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};


function renderStars(canvases, data) {
	data.forEach(function(star) {
		var h = canvases[star.hemisphere];
		h.drawStar(star);
		
		if(star.declination > 0)
			hemispheres[2].drawStar(star);
	});
}
function brightness() {
	var num = Math.random() * 10000;
	return 10 - Math.sqrt(Math.sqrt(num));
}

var stars = [];
for(var i = 0; i<2000; i++) {
	stars.push(new Star(
		(.5 - Math.random()) * 180,
		Math.random() * 360,
		brightness(),
		//Math.random() * 10,
		[
			208 + (Math.floor(Math.random() * 48)),
			208 + (Math.floor(Math.random() * 48)),
			208 + (Math.floor(Math.random() * 48))
		]
	));
}


var qx = canvas.width * .25;
var qy = canvas.height * .25;
var qr2 = Math.SQRT2 / 2 * qy;
var hemispheres = [
	new Hemisphere(ctx, qx, 2.5*qy, qx - 10),
	new Hemisphere(ctx, 3 * qx, 2.5*qy, qx - 10),
	new Demisphere(ctx, 2*qx,1.5*qy-qr2, qr2)
];

function drawBorder(width) {
	var dist = width * .5;
	var n = 6;
	for (var i = 0; i < canvas.width/n; i++) 
		drawBorderFragment(i*n,0,i*n,width,dist);
	
	for (var i = 0; i < canvas.height/n; i++) 
		drawBorderFragment(0,i*n,width,i*n,dist);
		
	for (var i = 0; i < canvas.width/n; i++) 
		drawBorderFragment(i*n,canvas.height,i*n,canvas.height - width,dist);
	
	for (var i = 0; i < canvas.height/n; i++) 
		drawBorderFragment(canvas.width,i*n,canvas.width-width,i*n,dist);

	ctx.lineWidth = 1;
}
function drawBorderFragment(x0,y0,x1,y1,dist) {
	ctx.lineWidth = 25;
	y1 = y1 + (Math.random() * dist) - (dist/2);
	x1 = x1 + (Math.random() * dist) - (dist/2);

	// linear gradient from start to end of line
	var grad= ctx.createLinearGradient(x0, y0, x1, y1);
	grad.addColorStop(0, "rgba(0,0,0,.5)");
	grad.addColorStop(.3, "rgba(0,0,0,.4)");
	grad.addColorStop(1, "rgba(0,0,0,0)");
	
	ctx.strokeStyle = grad;
	
	ctx.beginPath();
	ctx.moveTo(x0,y0);
	ctx.lineTo(x1,y1);
	
	ctx.stroke();
}

function loop() {
  clear();
  update();
//  draw();
//  queue();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
	var x = canvas.width * 3/8 + Math.random() * canvas.width / 4;
	var y = canvas.height * 3/8 + Math.random() * canvas.height / 4;
	var gradient = ctx.createRadialGradient(
		x,
		y,
		0,
		x,
		y,
		canvas.width);
	
	var colors = shuffle([0,32]);
		
	gradient.addColorStop(0,"rgba(" + colors.join(',') + ",64,.6)");
	gradient.addColorStop(1,"rgba(0,0,0,1)");
	ctx.fillStyle = gradient;
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
  drawBorder(100);

  hemispheres.forEach(function(h) { 
  	h.draw(); 
  	for(var i=0;i<4;i++)
  		if(Math.random() > .50)
  			h.drawGalaxy();
  	
  	h.drawGalaxy();
  });
  renderStars(hemispheres, stars);
  
  drawShip(ships[0], canvas.width - 300, 25, .3);
  drawShip(ships[1], 50, 25, .3);
}

function draw() {
  drawParticles();
}

function queue() {
  window.requestAnimationFrame(loop);
}

loop();

function drawShip(ship, x, y, scale) {
	ctx.shadowBlur = 5;
	ctx.shadowColor = "rgba(0, 0, 0, 1)";
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	
	var url = ship;
    var img = new window.Image();
	img.onload = function(){
		//var data = Filters.filterImage(Filters.whiteToAlpha, img, scale);
		var data = Filters.filterImage(Filters.whiteToColor, img, scale, 
			//[255, 180, 0, 128]);
			[240, 240, 255, 192]);
		ctx.drawImage(data, x, y);
	};
    img.setAttribute("src", url);

}
function toImage(url) {
	var DOM_img = document.createElement("img");
	DOM_img.src = url;
	document.getElementById("log").appendChild(DOM_img);
}
//http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
var Filters = {};
Filters.getPixels = function(img, scale) {
  var c,ctx;
  if (img.getContext) {
	c = img;
	try { ctx = c.getContext('2d'); } catch(e) {}
  }
  if (!ctx) {
	c = this.getCanvas(img.width * scale, img.height * scale);
	ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
  }
  //document.getElementById("log").appendChild(c);
  return ctx.getImageData(0,0,c.width,c.height);
};
Filters.getCanvas = function(w,h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};
Filters.filterImage = function(filter, image, scale, var_args) {
  var args = [this.getPixels(image, scale)];
  for (var i=3; i<arguments.length; i++) {
	args.push(arguments[i]);
  }
  var output = filter.apply(null, args);
  
  var c2 = document.createElement("canvas");
  c2.width = image.width * scale;
  c2.height = image.height * scale;
  var ct2 = c2.getContext('2d');
  ct2.putImageData(output, 0, 0);
  
  return c2;
};
Filters.whiteToColor = function(pixels, args) {
	Filters.whiteToAlpha(pixels, args);
	return Filters.toColor(pixels, args);
}
Filters.whiteToAlpha = function(pixels, args) {
  var d = pixels.data;
  
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
	var a = d[i+3];
	
	var mod = 1 - (r*g*b / 16581375);
	var mod2 = mod;
	
	if(16581375 - r*g*b < 100000)
		mod = 0;
	
	d[i+3] = Math.round(mod * 255);
	
	
	d[i+2] = Math.round(mod2 * b);
	d[i+1] = Math.round(mod2 * g);
	d[i+0] = Math.round(mod2 * r);
  }
  
  return pixels;
};

Filters.toColor = function(pixels, args) {
	var r2 = args[0];
	var g2 = args[1];
	var b2 = args[2];
	var a2 = args[3];
  var d = pixels.data;
  
  for (var i=0; i<d.length; i+=4) {
	
	if(d[i+3] < 100)
		continue;
	
	d[i+2] = b2
	d[i+1] = g2;
	d[i+0] = r2;
	d[i+3] = d[i+3] * (a2 / 255);
  }
  
  return pixels;
};