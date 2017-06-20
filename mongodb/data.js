var async = require('async');

var Urls = require("./urls.js");
var Infos = require("./infos.js");

function getUrlData(i, callback){
	var conditions = {'class' : i};
	Urls.distinct('url', conditions, function(err, res){
		callback(null, res.reverse());
	})
}

function getInfoData(urls, callback){
	var infoData = [];
	async.mapLimit(urls,10,function(url,callback){
		var field = 'title';
		var conditions = {'url' : url};
		Infos.distinct(field, conditions).exec((err,title)=>{
			var m = title[0];
			Infos.distinct('text', {'title':title}).exec((err1,text)=>{
				var n = text[0];
				var data={'title':m,'text':n};
				callback(null,data);
			});
		});
	},function(err,result){
		var result1=[];
		for(var value of result){
			if(value.title){
				value.title = value.title.replace(/[\r\n]/g,"");
				value.text = value.text.replace(/[\r\n]/g,"");
				result1.push(value);
			}
		}
		callback(err, result1);
	});
	
}

// function main(i){
// 	async.waterfall([
// 		function(callback){
// 			callback(null, i);
// 		},
// 		function(i, callback){
// 			getUrlData(i, callback);//按类别查找urls表
// 		},
// 		function(urls, callback){
// 			getInfoData(urls, callback);//按url获取详细信息
// 		}], function (err, result) {
// 			console.log(result);
// 		});
// }
// main(1);

module.exports = function(i,callback){
	async.waterfall([
		function(callback){
			callback(null, i);
		},
		function(i, callback){
			getUrlData(i, callback);//按类别查找urls表
		},
		function(urls, callback){
			getInfoData(urls, callback);//按url获取详细信息
		}], function (err, result) {
			callback(result);
		}
	);
}