const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
    id:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    game1_win:{
        type:Number,
        default:0,
    },
    game2_loose:{
        type:Number,
        default:0,
    },
    point:{
        type:Number,
        default:0,
    }
},{
    timestamps: true //언제 생성, 업데이트 됐는지
})

module.exports = mongoose.model('GameUser', userSchema);