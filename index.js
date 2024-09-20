const express = require('express');
const {validateAndSendVerificationEmail} = require('./middlewares/errorHandler');
const app = express();
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// Load environment variables
require('dotenv').config();
const authRoute = require('./routes/authRoute');
const productRoute = require('./routes/productRoute');
const blogRoute = require('./routes/blogRoute');
// Use default port if environment variable is not set
const PORT = process.env.PORT || 4000;


console.log('Process.env.PORT:', process.env.PORT); // Should print '3000'
console.log('PORT:', PORT); // Should print '3000' if dotenv is correctly loaded
const morgan = require('morgan');
// Connect to the database
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

// Use routes
app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute);


// Error handling middlewares
app.use(validateAndSendVerificationEmail);
// app.use(authMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
