const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaySchema = new Schema({
    description:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    }
});

module.exports = {Play: mongoose.model('Play', PlaySchema)};