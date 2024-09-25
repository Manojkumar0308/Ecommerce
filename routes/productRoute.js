const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist, rating } = require('../controller/productController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const route = express.Router();


route.post('/create-product',authMiddleware,isAdmin, createProduct);
route.get('/get-product/:id', getProduct);
route.get('/',getAllProducts);
route.put('/update-product/:id',authMiddleware,isAdmin,updateProduct);
route.delete('/delete-product/:id',authMiddleware,isAdmin,deleteProduct);
route.put('/wishlist',authMiddleware,addToWishlist);
route.put('/rating',authMiddleware,rating);
module.exports = route;