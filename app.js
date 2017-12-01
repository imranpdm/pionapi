// var express = require('express'),
//     mongoose = require('mongoose'),
//     bodyParser = require('body-parser');


// var db = mongoose.connect('mongodb://localhost/bookAPI');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var multer = require('multer');
// var cors = require('cors');
// var upload = multer({ dest: './uploads' });

// var mongoose = require('mongoose');
// var passport = require('passport');
// var config = require('../config/database');
require('./config/passport')(passport);
// var express = require('express');
var jwt = require('jsonwebtoken');

// res.header("Access-Control-Allow-Origin", "*");


// var multer = require('multer');

mongoose.connect(config.database);

var api = require('./Routes/api');

var Book = require('./models/bookModel');

var Elearning = require('./models/elearningModel');

var Assessment = require('./models/assessmentModel');

var Rmodule = require('./models/rmoduleModel');



var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  
  next();
});
// app.use(cors());
// app.get('/prod', cors(), function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for a Single Route'})
// })


var port = process.env.PORT || 3000;


app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));

app.use(bodyParser.urlencoded({ 
    extended: false,
    parameterLimit: 1000000 // experiment with this parameter and tweak
}));


// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  
//   next();
// });

bookRouter = require('./Routes/bookRoutes')(Book);

elearningRouter = require('./Routes/elearningRoutes')(Elearning);

assessRouter = require('./Routes/assessmentsubRoutes')(Elearning);

assessmentRouter = require('./Routes/assessmentRoutes')(Assessment);

rmoduleRouter = require('./Routes/rmoduleRoutes')(Rmodule);







// app.use(multer({
//   dest: path.join(__dirname, './upload/')
// }).any());

// app.use(multer({ dest: './uploads/',
//  rename: function (fieldname, filename) {
//    return filename;
//  },
// }));


// app.use('/api/books', bookRouter); 

app.use('/api/books', bookRouter, passport.authenticate('jwt', { session: false})); 

app.use('/api/elearning', elearningRouter, passport.authenticate('jwt', { session: false}));

app.use('/api/assess', assessRouter, passport.authenticate('jwt', { session: false}));


app.use('/api/assessment', assessmentRouter); 
app.use('/api/rmodule', rmoduleRouter); 

app.use('/api', api);
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  
// //   res.header 'Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS'
//   next();
// });

// app.all('/*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//   next();
// });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(express.static('uploads'))

// app.get('/img', function (req, res) {
//   res.sendfile(path.resolve('./uploads/'));
// }); 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
    res.send('welcome to my API!');
});

app.use(handleErrors);

function handleErrors(err, req, res, next) {
  res.send('This is your custom error page.');
}

app.use(handle403);

function handle403(err, req, res, next) {
  if (err.status !== 403) return next();
  res.send('403 error');
}



app.listen(port, function(){
    console.log('Gulp is running my app on  PORT: ' + port);
});