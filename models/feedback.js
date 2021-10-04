const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    name:{
        type: String,
        required: true
        
    },
    description:{
        type: String,
        required: true
    }


});

module.exports = {Feedback: mongoose.model('Feedback', FeedbackSchema)};