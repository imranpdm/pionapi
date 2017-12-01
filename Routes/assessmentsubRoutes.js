var express = require('express');
var FormData = require('form-data');

var fs = require('fs');
var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });

// var Item = new ItemSchema(
//   { img: 
//       { data: Buffer, contentType: String }
//   }
// );
// var Item = mongoose.model('Clothes',ItemSchema);

var upload = multer({ dest: '../uploads/', inMemory: true, includeEmptyFields: true});


var routes = function(Elearning){
    var elearningRouter = express.Router();

    elearningRouter.route('/')
        .post(upload.any(),function(req, res){
            var token = getToken(req.headers);
  if (token) {
      
//  console.log(req.body.intro);
//  console.log(req.files);
// if(req.files){
//      req.files.forEach(function(file){
//         // console.log(file);
//         var filename = (new Date).valueOf()+"-"+file.originalname
//         fs.rename(file.path,'uploads/'+filename,function(err){
//           if(err)throw err;
//            console.log(filename);
//         //  save to mongoose
//           var newElearning = new Elearning({
//                 level: req.body.level,
//                 modulename: req.body.modulename,
//                 // appintro: req.body.appintro,
//                 // appstem: req.body.appstem,
//                 // applo: req.body.applo,
//                 moduleimg: filename
//           });
//          newElearning.save(function(err) {
//       if (err) {
//         return res.json({success: false, msg: 'Save elearning failed.'});
//       }
//       res.json({success: true, msg: 'Successful created new elearning.'});
//     });
//        });
//      });
//    }


  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
            // var elearning = new Elearning(req.body);


            // elearning.save();
            // res.status(201).send(elearning);

        })
        .get(function(req,res){
            var token = getToken(req.headers);
            if (token) {
               var query = {};

            if(req.query.level)
            {
                query.level = req.query.level;
            }
            else if(req.query.modulename)
                {
                    query.modulename = req.query.modulename;
                }
            Elearning.find(query, function(err,elearnings){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(elearnings);
            });
            } else {
                return res.status(403).send({success: false, msg: 'Unauthorized.'});
            }

            // var query = {};

            // if(req.query.genre)
            // {
            //     query.genre = req.query.genre;
            // }
            // Elearning.find(query, function(err,elearnings){
            //     if(err)
            //         res.status(500).send(err);
            //     else
            //         res.json(elearnings);
            // });
        });

        elearningRouter.route('/introimg')
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
                    res.json(imr);
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


        elearningRouter.route('/stem')
        .post(function(req,res){
            // console.log(req.body);
             var modulename = req.body.modulename;
             var stem = req.body.stem;
console.log(req.body.stem)
     Elearning.findOne({modulename: modulename}, function(err, elearning) {
         

         Elearning.update(
            { _id: elearning._id },
            { $push: { stem: stem } }, function(err, imr){
                res.json(imr);
            }
     
         )
 
     })

            
        });

        elearningRouter.route('/comp')
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
            "name": req.body.components.name,
            "description": req.body.components.description,
            "image": filename,    
        };
         

        Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
            //  res.json(elearning);
    
             Elearning.update(
                { _id: elearning._id },
                { $push: { components: components } }, function(err, imr){
                    res.json(imr);
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



elearningRouter.route('/app')
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
            "name": req.body.application.name,
            "description": req.body.application.description,
            "image": filename,    
        };
         
        Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
            //  res.json(elearning);
    
             Elearning.update(
                { _id: elearning._id },
                { $push: { application: application } }, function(err, imr){
                    res.json(imr);
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


        elearningRouter.route('/intro')
        .post(function(req,res){

            // var modulename = req.body.modulename;
            // var intro = req.body.intro;
            console.log(req.files);
            if(req.files){
                req.files.forEach(function(file){
                 console.log(file);
                   var filename = (new Date).valueOf()+"-"+file.originalname
                   fs.rename(file.path,'uploads/'+filename,function(err){
                     if(err)throw err;
                   //   console.log('hello');
                    //save to mongoose

                    var intro = {
                        "description": req.body.intro.description,
                        "wprincipal": req.body.intro.wprincipal,
                        "bdiagram": filename,    
                    };
                     

                    Elearning.findOne({modulename: req.body.modulename}, function(err, elearning) {
                        // res.json(elearning);
                
                         Elearning.update(
                            { _id: elearning._id },
                            { $push: { intro: intro } }, function(err, imr){
                                res.json(imr);
                            }
                            
                         )
                    
                     })
          
                  });
                });
              }

        });

    elearningRouter.use('/:elearningId', function(req,res,next){
        Elearning.findById(req.params.elearningId, function(err,elearning){
            if(err)
                res.status(500).send(err);
            else if(elearning)
            {
                req.elearning = elearning;
                next();
            }
            else
            {
                res.status(404).send('no elearning found');
            }
        });
    });
    elearningRouter.route('/:elearningId')
        .get(function(req,res){

            res.json(req.elearning);

        })
        .put(upload.any(),function(req,res){

            console.log(req.files);

            if(req.files){
                req.files.forEach(function(file){
                   console.log(file);
                   var filename = (new Date).valueOf()+"-"+file.originalname
                   fs.rename(file.path,'uploads/'+filename,function(err){
                     if(err)throw err;
                     console.log('hello');
                    //save to mongoose

                    // req.elearning.title = req.body.title;
                    req.elearning.modulename = req.body.modulename;
                    req.elearning.appintro = req.body.appintro;
                    req.elearning.appstem = req.body.appstem;
                    req.elearning.applo = req.body.applo;
                    req.elearning.appimg = filename;
                    

                    //  var newElearning = new Elearning({
                    //        Main: req.body.Main,
                    //        modulename: req.body.author,
                    //        appintro: req.body.appintro,
                    //        appstem: req.body.appstem,
                    //        applo: req.body.applo,
                         
                    //        appimg: filename
                    //  });
                    req.elearning.save(function(err) {
                 if (err) {
                   return res.json({success: false, msg: 'Save elearning failed.'});
                 }
                 res.json({success: true, msg: 'Successful created new elearning.'});
               });
                  });
                });
              }
            // req.elearning.title = req.body.title;
            // req.elearning.author = req.body.author;
            // req.elearning.genre = req.body.genre;
            // req.elearning.read = req.body.read;
            // req.elearning.save(function(err){
            //     if(err)
            //         res.status(500).send(err);
            //     else{
            //         res.json(req.elearning);
            //     }
            // });
        })
        .patch(function(req,res){
            if(req.body._id)
                delete req.body._id;

            for(var p in req.body)
            {
                req.elearning[p] = req.body[p];
            }

            req.elearning.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.elearning);
                }
            });
        })
        .delete(function(req,res){
            req.elearning.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send('Removed');
                }
            });
        });
    return elearningRouter;
};

module.exports = routes;