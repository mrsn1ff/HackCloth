// === models/Product.js ===
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: { 
    type: String,
    unique: true 
  },
  images: {
    type: [String],  // array of 2 image URLs
    validate: [arrayLimit, '{PATH} must have exactly 2 images']
  },
  description: {
    type: String,
    required: true
  },
  size: {
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

function arrayLimit(val) {
  return val.length === 2;
}

module.exports = mongoose.model('Product', productSchema);
