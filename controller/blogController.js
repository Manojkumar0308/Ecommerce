const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');


const createBlog = asyncHandler(async (req,res)=>{

});

module.exports={createBlog}