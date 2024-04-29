const Restaurant = require('../models/Restaurant');

//@desc Get all Restaurants
//@route GET /api/v1/restaurants
//@access Public
exports.getRestaurants = async (req,res,next) => {
    let query;

    const reqQuery={...req.query};

    const removeFields=['select','sort','page','limit'];

    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);
    let queryStr=JSON.stringify(req.query);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);
    query = Restaurant.find(JSON.parse(queryStr)).populate('reservations reviews restaurantPromos menus');

    if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{

        query = query.sort('name');
    }

    //Pagination
    const page = parseInt(req.query.page,10)||1;
    const limit = parseInt(req.query.limit,10)||25;
    const startIndex = (page-1)*limit;
    const endIndex =  page*limit;
    
    
   
    try {
        const total = await Restaurant.countDocuments();
        query = query.skip(startIndex).limit(limit);
        //Execute query
        const restaurants = await query;
    
        //Pagination result
        const pagination={};
    
        if(endIndex<total){
            pagination.next={
                page:page+1,limit
            }
        }
        if(startIndex>0){
            pagination.prev={
                page:page-1,limit
            }
        }


        res.status(200).json({success:true, count: restaurants.length, data:restaurants});
    } catch (err) {
        res.status(400).json({success:false});
    }

};

//@desc Get single restaurant
//@route GET /api/v1/restaurants/:id
//@access Public
exports.getRestaurant = async (req,res,next) => {
    try {
        console.log("GET /api/v1/restaurants/search");
        
        const  restaurant = await Restaurant.findById(req.params.id).populate('reservations reviews restaurantPromos menus');

        if(!restaurant) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:restaurant});
    } catch (error) {
        return res.status(400).json({success:false});
    }
    
};

//@desc Create a restaurants
//@route POST /api/v1/restaurants/:id
//@access Private
exports.createRestaurant = async (req,res,next) => {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({success:true, data:restaurant});
};

//@desc Update single restaurant
//@route PUT /api/v1/restaurants/:id
//@access Private
exports.updateRestaurant = async (req,res,next) => {
    try {
        const  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!restaurant) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:restaurant});
    } catch (error) {
        return res.status(400).json({success:false});
    }
    
};

//@desc Delete single restaurant
//@route DELETE /api/v1/restaurants/:id
//@access Private
exports.deleteRestaurant = async (req,res,next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if(!restaurant) {
            return res.status(400).json({success:false,message:`Bootcamp can not found with id of ${req.params.id}`});;
        }
        await restaurant.deleteOne();

        res.status(200).json({success:true,data:{}});
    } catch (err) {
        return res.status(400).json({success:false});
    }
   
};

//@desc Search restaurants by name
//@route GET /api/v1/restaurants/:search
//@access Public
exports.searchRestaurants = async (req, res, next) => {
    try {
        const { restaurantName, minPrice, maxPrice } = req.query;

        const searchCriteria = {};

        if (restaurantName) {
            searchCriteria.name = { $regex: restaurantName, $options: 'i' };
        }

        if (minPrice && maxPrice) {
            searchCriteria.priceRange = { 
                $gte: parseInt(minPrice),
                $lte: parseInt(maxPrice) 
            };
        }

        const query = Restaurant.find(searchCriteria).sort('priceRange');
        const restaurants = await query;

        res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

//@desc Get Restaurants (limit to 4)
//@route GET /api/v1/restaurants/:limit
//@access Public
exports.getRestaurantslimitfour = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find().limit(4).populate('reservations reviews');
        const total = await Restaurant.countDocuments();
        
        const pagination = {
            next: total > 4 ? { page: 2, limit: 4 } : null
        };

        res.status(200).json({ success: true, count: restaurants.length, data: restaurants, pagination });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
