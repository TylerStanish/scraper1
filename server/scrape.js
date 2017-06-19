import {Test} from '../imports/collections/Test';
import {Against} from '../imports/collections/Against';
import {With} from '../imports/collections/With';

var cheerio = require('cheerio');

Meteor.methods({
	'scrape.withAndWithout': function(url, season){
	try{
		let body = Meteor.http.get(url).content;
		let $ = cheerio.load(body);
		let dataToScreen;
		let data = {};

		let indWithObj = {};
		let whenTogetherObj = {		}
		let playerWhenApartObj = {}
		let teammateWhenApartObj = {}
		let togetherObj = {}
		let playerApartObj = {}
		let teammateApartObj = {}

		let indAgainstObj = {}
		let playerWhenAgainstObj = {}
		let playerWhenNotAgainstObj = {}
		let opponentNotAgainstPlayerObj = {}

		let infoObj = {}

		// here's the problem
		if($('h2').text().includes(', , ,')){
			//console.log('blank page');
			throw 'blank page';
		}

		//let firstTable = $('table').eq(-3);
		//let secondTable = $('table').eq(-2);
		//let thirdTable = $('table').last();
		let firstTable;
		let secondTable;
		let thirdTable;
		$('body').filter(function(){
			$(this).children('table').map(function(index, element){
				if(index == 0){
					firstTable = $(this);
				}
				if(index == 1){
					secondTable = $(this);
				}
				if(index == 2){
					thirdTable = $(this);
				}
			});
		});

		if(!firstTable){
			//console.log('from line 57: there was no first table');
			throw 'no first table';
			//return;
		}
		
		data.with = {
			//info: [],
			indWith: [],
			whenTogether: [],
			playerWhenApart: [],
			teammateWhenApart: [],
			together: [],
			playerApart: [],
			teammateApart: []
		};
		data.against = {
			//info: [],
			indAgainst: [],
			playerWhenAgainst: [],
			playerWhenNotAgainst: [],
			opponentNotAgainstPlayer: []
		};
		//data.with.name = $('h2').text();
		//data.against.name = $('h2').text();

		let rowInfoTogether = firstTable.find('tbody').find('tr').eq(1).find('th');
		let rowInfoTogetherArray = [];
		rowInfoTogether.map(function(ind, el){
			rowInfoTogetherArray[ind] = $(this).text();
			if(ind < 2){
				infoObj[$(this).text()] = null;
			}
			if((ind > 1) && (ind < 7)){
				indWithObj[$(this).text()] = null;
			}
			if(ind > 7 && ind < 15){
				whenTogetherObj[$(this).text()] = null;
			}
			if(ind > 15 && ind < 23){
				playerWhenApartObj[$(this).text()] = null;
			}
			if(ind > 23 && ind < 31){
				teammateWhenApartObj[$(this).text()] = null;
			}
			if(ind > 31 && ind < 36){
				togetherObj[$(this).text()] = null;
			}
			if(ind > 36 && ind < 41){
				playerApartObj[$(this).text()] = null;
			}
			if(ind > 41 && ind < 45){
				teammateApartObj[$(this).text()] = null;
			}
		});

		if(secondTable){	
			let rowInfoAgainst = secondTable.find('tbody').find('tr').eq(1).find('th');
			var rowInfoAgainstArray = [];
			rowInfoAgainst.map(function(ind, el){
				rowInfoAgainstArray[ind] = $(this).text();
				if(ind < 2){
					infoObj[$(this).text()] = null;
				}
				if((ind > 1) && (ind < 7)){
					indAgainstObj[$(this).text()] = null;
				}
				if(ind > 7 && ind < 15){
					playerWhenAgainstObj[$(this).text()] = null;
				}
				if(ind > 15 && ind < 23){
					playerWhenNotAgainstObj[$(this).text()] = null;
				}
				if(ind > 23 && ind < 31){
					opponentNotAgainstPlayerObj[$(this).text()] = null;
				}
			});
		}

		firstTable.find('tbody').find('tr').map(function(ind, el){
			infoObj = {};
			indWithObj = {};
			whenTogetherObj = {};
			playerWhenApartObj = {};
			teammateWhenApartObj = {};
			togetherObj = {};
			playerApartObj = {};
			teammateApartObj = {};
			$(this).find('td').map(function(j, elem){
				if(j < 2){
					infoObj[rowInfoTogetherArray[j]] = $(this).text();
					if(j == 0 && ind == 2){
						data.with.name = $(this).text();
						data.against.name = $(this).text();
					}
				}
				if((j > 1) && (j < 7)){
					indWithObj[rowInfoTogetherArray[j]] = $(this).text();
					
				}
				if(j > 7 && j < 15){
					whenTogetherObj[rowInfoTogetherArray[j]] = $(this).text();
					
				}
				if(j > 15 && j < 23){
					playerWhenApartObj[rowInfoTogetherArray[j]] = $(this).text();
					
				}
				if(j > 23 && j < 31){
					teammateWhenApartObj[rowInfoTogetherArray[j]] = $(this).text();
					
				}
				if(j > 31 && j < 36){
					togetherObj[rowInfoTogetherArray[j]] = $(this).text();
					
				}
				if(j > 36 && j < 41){
					playerApartObj[rowInfoTogetherArray[j]] = $(this).text();
					
				}
				if(j > 41 && j < 45){
					teammateApartObj[rowInfoTogetherArray[j]] = $(this).text();
					
				}
			});
			indWithObj.playerWith = infoObj.Player;
			indWithObj.playerWithPos = infoObj.Pos;

			whenTogetherObj.playerWith = infoObj.Player;
			whenTogetherObj.playerWithPos = infoObj.Pos;

			playerWhenApartObj.playerWith = infoObj.Player;
			playerWhenApartObj.playerWithPos = infoObj.Pos;

			teammateWhenApartObj.playerWith = infoObj.Player;
			teammateWhenApartObj.playerWithPos = infoObj.Pos;

			togetherObj.playerWith = infoObj.Player;
			togetherObj.playerWithPos = infoObj.Pos;

			playerApartObj.playerWith = infoObj.Player;
			playerApartObj.playerWithPos = infoObj.Pos;

			teammateApartObj.playerWith = infoObj.Player;
			teammateApartObj.playerWithPos = infoObj.Pos;
			//data.with.info.push(infoObj);
			data.with.indWith.push(indWithObj);
			data.with.whenTogether.push(whenTogetherObj);
			data.with.playerWhenApart.push(playerWhenApartObj);
			data.with.teammateWhenApart.push(teammateWhenApartObj);
			data.with.together.push(togetherObj);
			data.with.playerApart.push(playerApartObj);
			data.with.teammateApart.push(teammateApartObj);
		});

	if(secondTable){	secondTable.find('tbody').find('tr').map(function(j, el){
			infoObj = {};
			indAgainstObj = {};
			playerWhenAgainstObj = {};
			playerWhenNotAgainstObj = {};
			opponentNotAgainstPlayerObj = {};
			$(this).find('td').map(function(ind, elem){
				if(ind < 2){
					infoObj[rowInfoAgainstArray[ind]] = $(this).text();
				}
				if((ind > 1) && (ind < 7)){
					indAgainstObj[rowInfoAgainstArray[ind]] = $(this).text();
				}
				if(ind > 7 && ind < 15){
					playerWhenAgainstObj[rowInfoAgainstArray[ind]] = $(this).text();
				}
				if(ind > 15 && ind < 23){
					playerWhenNotAgainstObj[rowInfoAgainstArray[ind]] = $(this).text();
				}
				if(ind > 23 && ind < 31){
					opponentNotAgainstPlayerObj[rowInfoAgainstArray[ind]] = $(this).text();
				}
			});
			indAgainstObj.playerAgainst = infoObj.Player;
			indAgainstObj.playerAgainstPos = infoObj.Pos;
			playerWhenAgainstObj.playerAgainst = infoObj.Player;
			playerWhenAgainstObj.playerAgainstPos = infoObj.Pos;
			playerWhenNotAgainstObj.playerAgainst = infoObj.Player;
			playerWhenNotAgainstObj.playerAgainstPos = infoObj.Pos;
			opponentNotAgainstPlayerObj.playerAgainst = infoObj.Player;
			opponentNotAgainstPlayerObj.playerAgainstPos = infoObj.Pos;
			//data.against.info.push(infoObj);
			data.against.indAgainst.push(indAgainstObj);
			data.against.playerWhenAgainst.push(playerWhenAgainstObj);
			data.against.playerWhenNotAgainst.push(playerWhenNotAgainstObj);
			data.against.opponentNotAgainstPlayer.push(opponentNotAgainstPlayerObj);
		});
	}
	if(thirdTable){	thirdTable.find('tbody').find('tr').map(function(j, el){
			infoObj = {};
			indAgainstObj = {};
			playerWhenAgainstObj = {};
			playerWhenNotAgainstObj = {};
			opponentNotAgainstPlayerObj = {};
			$(this).find('td').map(function(ind, elem){
				if(ind < 2){
					infoObj[rowInfoAgainstArray[ind]] = $(this).text();
				}
				if((ind > 1) && (ind < 7)){
					indAgainstObj[rowInfoAgainstArray[ind]] = $(this).text();
				}
				if(ind > 7 && ind < 15){
					playerWhenAgainstObj[rowInfoAgainstArray[ind]] = $(this).text();
				}
				if(ind > 15 && ind < 23){
					playerWhenNotAgainstObj[rowInfoAgainstArray[ind]] = $(this).text();
				}
				if(ind > 23 && ind < 31){
					opponentNotAgainstPlayerObj[rowInfoAgainstArray[ind]] = $(this).text();
				}
			});
			indAgainstObj.playerAgainst = infoObj.Player;
			indAgainstObj.playerAgainstPos = infoObj.Pos;
			playerWhenAgainstObj.playerAgainst = infoObj.Player;
			playerWhenAgainstObj.playerAgainstPos = infoObj.Pos;
			playerWhenNotAgainstObj.playerAgainst = infoObj.Player;
			playerWhenNotAgainstObj.playerAgainstPos = infoObj.Pos;
			opponentNotAgainstPlayerObj.playerAgainst = infoObj.Player;
			opponentNotAgainstPlayerObj.playerAgainstPos = infoObj.Pos;
			//data.against.info.push(infoObj);
			data.against.indAgainst.push(indAgainstObj);
			data.against.playerWhenAgainst.push(playerWhenAgainstObj);
			data.against.playerWhenNotAgainst.push(playerWhenNotAgainstObj);
			data.against.opponentNotAgainstPlayer.push(opponentNotAgainstPlayerObj);
		});
	}
		//fs.writeFile('scrape.json', JSON.stringify(data));
		//Test.insert(data.with);
		data.with.season = season;
		data.against.season = season;
		With.insert(data.with);
		Against.insert(data.against);
		//cb(data);
	}catch(e){
		console.log('------------------------------');
		console.log(e);
		console.log(url);
		console.log('------------------------------');
		//console.log(e);
		}
	}
});