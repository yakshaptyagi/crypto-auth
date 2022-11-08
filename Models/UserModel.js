const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id:{
        type:String,
        required: true
    },
    firstname:{
        type:String,
        required: true
    },
    lastname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    phone:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model('UserModel', UserSchema, 'Users');