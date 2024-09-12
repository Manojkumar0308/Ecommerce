const express = require('express');

const { verifyEmail, loginController, getAllUsers, getUserById, deleteUser, updateUser } = require('../controller/userController');
const { validateAndSendVerificationEmail } = require('../middlewares/errorHandler');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');

const router = express.Router();

// Endpoint to send verification email
router.post('/send-verification', validateAndSendVerificationEmail, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Verification email sent. Please check your email.'
    });
});

// Endpoint to verify the email and create the user
router.post('/verify-email', verifyEmail);
router.post('/login',loginController);
router.get('/all-users',getAllUsers);
router.get('/get-user/:id',authMiddleware,isAdmin,getUserById);
router.delete('/delete-user/:id',deleteUser);
router.put('/update-user',authMiddleware,updateUser);
module.exports = router;
