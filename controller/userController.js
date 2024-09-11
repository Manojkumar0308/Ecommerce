const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const verificationStore = require('../verificationStore'); // Import the verification store
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



module.exports = { verifyEmail };
