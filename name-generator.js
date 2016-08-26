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
	"Weyland",
	"Yutani",
	"Danlar",
	"Camadohr",
	"Eixaozur",
	"Oereumihr",
	"Mereworum",
	"Helios",
	"Nero",
	"Fable",
	"Apollo",
	"Muse",
	"Aeris",
	"Phoenix", 
	"Magni",
	"Eos",
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
];

function buildName() {
	var index = Math.floor(Math.random() * seeds.length);
	var name = seeds.splice(index,1)[0];
	
	
	if(Math.random() > .80)
		name += ' ' + posts[Math.floor(Math.random() * posts.length)];
	return name;
};
