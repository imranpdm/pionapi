var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var childSchema = new Schema({ name: 'string' }); 

var introSchema = new Schema({
     description: {type: String},
     wprincipal: {type: String},
     bdiagram : String
    })

var stemSchema = new Schema({
science : {type: String},
technology : {type: String},
engineering: {type: String},
mathematics: {type: String}
})

var appSchema = new Schema({
    appname : {type: String},
    image : {type: String},
    description: {type: String}
    })

var Robotics = new Schema({
modulename: {
    type: String
},
intro: [introSchema],
stem: [stemSchema],
application: [appSchema],
// construction: [constructionSchema],
createdAt: {
    type: Date, 
    default: Date.now
    },
moduleimg:  String
// genre: {type: String},
// child: childSchema,
// read: {type: Boolean, default:false}
 });

module.exports= mongoose.model('Rmodule', Robotics);