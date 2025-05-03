import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import Footer from '../../components/Footer';

interface Product {
  _id: string;
  name: string;
  price: number;
  slug: string;
  images: string[];
  type: string;
}

const SweatshirtsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    API.get('/products?type=Sweatshirts')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const displayedProducts = showAll ? products : products.slice(0, 8);

  return (
    <div className="w-full">
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Sweatshirts Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {displayedProducts.map((product) => (
            <div key={product._id} className="text-center group">
              <Link to={`/product/${product.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden rounded-lg shadow-md">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {product.images?.[1] && (
                    <img
                      src={product.images[1]}
                      alt={`${product.name} Hover`}
                      className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-700">₹ {product.price.toFixed(2)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {!showAll && products.length > 8 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
            >
              See More
            </button>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default SweatshirtsPage;
