import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const CATEGORIES = [
  'Handloom Textiles',
  'Organic Foods',
  'Handicrafts',
  'Pottery',
  'Natural Beauty',
  'Spices',
];

export const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [type, setType] = useState('STANDARD');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProductById(id);
        if (data) {
          setName(data.name || '');
          setDescription(data.description || '');
          setCategory(data.category || CATEGORIES[0]);
          setPrice(String(data.price || ''));
          setStock(String(data.stock || '1'));
          setType(data.type || 'STANDARD');
          setImages(data.images || []);
        }
      } catch (err) {
        console.error('Failed to load product for editing:', err);
        setError('Unable to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    if (selectedType === 'UNIQUE') {
      setStock('1');
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericPrice = Number(price);
    const numericStock = type === 'UNIQUE' ? 1 : Number(stock);

    if (isNaN(numericPrice) || numericPrice < 0) {
      setError('Please enter a valid price.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await productApi.updateProduct(id, {
        name,
        description,
        price: numericPrice,
        category,
        stock: numericStock,
        type,
        images,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/seller');
      }, 1200);
    } catch (err) {
      console.error('Update failed:', err);
      setError(err.response?.data?.message || 'Failed to update product listing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <LoadingSpinner text="Fetching product data..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          to="/seller"
          className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-taru-dark mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Edit Product Listing</h1>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Product updated successfully! Returning to dashboard...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-taru-border p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Product Description *</label>
          <textarea
            rows="4"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Qty *</label>
            <input
              type="number"
              required
              min="0"
              disabled={type === 'UNIQUE'}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Type</label>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => handleTypeChange('STANDARD')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                type === 'STANDARD'
                  ? 'bg-taru-dark text-white border-taru-dark'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              STANDARD
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('UNIQUE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                type === 'UNIQUE'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              UNIQUE PIECE (1-of-1)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Image URLs</label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Add image URL..."
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-taru-dark text-white rounded-xl text-xs font-semibold"
            >
              Add
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3 pt-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                <img src={img} alt="media" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <Link
            to="/seller"
            className="px-5 py-2.5 border border-taru-border rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl text-xs font-semibold shadow"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
