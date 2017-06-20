var charset = require("superagent-charset");
var superagent = charset(require("superagent")); 
var cheerio = require('cheerio');
var async = require('async');

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/news';


var getUrl = function(callback){
	var urls = [];
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		findPage(db, function(result) {
			for (var value of result){
				urls.push(value.url);
			}
			db.close();
			callback(null, urls);
		});
	});
	var findPage = function(db, callback) {  
		var collection = db.collection('urls');
		collection.find().toArray(function(err, result) {
			if(err){
				console.log('Error:'+ err);
				return;
			}     
			callback(result);
		});
	}
}
var getPage = function(urls, callback){

	var fetchUrl = function(url, callback){
		superagent
		.get(url)
		.end(function(err, res){
			if(err){
				return err;
			}
			var html = res.text;
			var $ = cheerio.load(html, {decodeEntities: false});
			var charset = $('head meta').attr('charset');
			if(!charset){
				
			}else{
				var title = $('.text-title h1').text();
				var date = $('.time').text();
				var text = $('.article').html();
				var data = [{"url":url,"title":title,"date":Date(),"text":text}];
				insertInfo(data);
			}
		});
		callback(null,'done');
	} 

	var insertInfo = function(data){
		MongoClient.connect(DB_CONN_STR, function(err, db){
			doInfo(data, db, function(result){
				db.close();
			});
		});
		var doInfo = function(data, db, callback){
			var collection = db.collection('infos');
			collection.insert(data, function(err, result){
				if(err){
					console.log(err);
					return;
				}
				callback(result);
			});
		}
	}

	async.mapLimit(urls, 20, function(url, callback){
		fetchUrl(url, callback);
	}, function(err, result){
		console.log('err:'+err);
	});

	callback(null, 'getPage');
	// for(var value of urls){
	// 	superagent
	// 	.get(value)
	// 	// .charset('gb2312')
	// 	.end(function(err, res){        
	// 		if(err){
	// 			return err;
	// 		}
	// 		var html = res.text;
	// 		var $ = cheerio.load(html, {decodeEntities: false});
	// 		// console.log($('.text-title h1,.content-box h1').text());
	// 		var charset = $('head meta').attr('charset')
	// 		if(!charset){
	// 		}else{
	// 			var title = $('.text-title h1').text();
	// 			var date = $('.time').text();
	// 			var text = $('.article').html();
	// 			data.push({"url":value,"title":title,"date":Date(),"text":text});
	// 		}
	// 	}); 
	// }
	
	
}

function main(){
	async.waterfall([
		function(callback){
			callback(null);
		},
		function(callback){
			getUrl(callback);
		},
		function(urls, callback){
			getPage(urls, callback);
		}], function (err, result) {
			console.log(result);
		});
}
module.exports = {
	main: main
};
