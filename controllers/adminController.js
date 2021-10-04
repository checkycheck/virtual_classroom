const Post = require('../models/postModel').Post; 
const Play = require('../models/playModel').Play;
const Feedback = require('../models/feedback').Feedback;
const multer = require('multer');
const cloudinary = require("cloudinary");


//==========================================================  set up multer============================
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "-" + Date.now());
    }
});
var upload = multer({ storage: storage })

// ===================================================   CLOUDINARY SETUP =====================================
cloudinary.config({
    cloud_name: 'jubel',
    api_key: '394513677318352',
    api_secret: 'EfBk3Lz_X28ifXOvO3txvtc1Rp8'

});











// var storage = multer.diskStorage({
//   filename: function(req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   }
// });
// var imageFilter = function (req, file, cb) {
//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
// var upload = multer({ storage: storage, fileFilter: imageFilter})

// var cloudinary = require('cloudinary');
// cloudinary.config({ 
//   cloud_name: 'jubel', 
//   api_key: '394513677318352', 
//   api_secret: 'EfBk3Lz_X28ifXOvO3txvtc1Rp8'
// });


// =============================cloudinary set up==================================================================

// var cloudinary = require('cloudinary');
// cloudinary.config({ 
//   cloud_name: 'jubel', 
//   api_key: '394513677318352', 
//   api_secret: 'EfBk3Lz_X28ifXOvO3txvtc1Rp8'
// });


// =============================end of cloudinary setup======================================================

module.exports = {
    

    index: async (req, res) =>{
        var postnum = await Post.count();
        var playnum = await Play.count();
        Post.find()
       .then(posts =>{
           res.render('admin/index', {posts: posts, postnum:postnum, playnum:playnum});
       });

    },

    getPosts: async (req, res) =>{
        const posts = await Post.find().sort({_id:-1});
        var postnum = await Post.count();

        res.render('admin/posts/index', {posts: posts, postnum:postnum});
    },

    videoGet: async (req, res) =>{
        const plays = await Play.find().sort({_id:-1});

        res.render('admin/videos/index', {plays:plays} );
    },


    feedbackGet: async (req, res) =>{
        res.render('admin/feedback/index');
    },
    createfeedbackGet: (req, res) =>{
        res.render('admin/feedback/create');
    },

    feedbackPost: (req, res) =>{
        const feedback = new Feedback({
            name: req.body.name,
            description: req.body.description
        });

        feedback.save().then(feedback =>{
            console.log(feedback);
            req.flash('feedback');
            res.redirect('/admin');
            
        });
    },


    


    // submitPosts: (req, res) =>{



    // //     upload(req, res, function(err){		
    // //         if(err){ return res.end("Error")};
    // //         console.log(req);
    // //         res.end("file uploaded")
    
    // //         cloudinary.config({ 
    // //           cloud_name: 'jubel', 
    // //           api_key: '394513677318352', 
    // //           api_secret: 'EfBk3Lz_X28ifXOvO3txvtc1Rp8'
    // //         });
    
    // //     cloudinary.uploader.upload(req.file.path, function(result) { 
    // //       console.log(result);
    // //         //create an urembo product
    // //         var post = new Post();
    // //           post.description = req.body.description;
    // //           post.file = result.url;
    // //         //save the product and check for errors
    // //         post.save(function(err, posts){
    // //           if(err) 
    // //             // res.send(err);
                
    // //         //   res.json({ message: 'post place created.'});
    // //           console.log(err);
    // //         });
    // //         console.log(post);
    // //     });
    
    // //    });	




    //     // const newPost = new Post({
    //     //     description: req.body.description,
    //     //     file: req.body.file
    //     // });

    //     // newPost.save().then(post => {
    //     //     console.log(post);
    //     //     req.flash('success-message', 'Post created successfully.');
    //     //     res.redirect('/admin/posts');
    //     // });
    
    // },

    // createPosts: (req, res) =>{
        
    //         res.render('admin/posts/create');    
    // },
    
    

    
    deletePost: (req, res) => {

        Post.findByIdAndDelete(req.params.id)
            .then(deletedPost => {
                req.flash('success-message', `The post ${deletedPost.name} has been deleted.`);
                res.redirect('/admin');
            });
    },

    deletePlay: (req, res) =>{
        Play.findByIdAndDelete(req.params.id)
            .then(deletedPlay => {
                req.flash('success-message', `The post ${deletedPlay.name} has been deleted.`);
                res.redirect('/admin');
            });
    }


};