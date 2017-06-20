// var async = require('async');
var crawlUrl = require('./crawlUrl').main;//引入hello模块
var crawlPage = require('./crawlPage').main;

module.exports = function webCrawler(){
	crawlUrl();
	setTimeout(function(){
		crawlPage();
	},3000);
}

