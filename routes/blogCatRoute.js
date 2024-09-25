const express = require('express');
const route = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlogCategory, getCategory, getAllCategories, updateCategory, deleteCategory } = require('../controller/blogCatController');
route.post('/create-blog-category',authMiddleware,isAdmin, createBlogCategory);
route.get('/get-blog-category/:id', getCategory);
route.get('/',getAllCategories);
route.put('/update-blog-category/:id',authMiddleware,isAdmin,updateCategory);
route.delete('/delete-blog-category/:id',authMiddleware,isAdmin,deleteCategory);
module.exports = route;





