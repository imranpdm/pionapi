var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/book");
// var Book = require("../models/imr");
var Elearning = require("../models/elearningModel");

var fs = require('fs');
var multer = require('multer');

// res.header("Access-Control-Allow-Origin", "*");
// var upload = multer({ dest: '/tmp/'});
// var upload = multer({ dest: '/uploads/' });



// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//         var ext = require('path').extname(file.originalname);
//         ext = ext.length>1 ? ext : "." + require('mime').extension(file.mimetype);
//         require('crypto').pseudoRandomBytes(16, function (err, raw) {
//             cb(null, (err ? undefined : raw.toString('hex') ) + ext);
//         });
//     }
// });

// var upload = multer({ storage: storage });

// router.post('/file_upload', upload.any(), function (req, res, next) {
//     res.send(modulename);
//     console.log(req.body.file);
    
// })

var upload = multer({ dest: '../uploads/', inMemory: true, includeEmptyFields: true});

router.post('/upload', upload.single('img'), function (req, res, next) {
   // do something here
  console.log(req.file);
  console.log(req.files);
})


router.post('/signup', function(req, res) {
  console.log(req.body)
  if (!req.body.mobileno || !req.body.password) {
    res.json({success: false, msg: 'Please pass mobileno and password.'});
  } else {
    var newUser = new User({
      mobileno: req.body.mobileno,
      password: req.body.password,
      // cpassword: req.body.cpassword,
      name: req.body.name,
      email: req.body.email,
      // mobileno: req.body.mobileno,
      course: req.body.course,
      regmodule: req.body.regmodule
      // password: req.body.password,
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        console.log(err);
        return res.json({success: false, msg: 'MobileNo already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    mobileno: req.body.mobileno
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      console.log(req.body);
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

//Elearning Intro

router.route('/introimg')
.post(upload.any(),function(req, res){
    var token = getToken(req.headers);
if (token) {
  // console.log(req.files.fieldname);
  // console.log(req.files.file.path);
  // console.log(req.files.file.type);  // console.log(req.body);
//  console.log(req.body.intro);
//  console.log(req.files);
if(req.files){
  // console.log(file.fieldname);
req.files.forEach(function(file){

var filename = (new Date).valueOf()+"-"+file.originalname
fs.rename(file.path,'uploads/'+filename,function(err){
  if(err)throw err;
//   console.log('hello');
 //save to mongoose
 var intro = {
    "description": req.body.idescription,
    "wprincipal": req.body.iwprincipal,
    "bdiagram": filename,    
};
 
Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
    //  res.json(elearning);

     Elearning.update(
        { _id: elearning._id },
        { $push: { intro: intro } }, function(err, imr){
            // res.json(imr.nModified);
            if(imr.nModified==1){
              res.json({status: 'Success', msg: 'Intro Added Successfully'});              
            }

        }
        
     )
    
 })

});
});
}
} else {
return res.status(403).send({success: false, msg: 'Unauthorized.'});
}
});

//intro update

router.route('/introu')
.post(upload.any(),function(req, res){
    var token = getToken(req.headers);
if (token) {
  console.log(req.body);
//  console.log(req.body.intro);
// console.log(req.files);
if(req.files){
req.files.forEach(function(file){
// console.log(file);
var filename = (new Date).valueOf()+"-"+file.originalname
fs.rename(file.path,'uploads/'+filename,function(err){
  if(err)throw err;
//   console.log('hello');
 //save to mongoose
 var intro = {
    "_id": req.body.eid,    
    "description": req.body.idescription,
    "wprincipal": req.body.iwprincipal,
    "bdiagram": filename,    
};
 
Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
    //  res.json(elearning);

     Elearning.update(
        { _id: elearning._id },
        { $set: { intro: intro } }, function(err, imr){
            // res.json(imr.nModified);
            if(imr.nModified==1){
              res.json({status: 'Success', msg: 'Intro Updated Successfully'});              
            }

        }
        
     )
    
 })

});
});
}
} else {
return res.status(403).send({success: false, msg: 'Unauthorized.'});
}

});

router.route('/introupdate')
.post(function(req,res){
    // console.log(req.body);
     var modulename = req.body.modulename;
     var intro = {
      "_id": req.body.eid,  
      "description": req.body.idescription,
      "wprincipal": req.body.iwprincipal,
      "bdiagram": filename, 
  };
   //  var stem = req.body.stem;
// console.log(req.body.stem)
// db.collection.update({ d : 2014001 , m :123456789},
//   {$pull : { "topups.data" : {"val":NumberLong(200)} } } )
Elearning.findOne({modulename: modulename}, function(err, elearning) {
 
// console.log(elearning.assessment._id);
 Elearning.update(
    { _id: elearning._id },
    { $set: { intro: intro } }, function(err, imr){
        // res.json(imr);
        if(imr.nModified==1){
          res.json({status: 'Success', msg: 'Intro Updated Successfully'});              
        }
    }

 )

})
    
});

router.route('/stemupdate')
.post(function(req, res){
  console.log(req.body);
  
 //save to mongoose
 var stem = {
  "_id": req.body.id,
  "science": req.body.science,
  "technology": req.body.technology,
  "engineering": req.body.engineering,
  "mathematics": req.body.mathematics         
   
};
 
Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
  //  res.json(elearning);

   Elearning.update(
      { _id: elearning._id },
      { $set: { stem: stem } }, function(err, imr){
          // res.json(imr.nModified);
          if(imr.nModified==1){
            res.json({status: 'Success', msg: 'Stem Updated Successfully'});              
          }

      }
      
   )
  
})

});

// if(req.files){
//   // console.log(file.fieldname);
// req.files.forEach(function(file){
// console.log(file.originalname);
// if(file.fieldname == 'imran'){
//   var filename = (new Date).valueOf()+"-"+file.originalname
//   // fs.rename(file.path,'uploads/'+filename,function(err){
//   //   if(err)throw err;
//   console.log(filename)
// }
// if(file.fieldname == 'khan'){
//   var khan = (new Date).valueOf()+"-"+file.originalname
//   // fs.rename(file.path,'uploads/'+filename,function(err){
//   //   if(err)throw err;
//   console.log(khan)
// }
// // var filename = (new Date).valueOf()+"-"+file.originalname
// // fs.rename(file.path,'uploads/'+filename,function(err){
// //   if(err)throw err;
// // //   console.log('hello');
// //  //save to mongoose
// //  var intro = {
// //     "description": req.body.idescription,
// //     "wprincipal": req.body.iwprincipal,
// //     "bdiagram": filename,    
// // };
 
// // Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
// //     //  res.json(elearning);

// //      Elearning.update(
// //         { _id: elearning._id },
// //         { $push: { intro: intro } }, function(err, imr){
// //             // res.json(imr.nModified);
// //             if(imr.nModified==1){
// //               res.json({status: 'Success', msg: 'Intro Added Successfully'});              
// //             }

// //         }
        
// //      )
    
// //  })

// // });
// });
// }

router.route('/stem1')
.post(upload.any(),function(req,res){
    // console.log(req.body);
     var modulename = req.body.modulename;
     

  if(req.files){
  // console.log(file.fieldname);
req.files.forEach(function(file){
console.log(file.originalname);
if(file.fieldname == 'simg'){
  var scimg = (new Date).valueOf()+"-"+file.originalname
  fs.rename(file.path,'uploads/'+scimg,function(err){
    if(err)throw err;
  console.log(scimg)

if(file.fieldname == 'timg'){
  var teimg = (new Date).valueOf()+"-"+file.originalname
  fs.rename(file.path,'uploads/'+teimg,function(err){
    if(err)throw err;
  console.log(teimg)

  if(file.fieldname == 'eimg'){
    var eimg = (new Date).valueOf()+"-"+file.originalname
    fs.rename(file.path,'uploads/'+eimg,function(err){
      if(err)throw err;
    console.log(eimg)

    if(file.fieldname == 'mimg'){
      var maimg = (new Date).valueOf()+"-"+file.originalname
      fs.rename(file.path,'uploads/'+maimg,function(err){
        if(err)throw err;
      console.log(maimg)
 //save to mongoose
 var intro = {
    "description": req.body.idescription,
    "wprincipal": req.body.iwprincipal,
    "bdiagram": filename,    
};

var stem = {
  "science": req.body.science,
  "technology": req.body.technology,
  "engineering": req.body.engineering,
  "mathematics": req.body.mathematics         
   
};


   //  var stem = req.body.stem;
// console.log(req.body.stem)
Elearning.findOne({modulename: modulename}, function(err, elearning) {
 

 Elearning.update(
    { _id: elearning._id },
    { $push: { stem: stem } }, function(err, imr){
        // res.json(imr);
        if(imr.nModified==1){
          res.json({status: 'Success', msg: 'Stem Added Successfully'});              
        }
    }

 )

})
});
}
});
}
});
}
});
}
});
}
    
});

router.route('/stem')
.post(function(req,res){
    // console.log(req.body);
     var modulename = req.body.modulename;
     var stem = {
      "science": req.body.science,
      "technology": req.body.technology,
      "engineering": req.body.engineering,
      "mathematics": req.body.mathematics         
       
  };
   //  var stem = req.body.stem;
// console.log(req.body.stem)
Elearning.findOne({modulename: modulename}, function(err, elearning) {
 

 Elearning.update(
    { _id: elearning._id },
    { $push: { stem: stem } }, function(err, imr){
        // res.json(imr);
        if(imr.nModified==1){
          res.json({status: 'Success', msg: 'Stem Added Successfully'});              
        }
    }

 )

})
    
});

//Eleaning Components

router.route('/comp')
.post(upload.any(),function(req, res){
    var token = getToken(req.headers);
if (token) {
//  console.log(req.body.intro);
console.log(req.files);
if(req.files){
req.files.forEach(function(file){
// console.log(file);
var filename = (new Date).valueOf()+"-"+file.originalname
fs.rename(file.path,'uploads/'+filename,function(err){
  if(err)throw err;
//   console.log('hello');
 //save to mongoose

 var components = {
    "name": req.body.cname,
    "description": req.body.cdescription,
    "image": filename,    
};
 

Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
    //  res.json(elearning);

     Elearning.update(
        { _id: elearning._id },
        { $push: { components: components } }, function(err, imr){
            // res.json(imr);
            if(imr.nModified==1){
              res.json({status: 'Success', msg: 'Components Added Successfully'});              
            }
        }
        
     )
    
 })

});
});
}
}
else {
return res.status(403).send({success: false, msg: 'Unauthorized.'});
}

});

// Components Update

router.route('/compupdate')
.post(upload.any(),function(req, res){
    var token = getToken(req.headers);
if (token) {
  console.log(req.body);
//  console.log(req.body.intro);
// console.log(req.files);
if(req.files){
req.files.forEach(function(file){
// console.log(file);
var filename = (new Date).valueOf()+"-"+file.originalname
fs.rename(file.path,'uploads/'+filename,function(err){
  if(err)throw err;
//   console.log('hello');
 //save to mongoose
 var comp = {
    "_id": req.body.cid,    
    "name": req.body.cname,
    "description": req.body.cdescription,
    "image": filename,    
};
 
Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
    //  res.json(elearning);

     Elearning.update(
        { _id: elearning._id },
        { $set: { components: comp } }, function(err, imr){
            // res.json(imr.nModified);
            if(imr.nModified==1){
              res.json({status: 'Success', msg: 'Components Updated Successfully'});              
            }

        }
        
     )
    
 })

});
});
}
} else {
return res.status(403).send({success: false, msg: 'Unauthorized.'});
}

});

//components Delete

router.route('/compdel')
.post(function(req,res){
    // console.log(req.body);
     var modulename = req.body.modulename;
     var com = {
      "_id": req.body.id,        
       
  };
   //  var stem = req.body.stem;
// console.log(req.body.stem)
// db.collection.update({ d : 2014001 , m :123456789},
//   {$pull : { "topups.data" : {"val":NumberLong(200)} } } )
Elearning.findOne({modulename: modulename}, function(err, elearning) {
 
// console.log(elearning.assessment._id);
 Elearning.update(
    { _id: elearning._id },
    { $pull: { components : com } }, function(err, imr){
        // res.json(imr);
        if(imr.nModified==1){
          res.json({status: 'Success', msg: 'Components Deleted Successfully'});              
        }
    }
 )

})
    
});


// Elearning Application

router.route('/app')
.post(upload.any(),function(req, res){
    var token = getToken(req.headers);
if (token) {
//  console.log(req.body.intro);
console.log(req.files);
if(req.files){
req.files.forEach(function(file){
// console.log(file);
var filename = (new Date).valueOf()+"-"+file.originalname
fs.rename(file.path,'uploads/'+filename,function(err){
  if(err)throw err;
//   console.log('hello');
 //save to mongoose

 var application = {
    "name": req.body.aname,
    "description": req.body.adescription,
    "image": filename,    
};
 
Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
    //  res.json(elearning);

     Elearning.update(
        { _id: elearning._id },
        { $push: { application: application } }, function(err, imr){
            // res.json(imr);
            if(imr.nModified==1){
              res.json({status: 'Success', msg: 'Application Added Successfully'});              
            }
        }
        
     )
    
 })

});
});
}
} else {
return res.status(403).send({success: false, msg: 'Unauthorized.'});
}

});

// App update

router.route('/appupdate')
.post(upload.any(),function(req, res){
    var token = getToken(req.headers);
if (token) {
  console.log(req.body);
//  console.log(req.body.intro);
// console.log(req.files);
if(req.files){
req.files.forEach(function(file){
// console.log(file);
var filename = (new Date).valueOf()+"-"+file.originalname
fs.rename(file.path,'uploads/'+filename,function(err){
  if(err)throw err;
//   console.log('hello');
 //save to mongoose
 var app = {
    "_id": req.body.aid,    
    "name": req.body.aname,
    "description": req.body.adescription,
    "image": filename    
};
 
Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
    //  res.json(elearning);

     Elearning.update(
        { _id: elearning._id },
        { $set: { application: app } }, function(err, imr){
            // res.json(imr.nModified);
            if(imr.nModified==1){
              res.json({status: 'Success', msg: 'Application Updated Successfully'});              
            }

        }
        
     )
    
 })

});
});
}
} else {
return res.status(403).send({success: false, msg: 'Unauthorized.'});
}

});


router.route('/qins')
.post(upload.any(),function(req, res){
    var token = getToken(req.headers);
if (token) {
//  console.log(req.body.intro);
console.log(req.files);
if(req.files){
req.files.forEach(function(file){
// console.log(file);
var filename = (new Date).valueOf()+"-"+file.originalname
fs.rename(file.path,'uploads/'+filename,function(err){
  if(err)throw err;
//   console.log('hello');
 //save to mongoose

 var assess = {
    "question": req.body.question,
    "qno": req.body.qno,
    "option1": req.body.option1,
    "option2": req.body.option2,
    "option3": req.body.option3,
    "option4": req.body.option4,
    "answer": req.body.answer      
};
 
Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
    //  res.json(elearning);

     Elearning.update(
        { _id: elearning._id },
        { $push: { assessment: assess } }, function(err, imr){
            // res.json(imr);
            if(imr.nModified==1){
              res.json({status: 'Success', msg: 'Question Added Successfully'});              
            }
        }
        
     )
    
 })

});
});
}
} else {
return res.status(403).send({success: false, msg: 'Unauthorized.'});
}

});

//Eleaning construction

router.route('/construct')
.post(upload.any(),function(req, res){
    var token = getToken(req.headers);
if (token) {
//  console.log(req.body.intro);
console.log(req.files);
if(req.files){
req.files.forEach(function(file){
// console.log(file);
var filename = (new Date).valueOf()+"-"+file.originalname
fs.rename(file.path,'uploads/'+filename,function(err){
  if(err)throw err;
//   console.log('hello');
 //save to mongoose

 var construction = {
    "name": req.body.cname,
    "description": req.body.cdescription,
    "image": filename,    
};
 

Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
    //  res.json(elearning);

     Elearning.update(
        { _id: elearning._id },
        { $push: { components: components } }, function(err, imr){
            // res.json(imr);
            if(imr.nModified==1){
              res.json({status: 'Success', msg: 'Constructions Added Successfully'});              
            }
        }
        
     )
    
 })

});
});
}
}
else {
return res.status(403).send({success: false, msg: 'Unauthorized.'});
}

});

router.route('/qinsert')
.post(function(req,res){
    // console.log(req.body);
     var modulename = req.body.modulename;
     var assess = {
      "question": req.body.question,
      "qno": req.body.qno,
      "option1": req.body.option1,
      "option2": req.body.option2,
      "option3": req.body.option3,
      "option4": req.body.option4,
      "answer": req.body.answer      
  };
    //  var stem = req.body.stem;
// console.log(req.body.stem)
Elearning.findOne({modulename: modulename}, function(err, elearning) {

 Elearning.update(
    { _id: elearning._id },
    { $push: { assessment: assess } }, function(err, imr){
        // res.json(imr);
        if(imr.nModified==1){
          res.json({status: 'Success', msg: 'Question Added Successfully'});              
        }
    }

 )

})

    
});

//ques update

router.route('/qupdate')
.post(function(req,res){
    // console.log(req.body);
     var modulename = req.body.modulename;
     var assess = {
      "_id":req.body.id,
      "question": req.body.question,
      "qno": req.body.qno,
      "option1": req.body.option1,
      "option2": req.body.option2,
      "option3": req.body.option3,
      "option4": req.body.option4,
      "answer": req.body.answer      
  };
    //  var stem = req.body.stem;
// console.log(req.body.stem)
Elearning.findOne({modulename: modulename}, function(err, elearning) {

 Elearning.update(
    { _id: elearning._id },
    { $set: { assessment: assess } }, function(err, imr){
        // res.json(imr);
        if(imr.nModified==1){
          res.json({status: 'Success', msg: 'Question updated Successfully'});              
        }
    }

 )

})

});


//ques delete

router.route('/qdel')
.post(function(req,res){
    // console.log(req.body);
     var modulename = req.body.modulename;
     var assessment = {
      "_id": req.body.id,        
       
  };
   //  var stem = req.body.stem;
// console.log(req.body.stem)
// db.collection.update({ d : 2014001 , m :123456789},
//   {$pull : { "topups.data" : {"val":NumberLong(200)} } } )
Elearning.findOne({modulename: modulename}, function(err, elearning) {
 
// console.log(elearning.assessment._id);
 Elearning.update(
    { _id: elearning._id },
    { $pull: { assessment: assessment } }, function(err, imr){
        // res.json(imr);
        if(imr.nModified==1){
          res.json({status: 'Success', msg: 'Question Deleted Successfully'});              
        }
    }

 )

})
    
});

router.route('/idel')
.post(function(req,res){
    // console.log(req.body);
     var modulename = req.body.modulename;
     var intro = {
      "_id": req.body.id,        
       
  };
   //  var stem = req.body.stem;
// console.log(req.body.stem)
// db.collection.update({ d : 2014001 , m :123456789},
//   {$pull : { "topups.data" : {"val":NumberLong(200)} } } )
Elearning.findOne({modulename: modulename}, function(err, elearning) {
 
// console.log(elearning.assessment._id);
 Elearning.update(
    { _id: elearning._id },
    { $pull: { intro : intro } }, function(err, imr){
        // res.json(imr);
        if(imr.nModified==1){
          res.json({status: 'Success', msg: 'Intro Deleted Successfully'});              
        }
    }

 )

})
    
});
//introdel delete

//stem deleted
router.route('/sdel')
.post(function(req,res){
    // console.log(req.body);
     var modulename = req.body.modulename;
     var stem = {
      "_id": req.body.id,        
       
  };


Elearning.findOne({modulename: modulename}, function(err, elearning) {
 
// console.log(elearning.assessment._id);
 Elearning.update(
    { _id: elearning._id },
    { $pull: { stem : stem } }, function(err, imr){
        // res.json(imr);
        if(imr.nModified==1){
          res.json({status: 'Success', msg: 'Stem Deleted Successfully'});              
        }
    }
 )

})
    
});


router.route('/introdel')
.post(function(req,res){
    // console.log(req.body);
     var modulename = req.body.modulename;
     var intro = {
      "_id": req.body.id

  };
   //  var stem = req.body.stem;
// console.log(req.body.stem)
// db.collection.update({ d : 2014001 , m :123456789},
//   {$pull : { "topups.data" : {"val":NumberLong(200)} } } )
Elearning.findOne({modulename: modulename}, function(err, elearning) {
res.json(elearning);
// console.log(elearning.assessment._id);
//  Elearning.update(
//     { _id: elearning._id },
//     { $pull: { intro: intro } }, function(err, imr){
//         console.log(err);
//         res.json(imr);
//         // if(imr.nModified==1){
//         //   res.json({status: 'Success', msg: 'Question Deleted Successfully'});              
//         // }
//     }

//  )

})
    
});
router.route('/qcheck')
.post(function(req, res){
    // console.log(req.body);
    var modulename = req.body.modulename;
    
    var assessment = {
      "qno": req.body.qno,
      "answer": req.body.answer
     }

    //  res.json(assessment.qno);
    Elearning.find({modulename : modulename,'assessment.qno':assessment.qno, 'assessment.answer':assessment.answer}, function (err, assessments) {
        if (err) return next(err);
        //  res.json(assessments);
        if(assessments == ''){
            console.log('incorrect');
            var assessment = {
              "qno": req.body.qno,                
              "modulename": req.body.modulename,
              "selanswer": req.body.answer,
              "iscorrected": false,
          };
            User.findOne({mobileno: '8148575144'}, function(err, userdata) {
              // console.log(userdata);
              var qchek = userdata.AssessmentQuiz;
              var found = qchek.some(function (el) {
                return el.qno === req.body.qno;
              });

              if (!found) {
                console.log("notfound");
                // arr.push({ id: id, username: name });
                User.update(
                  { _id: userdata._id },
                  { $push: { AssessmentQuiz: assessment } }, function(err, imr){
                res.json({success: false, msg: 'inCorrect'});
                
                      // res.json(imr);
                      // if(imr.nModified==1){
                      //   res.json({status: 'Success', msg: 'Stem Added Successfully'});              
                      // }
                  }
              
               )
            }
            else{
              console.log("found");
              
              User.update(
                { _id: userdata._id, 'AssessmentQuiz.qno': req.body.qno,'AssessmentQuiz.modulename':req.body.modulename },
                { $set: { 'AssessmentQuiz.$.selanswer':req.body.answer,'AssessmentQuiz.$.iscorrected':false } }, function(err, imr){
                  if(err)
                      throw err;
                res.json({success: false, msg: 'inCorrect'}); 
                    // res.json(imr.nModified);
                    // if(imr.nModified==1){
                    //   res.json({status: 'Success', msg: 'Components Updated Successfully'});              
                    // }
        
                }
                
             )
            }
              
            })
            // Elearning.update({modulename:modulename, 'assessment.qno':assessment.qno},{$set:{'assessment.$.iscorrected':false,'assessment.$.isattended':true}}, function (err, assessments) {
            //     if (err) return next(err);
            //     //  res.json(assessments);
            //     res.json({success: false, msg: 'inCorrect'});
            // })
          
        }
        else{

          console.log('correct');
          var assessment = {
            "qno": req.body.qno,                
            "modulename": req.body.modulename,
            "selanswer": req.body.answer,
            "iscorrected": true,
        };
          User.findOne({mobileno: '8148575144'}, function(err, userdata) {
            // console.log(userdata);
            var qchek = userdata.AssessmentQuiz;
            var found = qchek.some(function (el) {
              return el.qno === req.body.qno;
            });

            if (!found) {
              console.log("notfound");
              // arr.push({ id: id, username: name });
              User.update(
                { _id: userdata._id },
                { $push: { AssessmentQuiz: assessment } }, function(err, imr){
                    // res.json(imr);
                    res.json({success: true, msg: 'Correct'});
                    // if(imr.nModified==1){
                    //   res.json({status: 'Success', msg: 'Stem Added Successfully'});              
                    // }
                }
            
             )
          }
          else{
            console.log("found");
            
            User.update(
              { _id: userdata._id, 'AssessmentQuiz.qno': req.body.qno,'AssessmentQuiz.modulename':req.body.modulename },
              { $set: { 'AssessmentQuiz.$.selanswer':req.body.answer,'AssessmentQuiz.$.iscorrected':true } }, function(err, imr){
                if(err)
                    throw err;
                  // res.json(imr.nModified);
                  res.json({success: true, msg: 'Correct'});
                  // if(imr.nModified==1){
                  //   res.json({status: 'Success', msg: 'Components Updated Successfully'});              
                  // }
      
              }
              
           )
          }
            
          })

          // Elearning.update({modulename:modulename, 'assessment.qno':assessment.qno},{$set:{'assessment.$.iscorrected':true,'assessment.$.isattended':true}}, function (err, assessments) {
          //       if (err) return next(err);
          //       res.json({success: true, msg: 'Correct'});
          //       // res.json(assessments);
          //   })
            
        }
      });

});

//qcheck

router.route('/qcheck1')
.post(function(req, res){
    // console.log(req.body);
    var modulename = req.body.modulename;
    
    var assessment = {
      "qno": req.body.qno,
      "answer": req.body.answer
     }

    //  res.json(assessment.qno);
    Elearning.find({modulename : modulename,'assessment.qno':assessment.qno, 'assessment.answer':assessment.answer}, function (err, assessments) {
        if (err) return next(err);
        //  res.json(assessments);
        if(assessments == ''){
            console.log('incorrect');
            User.findOne({mobileno: '8148575144'}, function(err, userdata) {
             console.log(userdata.AssessmentQuiz);
             var qnocheck = userdata.AssessmentQuiz[0].qno;
            //  var arrqls = userdata.AssessmentQuiz;
            //  console.log(arrqls.qno);

              var assessment = {
                "qno": req.body.qno,                
                "modulename": modulename,
                "selanswer": req.body.answer,
                "iscorrected": false,
            };
            console.log(assessment);
            User.update(
              { _id: userdata._id },
              { $push: { AssessmentQuiz: assessment } }, function(err, imr){
                  // res.json(imr);
                  if(imr.nModified==1){
                    res.json({status: 'Success', msg: 'Question Added Successfully'});              
                  }
              }
           )
        
              //   User.update(
              //     { _id: userdata._id },
              //     { $addToSet: { AssessmentQuiz: assessment } }, function(err, imr){
              //         // res.json(imr);
              //         if(imr.nModified==1){
              //          //  res.json({status: 'Success', msg: 'Stem Added Successfully'});   
              //          console.log("assessment Marks Updated")           
              //         }
              //     }
              
              //  )       
      

              //   User.update(
              //     { _id: userdata._id },
              //     { $push: { AssessmentQuiz: assessment } }, function(err, imr){
              //         // res.json(imr);
              //         if(imr.nModified==1){
              //          //  res.json({status: 'Success', msg: 'Stem Added Successfully'});   
              //          console.log("assessment Marks inserted")           
              //         }
              //     }
              
              //  )
        
             
            
             })
            // Elearning.update({modulename:modulename, 'assessment.qno':assessment.qno},{$set:{'assessment.$.iscorrected':false,'assessment.$.isattended':true}}, function (err, assessments) {
            //     // if (err) return next(err);
            //     //  res.json(assessments);
            //     res.json({success: false, msg: 'inCorrect'});
            // })
    
        }
        else{

          User.findOne({mobileno: '8148575144'}, function(err, userdata) {
            
             var assessment = {
               "modulename": modulename,
               "qno": req.body.qno,
               "selanswer": req.body.answer,
               "iscorrected": true,
           };
             if(userdata.AssessmentQuiz != 0){
       
               User.update(
                 { _id: userdata._id },
                 { $set: { AssessmentQuiz: assessment } }, function(err, imr){
                     // res.json(imr);
                     if(imr.nModified==1){
                      //  res.json({status: 'Success', msg: 'Stem Added Successfully'});   
                      console.log("assessment Marks Updated")           
                     }
                 }
             
              )       
       
             }
             else{
       
               User.update(
                 { _id: userdata._id },
                 { $push: { AssessmentQuiz: assessment } }, function(err, imr){
                     // res.json(imr);
                     if(imr.nModified==1){
                      //  res.json({status: 'Success', msg: 'Stem Added Successfully'});   
                      console.log("assessment Marks inserted")           
                     }
                 }
             
              )
       
             }
            
           
            })
          // Elearning.update({modulename:modulename, 'assessment.qno':assessment.qno},{$set:{'assessment.$.iscorrected':true,'assessment.$.isattended':true}}, function (err, assessments) {
          //       // if (err) return next(err);
          //       res.json({success: true, msg: 'Correct'});
          //       // res.json(assessments);
          //   })
            
        }
      });

});

router.route('/ccount1')

.get(function(req,res){

User.aggregate([
  { $match: { mobileno: '8148575144' } },
  {
    "$unwind": "$AssessmentQuiz"
 },
  { $match: { 'AssessmentQuiz.modulename': 'IMRAN' } },
  
  {
      "$group": {
          "_id": "$AssessmentQuiz.iscorrected",
          "count": {
              "$sum": 1
          }
      }
  },
  
], function(err, respr){
  if(err)
    throw err;
    var arr = respr;
    if(arr.length == 2){
      var attend = arr[0].count + arr[1].count;
      var correct = arr[1].count;
      var notcorrect = arr[0].count;
      
    }
    else{
      var attend = arr[0].count;
      if(arr.id == true){
        var correct = arr[0].count;
        var notcorrect = 0;
      }
      else{
        var correct = 0;
        var notcorrect = arr[0].count;
      }
    }
    // var notcorrect = arr[0].count;
    
    // res.json(correct);
});
   
});

router.route('/ccount2')

.post(function(req,res){
  // var modulename = req.param('modulename');
  var modulename = req.body.modulename;
  console.log(modulename);
  var productArray = [];

  var pipeline = [
    { $match: { modulename: modulename } },
    // {   // Get the length of the booking array
    //     "$project": {"_id": '59e239497fae3e1a08639227',
    //         "assessment": { "$size": "$assessment" }
    //     }
        
    // }, 
    {$project: { count: {$size: '$assessment'}}}
    // {   // Get the total length of all the booking fields 
    //     "$group": {
    //         "_id": '59e239497fae3e1a08639227',
    //         "count": { "$sum": "$assessment" }
    //     }
    // }
]
  
 Elearning.aggregate(pipeline, function (err, result) {
    if(err)
        throw err;
    // console.log(result[0].count);
    var productObj = {
      Total : result[0].count,
      
  }; // Prints the count of all the booking sub-documents in the collection
    // res.json(result);
    productArray.total = result[0].count;
// productArray.push(productObj);
// console.log(productArray);

  
User.aggregate([
  { $match: { mobileno: '8148575144' } },
  {
    "$unwind": "$AssessmentQuiz"
 },
  { $match: { 'AssessmentQuiz.modulename': 'IMRAN' } },
  
  {
      "$group": {
          "_id": "$AssessmentQuiz.iscorrected",
          "count": {
              "$sum": 1
          }
      }
  },
  
], function(err, respr){
  if(err)
    throw err;
    var arr = respr;
    if(arr.length == 2){
      productArray.attend = arr[0].count + arr[1].count;
      productArray.correct = arr[1].count;
      productArray.notcorrect = arr[0].count;
      productArray.notattend = productArray.total - productArray.attend;
      
    }
    else{
      productArray.attend = arr[0].count;
      productArray.notattend = productArray.total - productArray.attend;
      
      if(arr.id == true){
        productArray.correct = arr[0].count;
        productArray.notcorrect = 0;
      }
      else{
        productArray.correct = 0;
        productArray.notcorrect = arr[0].count;
      }
    }

    var assessment = {
      "modulename": modulename,
      "total": productArray.total,
      "attend": productArray.attend,
      "notattend": productArray.notattend,
      "correct": productArray.correct,
      "notcorrect": productArray.notcorrect
  };
     
     User.findOne({mobileno: '8148575144'}, function(err, userdata) {
      //  if(userdata.assessmentmarks != 0){
      //  res.json(userdata.assessmentmarks);
       
      //  }
      //  else{
      //    res.json(userdata);
      //  }
      if(userdata.assessmentmarks != 0){

        User.update(
          { _id: userdata._id },
          { $set: { assessmentmarks: assessment } }, function(err, imr){
              // res.json(imr);
              if(imr.nModified==1){
               //  res.json({status: 'Success', msg: 'Stem Added Successfully'});   
               console.log("assessment Marks Updated")           
              }
          }
      
       )       

      }
      else{

        User.update(
          { _id: userdata._id },
          { $push: { assessmentmarks: assessment } }, function(err, imr){
              // res.json(imr);
              if(imr.nModified==1){
               //  res.json({status: 'Success', msg: 'Stem Added Successfully'});   
               console.log("assessment Marks inserted")           
              }
          }
      
       )

      }
     
    
     })

    res.json({Total: productArray.total, attend: productArray.attend, notattend : productArray.notattend, correct : productArray.correct, notcorrect: productArray.notcorrect});
    
    // res.json(result);
})


});


   
});

router.route('/ccount')

.post(function(req,res){
  // var modulename = req.param('modulename');
  var modulename = req.body.modulename;
  console.log(modulename);
  var productArray = [];

  var pipeline = [
    { $match: { modulename: modulename } },
    // {   // Get the length of the booking array
    //     "$project": {"_id": '59e239497fae3e1a08639227',
    //         "assessment": { "$size": "$assessment" }
    //     }
        
    // }, 
    {$project: { count: {$size: '$assessment'}}}
    // {   // Get the total length of all the booking fields 
    //     "$group": {
    //         "_id": '59e239497fae3e1a08639227',
    //         "count": { "$sum": "$assessment" }
    //     }
    // }
]

// Elearning.aggregate([
//   { $match: { modulename: modulename } },
//   {
//       "$unwind": "$assessment"
//   },
//   {
//       "$group": {
//           "_id": "$assessment.isattended",
//           "count": {
//               "$sum": 1
//           }
//       }
//   },
  
// ], function(err, result){
//   if(err)
//     throw err;
//     res.json(result);
// })

// { "$match": { "pollId": "hr4946-113" } },
// { "$group": {
//     "_id": "$vote",
//     "count": { "$sum": 1 }
// }},
// { "$group": {
//     "_id": null,
//     "yesCount": {
//         "$sum": {
//             "$cond": [ "_id", 1, 0 ]
//         }
//     },
//     "noCount": {
//         "$sum": {
//             "$cond": [ "_id", 0, 1 ]
//         }
//     }
// }},
// { "$project": { "_id": 0 } }
// Elearning.findOne({modulename: modulename}, function(err, imr) {
//   res.json(imr);
  
 Elearning.aggregate(pipeline, function (err, result) {
    if(err)
        throw err;
    // console.log(result[0].count);
    var productObj = {
      Total : result[0].count,
      
  }; // Prints the count of all the booking sub-documents in the collection
    // res.json(result);
    productArray.total = result[0].count;
// productArray.push(productObj);
// console.log(productArray);

Elearning.aggregate([
  { $match: { modulename: modulename } },
  {
      "$unwind": "$assessment"
  },
  {
      "$group": {
          "_id": "$assessment.isattended",
          "count": {
              "$sum": 1
          }
      }
  }
], function(err, result1){
  if(err)
    throw err;
    // res.json(result1);
    // if(result1._id == false){
    productArray.afalse = result1[0].count; 
    productArray.atrue = result1[1].count;  
  //  console.log(productArray);

  
Elearning.aggregate([
  { $match: { modulename: modulename } },
  {
      "$unwind": "$assessment"
  },
  {
      "$group": {
          "_id": "$assessment.iscorrected",
          "count": {
              "$sum": 1
          }
      }
  },
  
], function(err, respr){
  if(err)
    throw err;
    // res.json(respr);
    productArray.cfalse = respr[0].count; 
    productArray.ctrue = respr[1].count;

    var assessment = {
      "modulename": modulename,
      "total": productArray.total,
      "attend": productArray.atrue,
      "notattend": productArray.afalse,
      "correct": productArray.ctrue,
      "notcorrect": productArray.cfalse
  };
     
     User.findOne({mobileno: '8148575144'}, function(err, userdata) {
      //  if(userdata.assessmentmarks != 0){
      //  res.json(userdata.assessmentmarks);
       
      //  }
      //  else{
      //    res.json(userdata);
      //  }
      if(userdata.assessmentmarks != 0){

        User.update(
          { _id: userdata._id },
          { $set: { assessmentmarks: assessment } }, function(err, imr){
              // res.json(imr);
              if(imr.nModified==1){
               //  res.json({status: 'Success', msg: 'Stem Added Successfully'});   
               console.log("assessment Marks Updated")           
              }
          }
      
       )       

      }
      else{

        User.update(
          { _id: userdata._id },
          { $push: { assessmentmarks: assessment } }, function(err, imr){
              // res.json(imr);
              if(imr.nModified==1){
               //  res.json({status: 'Success', msg: 'Stem Added Successfully'});   
               console.log("assessment Marks inserted")           
              }
          }
      
       )

      }
     
    
     })

    res.json({Total: productArray.total, attend: productArray.atrue, notattend : productArray.afalse, correct : productArray.ctrue, notcorrect: productArray.cfalse});
    
    // res.json(result);
})



    
    // }
})


});


   
});

    // var correct = [];
    // var incorrect = [];
    // var attended = [];
    // var notatten =[];

    // var query = {isattended : true};

    // console.log(query);
    // Elearning.assessment.count(function( err, total){
    //     // var totalquiz = count;
    //      console.log( "Number of Quiz:", total );
    //      Elearning.assessment.count({iscorrected: true}, function(err, count){
    //             var correct  = count
    //             var incorrect = total - correct;
    //             console.log(incorrect);

    //             Elearning.assessment.count({isattended: true}, function( err, atten){
    //                 var attended = atten;
    //                 var notatten = total - attended;
    //                  console.log( "Number of isattended:", notatten);

    //                  res.json({total: total, correct: count, incorrect:incorrect, attend : attended, notattend : notatten  }); 
    //             })
    //         })     
    // })


router.post('/book', upload.any(), function(req, res) {

    //  console.log(req.file);
  console.log(req.files);

//   var token = getToken(req.headers);
//   if (token) {
//     console.log(req.body);
    
//     // var newBook = new Book({
//     //   isbn: req.body.isbn,
//     //   title: req.body.title,
//     //   author: req.body.author,
//     //   publisher: req.body.publisher,
//     //   image : req.body.image
//     // });

//     // newBook.save(function(err) {
//     //   if (err) {
//     //     return res.json({success: false, msg: 'Save book failed.'});
//     //   }
//     //   res.json({success: true, msg: 'Successful created new book.'});
//     // });
//   } else {
//     return res.status(403).send({success: false, msg: 'Unauthorized.'});
//   }
});

router.get('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
      
    Book.find(function (err, books) {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
