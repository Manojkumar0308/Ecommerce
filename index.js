const express = require('express');
const {validateAndSendVerificationEmail} = require('./middlewares/errorHandler');
const app = express();
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');

// Load environment variables
require('dotenv').config();

// Use default port if environment variable is not set
const PORT = process.env.PORT || 4000;
const authRoute = require('./routes/authRoute');


console.log('Process.env.PORT:', process.env.PORT); // Should print '3000'
console.log('PORT:', PORT); // Should print '3000' if dotenv is correctly loaded

// Connect to the database
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use routes
app.use('/api/user', authRoute);

// Error handling middlewares
app.use(validateAndSendVerificationEmail);
// app.use(authMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
