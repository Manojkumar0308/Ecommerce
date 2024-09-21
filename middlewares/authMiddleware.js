const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
try {
    if(token){
        
        const verificationToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(verificationToken)
        const user = await User.findById(verificationToken?.id);     
        console.log(user)
        req.user = user;
        console.log(req.user)
        next();
    }else{
       res.status(401).json({message:'Unauthorized, token missing'});
    } 
} catch (error) {
    res.status(500).json({message:'Not authorized, token failed with 500 serer error'});
}      
    }else{
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    console.log(req.user);
    const {email} = req.user;
    const user = await User.findOne({email});
    if(user.role === 'admin'){
        next();
    }else{
        res.status(401).json({message:'Not authorized as an admin'});
       
    }   
});

module.exports = {authMiddleware,isAdmin}; 