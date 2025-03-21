require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');
const authRoutes = require('./Routes/auth-routes');
const candidateRoutes = require('./Routes/candidate-routes');
const adminRoutes = require('./Routes/admin-routes');

const app=express();
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
app.use(express.json());
app.use(cors())
app.use("/api/auth", authRoutes);
app.use("/api/candidate",candidateRoutes);
app.use("/api/admin",adminRoutes);

// Serve uploaded files (optional)
app.use('/uploads', express.static('uploads'));