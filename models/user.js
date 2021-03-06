var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var AssessmentSchema = new Schema({
    modulename : {type: String},
    total : {type: String},
    attend: {type: String},
    notattend: {type: String},
    correct: {type: String},
    notcorrect: {type: String}    
    });

    var Quiz = new Schema({
        modulename : {type: String},
        qno : {type: String},
        selanswer: {type: String},
        iscorrected: { type: Boolean},
        
        });

var UserSchema = new Schema({
    mobileno: {
        type: String,
        unique: true,
        required: true
    },
//   username: {
//         type: String,
//         unique: true,
//         required: true
//     },
  password: {
        type: String,
        required: true
    },
// cpassword: {
//     type: String,
//     required: true
// },
  name: {
        type: String,
        required: true
    },
email: {
    type: String,
    required: true
},

course: {
    type: String,
    required: true
},
regmodule: {
    type: String,
    required: true
},
assessmentmarks: [AssessmentSchema],

AssessmentQuiz:[Quiz],


createdAt: {
    type: Date, 
    default: Date.now
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
