const express = require('express');
const { createProduct, getProduct, getAllProducts } = require('../controller/productController');
const route = express.Router();


route.post('/create-product', createProduct);
route.get('/get-product/:id', getProduct);
route.get('/',getAllProducts);
module.exports = route;