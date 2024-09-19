const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const createProduct = asyncHandler(async (req, res) => {

    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
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

//Update a Product.
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updatedProduct
        });
    } catch (error) {       
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}); 



//Delete a Product

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            deleteProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// const getAllProducts = asyncHandler(async (req, res) => {
//     try {
//         console.log(req.query)
//         const products = await Product.find(req.query);
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 3, sort, category, brand, color, priceMin, priceMax, title, ...otherFilters } = req.query;

        let query = {};

        // Filtering based on category
        if (category) {
            query.category = category;
        }

        // Filtering based on brand
        if (brand) {
            query.brand = brand;
        }

        // Filtering based on color
        if (color) {
            query.color = { $regex: color, $options: 'i' }; // Case-insensitive regex for partial match
        }

        // Filtering based on price range
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = parseFloat(priceMin); // Greater than or equal to priceMin
            if (priceMax) query.price.$lte = parseFloat(priceMax); // Less than or equal to priceMax
        }

        // Filtering based on title
        if (title) {
            query.title = { $regex: title, $options: 'i' }; // Case-insensitive regex for partial match
        }

        // Merge any additional filters dynamically
        query = { ...query, ...otherFilters };

        // Log the query for debugging
        console.log("Query: ", query);

        // Pagination and sorting logic
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageSize;

        let sortOption = {};
        if (sort) {
            const sortFields = sort.split(',');
            sortFields.forEach(field => {
                const direction = field.startsWith('-') ? -1 : 1;
                const fieldName = field.replace('-', '');
                sortOption[fieldName] = direction;
            });
        }

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize);

        res.status(200).json({
            success: true,
            page: pageNumber,
            totalPages: Math.ceil(total / pageSize),
            totalProducts: total,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


module.exports = {createProduct,getProduct,getAllProducts,updateProduct,deleteProduct};