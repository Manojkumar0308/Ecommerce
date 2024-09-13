const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const createProduct = asyncHandler(async (req, res) => {

    try {
        const newProduct = await Product.create(req.body);
        res.status(200).json({
            success: true,
            message: "Product created successfully",
            newProduct
        });
    } catch (error) {
       res.status(500).json({
           success: false,
           message: error.message
       }) 
    }

});

const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
        try {
            const product = await Product.findById(id);
            res.status(200).json(product);        
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
});

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
module.exports = {createProduct,getProduct,getAllProducts};