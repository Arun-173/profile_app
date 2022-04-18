const mongoose = require('mongoose');
const schema = mongoose.Schema;

const passportlocalmongoose = require('passport-local-mongoose');

const user = new schema({
    username:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        // required:true
    }
},{timestamp:true});

user.plugin(passportlocalmongoose);

const sign = mongoose.model('user',user);

module.exports = sign;
