var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/news');

mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection success');  
});

mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err);  
}); 

mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected');  
});  

module.exports = mongoose;
