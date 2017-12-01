var express = require('express');

var FormData = require('form-data');

var fs = require('fs');
var multer = require('multer');

var upload = multer({ dest: '../uploads/', inMemory: true, includeEmptyFields: true});



var routes = function(Rmodule){
    var rmoduleRouter = express.Router();

    rmoduleRouter.route('/')
        .post(function(req, res){
            console.log(req.files);
            if(req.files){
                 req.files.forEach(function(file){
                    // console.log(file);
                    var filename = (new Date).valueOf()+"-"+file.originalname
                    fs.rename(file.path,'uploads/'+filename,function(err){
                      if(err)throw err;
                      console.log('hello');
                     //save to mongoose
                      var rmodule = new Rmodule({
                        modulename: req.body.modulename,
                            // appname: req.body.appname,
                            // appintro: req.body.appintro,
                            // appstem: req.body.appstem,
                            // applo: req.body.applo,
                          
                            moduleimg: filename
                      });
                     rmodule.save(function(err) {
                  if (err) {
                    return res.json({success: false, msg: 'Save elearning failed.'});
                  }
                  res.json({success: true, msg: 'Successful created new elearning.'});
                });
                   });
                 });
               }
            // var rmodule = new Rmodule(req.body);


            // rmodule.save();
            // res.status(201).send(rmodule);

        })
        .get(function(req,res){

            var query = {};

            if(req.query.genre)
            {
                query.genre = req.query.genre;
            }
            Rmodule.find(query, function(err,eservices){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(eservices);
            });
        });


        rmoduleRouter.route('/lvlupdate')
        .get(function(req, res){
            var doc = {
                level: "Beginner",
                mname: {
                moname: "imran", 
                }
                
                // "id": "4",
                // "title": "PyData",
                // "speaker": {
                //     "id": "7",
                //     "name": "alice bob",
                //     "about": "about the speaker",
                //     "photo": "https://pbs.twimg.com/dUy_ueY2.jpeg"
                };

                Rmodule.update(
                    { "course": "Robotics" },
                    { "$push": { "level": doc } },
                    function(err, result){
                    res.json(result);
                        
                        // console.log(result);
                        // db.close();
                    }
                )
          
        
            // Update the document with an atomic operator
            // Rmodule.updateOne(
            //     { "course": "Robotics" },
            //     { "$set":  },{
            //         upsert: true
            //     },
            //     function(err, result){
            //         // console.log(result);
            //         res.json(result);
            //         // db.close();
            //     }
            // )
            // // var course = req.body.course;
            // var level = req.body.level;
            // console.log(req.body);
            // var mname = req.body.mname;

            // Assessment.update({qno:qno},{$set:{iscorrected:false,isattended:true}}
            // Assessment.update({qno:qno},{$set:{iscorrected:false,isattended:true}}, function (err, assessments) {
            //     if (err) return next(err);
            //     res.json(assessments);
            // })

            // Rmodule.updateOne(
            //             { course : course },
            //             { "$push": { level: level } },
            //             function(err, result){
            //                 res.json(result);
            //                 // console.log(result);
                            
            //             }
            //         )


            // rmodule.save();
            // res.status(201).send(rmodule);

        });
        // .get(function(req, res){

           
            
        //     // req.rmodule.level = req.body.level;

        //     Rmodule.updateOne(
        //         { course : "Robotics" },
        //         { "$push": { "level": "Intermediate" } },
        //         function(err, result){
        //             console.log(result);
                    
        //         }
        //     )
        // });

        

    rmoduleRouter.use('/:eserviceId', function(req,res,next){
        Rmodule.findById(req.params.eserviceId, function(err,rmodule){
            if(err)
                res.status(500).send(err);
            else if(rmodule)
            {
                req.rmodule = rmodule;
                next();
            }
            else
            {
                res.status(404).send('no rmodule found');
            }
        });
    });
    rmoduleRouter.route('/:eserviceId')
        .get(function(req,res){

            res.json(req.rmodule);

        })
        .put(function(req,res){
            console.log(req.body.level);
            req.rmodule.level = req.body.level;            
           
            req.rmodule.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.rmodule);
                }
            });
        })
        .patch(function(req,res){
            if(req.body._id)
                delete req.body._id;

            for(var p in req.body)
            {
                req.rmodule[p] = req.body[p];
            }

            req.rmodule.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.rmodule);
                }
            });
        })
        .delete(function(req,res){
            req.rmodule.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send('Removed');
                }
            });
        });
    return rmoduleRouter;
};

module.exports = routes;