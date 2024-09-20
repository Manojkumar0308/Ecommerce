const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');


const createBlog = asyncHandler(async (req,res)=>{
try {
    const newBlog = await Blog.create(req.body);
    res.status(200).json({success: true, message: "Blog created successfully", newBlog});
} catch (error) {
    res.status(500).json({success: false, message: error.message});
}
});



const updateBlog = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).json({success: true, message: "Blog update successfully", updateBlog: updateBlog});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});


const getBlog = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    try {
        const getBlog = await Blog.findById(id);
        const updateBlogViews = await Blog.findByIdAndUpdate(id,{$inc:{numViews:1}},{new:true});
        res.status(200).json({success: true, message: "Views increases by 1", updateBlogViews: updateBlogViews});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});


const getAllBlogs = asyncHandler(async (req,res)=>{
    try {
        const getAllBlogs = await Blog.find();
        res.status(200).json({success: true, message: "All blogs", getAllBlogs: getAllBlogs});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});


const deleteBlog = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Blog deleted successfully",deletedBlog});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

module.exports={createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog}