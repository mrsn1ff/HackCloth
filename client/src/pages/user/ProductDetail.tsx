// ✅ Added type update for slug usage
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // ✅ Added Link
import API from '../../api';
import Footer from '../../components/Footer';
import { useCart } from '../admin/CartContext'; // ✅ Updated path to CartContext

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  otherImages?: string[];
  size: string;
  slug: string; // ✅ Needed to route to other product
}

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart(); // ✅ Hook from CartContext
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]); // ✅ New state
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${slug}`);
        setProduct(res.data);
        setSelectedImage(res.data.images[0]);
        setSelectedSize(res.data.size);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    const fetchRelated = async () => {
      try {
        const res = await API.get('/products');
        const filtered = res.data.filter((p: Product) => p.slug !== slug);
        setRelatedProducts(filtered.slice(0, 4)); // ✅ Just pick top 4
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };

    fetchProduct();
    fetchRelated();
  }, [slug]); // ✅ Re-fetch when slug changes

  if (!product)
    return <div className="text-center text-lg mt-10">Loading...</div>;

  return (
    <div>
      <div className="max-w-6xl mx-auto p-5 flex flex-col gap-12 mt-10">
        {/* ✅ Main Product Detail Layout */}
        <div className="flex flex-wrap gap-8">
          {/* Images */}
          <div className="flex-1 min-w-[450px]">
            {/* Main selected image */}
            <img
              src={selectedImage}
              alt="Main Product"
              className="w-full h-auto object-cover rounded-lg mb-4"
            />

            {/* Thumbnail image selector */}
            <div className="flex gap-3 flex-wrap">
              {[...(product.images || []), ...(product.otherImages || [])].map(
                (img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Product ${index}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 object-cover rounded border-2 cursor-pointer transition
            ${
              selectedImage === img
                ? 'border-black'
                : 'border-transparent hover:border-black'
            }`}
                  />
                ),
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-[450px]">
            <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
            <p className="text-2xl font-medium mb-3">
              ₹ {product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-6 text-sm">
              Tax included. Shipping calculated at checkout.
            </p>

            {/* Options */}
            <div className="space-y-5">
              <div>
                <label className="block font-medium mb-1">Color:</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="">Select Color</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Grey">Grey</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Size:</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="mt-8 text-gray-700 leading-relaxed text-l">
                {product.description}
              </div>

              {/* Quantity */}
              <div>
                <label className="block font-medium mb-2">Quantity:</label>
                <div className="flex items-center gap-3">
                  <button
                    className="px-3 py-1 border border-gray-500 rounded"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    className="px-3 py-1 border border-gray-500 rounded"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={() => {
                    if (!selectedSize || !selectedColor) {
                      alert('Please select size and color');
                      return;
                    }

                    // Add item to cart and navigate to Cart page
                    addToCart({
                      _id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0], // Add product image
                      quantity,
                      size: selectedSize,
                      color: selectedColor,
                    });

                    // Redirect to Cart page
                    navigate('/cart');
                  }}
                  className="bg-black text-white px-5 py-2 rounded"
                >
                  Add to Cart
                </button>

                <button className="bg-red-600 text-white px-5 py-2 rounded">
                  Buy it Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Related Products Section */}
        <div>
          <h2 className="text-3xl mt-9 font-semibold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <Link
                to={`/product/${relProd.slug}`}
                key={relProd._id}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg shadow-md">
                  <img
                    src={relProd.images?.[0]}
                    alt={relProd.name}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {relProd.images?.[1] && (
                    <img
                      src={relProd.images[1]}
                      alt={relProd.name + ' alt'}
                      className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <h3 className="text-lg font-semibold">{relProd.name}</h3>
                  <p className="text-gray-700">₹ {relProd.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
