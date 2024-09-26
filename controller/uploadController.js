const fs = require("fs");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

const { validateMongoDbId } = require("../utils/validateMongoDbId");

const {
  cloudinaryUploadImg,
} = require("../utils/cloudinary");
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findProduct = Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true}
    );
   
    res.json(findProduct);
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
  }
});

module.exports = {
  uploadImages,
}