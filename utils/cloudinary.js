const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



const cloudinaryUploadImg = async (buffer) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url });
      });
  
      // Convert buffer to stream and pipe it to Cloudinary
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  };



module.exports = { cloudinaryUploadImg }