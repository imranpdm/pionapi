var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TestSchema = new Schema({
 
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('imr', TestSchema);