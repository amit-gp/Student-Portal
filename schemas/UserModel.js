const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    firstname : {    
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    usn: {
        type: String,
        required:true
    },
    semester:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },

    password : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema, 'users');