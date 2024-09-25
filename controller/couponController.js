const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');
const {validateMongoDbId} = require('../utils/validateMongoDbId');

const createCoupon = asyncHandler(async (req, res) => {
    try {        
        const newCoupon = await Coupon.create(req.body);
        res.status(200).json({
            success: true,
            message: "Coupon created successfully",
            newCoupon
        });
    } catch (error) {           
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

const getAllCoupon = asyncHandler(async (req, res) => {
    try {        
        const coupons = await Coupon.find({});
        res.status(200).json({
            success: true, 
            coupons
        });
    } catch (error) {           
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    // validateMongoDbId(id);
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            updatedCoupon
        });
    } catch (error) {       
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = { createCoupon,getAllCoupon,updateCoupon}
