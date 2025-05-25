import React, { useEffect, useState } from 'react';
import API from '../../api';
import Footer from '../../components/Footer';
import ProductGrid from '../../components/ProductGrid';

interface Product {
  _id: string;
  name: string;
  price: number;
  slug: string;
  images: string[];
}

const LandingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);  

  useEffect(() => {
    API.get('/products?type=Hoodies')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full">
      <ProductGrid
        products={products}
        showAll={showAll}
        setShowAll={setShowAll}
      />
      <Footer />
    </div>
  );
};

export default LandingPage;
