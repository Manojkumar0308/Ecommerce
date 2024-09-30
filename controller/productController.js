const Product = require('../models/productModel');
const fs = require('fs');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const {cloudinaryUploadImg} = require('../utils/cloudinary');

const {validateMongoDbId} = require('../utils/validateMongoDbId');

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


//Add to Wishlist with toggle functionality.

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyAdded = user?.wishlist?.find((id) => id.toString() === productId);

        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: productId },
                },
                {
                    new: true,
                }
            );
            res.status(200).json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: productId },
                },
                {
                    new: true,
                }
            );  
            res.status(200).json(user);
        }                                           
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }   

});

const rating = asyncHandler(async (req, res) => {
  
    const { star,comment, prodId } = req.body; // Star rating and Product ID
    const userId = req.user._id; // User ID
   

    try {
        const product = await Product.findById(prodId);
        
        // Check if product exists
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user has already rated the product
        const alreadyRatedIndex =  product.ratings.find((rating) => rating.postedby?.toString() === userId.toString());

        if (alreadyRatedIndex) {
           
            alreadyRatedIndex.star = star;
            alreadyRatedIndex.comment = comment; // Update the comment
          } else {
            
            product.ratings.push({ star,comment, postedby: userId });
          }
           // Calculate the average rating
        const totalStars = product.ratings.reduce((acc, rating) => acc + rating.star, 0);
        const totalRatings = product.ratings.length;
        product.totalRatings = (totalStars / totalRatings).toFixed(1); // Set to 1 decimal place

        // Save the updated product
        await product.save();

        return res.json({ message: "Rating submitted successfully", product });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Server error" });
    }
});



  // Upload images locally and store URLs in MongoDB
  const uploadProductImages = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if product exists
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const imageUploadPromises = req.files.map(async (file) => {
        const result = await cloudinaryUploadImg(file.buffer); // Upload using buffer
        return result.url;
      });
  
      const uploadedImageUrls = await Promise.all(imageUploadPromises);
  
      // Update the product's images array with Cloudinary URLs
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { images: uploadedImageUrls },
        { new: true }
      );
  
      res.status(200).json({
        message: 'Images uploaded successfully',
        product: updatedProduct
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
module.exports = {createProduct,getProduct,getAllProducts,updateProduct,deleteProduct,addToWishlist,rating,uploadProductImages};