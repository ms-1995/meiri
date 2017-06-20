var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var infos = new Schema({          
    url : { type: String },                    
    title: {type: String },                      
    date : { type: Date }, 
    text: {type: String }                        
});
module.exports = mongoose.model('Infos',infos);


