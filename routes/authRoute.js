const express = require('express');
const { validateAndSendVerificationEmail } = require('../middlewares/errorHandler');
const { verifyEmail } = require('../controller/userController');

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

module.exports = router;
