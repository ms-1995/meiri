var charset = require("superagent-charset");
var superagent = charset(require("superagent")); 
var cheerio = require('cheerio');
var async = require('async');

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/news';

console.log('爬虫开始运行......');

var url = [
	'http://news.sohu.com',//热点
	'http://news.sohu.com/guoneixinwen.shtml',//国内
	'http://news.sohu.com/guojixinwen.shtml',//国际
	'http://news.sohu.com/shehuixinwen.shtml',//社会
	'http://mil.sohu.com',//军事
	'http://business.sohu.com',//财经
	'http://fashion.sohu.com',//时尚
	'http://it.sohu.com',//科技
	'http://sports.sohu.com'//体育
];
var id = [
	'#change-con a',
	'.article-list h3>a',
	'.article-list h3>a',
	'.article-list h3>a',
	'#main-news div[data-role="news-item"] h4 a',
	'#main-news div[data-role="news-item"] h4 a',
	'#main-news div[data-role="news-item"] h4 a',
	'#main-news div[data-role="news-item"] h4 a',
	'#contentA .center .news a'
];
var num = [0, 1, 2, 3, 4, 5, 6, 7, 8];
// #main-news div[data-role="news-item"] h4 a
var getHref = function(url, i, callback){
	var urls = [];
    superagent
    .get(url)
    .end(function(err, res){        
        if(err){
            return next(err);
        }
        var html = res.text;
        var $ = cheerio.load(html, {decodeEntities: false});
        $(id[i]).each(function (idx, element) {
        	var str = $(element).attr('href');
        	urls.push(str);
        });
        callback(null, urls, i);  
    }); 
}

var insertUrl = function(urls, i, callback){
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		CrawlUrl(urls, db, function(result){
			db.close();
		});
	});
	callback(null, i+' is done');
	var CrawlUrl = function(urls, db, callback) {
		var collection = db.collection('urls');
		var data = [];
		for (var value of urls){
			data.push({"url":value,"from":'sohu',"class":i,"time":Date()});
		}
		collection.insert(data, function(err, result){
			if(err){
				console.log(err);
				return;
			}
			callback(result);
		});
	}
}

function main(){
	async.mapLimit(num, 9, function (i, callback) {
		async.waterfall([
			function(callback){
				callback(null, i);
			},
			function(i, callback){
				getHref(url[i], i, callback);
			},
			function(urls, i, callback){
				// console.log(urls);
				insertUrl(urls, i, callback);
			}], function (err, result) {
				console.log(result);
			});
	}, function (err, result) {
		console.log('final:');
		console.log(result);
	});
}

module.exports = {
	main: main
};