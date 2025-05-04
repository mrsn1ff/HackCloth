// src/pages/AdminDashboard.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const AdminDashboard: React.FC = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [hoverImage, setHoverImage] = useState<File | null>(null);
  const [otherImages, setOtherImages] = useState<FileList | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSize((prevSize) =>
      prevSize.includes(value)
        ? prevSize.filter((size) => size !== value)
        : [...prevSize, value],
    );
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!productImage || !hoverImage) {
      setMessage('❌ Please upload both Product and Hover images.');
      setLoading(false);
      return;
    }

    const formData = new FormData(); // ✅ Declare first

    formData.append('name', name);
    formData.append('description', description);
    size.forEach((s) => formData.append('size', s));
    formData.append('price', price);
    formData.append('type', type);

    // ✅ Append the 2 required main images
    formData.append('images', productImage);
    formData.append('images', hoverImage);

    // ✅ Append any additional (other) images
    if (otherImages) {
      Array.from(otherImages).forEach((file) => {
        formData.append('otherImages', file);
      });
    }

    try {
      await API.post('/products', formData);
      setMessage('✅ Product uploaded successfully!');
      setName('');
      setDescription('');
      setSize([]);
      setPrice('');
      setType('');
      setProductImage(null);
      setHoverImage(null);
      setOtherImages(null);
      (document.getElementById('productImage') as HTMLInputElement).value = '';
      (document.getElementById('hoverImage') as HTMLInputElement).value = '';
    } catch (err: any) {
      setMessage(err.response?.data?.message || '❌ Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ Container styles improved for responsiveness
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛠️ Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="mt-4 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md transition"
        >
          Logout
        </button>
      </div>

      {message && (
        <div
          className={`p-4 mb-6 text-sm rounded-md ${
            message.startsWith('✅')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      {/* ✅ Form layout improved */}
      <form
        onSubmit={handleUpload}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="col-span-1">
          <label className="block mb-1 font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block mb-1 font-medium text-gray-700">
            Product Price (₹)
          </label>
          <input
            type="number"
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block mb-1 font-medium text-gray-700">
            Product Size
          </label>
          <div className="flex flex-wrap gap-3">
            {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((s) => (
              <label key={s} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={s}
                  checked={size.includes(s)}
                  onChange={handleSizeChange}
                  className="form-checkbox"
                />
                <span className="ml-2">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <label className="block mb-1 font-medium text-gray-700">
            Product Image
          </label>
          <input
            id="productImage"
            type="file"
            accept="image/*"
            onChange={(e) => setProductImage(e.target.files?.[0] || null)}
            required
            className="w-full"
          />
        </div>

        <div className="col-span-1">
          <label className="block mb-1 font-medium text-gray-700">
            Hover Image
          </label>
          <input
            id="hoverImage"
            type="file"
            accept="image/*"
            onChange={(e) => setHoverImage(e.target.files?.[0] || null)}
            required
            className="w-full"
          />
        </div>

        <div className="col-span-1">
          <label className="block mb-1 font-medium text-gray-700">
            Product Type
          </label>
          <select
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            {['T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets'].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-full">
          <label className="block mb-1 font-medium text-gray-700">
            Product Other Images (up to 10)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setOtherImages(e.target.files)}
            className="w-full"
          />
        </div>

        <div className="col-span-full">
          <label className="block mb-1 font-medium text-gray-700">
            Product Description
          </label>
          <textarea
            className="w-full border px-4 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="col-span-full flex justify-end">
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
