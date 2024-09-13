const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const verificationStore = require('../verificationStore'); // Import the verification store
const {generateToken} = require('../config/jwtToken')
const jwt = require('jsonwebtoken');
const { validateMongoDbId } = require('../utils/validateMongoDbId');


//verify email
const verifyEmail = asyncHandler(async (req, res) => {
    try {
        const { email, token } = req.body;

        // Retrieve the stored verification details
        const storedData = verificationStore.get(email);
        console.log(verificationStore)
        if (!storedData) {
            return res.status(400).json({
                status: 'fail',
                message: 'Verification details not found'
            });
        }

        
        // Check if the token matches and hasn't expired
        const isTokenValid = storedData.verificationToken === token;
        console.log(isTokenValid);
        const isTokenExpired = storedData.tokenExpiry < Date.now();
        console.log(isTokenValid);

        if (isTokenExpired) {
            return res.status(400).json({
                status: 'fail',
                message: 'Verification token has expired'
            });
        }

        if (!isTokenValid) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid verification token'
            });
        }


        // If verified, create the user
        const newUser = await User.create({
            firstname: storedData.firstname,
            lastname: storedData.lastname,
            mobile: storedData.mobile,
            email,
            password: storedData.password,
            isVerified: true
        });

        // Remove the verification details from the store
        verificationStore.delete();

        res.status(201).json({
            status: 'success',
            message: 'Email verified and user created successfully',
            user: newUser
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }
});

//Login Controller
const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(user && (await user.isPasswordMatched(password))) {
        res.status(200).json({
          


            //new code with token 
            _id: user?._id,
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            mobile: user?.mobile,
            token: generateToken(user?._id)
        });
    }else{
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password'
        });
    }
})


//Get all users.
 const getAllUsers = asyncHandler(async (req, res) => {
     try {
        const users = await User.find();
        res.status(200).json(users);
     } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message});
     }
 })

 //Get User by id.
 const getUserById= asyncHandler(async (req, res) => {
    const { id } = req.params;  
    validateMongoDbId(id);
     try {
        const getUser = await User.findById(id);
        res.status(200).json(getUser);
     } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
     }
 });

 //update a user
 const userUpdate = asyncHandler(async (req, res) => {
     console.log('first');
     console.log(req.user) ;
     if (!req.user) {
                return res.status(401).json({ message: 'Not authorized or User not found' });
              }else{
                const {_id} = req.user; 
                validateMongoDbId(_id);
                try {
                    const updatedUser = await User.findByIdAndUpdate(
                      _id,
                      {
                        firstname: req?.body?.firstname,
                        lastname: req?.body?.lastname,
                        email: req?.body?.email,
                        mobile: req?.body?.mobile,
                      },
                      {
                        new: true,
                      }
                    );
                    res.status(200).json({success:true,message: 'User updated successfully',updatedUser});
                  } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
                  }
              }
    
 });
 


 //delete a user

 const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.status(200).json({success:true,message:"User deleted successfully",deletedUser:deletedUser});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

//Block a user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    if(!id){
        res.status(404).json({success:false,message:"User not found"});
    }else{
        try {
            const blockedUser = await User.findByIdAndUpdate(
                id,
                {
                    isBlocked: true
                },
                {
                    new: true
                }
            );
            res.status(200).json({success:true,message:"User blocked successfully",blockedUser: blockedUser});
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
   
});

//Unblock a user.
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    if(!id){
        res.status(404).json({success:false,message:"User not found"});
    }else{
        try {
            const unblockedUser = await User.findByIdAndUpdate(
                id,
                {
                    isBlocked: false
                },
                {
                    new: true
                }
            );
            res.status(200).json({success:true,message:"User unblocked successfully",unblockedUser: unblockedUser});
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
   
});

module.exports = { verifyEmail,loginController,getAllUsers,getUserById,userUpdate,deleteUser,blockUser,unblockUser};
