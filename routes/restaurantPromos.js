const express = require('express');
const {
    getRestaurantPromos,
    getRestaurantPromo,
    createRestaurantPromo,
    updateRestaurantPromo,
    deleteRestaurantPromo
  } = require("../controllers/restaurantPromos");
  
  const router = express.Router();
  
  const { protect, authorize } = require("../middleware/auth");

  router
    .route("/")
    .get(getRestaurantPromos) 
    .post(protect, authorize("admin"), createRestaurantPromo);
  router
    .route("/:id")
    .get(getRestaurantPromo)
    .put(protect, authorize("admin"), updateRestaurantPromo)
    .delete(protect, authorize("admin"), deleteRestaurantPromo);
  
  module.exports = router;
  