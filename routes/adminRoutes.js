const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {isUserAuthenticated} = require("../config/customFunctions");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin').Admin;
const Post = require('../models/postModel').Post; 
const Play = require('../models/playModel').Play; 
const multer = require('multer');
const cloudinary = require("cloudinary");
const path = require('path');



//==========================================================  set up multer============================
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "-" + Date.now());
    }
});

var upload = multer({ storage: storage })

// var upload = multer({ storage: storage,
//     fileFilter:function(req, file, cb){
//         checkFileType(file, cb)
//     }
// })

// function checkFileType(file, cb){
//     const filetypes = /jpeg|jpg|png|pdf/
//     const extname= filetypes.test(path.extname(file.originalname).toLowerCase())

//     const mimetype = filetypes.test(file.mimetype)

//     if(mimetype && extname){
//         return cb(null, true)
//     }
//     else{
//         cb('please upload an image')
//     }
// }

// ===================================================   CLOUDINARY SETUP =====================================
cloudinary.config({
    cloud_name: 'jubel',
    api_key: '394513677318352',
    api_secret: 'EfBk3Lz_X28ifXOvO3txvtc1Rp8'

});




 
// isUserAuthenticated,
router.all('/*', isUserAuthenticated, (req, res, next) => {

    req.app.locals.layout = 'admin';

    next(); 
});

router.route('/')
 .get(adminController.index);


router.route('/posts')
    .get(adminController.getPosts);



router.route('/posts/create')
    .get((req, res)=>{
     res.render('admin/posts/create');
 })
router.route('/posts/create')
 .post(upload.single('picture'), function (req, res, next) {
    // console.log(req)
    // if(req.file ==undefined){
    //     req.flash('error', 'no file chosen')
    

   
        cloudinary.v2.uploader.upload(req.file.path,   async (err, result) =>{
            console.log('consoling cloud result::',result)
            let { description } = req.body;
            var picture = result.secure_url;
            let newPost = new Post({ description, picture })
            console.log(newPost)
            await newPost.save().then(post =>{
                console.log('consoling promise return::',post)
                req.flash('success', 'Your post has been created')
                res.redirect('/admin')
                
        })

    
  })
});



router.route('/feedback/create')
    .get(adminController.createfeedbackGet);  
    
router.route('/feedback/create')
    .get(adminController.feedbackGet)
    .post(adminController.feedbackPost);    

router.route('/video/create')
    .get((req, res)=>{
     res.render('admin/videos/create');
 })


router.route('/video')
 .get(adminController.videoGet);

router.route('/video/create')
 .post(upload.single('video'), function (req, res, next) {
    // console.log(req)
    // if(req.file ==undefined){
    //     req.flash('error', 'no file chosen')
    

   
        cloudinary.v2.uploader.upload(req.file.path, {resource_type: "auto"},  async (err, result) =>{
            console.log('consoling cloud result::',result)
            let { description } = req.body;
            var video = result.secure_url;
            let newPlay = new Play({ description, video })
            console.log(newPlay)
            await newPlay.save().then(play =>{
                console.log('consoling promise return::',play)
                req.flash('success', 'Your post has been created')
                res.redirect('/admin')
                
        })

    
  })
});




router.route('/posts/delete/:id')
    .delete(adminController.deletePost);  

router.route('/plays/delete/:id')
    .delete(adminController.deletePlay);    

 


 module.exports = router;