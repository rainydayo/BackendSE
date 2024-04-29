const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50,'Name can not be more than 50 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required:true
    }
   
},{
    toJSON:{virtuals:true},
    toObject: {virtuals:true}
});

MenuSchema.pre(`deleteOne`,{ document:true, query:false},async function(next){
    console.log(`Reviews being removed from restaurant ${this._id}`);
    await this.model(`Menureview`).deleteMany({menu: this._id});

    next();
});
MenuSchema.virtual('menureviews',{
    ref:'Menureview',
    localField:'_id',
    foreignField : 'menu',
    justOne:false
});
MenuSchema.virtual('promotions', {
    ref: 'RestaurantPromo',
    localField: '_id',
    foreignField: 'menu',
    justOne: false
});


module.exports = mongoose.model('Menu', MenuSchema);