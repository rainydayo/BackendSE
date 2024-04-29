const Review = require('../models/Menureview');
const Restaurant = require('../models/Menu');

exports.getReviews = async (req,res,next)=>{
    let query;
    if (req.params.menuId) {
        console.log(req.params.menuId);
        query = Review.find({ restaurant: req.params.restaurantId, menu: req.params.menuId });
    } else {
        query = Review.find().populate({
            path: 'menu',
            select: 'name price'
        });
    }
    
    try {
        const reviews = await query;
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Review" });
    }
   
}

exports.getReview = async (req, res, next) => {
    try {
        // Extract restaurant ID provided by the user
        const menuId = req.params.menuId;

        // Query all reviews associated with the provided restaurant ID
        const reviews = await Review.find({ menu: menuId });

        // Check if reviews are found
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ success: false, message: `No reviews found for restaurant with ID ${menuId}` });
        }

        // Respond with the found reviews
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot get reviews' });
    }
};


exports.addReview = async (req,res,next)=>{
    
    try{

        // Debug
        req.body.menu = req.params.menuId;
        console.log(req.body.menuId);
        const restaurant = await Restaurant.findById(req.params.menuId);

        if(!restaurant){
            return res.status(404).json({success:false, message:`No restaurant with the id of ${req.params.menuId}`});
        }
      
        req.body.user = req.user.id;


        const review = await Review.create(req.body);
        res.status(200).json({success:true, data: review});
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false , message:'Cannot create Review'});
    }
    
};
exports.updateReview = async (req,res,next)=>{
    try{
        let review = await Review.findById(req.params.id);
        
        if(!review){
            return res.status(404).json({success:false,message:`No review with the id of ${req.params.id}`});
        }

        if(review.user.toString()!==req.user.id && req.user.role !=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this review`});
        }


        review = await Review.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data:review
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:`Cannot update Review`});
    }
};


exports.deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;

        // Find the review by ID
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: `No review with the id of ${reviewId}` });
        }

        // Check if the user is the author of the review or an admin
        if (review.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${userId} is not authorized to delete this review` });
        }

        // User is authorized, proceed to delete the review
        await review.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Cannot delete Review' });
    }
};
