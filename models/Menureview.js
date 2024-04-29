const mongoose = require('mongoose');

const MenureviewSchema=new mongoose.Schema({
    rating:{
        type: Number,
        required: [true, 'Please add rating for this restaurant']
    },
    comment:{
        type:String,
        required: [true, "Please add a comment"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    menu:{
        type:mongoose.Schema.ObjectId,
        ref: 'Menu',
        required:true
    }
});


module.exports=mongoose.model('Menureview',MenureviewSchema);