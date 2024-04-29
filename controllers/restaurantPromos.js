const Reservation = require('../models/Reservation');
const RestaurantPromo = require('../models/RestaurantPromo');

exports.getRestaurantPromos = async (req,res,next) => {
    let query;

    const reqQuery={...req.query};
    const removeFields=['select','sort','page','limit'];

    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);
    let queryStr=JSON.stringify(req.query);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);
    query = RestaurantPromo.find(JSON.parse(queryStr))

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
        const total = await RestaurantPromo.countDocuments();
        query = query.skip(startIndex).limit(limit);
        //Execute query
        const restaurantPromos = await query;
    
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


        res.status(200).json({success:true, count: restaurantPromos.length, data:restaurantPromos});
    } catch (err) {
        res.status(400).json({success:false});
    }

}

exports.getRestaurantPromo = async (req,res,next) => {
    try {
        const  restaurantPromo = await RestaurantPromo.findById(req.params.id);

        if(!restaurantPromo) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:restaurantPromo});
    } catch (error) {
        return res.status(400).json({success:false});
    }
    
};

exports.getPromoByRestaurantId = async (req,res,next) => {
    try {
        const  restaurantPromo = await RestaurantPromo.findById(req.params.id);

        if(!restaurantPromo) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:restaurantPromo});
    } catch (error) {
        return res.status(400).json({success:false});
    }
    
};

exports.createRestaurantPromo = async (req,res,next) => {
    const restaurantPromo = await RestaurantPromo.create(req.body);
    res.status(201).json({success:true, data:restaurantPromo});
};

exports.updateRestaurantPromo = async (req,res,next) => {
    try {
        const  restaurantPromo = await RestaurantPromo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!restaurantPromo) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:restaurantPromo});
    } catch (error) {
        return res.status(400).json({success:false});
    }
    
};

exports.deleteRestaurantPromo = async (req,res,next) => {
    try {
        const restaurantPromo = await RestaurantPromo.findById(req.params.id);

        if(!restaurantPromo) {
            return res.status(400).json({success:false,message:`Bootcamp can not found with id of ${req.params.id}`});;
        }
        await restaurantPromo.deleteOne();

        res.status(200).json({success:true,data:{}});
    } catch (err) {
        return res.status(400).json({success:false});
    }
   
};

