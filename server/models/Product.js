// === models/Product.js ===
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  images: {
    type: [String], // array of 2 image URLs
    validate: [arrayLimit, '{PATH} must have exactly 2 images'],
  },
  otherImages: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  size: {
    type: [String],
    enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets'],
    required: true,
  },
});

function arrayLimit(val) {
  return val.length >= 1;
}

module.exports = mongoose.model('Product', productSchema);
