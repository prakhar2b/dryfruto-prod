import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FrontendManager = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [heroSlides, setHeroSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [giftBoxes, setGiftBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [heroRes, catRes, testRes, giftRes] = await Promise.all([
        axios.get(`${API}/hero-slides`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/testimonials`),
        axios.get(`${API}/gift-boxes`)
      ]);
      setHeroSlides(heroRes.data);
      setCategories(catRes.data);
      setTestimonials(testRes.data);
      setGiftBoxes(giftRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      const endpoint = {
        hero: 'hero-slides',
        categories: 'categories',
        testimonials: 'testimonials',
        giftboxes: 'gift-boxes'
      }[activeTab];

      if (editItem?.id) {
        await axios.put(`${API}/${endpoint}/${editItem.id}`, data);
      } else {
        await axios.post(`${API}/${endpoint}`, data);
      }
      await fetchData();
      setShowModal(false);
      setEditItem(null);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const endpoint = {
        hero: 'hero-slides',
        categories: 'categories',
        testimonials: 'testimonials',
        giftboxes: 'gift-boxes'
      }[activeTab];

      await axios.delete(`${API}/${endpoint}/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting item');
    }
  };

  const tabs = [
    { id: 'hero', name: 'Hero Slides' },
    { id: 'categories', name: 'Categories' },
    { id: 'testimonials', name: 'Testimonials' },
    { id: 'giftboxes', name: 'Gift Boxes' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return <HeroSlidesList data={heroSlides} onEdit={(item) => { setEditItem(item); setShowModal(true); }} onDelete={handleDelete} />;
      case 'categories':
        return <CategoriesList data={categories} onEdit={(item) => { setEditItem(item); setShowModal(true); }} onDelete={handleDelete} />;
      case 'testimonials':
        return <TestimonialsList data={testimonials} onEdit={(item) => { setEditItem(item); setShowModal(true); }} onDelete={handleDelete} />;
      case 'giftboxes':
        return <GiftBoxesList data={giftBoxes} onEdit={(item) => { setEditItem(item); setShowModal(true); }} onDelete={handleDelete} />;
      default:
        return null;
    }
  };

  const renderModal = () => {
    switch (activeTab) {
      case 'hero':
        return <HeroSlideForm item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null); }} />;
      case 'categories':
        return <CategoryForm item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null); }} />;
      case 'testimonials':
        return <TestimonialForm item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null); }} />;
      case 'giftboxes':
        return <GiftBoxForm item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null); }} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Front End Manager</h1>
          <p className="text-gray-600">Manage website content, images, and descriptions</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-emerald-600 border-b-2 border-emerald-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          renderContent()
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {renderModal()}
          </div>
        </div>
      )}
    </div>
  );
};

// Hero Slides List
const HeroSlidesList = ({ data, onEdit, onDelete }) => (
  <div className="grid gap-4">
    {data.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No hero slides found. Add one to get started.</p>
    ) : (
      data.map((slide) => (
        <div key={slide.id} className="flex items-center gap-4 p-4 border rounded-lg">
          <img src={slide.image} alt={slide.title} className="w-32 h-20 object-cover rounded-lg" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{slide.title}</h3>
            <p className="text-sm text-gray-500">{slide.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(slide)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <Edit2 className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(slide.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

// Categories List
const CategoriesList = ({ data, onEdit, onDelete }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {data.length === 0 ? (
      <p className="text-gray-500 text-center py-8 col-span-full">No categories found. Add one to get started.</p>
    ) : (
      data.map((cat) => (
        <div key={cat.id} className="border rounded-lg overflow-hidden">
          <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover" />
          <div className="p-3">
            <h3 className="font-semibold text-gray-800">{cat.name}</h3>
            <p className="text-sm text-gray-500">{cat.slug}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => onEdit(cat)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(cat.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

// Testimonials List
const TestimonialsList = ({ data, onEdit, onDelete }) => (
  <div className="grid gap-4">
    {data.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No testimonials found. Add one to get started.</p>
    ) : (
      data.map((item) => (
        <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
          <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600 mt-1">"{item.review}"</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <Edit2 className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

// Gift Boxes List
const GiftBoxesList = ({ data, onEdit, onDelete }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {data.length === 0 ? (
      <p className="text-gray-500 text-center py-8 col-span-full">No gift boxes found. Add one to get started.</p>
    ) : (
      data.map((box) => (
        <div key={box.id} className="border rounded-lg overflow-hidden">
          <img src={box.image} alt={box.name} className="w-full h-32 object-cover" />
          <div className="p-3">
            <h3 className="font-semibold text-gray-800">{box.name}</h3>
            <p className="text-emerald-600 font-bold">₹{box.price}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => onEdit(box)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(box.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

// Forms
const HeroSlideForm = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState(item || { title: '', subtitle: '', description: '', image: '', cta: 'Shop Now' });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{item ? 'Edit Hero Slide' : 'Add Hero Slide'}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" rows="3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
          {form.image && <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
          <input type="text" value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <button onClick={() => onSave(form)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Save
        </button>
      </div>
    </div>
  );
};

const CategoryForm = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState(item || { name: '', slug: '', image: '', icon: '' });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{item ? 'Edit Category' : 'Add Category'}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
          {form.image && <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
          <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <button onClick={() => onSave(form)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Save
        </button>
      </div>
    </div>
  );
};

const TestimonialForm = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState(item || { name: '', review: '', avatar: '' });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{item ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
          <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" rows="4" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
          <input type="text" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
          {form.avatar && <img src={form.avatar} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded-full" />}
        </div>
        <button onClick={() => onSave(form)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Save
        </button>
      </div>
    </div>
  );
};

const GiftBoxForm = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState(item || { name: '', image: '', price: 0 });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{item ? 'Edit Gift Box' : 'Add Gift Box'}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
          {form.image && <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />}
        </div>
        <button onClick={() => onSave(form)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Save
        </button>
      </div>
    </div>
  );
};

export default FrontendManager;
