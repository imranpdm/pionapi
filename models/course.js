var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var courseModel = new Schema({
    courseid: {
        type: Number
    },
    coursename: {type: String},
    createdAt: {
        type: Date, 
        default: Date.now
        }
    // appintro: {type: String},
    // appstem: {type: String},
    // applo: {type: String},
    // appimg:  String
});

module.exports= mongoose.model('Course', courseModel);