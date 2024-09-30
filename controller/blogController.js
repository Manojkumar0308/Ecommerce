
const Blog = require('../models/blogModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');
const {cloudinaryUploadImg} = require('../utils/cloudinary');


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
    validateMongoDbId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).json({success: true, message: "Blog update successfully", updateBlog: updateBlog});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});


const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        // Fetch the blog and populate likes and dislikes with user details
        const getBlog = await Blog.findById(id)
            .populate('likes', 'firstname lastname email') // populate likes with user details
            .populate('dislikes', 'firstname lastname email'); // populate dislikes with user details

        // Increment blog views
        const updateBlogViews = await Blog.findByIdAndUpdate(
            id,
            { $inc: { numViews: 1 } },
            { new: true }
        )
            .populate('likes', 'firstname lastname email')
            .populate('dislikes', 'firstname lastname email');

        res.status(200).json({
            success: true,
            message: "Views increased by 1",
            blog: updateBlogViews,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



const getAllBlogs = asyncHandler(async (req,res)=>{
    try {
        const getAllBlogs = await Blog.find().populate('likes').populate('dislikes');
        res.status(200).json({success: true, message: "All blogs", getAllBlogs: getAllBlogs});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});


const deleteBlog = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Blog deleted successfully",deletedBlog});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});


const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user._id; // Assuming you are getting the authenticated user's id

    validateMongoDbId(blogId);

    try {
        // Find the blog
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Check if the user has already liked the blog
        const isLiked = blog.likes.includes(userId);


        /*The logic assumes a toggle-like behavior:
        If the user has already liked the blog and clicks the "like" button again, 
        it means they want to undo the like—so the user's ID is removed from the likes array, 
        effectively "unliking" the blog. 
        That's why we pull the userId from the likes array and set isLiked to false.
        If the user hasn't liked the blog, clicking the "like" button will add their 
        like—so their userId is pushed to the likes array, and isLiked is set to true. 
        This also removes any potential dislike they may have previously added 
        (to prevent them from both liking and disliking the same blog)*/

        if (isLiked) {
            // If already liked, remove the like
            blog.likes.pull(userId);
            blog.isLiked = false;
        } else {
            // If not liked, add like and remove dislike if it exists
            blog.likes.push(userId);
            blog.isLiked = true;

            if (blog.dislikes.includes(userId)) {
                blog.dislikes.pull(userId);
                blog.isDisLiked = false;
            }
        }

        await blog.save();

        const updatedBlog = await Blog.findById(blogId).populate('likes').populate('dislikes');
        res.status(200).json({ success: true, message: "Blog like updated", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user._id; // Assuming you are getting the authenticated user's id

    validateMongoDbId(blogId);

    try {
        // Find the blog
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Check if the user has already disliked the blog
        const isDisLiked = blog.dislikes.includes(userId);

        if (isDisLiked) {
            // If already disliked, remove the dislike
            blog.dislikes.pull(userId);
            blog.isDisLiked = false;
        } else {
            // If not disliked, add dislike and remove like if it exists
            blog.dislikes.push(userId);
            blog.isDisLiked = true;

            if (blog.likes.includes(userId)) {
                blog.likes.pull(userId);
                blog.isLiked = false;
            }
        }

        await blog.save();

        const updatedBlog = await Blog.findById(blogId).populate('likes').populate('dislikes');
        res.status(200).json({ success: true, message: "Blog dislike updated", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const uploadBlogImages = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if product exists
      const blog = await Blog.findById(id);
      console.log("Blog", blog);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      const imageUploadPromises = req.files.map(async (file) => {
        const result = await cloudinaryUploadImg(file.buffer); // Upload using buffer
        return result.url;
      });
  
      const uploadedImageUrls = await Promise.all(imageUploadPromises);
  
      // Update the product's images array with Cloudinary URLs
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { images: uploadedImageUrls },
        { new: true }
      );
  
      res.status(200).json({
        message: 'Images uploaded successfully',
        product: updatedBlog
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


module.exports={createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog,likeBlog,dislikeBlog,uploadBlogImages}