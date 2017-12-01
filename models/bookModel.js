var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    var authorSchema = new Schema({
        fname: {
            type: String
        },
        lname: {type: String},
        // img:  String,
        
    });

var bookModel = new Schema({
    title: {
        type: String
    },
    author: [authorSchema],
    genre: {type: String},
    // img:  String,
    read: {type: Boolean, default:false}
});

module.exports= mongoose.model('Book', bookModel);