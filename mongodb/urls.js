var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var urls = new Schema({          
    url : { type: String },                    
    from: {type: String},                      
    class: {type: Number},                     
    time : { type: Date}                       
});
module.exports = mongoose.model('Urls',urls);


