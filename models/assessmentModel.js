var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var assessmentModel = new Schema({
    m_id: {
        type: String
    },
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

module.exports= mongoose.model('Assessment', assessmentModel);