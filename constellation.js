function Constellations(stars, context) {
	this.stars = stars;
	this.context = context;
	
	this.constellations = [];
}

Constellations.prototype.planConstellations = function() {
	if(this.constellations.length > 2)
		return;
	
	if(Math.random() > .05)
		return;
	
	//	5% chance: plan a new constellation
	var origin = stars[Math.floor(Math.random() * stars.length)];
	// get other stars within hemisphere && close by
	var self = this;
	
	var others = stars.filter(function(s) {
		if(
			(s.ascension > 180 && origin.ascension > 180)
				||
			(s.ascension < 180 && origin.ascension < 180)
			)
			return true;
		
		return false;
	}).filter(function(s) {
		return Math.abs(origin.ascension - s.ascension) < 30
			&& Math.abs(origin.declination - s.declination) < 20;
	});
	this.constellations.push(new Constellation(others, self.context));
};
Constellations.prototype.drawConstellations = function() {
	var self = this;
	for(var i=this.constellations.length - 1;i>=0;i--) {
		var c = this.constellations[i];
		if(c.animate() === false)
			this.constellations.splice(i, 1);
	}
};

function Constellation(stars, context) {
	this.context = context;
	this.stars = stars;
	this.age = 0;
	this.drawn = [];
	this.lines = [];
}
Constellation.prototype.calculateLines = function() {
	var nextStars = this.getNextStars();
	if(this.drawn.length > 0) {
		
	}
	this.drawn = this.drawn.concat(nextStars);
};
Constellation.prototype.animate = function() {
	var self = this;
	
	this.stars.forEach(function(s) {
		var hemisphere = hemispheres[0];
		if(s.ascension > 180)
			hemisphere = hemispheres[1];
		
		s.highlight(self.context, hemisphere);
	});
	if(this.age++ > 100)
		return false;
	
	return true;
};
Constellation.prototype.getNextStars = function() {
	if(this.drawn.length == 0)
		return [this.stars[Math.floor(Math.random() * this.stars.length)]];
	
	var lastStar = this.drawn[Math.floor(Math.random() * this.drawn.length)];
	
	var retval = [];
	for(var d=0;d<100;d++) {
		var coords = {
			top:	lastStar.declination + d,
			bottom:	lastStar.declination - d,
			left:	lastStar.ascension + d,
			right:	lastStar.ascension - d,
		};
		
		for(var i=0,s; s=this.stars[i]; i++) {
			if(this.drawn.indexOf(s) >= 0)
				continue;
			
			if(
				s.declination < top
				&& s.declination > bottom
				&& s.ascension > left
				&& s.ascension < right
				) {
					retval.push(s);
					if(Math.random() > .5)
						return retval;
				}
		}
	}
};