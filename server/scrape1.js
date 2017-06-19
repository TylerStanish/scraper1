import {IndGames} from '../imports/collections/IndGames.js';

var cheerio = require('cheerio');

Meteor.methods({
	'scrape.updateDate': function(url){
		let body = Meteor.http.get(url).content;
		let $ = cheerio.load(body);
		$.prototype.logHtml = function(){
			console.log(this.html());
		}
		
	},
	'scrape.indGame': function(url){

		let body = Meteor.http.get(url).content;
		let $ = cheerio.load(body);
		$.prototype.logHtml = function() {
			console.log(this.html());
		};
		
		let game = {
			info: [],
			date: null,
			gameId: null
		};
		let obj = {
			name: null,
			pos: null,
			five: {},
			all: {}
		};

		$('#wrapper').filter(function(){
			game.gameId = $(this).children('.content').children('.container').children('.row').eq(2)
				.children('.col-med-8')
				.children('.portlet').children('.portlet-title').text().trim().substring(8).trim();
		});

		let awayStatsTitle;
		$('#wrapper').filter(function(){
			awayStatsTitle = $(this).children('.content').children('.container').children('.row').eq(-1)
				.children('.col-med-8')
				.children('.portlet')
				.children('.portlet-body')
				.children('table')
				.children('thead')
				.children('tr').last().children('td');
		});
		
		let playerDataArr = [];
		awayStatsTitle.map(function(i, el){
			playerDataArr.push($(this).text());
		});
		
		let awayStats;
		$('#wrapper').filter(function(){
			awayStats = $(this).children('.content').children('.container').children('.row').eq(-2)
				.children('.col-med-8')
				.children('.portlet')
				.children('.portlet-body')
				.children('table')
				.children('tbody')
				.children('tr');
		});
		let homeStats;
		$('#wrapper').filter(function(){
			homeStats = $(this).children('.content').children('.container').children('.row').eq(-1)
				.children('.col-med-8')
				.children('.portlet')
				.children('.portlet-body')
				.children('table')
				.children('tbody')
				.children('tr');
		});

		awayStats.map(function(i, el){
			let obj = {
				name: null,
				pos: null,
				five: {},
				all: {}
			};
			$(this).find('td').map(function(index, element){
				if(index == 0){
					return;
				}
				if(index == 1){
					obj.name = $(this).text().trim();
					return;
				}
				if(index == 2){
					obj.pos = $(this).text().trim();
					return;
				}
				if(index <= 8){
					obj.five[playerDataArr[index]] = $(this).text().trim();
				}
				if(index > 8){
					obj.all[playerDataArr[index]] = $(this).text().trim();
				}
			});
			game.info.push(obj);
		});
		homeStats.map(function(i, el){
			let obj = {
				name: null,
				pos: null,
				five: {},
				all: {}
			};
			$(this).find('td').map(function(index, element){
				if(index == 0){
					return;
				}
				if(index == 1){
					obj.name = $(this).text().trim();
					return;
				}
				if(index == 2){
					obj.pos = $(this).text().trim();
					return;
				}
				if(index <= 8){
					obj.five[playerDataArr[index]] = $(this).text().trim();
				}
				if(index > 8){
					obj.all[playerDataArr[index]] = $(this).text().trim();
				}
			});
			game.info.push(obj);
		});
		IndGames.insert(game);
	},
});

// season (or just year I guess)
var getList = function(season){
	let arr = [];
	let thirtyM = ['04', '06', '09', '11'];
	let thirtyOneM = ['01', '03', '05', '07', '08', '10', '12'];
	let twentyNine /*just in case*/ = ['02'];
	let count = 0;
	let month = '01';
	let day = '01';
	getScheduleForDay('http://hockeystats.ca/index/${season}/${month}/${day}', function(numbers){
		getScheduleForDay();
	});

	return arr;
}

var getScheduleForDay = function(url, cb){
	let numbers = [];
	let body = Meteor.http.get(url).content;
	let $ = cheerio.load(body);
	$('#wrapper').find('.content').find('.container').find('.row').last().find('.col-md-3').map(function(i, el){
		let n = $(this).find('div').last().find('a').attr('href').substring(6);
		numbers.push(n);
	});
	cb(numbers);
}


