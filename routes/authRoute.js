const express = require('express');

const { verifyEmail, loginController, getAllUsers, getUserById,userUpdate, deleteUser, blockUser, unblockUser } = require('../controller/userController');
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
router.put('/update-user',authMiddleware,userUpdate);
router.delete('/delete-user/:id',deleteUser);
router.put('/block-user/:id',authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);

module.exports = router;
