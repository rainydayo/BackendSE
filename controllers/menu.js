const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');

//@desc Get all Menus
//@route GET /api/v1/menus
//@access Public
exports.getMenus = async (req,res,next) => {
    let query;
    if (req.params.restaurantId) {
        console.log(req.params.restaurantId);
        query = Menu.find({ restaurant: req.params.restaurantId }).populate('menureviews promotions');
    } else {
        query = Menu.find().populate({
            path: 'restaurant',
            select: 'name description tel'
        });
    }
    query = query.sort('name');
    try {
        const menus = await query;
        res.status(200).json({
            success: true,
            count: menus.length,
            data: menus
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Menu" });
    }
};

//@desc Get single menu
//@route GET /api/v1/menus/:id
//@access Public
exports.getMenu = async (req,res,next) => {
    try {
        //console.log("GET /api/v1/menus/search");
        const  menu = await Menu.findById(req.params.id).populate('');

        if(!menu) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:menu});
    } catch (error) {
        return res.status(400).json({success:false});
    }
    
};

//@desc Create a menus
//@route POST /api/v1/menus/:id
//@access Private
exports.createMenu = async (req,res,next) => {
    try{

        req.body.restaurant = req.params.restaurantId;
        console.log(req.params.restaurantId);
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if(!restaurant){
            return res.status(404).json({success:false, message:`No restaurant with the id of ${req.params.restaurantId}`});
        }

        const menu = await Menu.create(req.body);
        res.status(200).json({success:true, data: menu});
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false , message:'Cannot create menu'});
    }
};

//@desc Update single menu
//@route PUT /api/v1/menus/:id
//@access Private
exports.updateMenu = async (req,res,next) => {
    try {
        const  menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!menu) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:menu});
    } catch (error) {
        return res.status(400).json({success:false});
    }
    
};

//@desc Delete single menu
//@route DELETE /api/v1/menus/:id
//@access Private
exports.deleteMenu = async (req,res,next) => {
    try {
        const menu = await Menu.findById(req.params.id);

        if(!menu) {
            return res.status(400).json({success:false,message:`Bootcamp can not found with id of ${req.params.id}`});;
        }
        await menu.deleteOne();

        res.status(200).json({success:true,data:{}});
    } catch (err) {
        return res.status(400).json({success:false});
    }
   
};
