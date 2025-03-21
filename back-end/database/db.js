const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb+srv://madgulasiddarthareddy:GWPrIQS20KTPd4iu@cluster0.3xgqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log("MongoDB connected");
    }catch (e) {
        console.error("MongoDB connection failed");
        process.exit(1);
      }
};

module.exports = connectDB;