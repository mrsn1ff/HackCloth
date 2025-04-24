const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/authMiddleware');
const slugify = require('slugify');

const router = express.Router();

// Multer setup for multiple images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// 🟢 POST route to upload product with 2 images
router.post('/', upload.array('images', 2), verifyToken, async (req, res) => {
  console.log(req.files); // Debugging

  if (!req.files || req.files.length !== 2) {
    return res.status(400).json({ message: 'Exactly 2 images are required' });
  }

  const { name, description, size, price } = req.body;

  // Validate size input
  const validSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  if (!validSizes.includes(size)) {
    return res.status(400).json({ message: 'Invalid size selected' });
  }

  const imageUrls = req.files.map(
    (file) => `http://localhost:5000/uploads/${file.filename}`,
  );
  const slug = slugify(name, { lower: true, strict: true }); // Create SEO-friendly slug

  try {
    const product = new Product({
      name,
      slug, // Store slug in DB
      images: imageUrls,
      description,
      size,
      price,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving product' });
  }
});

// 🟢 GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// 🟢 GET single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;
