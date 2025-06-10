const mongoose=require('mongoose')

const roomSchema=new mongoose.Schema({
    name:{type:String,required:true},
    players:{
        x: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        o:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    score :{
        x: {
            type: Number,
            default: 0
        },
        o: {
            type: Number,
            default: 0
        }
    },
    rounds: {
        type: Number,
        default: 1
    },
    turn: {
        type: String,
        enum: ['x', '0'],
        default: 'x'
    },
    status: {
        type: String,
        enum: ['waiting', 'full'],
        default: 'waiting'
    },
    board: {
        type: Array,
        default: [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]
    },
});

module.exports=mongoose.model('Room',roomSchema)