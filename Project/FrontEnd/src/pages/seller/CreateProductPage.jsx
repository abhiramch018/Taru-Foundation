import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Sparkles, ShieldCheck, HelpCircle, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';
import { productApi } from '../../api/productApi';

const CATEGORIES = [
  'Handloom Textiles',
  'Organic Foods',
  'Handicrafts',
  'Pottery',
  'Natural Beauty',
  'Spices',
];

const DEFAULT_SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
];

export const CreateProductPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [type, setType] = useState('STANDARD'); // 'STANDARD' | 'UNIQUE'
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([DEFAULT_SAMPLE_IMAGES[0]]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
    if (!name || !description || !price || !category) {
      setError('Please fill in all required fields.');
      return;
    }

    const numericPrice = Number(price);
    const numericStock = type === 'UNIQUE' ? 1 : Number(stock);

    if (isNaN(numericPrice) || numericPrice < 0) {
      setError('Please enter a valid price.');
      return;
    }

    if (isNaN(numericStock) || numericStock < 0) {
      setError('Please enter a valid stock quantity.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await productApi.createProduct({
        name,
        description,
        price: numericPrice,
        category,
        stock: numericStock,
        type,
        images: images.length > 0 ? images : [DEFAULT_SAMPLE_IMAGES[0]],
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/seller');
      }, 1500);
    } catch (err) {
      console.error('Failed to create product:', err);
      setError(err.response?.data?.message || 'Failed to submit product listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taru-border">
        <div>
          <Link
            to="/seller"
            className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-taru-dark mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Create New Product Listing</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showcase your rural self-help group's finest craft or soil-grown organic produce to conscious buyers.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Product submitted successfully! Redirecting to dashboard...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form (8 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
          {/* 1. Product Information */}
          <div className="bg-white rounded-2xl border border-taru-border p-6 sm:p-8 shadow-card space-y-5">
            <h3 className="font-serif text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
              1. Product Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Handspun Indigo Khadi Stole"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Description & Craft Story *
                </label>
                <textarea
                  rows="4"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the materials, the region's style, and how your SHG made this item. Highlight the legacy and community effort."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark cursor-pointer font-medium text-gray-800"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Pricing & Stock */}
          <div className="bg-white rounded-2xl border border-taru-border p-6 sm:p-8 shadow-card space-y-5">
            <h3 className="font-serif text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
              2. Pricing & Stock
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1850"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Initial Stock Qty *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    disabled={type === 'UNIQUE'}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark disabled:bg-gray-100 disabled:text-gray-500 font-medium"
                  />
                </div>
              </div>

              {/* Listing Product Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Listing Product Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('STANDARD')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      type === 'STANDARD'
                        ? 'border-taru-dark bg-taru-sand ring-1 ring-taru-dark text-taru-dark'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-bold text-xs">STANDARD</span>
                    <span className="text-[11px] text-gray-500 mt-1">
                      Regular artisanal craft with repeat replenishment stock.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTypeChange('UNIQUE')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      type === 'UNIQUE'
                        ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-600 text-amber-900'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-bold text-xs text-amber-800">UNIQUE PIECE</span>
                    <span className="text-[11px] text-gray-500 mt-1">
                      Individual master art (one-off). Auto-marked SOLD once bought (Stock: 1).
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Image Upload / Media URLs */}
          <div className="bg-white rounded-2xl border border-taru-border p-6 sm:p-8 shadow-card space-y-5">
            <h3 className="font-serif text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
              3. Image Media URLs
            </h3>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct image URL (e.g. https://...)"
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-5 py-2.5 bg-taru-dark text-white rounded-xl text-xs font-semibold hover:bg-taru-dark-hover transition-colors"
                >
                  Add Image
                </button>
              </div>

              {/* Image Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                    <img src={img} alt="Product media" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/seller"
              className="px-6 py-3 border border-taru-border rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Publish Product Listing</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sidebar Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-3">
            <h4 className="font-serif text-sm font-bold text-gray-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-taru-accent" />
              <span>Listing Policy</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every product submitted to the Taru marketplace goes through inspection by platform auditors to ensure authentic GI compliance and fair trade pricing.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-medium">
              Review window is typically under 24 hours.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-2">
            <h4 className="font-serif text-sm font-bold text-gray-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-taru-accent" />
              <span>Need Help?</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Not sure about pricing matrices or categorization? Contact our regional Taru Hub coordinator at <span className="font-semibold text-taru-dark">support@tarufoundation.org</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
