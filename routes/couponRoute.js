const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCoupon, getAllCoupon, updateCoupon } = require('../controller/couponController');

const route = express.Router();
route.post('/create-coupon',authMiddleware,isAdmin,createCoupon);
route.get('/',authMiddleware,isAdmin,getAllCoupon);
route.put('/:id',authMiddleware,isAdmin,updateCoupon);
module.exports = route;