import { Meteor } from 'meteor/meteor';
import '../imports/collections/Test.js';
import '../imports/collections/Against.js';
import '../imports/collections/With.js';
import '../imports/collections/IndGames.js';

import {Against} from '../imports/collections/Against';
import {With} from '../imports/collections/With';
import {IndGames} from '../imports/collections/IndGames';

Meteor.startup(() => {
	console.log('removed');
});

Meteor.publish('with', function(){
	return With.find();
});

Meteor.publish('against', function(){
	return Against.find();
});

Meteor.publish('singleWith', function(name){
	return With.find({name: name});
});

Meteor.publish('singleAgainst', function(name){
	return Against.find({name: name});
});

Meteor.publish('singleIndGame', function(id){
	return IndGames.find({gameId: id});
})
