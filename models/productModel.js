const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    star: { type: Number},
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,trim:true
    },
    slug: {
        type: String,
        required: true,unique:true,lowercase:true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
     },
     sold:{
        type: Number,
        default: 0
     },
    images: {
        type: Array
       
    },
    color:{
        type: String,
      required: true
    },
    category: {
        type: String,
        required: false
    },
    ratings: [{
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },],
    totalRatings: {
        type: String,
        default: 0
    }
},{timestamp:true},);
            

const Product=mongoose.model('Product', productSchema);
module.exports=Product;