const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const cloudinaryUploadImg = async (fileToUpload) => {
  
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUpload, ( result) => {
            // if (error) throw error;
            resolve({
                url: result.secure_url
            },{resource_type: "auto"});
        });
    });
};

module.exports = { cloudinaryUploadImg }