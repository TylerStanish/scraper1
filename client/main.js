import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Meteor} from 'meteor/meteor';
import {Test} from '../imports/collections/Test.js';
import {With} from '../imports/collections/With.js';
import {Against} from '../imports/collections/Against.js';
import {IndGames} from '../imports/collections/IndGames.js';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
	// counter starts at 0
	this.counter = new ReactiveVar(1);
	//this.sub = Meteor.subscribe('with');
	//this.sub1 = Meteor.subscribe('against');
	//console.log(data)

});

Template.body.onCreated(function onBodyCreated(){
	this.state = new ReactiveDict();
	Meteor.subscribe('singleWith', 'FISCHER, CHRISTIAN');
	Meteor.subscribe('singleAgainst', 'FISCHER, CHRISTIAN');
	Meteor.subscribe('singleIndGame', '2016020500');
});

Template.body.helpers({
	single(){
		let info = With.find();
		let infoAgainst = Against.find();
		console.log(infoAgainst.fetch());
		console.log(info.fetch());
		console.log(IndGames.find().fetch());
		return info.count();
	}
})

Template.hello.helpers({
	counter() {
		return Template.instance().counter.get();
	},
});

Template.hello.events({
	'click button'(event, instance) {
	// increment the counter when button is clicked
		instance.counter.set(instance.counter.get() + 1);
		scrapeAllGames();
		return;
		/*Meteor.call('scrape.withAndWithout', 'http://stats.hockeyanalysis.com/showplayer.php?pid=876&withagainst=true&season=2007-08&sit=5v5', '2007-08', (err, data) => {
			console.log('completed one');
		});
		Meteor.call('scrape.withAndWithout', 'http://stats.hockeyanalysis.com/showplayer.php?pid=877&withagainst=true&season=2007-08&sit=5v5', '2007-08', (err, data) => {
			console.log('compmleted two');
		});*/
		getData();
		return;

		let baseUrl = 'http://stats.hockeyanalysis.com/showplayer.php?season=';
		let baseUrl1 = '&sit=5v5&pid=';
		let baseUrl2 = '&withagainst=true';
		for(i = 2007; i < 2017; i++){
			let iplusone = i + 1;
			let season = i + '-' + iplusone.toString().substring(2, 4);
			let obj = {season: season, data: []};
			setTimeout(() => {
				let c = 0;
				for(j = 0; j < 2500; j++){
					setTimeout(() => {
						let url = baseUrl + season + baseUrl1 + c + baseUrl2;
						console.log(c + ':' + season);
						Meteor.call('test.testing', url, function(err, data){
							if(!err){

							}else{
								console.log(err);
							}
						});
						c++;
					}, 500*j);
				}
			}, 2500 * (i-2007) * 500 + 500);
		}
	},
});

var nextUrl = function(currSeason, currId){

	let baseUrl = 'http://stats.hockeyanalysis.com/showplayer.php?season=';
	let baseUrl1 = '&sit=5v5&pid=';
	let baseUrl2 = '&withagainst=true';
	if(currId == 2500){
		currSeason = (Number(currSeason.substring(0, 4)) + 1).toString() + '-' + (Number(currSeason.substring(0, 4)) + 2).toString().substring(2,4);
		currId = -1;
	}
	currId++;
	let nUrl;
	nUrl = baseUrl + currSeason + baseUrl1 + currId + baseUrl2;
	console.log(nUrl);
	cSeason = currSeason;
	cId = currId;
	return nUrl;
}

// switch this to 2007-08
var cSeason = '2010-11';
// switch this to -1
var cId = 19;

var getData = function(url){
	if(Number(cSeason.substring(0,4)) == 2017){
		console.log('complete');
		return;
	}
	Meteor.call('scrape.withAndWithout', url, cSeason, function(err, data){
		if(!err){
			getData(nextUrl(cSeason, cId));
		}
	});
}

var currSeason = 2007;
var gameNo = 0;
var scrapeAllGames = function(url){
	// going since 2007
	console.log(url);
	if(currSeason == 2018){
		console.log('complete');
		return;
	}
	Meteor.call('scrape.indGame', url, (err, data) => {
		scrapeAllGames(nextUrl1(currSeason, gameNo));
	});
}

function nextUrl1(s, g){
	if(g == 1230){
		g = 0;
		s++;
		currSeason++;
		gameNo = 0;
	}
	gameNo++;
	return 'http://hockeystats.ca/game/' + s + '02' + pad(g + 1, 4);
}

function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

Meteor.startup(() => {
	console.log('starting up');
});


