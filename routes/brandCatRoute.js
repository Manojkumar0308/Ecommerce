const express = require('express');
const route = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBrandCategory, getCategory, getAllCategories, updateCategory, deleteCategory } = require('../controller/brandCatController');
route.post('/create-brand-category',authMiddleware,isAdmin, createBrandCategory);
route.get('/get-brand-category/:id', getCategory);
route.get('/',getAllCategories);
route.put('/update-brand-category/:id',authMiddleware,isAdmin,updateCategory);
route.delete('/delete-brand-category/:id',authMiddleware,isAdmin,deleteCategory);
module.exports = route;





