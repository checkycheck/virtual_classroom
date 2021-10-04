const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose')

const PostSchema = new Schema({
    description:{
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true,
        // default:'https://res.cloudinary.com/dzl4he0xn/image/upload/v1571834880/sample.jpg'
    }

});
 
// PostSchema.plugin(passportLocalMongoose);
module.exports = {Post: mongoose.model('Post', PostSchema)};