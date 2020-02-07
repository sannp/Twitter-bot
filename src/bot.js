var Twit = require('twit');
var config = require('./config');

console.log("The bot is running");
var T = new Twit(config);