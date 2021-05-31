const mongoose = require('mongoose');
const Schema = mongoose.Schema
const grouoMsgSchema = new mongoose.Schema({
    text:{
        type:String
    },
    to:{type:Schema.Types.ObjectId,
        ref:'User'},
    from:{type:Schema.Types.ObjectId,
        ref:'User'},
    time:{
        type:Date , default: new Date()
    }

},{timestamps:true})
const GroupMsg = mongoose.model("groupMsg",messageSchema);

exports.GroupMsg = GroupMsg;