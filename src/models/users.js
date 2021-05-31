const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
    },
    lastname:{
        type:String
    },
    email:{
        type:String,
    },
    password:{
        type:String
    }
},{timestamps:true})

const User = new mongoose.model("User",userSchema);
exports.User = User;