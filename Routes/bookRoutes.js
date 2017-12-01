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




var routes = function(Book){
    var bookRouter = express.Router();

    bookRouter.route('/')
        .post(upload.any(),function(req, res){
            var token = getToken(req.headers);
  if (token) {
// console.log("dfd");
// console.log(req.files);
// if(req.files){
//      req.files.forEach(function(file){
//         console.log(file);
//         var filename = (new Date).valueOf()+"-"+file.originalname
//         fs.rename(file.path,'uploads/'+filename,function(err){
//           if(err)throw err;
//           console.log('hello');
//          //save to mongoose
//           var newBook = new Book({
//               title: req.body.title,
//                 author: req.body.author,
//                 genre: req.body.genre,
//                 img: filename
//           });
//          newBook.save(function(err) {
//       if (err) {
//         return res.json({success: false, msg: 'Save book failed.'});
//       }
//       res.json({success: true, msg: 'Successful created new book.'});
//     });
//        });
//      });
//    }

//     var newBook = new Book({
//       title: req.body.title,
//       author: req.body.author,
//       genre: req.body.genre,
//       book.img.data = fs.readFileSync(req.files.userPhoto.path)
//  book.img.contentType = ‘image/png’;
//     //   img: req.body.publisher
//     });

    // newBook.save(function(err) {
    //   if (err) {
    //     return res.json({success: false, msg: 'Save book failed.'});
    //   }
    //   res.json({success: true, msg: 'Successful created new book.'});
    // });

//     console.log(req.body);
   var book = new Book(req.body);

//    book.img.data = fs.readFileSync(req.files.userPhoto.path)
//    book.img.contentType = 'image/png';

    book.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Save book failed.'});
      }
      res.json({success: true, msg: 'Successful created new book.'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
            // var book = new Book(req.body);


            // book.save();
            // res.status(201).send(book);

        })
        .get(function(req,res){
            var token = getToken(req.headers);
            if (token) {
               var query = {};

            if(req.query.genre)
            {
                query.genre = req.query.genre;
            }
            Book.find(query, function(err,books){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(books);
            });
            } else {
                return res.status(403).send({success: false, msg: 'Unauthorized.'});
            }

            // var query = {};

            // if(req.query.genre)
            // {
            //     query.genre = req.query.genre;
            // }
            // Book.find(query, function(err,books){
            //     if(err)
            //         res.status(500).send(err);
            //     else
            //         res.json(books);
            // });
        });

    bookRouter.use('/:bookId', function(req,res,next){
        Book.findById(req.params.bookId, function(err,book){
            if(err)
                res.status(500).send(err);
            else if(book)
            {
                req.book = book;
                next();
            }
            else
            {
                res.status(404).send('no book found');
            }
        });
    });
    bookRouter.route('/:bookId')
        .get(function(req,res){

            res.json(req.book);

        })
        .put(function(req,res){
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;
            req.book.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.book);
                }
            });
        })
        .patch(function(req,res){
            if(req.body._id)
                delete req.body._id;

            for(var p in req.body)
            {
                req.book[p] = req.body[p];
            }

            req.book.save(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.book);
                }
            });
        })
        .delete(function(req,res){
            req.book.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send('Removed');
                }
            });
        });
    return bookRouter;
};

module.exports = routes;