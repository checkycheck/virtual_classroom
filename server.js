// impoerting different modules
const {globalVariables} = require('./config/configuration');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
const passport = require('passport');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const expresshandlebars = require('express-handlebars');
const {mongoDbUrl} = require('./config/configuration');
const {PORT} = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo");
const {selectOption} = require('./config/customFunctions');
// const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');



const app = express();
//===== MongoDB Connection starts =====//
const productionDBString = `mongodb+srv://coza:6045@cluster0.ikkyv.mongodb.net/project?retryWrites=true&w=majority`;
// const productionDBString = `mongodb://${config.production.username}:${config.production.password}@${config.production.host}:${config.production.port}/${config.production.dbName}?authSource=${config.production.authDb}`;
// check
var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(productionDBString, options, function (err) {
  if (err) {
    console.log("Mongo db connection failed");
  } else {
    console.log("Connected to mongo db");
  }
});

/** Mongo on connection emit */
mongoose.connection.on("connect", function () {
  console.log("Mongo Db connection success");
});

/** Mongo db error emit */
mongoose.connection.on("error", function (err) {
  console.log(`Mongo Db Error ${err}`);
});

/** Mongo db Retry Conneciton */
mongoose.connection.on("disconnected", function () {
  console.log("Mongo db disconnected....trying to reconnect. Please wait.....");
  mongoose.createConnection();
});
//===== MongoDB Connection ends =====//

// configure express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use(cookieParser());


// flash and session
app.use(session({
    secret: 'zacks1',
    saveUninitialized: true,
    resave: true,
    // store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        maxAge: 180 * 60 * 1000
      }


}));


//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// global variable
app.use(flash());
app.use(globalVariables);

// ========================================agora set up======================================
module.exports.nocache = (req, res, next) =>{
  res.header('Cache-Control', 'private, ni-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

module.exports.generateAccessToken = (req, res) =>{
  // set response header
  res.header('Access-Control-Allow-Origin', '*');
  // get channel name
  const channelName = req.query.channelName;
  if(!channelName){

  }
  // get uid
  let uid = req.query.uid;
  if(!uid || uid == ''){
    uid = 0;
  }
  let role = RtcRole.SUBSCRIBER;
  if(req.query.role == 'publisher'){
    role = RtcRole.PUBLISHER;
  }
  // get expire time
  let expireTime = req.query.expireTime;
  if(!expireTime || expireTime == ''){
    expireTime = 3600;
  }else{
    expireTime = parseInt(expireTime, 10);
  }
// calculate privilage expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  // build the token
  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName. uid, role, privilegeExpireTime);

  // return token
  return res.json({'token': token});
}

// fileupload
// app.use(fileUpload());


// setup view engine to use handlebars
app.engine(
    ".hbs",
    expresshandlebars({
      defaultLayout: "default",
      helpers: {select: selectOption},
      extname: ".hbs"
    })
  );
  app.set("view engine", ".hbs");


// method override middleware
app.use(methodOverride('newMethod'));




// Route grouping
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);











app.listen(PORT, () =>{
    console.log(`app started at port ${PORT}`);
});