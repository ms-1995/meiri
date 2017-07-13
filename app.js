var express = require('express');
var serveStatic = require('serve-static');
var getData = require('./mongodb/data.js');
var webCrawler = require('./crawler/webCrawler.js');


var app = express();

app.use(serveStatic(__dirname,{'index':['home.html']}));

app.get('/getData', function(req, res){
	getData(req.query.type,function(result){
		res.send(result);
	});
});

app.listen(3000);
