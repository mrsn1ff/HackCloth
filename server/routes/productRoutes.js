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
router.post(
  '/',
  upload.fields([
    { name: 'images', maxCount: 2 },
    { name: 'otherImages', maxCount: 10 },
  ]),
  verifyToken,
  async (req, res) => {
    const productImages = req.files['images'];
    const additionalImages = req.files['otherImages'] || [];

    if (!productImages || productImages.length !== 2) {
      return res
        .status(400)
        .json({ message: 'Exactly 2 main images are required' });
    }

    let { name, description, size, price, type } = req.body;

    // ✅ Normalize size to always be an array
    if (typeof size === 'string') {
      size = [size];
    } else if (!Array.isArray(size)) {
      size = [];
    }

    if (!['T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets'].includes(type)) {
      return res.status(400).json({ message: 'Invalid product type' });
    }

    if (!size.length) {
      return res
        .status(400)
        .json({ message: 'At least one size must be selected' });
    }

    const validSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    if (!size.every((s) => validSizes.includes(s))) {
      return res.status(400).json({ message: 'Invalid size(s) selected' });
    }

    const imageUrls = productImages.map(
      (file) => `http://localhost:5000/uploads/${file.filename}`,
    );

    const otherImageUrls = additionalImages.map(
      (file) => `http://localhost:5000/uploads/${file.filename}`,
    );

    const slug = slugify(name, { lower: true, strict: true });

    try {
      const product = new Product({
        name,
        slug,
        images: imageUrls,
        otherImages: otherImageUrls,
        description,
        size,
        price,
        type,
      });
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error saving product' });
    }
  },
);

// 🟢 GET all products (with optional type filter)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;

    const filter = type ? { type } : {};
    const products = await Product.find(filter);

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
