import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Search, Upload, Link } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`)
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editItem?.id) {
        await axios.put(`${API}/products/${editItem.id}`, data);
      } else {
        await axios.post(`${API}/products`, data);
      }
      await fetchData();
      setShowModal(false);
      setEditItem(null);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`${API}/products/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting product');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products Manager</h1>
          <p className="text-gray-600">Manage product images, descriptions, and prices</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {products.length === 0 ? 'No products found. Add one to get started.' : 'No products match your search.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">SKU: {product.sku}</p>
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-amber-600 mb-2">{product.type}</p>
                  <p className="text-lg font-bold text-amber-700">₹{product.basePrice}/100g</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => { setEditItem(product); setShowModal(true); }}
                      className="flex-1 flex items-center justify-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-1 p-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <ProductForm
              item={editItem}
              categories={categories}
              onSave={handleSave}
              onClose={() => { setShowModal(false); setEditItem(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Product Form
const ProductForm = ({ item, categories, onSave, onClose }) => {
  const [form, setForm] = useState(item || {
    name: '',
    slug: '',
    category: '',
    type: '',
    basePrice: 0,
    image: '',
    images: [],
    sku: '',
    shortDescription: '',
    description: '',
    benefits: [],
    features: ['Healthy Heart', 'High Nutrition', 'Gluten Free', 'Cholesterol Free']
  });
  const [benefitInput, setBenefitInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setForm({ ...form, benefits: [...form.benefits, benefitInput.trim()] });
      setBenefitInput('');
    }
  };

  const removeBenefit = (index) => {
    setForm({ ...form, benefits: form.benefits.filter((_, i) => i !== index) });
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setForm({ ...form, images: [...form.images, imageInput.trim()] });
      setImageInput('');
    }
  };

  const removeImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{item ? 'Edit Product' : 'Add Product'}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({
              ...form,
              name: e.target.value,
              slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Premium California Almonds"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="DRF001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
          <input
            type="text"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Almonds"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (per 100g) *</label>
          <input
            type="number"
            value={form.basePrice}
            onChange={(e) => setForm({ ...form, basePrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="145"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL *</label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="https://..."
          />
          {form.image && <img src={form.image} alt="Preview" className="mt-2 h-24 object-cover rounded-lg" />}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Image URL"
            />
            <button onClick={addImage} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
          <input
            type="text"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Brief product description"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            rows="4"
            placeholder="Detailed product description"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Add a benefit"
              onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
            />
            <button onClick={addBenefit} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.benefits.map((benefit, i) => (
              <span key={i} className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                {benefit}
                <button onClick={() => removeBenefit(i)} className="text-amber-600 hover:text-amber-800">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => onSave(form)}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Save Product
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProductsManager;
