const Post = require('../models/postModel').Post;
const Play = require('../models/playModel').Play;
const {isEmpty} = require('../config/customFunctions');
let axios = require('axios');

module.exports = {
    index: async (req, res)=>{
        
       
        const posts = await Post.find().sort({_id:-1});
        const plays = await Play.find();

    res.render('default/index', {posts: posts, plays: plays});

    },

    videoGet: async (req, res) =>{
        const plays = await Play.find().sort({_id:-1});



                // HTTP basic authentication example in node.js using the RTC Server RESTful API
        const https = require('https')
        // Customer ID
        const customerKey = "fb093e06891e44508e0385a743a5c768"
        // Customer secret
        const customerSecret = "f2c8fc7277bb435591c81a1cbe7d4ae8"
        // Concatenate customer key and customer secret and use base64 to encode the concatenated string
        const plainCredential = customerKey + ":" + customerSecret
        // Encode with base64
        encodedCredential = Buffer.from(plainCredential).toString('base64')
        authorizationField = "Basic " + encodedCredential


        // Set request parameters
        const options = {
        hostname: 'api.agora.io',
        port: 443,
        path: '/dev/v1/projects',
        method: 'GET',
        headers: {
            'Authorization':authorizationField,
            'Content-Type': 'application/json'
        }
        }

        // Create request object and send request
        const reqq = https.request(options, res => {
        console.log(`Status code: ${res.statusCode}  ;;;;;;;;;;${res}`)

        res.on('data', d => {
            process.stdout.write(d)
        })
        })

        reqq.on('error', error => {
        console.error(error)
        })

        reqq.end()






        res.render('default/video', {plays: plays})
    },
    createProject:(req, res)=>{
        let name = req.body.name;
        let enable_sign_key = true;
        // Customer ID
        const customerKey = "fb093e06891e44508e0385a743a5c768"
        // Customer secret
        const customerSecret = "f2c8fc7277bb435591c81a1cbe7d4ae8"
        // Concatenate customer key and customer secret and use base64 to encode the concatenated string
        const plainCredential = customerKey + ":" + customerSecret
        // Encode with base64
        let encodedCredential = Buffer.from(plainCredential).toString('base64')
        let authorizationField = "Basic " + encodedCredential
        const reqBody = {
            name,
            enable_sign_key
          }
          const options = {
            headers: {
                'Authorization':authorizationField,
                "content-type": "application/json"
            }
          }
          let response = axios.post(`https://api.agora.io/dev/v1/project`, reqBody, options);
          console.log("response+========================================================", response);
          res.send(response);

    },




    getPosts:  (req, res) =>{
      
            res.render('admin/posts/index', {posts: posts});
    },


    

    indexPost: async (req, res) =>{

       

        // check for new file
        let fileName = '';

        if(!isEmpty(req.files)){
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir+filename, (err) => {
                if(err)
                    throw err;
            });
        }
        

       const  newPost = new Post({
            name: req.body.name,
            location: req.body.location,
            file: `/uploads/${filename}`,
            number: req.body.number,
            description: req.body.description,
            creationDate: req.body.creationDate
        });

        


       await newPost.save().then(post => {
            console.log('POSTS',post);
            req.flash('success-message', 'report created successfully, thank you for your time.');
            res.redirect('/');
        });

    },


    galleryGet: async (req, res) =>{
        const posts = await Post.find().sort({_id:-1});
        res.render('default/gallery', {posts: posts});
    },

    contactGet: (req, res) =>{
        res.render('default/contact');
    },

    serviceGet: (req, res) =>{
        res.render('default/service');
    },

    aboutGet: (req, res) =>{
        res.render('default/about');
    },

    loginGet: (req, res) =>{
        res.render('default/login', {message: req.flash('error') });
    },


    logoutGet: (req, res) =>{
        req.logout();
        req.flash("success", "See you later!")
        res.redirect("/");
    }
    
}