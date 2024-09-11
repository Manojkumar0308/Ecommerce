const mongoose = require('mongoose');


const dbConnect = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URL);
      
        console.log('Database Connected successfully ');
    } catch (error) {
        console.log(`first db connected ${process.env.MONGO_UR}`)
        console.error('Database connection error:', error);
    }
};

module.exports = dbConnect;
