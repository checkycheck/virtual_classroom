const express = require("express");
const app = express();
const defaultController = require('../controllers/defaultController');
const {isUserAuthenticated} = require("../config/customFunctions");
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin').Admin;
const adminController = require('../controllers/adminController');


const router = express.Router();

router.all('/*',  (req, res, next)=>{
  req.app.locals.layout = 'default';
  next() 
});




router.route("/")
.get(defaultController.index)
.post(defaultController.indexPost);

router.route('/video')
  .get(defaultController.videoGet);

router.route('/create')
  .post(defaultController.createProject);  

router.route("/gallery")
 .get(defaultController.galleryGet);

router.route("/contact")
  .get(defaultController.contactGet);
  
router.route("/service")
  .get(defaultController.serviceGet);
  
router.route("/about")
  .get(defaultController.aboutGet);  

    


    //define local strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, (req, email, password, done) => {
          Admin.findOne({email: email}).then(user => {
            if(!user){
              Admin.findOne({email:email}).then(user =>{
                if(!user){
                  return done(null, false, req.flash('error-message', 'User not found with this email'));
                }
                bcrypt.compare(password, user.password, (err, passwordMatched) =>{
                  if(err){
                    return err;
                  }
                  if(!passwordMatched){
                    return done(null, false, req.flash('error-message', 'invalid username or password'));
                  }
        
                  return done(null, user, req.flash('success-message', 'login successful'));
                });
              })
              
            }
            bcrypt.compare(password, user.password, (err, passwordMatched) =>{
              if(err){
                return err;
              }
              if(!passwordMatched){
                return done(null, false, req.flash('error-message', 'invalid username or password'));
              }
    
              return done(null, user, req.flash('success-message', 'login successful'));
            });
          });
    }));
    
    
    
    
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      Admin.findById(id, function(err, user) {
        if(!user){
          Admin.findById(id, function(err, user){
            done(err, user);
          })
        }else{
          done(err, user);
        }
        
      });
    });
    
    
    router.route('/login')
      .get(defaultController.loginGet)
      .post(passport.authenticate('local',{
        successRedirect: '/admin',
        failureRedirect:'/login',
        failureFlash: true,
        successFlash: true,
        session: true
       
      }));

      
    router.route('/logout')
        .get(defaultController.logoutGet); 



  module.exports = router;