require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Add this to handle directory creation
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoute');
const productRoutes = require('./routes/productRoutes'); // Import your product routes
const userRoutes = require('./routes/userRoute');

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // Allow cross-origin requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create the uploads directory if it doesn't exist
}

// Serve static files from 'uploads' folder
app.use('/uploads', express.static(uploadDir));

// Register product routes
app.use('/api/products', productRoutes); // Link your product routes to '/api/products'
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB (ensure your MongoDB connection string is correct)

// Server setup
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
