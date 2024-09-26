const express = require("express");
const { uploadImages } = require("../controller/uploadController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const {uploadPhoto, productImgResize} = require("../middlewares/uploadImages");
const router = express.Router();
router.put("/uploadImages/:id",authMiddleware,isAdmin,uploadPhoto.array("images",10),productImgResize, uploadImages);

module.exports = router