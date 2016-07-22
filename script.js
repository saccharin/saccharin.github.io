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

/*
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
		
	}
	
	avgx /= num;
	avgy /= num;
	this.text(name, avgx, avgy, 10);
	
	this.context.shadowBlur = 0;
	this.context.shadowColor = "rgba(255, 255, 255,0)";
};
*/

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
var hemispheres = [];
function initialize() {
	for(var i = 0; i<2000; i++) {
		stars.push(new Star(
			(.5 - Math.random()) * 180,
			Math.random() * 360,
			brightness(),
			[
				208 + (Math.floor(Math.random() * 48)),
				208 + (Math.floor(Math.random() * 48)),
				208 + (Math.floor(Math.random() * 48))
			],
			buildName
		));
	}
	
	var qx = canvas.width * .25;
	var qy = canvas.height * .25;
	var qr2 = Math.SQRT2 / 2 * qy;
	
	var r = qx > qy ? qy : qx;

	hemispheres.push(new Hemisphere(ctx, qx, 2.5*qy, r - 10));
	hemispheres.push(new Hemisphere(ctx, 3 * qx, 2.5*qy, r - 10));
	hemispheres.push(new Demisphere(ctx, 2*qx,1.5*qy-qr2, qr2));
}

function drawBackground() {
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
		h.render(); 
		//for(var i=0;i<4;i++)
		//	if(Math.random() > .50)
		//		h.drawGalaxy();

		//h.drawGalaxy();
	});
/*
	drawShip(ships[0], canvas.width - 300, 25, .3);
	drawShip(ships[1], 50, 25, .3);
*/
	var strDataURI = canvas.toDataURL("image/png;base64");

	var img = new window.Image();
    img.setAttribute("src", strDataURI);
	
	return img;
}

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

initialize();
var base = drawBackground();

function loop() {
  clear();
  update();
  draw();
  queue();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
	//renderStars(hemispheres, stars);
	stars.forEach(function(s) {
		s.modifyAscension(.2);
		//s.modifyDeclination(1);
	});
}

function draw() {
	canvas.getContext("2d").drawImage(base, 0, 0);
	
	stars.forEach(function(s) {
		s.render(ctx, hemispheres[s.hemisphere]);
		if(s.demisphere == 0)
			s.render(ctx, hemispheres[2]);
	});
}

function queue() {
  window.requestAnimationFrame(loop);
}

clear();
setTimeout(function() {
	loop();
}, 1000);

/*
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
*/