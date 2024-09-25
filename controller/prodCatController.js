const ProductCategory = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const createProductCategory = asyncHandler(async (req, res) => {    
    try {
        const newProductCategory = await ProductCategory.create(req.body);
        res.status(200).json({
            success: true,  
            message: "Product Category created successfully",
            newProductCategory                                  
        });
    } catch (error) {
        res.status(500).json({
            success: false,     
            message: error.message

        });
    }
});


const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getCategory = await ProductCategory.findById(id);
        res.status(200).json(getCategory);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await ProductCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCategory = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            updateCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCategory = await ProductCategory.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            deleteCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}); 

module.exports={createProductCategory,getCategory,getAllCategories,updateCategory,deleteCategory};