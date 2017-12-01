var mongoose = require('mongoose'),
Schema = mongoose.Schema;


var introSchema = new Schema({
    description: {type: String},
    wprincipal: {type: String},
    bdiagram : String
   });

var stemSchema = new Schema({
science : {type: String},
technology : {type: String},
engineering: {type: String},
mathematics: {type: String}
});

var applicationSchema = new Schema({
   name : {type: String},
   image : {type: String},
   description: {type: String}
   });

var componentsSchema = new Schema({
    name : {type: String},
    image : {type: String},
    description: {type: String}
    });

    var assessmentSchema = new Schema({
        
        // qid: {type: String},
        question: {type: String},
        qno: {type: Number},
        option1: {type: String},
        option2: {type: String},
        option3: {type: String},
        option4: {type: String},
        answer: {type: String},
        selectdstatus: {type: String},
        iscorrected: { type: Boolean, default: false },
        isattended: { type: Boolean, default: false },
        createdAt: {
            type: Date, 
            default: Date.now
            }
        // appimg:  String
    });
    var constructionSchema = new Schema({
        name : {type: String},
        image : {type: String},
        description: {type: String}
        });

var elearningModel = new Schema({
    level: {
        type: String
    },
    course: {type:String},
    modulename: {type: String},
    intro: [introSchema],
    stem: [stemSchema],
    application: [applicationSchema],
    components: [componentsSchema],
    assessment:[assessmentSchema],
    construction: [constructionSchema],
    modulename: {type: String},
    verification: {type: String},
    createdAt: {
        type: Date, 
        default: Date.now
        },
    moduleimg:  String
});

module.exports= mongoose.model('Elearning', elearningModel);