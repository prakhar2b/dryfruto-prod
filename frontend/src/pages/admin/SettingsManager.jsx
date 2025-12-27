import React, { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, MessageCircle, Briefcase, Package, Plus, X } from 'lucide-react';
import axios from 'axios';
import ImageUpload from '../../components/common/ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    businessName: 'DryFruto',
    slogan: 'Live With Health',
    logo: '',
    phone: '9870990795',
    email: 'info@dryfruto.com',
    careerEmail: 'careers@dryfruto.com',
    address: '123, Main Street, New Delhi, India',
    whatsappLink: 'https://wa.me/919870990795',
    facebookLink: '',
    instagramLink: '',
    twitterLink: '',
    youtubeLink: '',
    bulkOrderProductTypes: ['Dry Fruits', 'Nuts', 'Seeds', 'Berries', 'Gift Boxes', 'Mixed Products'],
    bulkOrderBenefits: [
      'Direct sourcing from farms ensures freshness',
      'Minimum order quantity: 10 kg',
      'Special rates for orders above 100 kg',
      'Custom packaging with your branding',
      'Regular supply contracts available',
      'Quality testing certificates provided'
    ]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newProductType, setNewProductType] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/site-settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${API}/site-settings`, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
        <p className="text-gray-600">Manage your business information, contact details, and social media</p>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <span className="text-emerald-600 font-bold">B</span>
          </span>
          Business Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              label="Logo"
              value={settings.logo}
              onChange={(url) => setSettings({ ...settings, logo: url })}
              placeholder="Enter logo URL or upload an image"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Phone className="w-4 h-4 text-blue-600" />
          </span>
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="9870990795"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="info@dryfruto.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              Career Email
            </label>
            <input
              type="email"
              value={settings.careerEmail || ''}
              onChange={(e) => setSettings({ ...settings, careerEmail: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="careers@dryfruto.com"
            />
            <p className="text-xs text-gray-500 mt-1">Email for job applications on Career page</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              rows="2"
              placeholder="123, Main Street, New Delhi, India"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              WhatsApp Link
            </label>
            <input
              type="text"
              value={settings.whatsappLink}
              onChange={(e) => setSettings({ ...settings, whatsappLink: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="https://wa.me/919870990795"
            />
            <p className="text-xs text-gray-500 mt-1">Format: https://wa.me/91XXXXXXXXXX (include country code)</p>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
            <Instagram className="w-4 h-4 text-pink-600" />
          </span>
          Social Media Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </label>
            <input
              type="text"
              value={settings.facebookLink || ''}
              onChange={(e) => setSettings({ ...settings, facebookLink: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="https://facebook.com/yourpage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-600" />
              Instagram
            </label>
            <input
              type="text"
              value={settings.instagramLink || ''}
              onChange={(e) => setSettings({ ...settings, instagramLink: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="https://instagram.com/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Twitter className="w-4 h-4 text-sky-500" />
              Twitter / X
            </label>
            <input
              type="text"
              value={settings.twitterLink || ''}
              onChange={(e) => setSettings({ ...settings, twitterLink: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="https://twitter.com/yourhandle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              YouTube
            </label>
            <input
              type="text"
              value={settings.youtubeLink || ''}
              onChange={(e) => setSettings({ ...settings, youtubeLink: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
        </div>
      </div>

      {/* Bulk Order Page Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-green-600" />
          </span>
          Bulk Order Page Settings
        </h2>
        
        {/* Product Types */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Types (for dropdown)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(settings.bulkOrderProductTypes || []).map((type, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                {type}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...settings.bulkOrderProductTypes];
                    updated.splice(index, 1);
                    setSettings({ ...settings, bulkOrderProductTypes: updated });
                  }}
                  className="ml-1 text-emerald-600 hover:text-emerald-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newProductType}
              onChange={(e) => setNewProductType(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newProductType.trim()) {
                  e.preventDefault();
                  setSettings({
                    ...settings,
                    bulkOrderProductTypes: [...(settings.bulkOrderProductTypes || []), newProductType.trim()]
                  });
                  setNewProductType('');
                }
              }}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Add new product type..."
            />
            <button
              type="button"
              onClick={() => {
                if (newProductType.trim()) {
                  setSettings({
                    ...settings,
                    bulkOrderProductTypes: [...(settings.bulkOrderProductTypes || []), newProductType.trim()]
                  });
                  setNewProductType('');
                }
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Benefits List */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Why Choose Us (Benefits)</label>
          <div className="space-y-2 mb-3">
            {(settings.bulkOrderBenefits || []).map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="flex-1 text-sm text-gray-700">{benefit}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...settings.bulkOrderBenefits];
                    updated.splice(index, 1);
                    setSettings({ ...settings, bulkOrderBenefits: updated });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newBenefit.trim()) {
                  e.preventDefault();
                  setSettings({
                    ...settings,
                    bulkOrderBenefits: [...(settings.bulkOrderBenefits || []), newBenefit.trim()]
                  });
                  setNewBenefit('');
                }
              }}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Add new benefit..."
            />
            <button
              type="button"
              onClick={() => {
                if (newBenefit.trim()) {
                  setSettings({
                    ...settings,
                    bulkOrderBenefits: [...(settings.bulkOrderBenefits || []), newBenefit.trim()]
                  });
                  setNewBenefit('');
                }
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsManager;
