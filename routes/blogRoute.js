const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadBlogImages } = require('../controller/blogController');
const { authMiddleware,isAdmin } = require('../middlewares/authMiddleware');
const {uploadPhoto,blogImgResize}= require('../middlewares/uploadImages')
const route = express.Router();
route.post('/create-blog',authMiddleware,isAdmin,createBlog);
route.put('/uploadImages/:id',authMiddleware,isAdmin,uploadPhoto.array("images",10),blogImgResize,uploadBlogImages);
route.put('/update-blog/:id',authMiddleware,isAdmin,updateBlog);
route.get('/get-blog/:id',getBlog);
route.get('/getAllBlogs',getAllBlogs);
route.delete('/delete-blog/:id',authMiddleware,isAdmin,deleteBlog);
route.put('/:blogId/like', authMiddleware, likeBlog);
route.put('/:blogId/dislike', authMiddleware, dislikeBlog);
module.exports = route;