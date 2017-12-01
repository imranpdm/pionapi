var express = require('express');


var routes = function(Assessment){
    var assessmentRouter = express.Router();

    assessmentRouter.route('/')
        .post(function(req, res){
            var assessment = new Assessment(req.body);


            assessment.save();
            res.status(201).send(assessment);

        })
        .get(function(req,res){

            var query = {};

            if(req.query.qno)
            {
                query.qno = req.query.qno;
            }
            Assessment.find(query, function(err,assessments){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(assessments);
            });
        });

        assessmentRouter.route('/ccount')
        
        .get(function(req,res){


            

            // var correct = [];
            // var incorrect = [];
            // var attended = [];
            // var notatten =[];

            // var query = {isattended : true};

            // console.log(query);
            Assessment.count(function(err, total){
                // var totalquiz = count;
                 console.log( "Number of Quiz:", total );
                 Assessment.count({iscorrected: true}, function(err, count){
                        var correct  = count
                        var incorrect = total - correct;
                        console.log(incorrect);

                        Assessment.count({isattended: true}, function( err, atten){
                            var attended = atten;
                            var notatten = total - attended;
                             console.log( "Number of isattended:", notatten);

                             res.json({total: total, correct: count, incorrect:incorrect, attend : attended, notattend : notatten  }); 
                        })
                    })

                    

                   
            })
            //  console.log(totalquiz);


            // Assessment.count({iscorrected: true}, function( err, count){
            //     var correct  = count
            //     var incorrect = totalquiz - correct;
            //     console.log(incorrect);
            // })

            // Assessment.count({isattended: true}, function( err, count){
            //     var attended = count;
            //     // console.log( "Number of isattended:", count );
            // })

            // res.json({total: totalquiz, correct: correct});

            // db.collection.find( { isattended: 5, b: 5 } ).count()

            // Assessment.find(query.count(), function(err,assessments){
            //     if(err)
            //         res.status(500).send(err);
            //     else
            //         res.json(assessments);
            // });
        });

        assessmentRouter.route('/qcheck')
        .post(function(req, res){
            console.log(req.body);
            var qno = req.body.qno;
            var ans = req.body.answer;
            Assessment.find({qno : qno, answer:ans}, function (err, assessments) {
                if (err) return next(err);
                // res.json(assessments);
                if(assessments == ''){
                    console.log('incorrect');
                    Assessment.update({qno:qno},{$set:{iscorrected:false,isattended:true}}, function (err, assessments) {
                        if (err) return next(err);
                        //  res.json(assessments);
                        res.json({success: false, msg: 'inCorrect'});
                    })
                    // Assessment.update(
                    //     { qno: req.body.qno },
                    //     {
                    //        iscorrected: false
                    //     },
                    //     { upsert: true }
                    //  )
                    // res.json({success: false, msg: 'inCorrect'});
                    
                    //   dif     
                    // assessments.iscorrected = true;
                        
            
                    //     assessment.save(function(err){
                    //         if(err)
                    //             res.status(500).send(err);
                    //         else{
                    //             res.json(assessment);
                    //         }
                    //     });
                }
                else{
                    Assessment.update({iscorrected:false},{$set:{iscorrected:true,isattended:true}}, function (err, assessments) {
                        if (err) return next(err);
                        res.json({success: true, msg: 'Correct'});
                        // res.json(assessments);
                    })
                    // Assessment.update({iscorrected:false},{$set:{iscorrected:true}})
                    
                    //  console.log(assessments);
                }
              });

        })

        // assessmentRouter.route('/qcheck')
        // .post(function(req, res){
        //     // console.log(req.body)
        //     Assessment.findOne({
        //         qno: req.body.qno
        //       }, function(err, assessment) {
        //         if (err) throw err;
            
        //         if (!assessment) {
        //           console.log(req.body);
        //           res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        //         } else {
        //           // check if password matches
        //           assessment.comparePassword(req.body.answer, function (err, isMatch) {
        //             if (isMatch && !err) {
        //               // if assessment is found and password is right create a token
        //             //   var token = jwt.sign(assessment, config.secret);
        //               // return the information including token as JSON
        //               res.json({success: true, msg: 'Correct'});
        //             } else {
        //               res.status(401).send({success: false, msg: 'incorrect'});
        //             }
        //           });
        //         }
        //       });

        // });

    assessmentRouter.use('/:assessmentId', function(req,res,next){
        Assessment.findById(req.params.assessmentId, function(err,assessment){
            if(err)
                res.status(500).send(err);
            else if(assessment)
            {
                req.assessment = assessment;
                next();
            }
            else
            {
                res.status(404).send('no assessment found');
            }
        });
    });
    assessmentRouter.route('/:assessmentId')
        .get(function(req,res){

            res.json(req.assessment);

        })
        .put(function(req,res){
            req.assessment.question = req.body.question;
            req.assessment.qno = req.body.qno;            
            req.assessment.option1 = req.body.option1;
            req.assessment.option2 = req.body.option2;
            req.assessment.option3 = req.body.option3;
            req.assessment.option4 = req.body.option4;
            req.assessment.answer = req.body.answer;
            
            req.assessment.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.assessment);
                }
            });
        })
        .patch(function(req,res){
            if(req.body._id)
                delete req.body._id;

            for(var p in req.body)
            {
                console.log(req.body[p]);
                req.assessment[p] = req.body[p];
            }

            req.assessment.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.assessment);
                }
            });
        })
        .delete(function(req,res){
            req.assessment.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send('Removed');
                }
            });
        });

        

        // assessmentRouter.post('/signin', function(req, res) {
        //     User.findOne({
        //       mobileno: req.body.mobileno
        //     }, function(err, assessment) {
        //       if (err) throw err;
          
        //       if (!assessment) {
        //         console.log(req.body);
        //         res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        //       } else {
        //         // check if password matches
        //         assessment.comparePassword(req.body.password, function (err, isMatch) {
        //           if (isMatch && !err) {
        //             // if assessment is found and password is right create a token
        //             var token = jwt.sign(assessment, config.secret);
        //             // return the information including token as JSON
        //             res.json({success: true, token: 'JWT ' + token});
        //           } else {
        //             res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        //           }
        //         });
        //       }
        //     });
        //   });
    return assessmentRouter;
};

module.exports = routes;