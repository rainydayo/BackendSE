const mongoose = require('mongoose');

const ReviewSchema=new mongoose.Schema({
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
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required:true
    }
});


module.exports=mongoose.model('Review',ReviewSchema);