const mongoose = require('mongoose');

const RestaurantPromoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a promotion name'],
        trim: true,
    },
    detail: {
        type: String,
        required: [true, 'Please add a promotion detail']
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required:true
    },
    startDate:{
        type: Date,
        required:true
    },
    endDate:{
        type: Date,
        required:true
    },
    menu:[{
        type:mongoose.Schema.ObjectId,
        ref: 'Menu',
        required:true
    }],
})
module.exports=mongoose.model('RestaurantPromo',RestaurantPromoSchema);