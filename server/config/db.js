const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/economicClasses',
    );
    console.log('✅ Successfully Connected to DATABASE....');
  } catch (err) {
    console.error('❌ Database Connection Failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
