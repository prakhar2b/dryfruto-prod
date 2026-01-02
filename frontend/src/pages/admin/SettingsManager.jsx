import React, { useState, useEffect } from 'react';
import { Save, Phone, Mail, Facebook, Instagram, Twitter, Youtube, MessageCircle, Briefcase, Package, Plus, X, CheckCircle, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import axios from 'axios';
import ImageUpload from '../../components/common/ImageUpload';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const API = API_BASE_URL;

const SettingsManager = () => {
  const { changePassword, user } = useAuth();
  const [settings, setSettings] = useState({
    businessName: 'DryFruto',
    slogan: 'Live With Health',
    logo: '',
    phone: '9870990795',
    email: 'info@dryfruto.com',
    careerEmail: 'careers@dryfruto.com',
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
  const [originalSettings, setOriginalSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newProductType, setNewProductType] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  
  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/site-settings`);
      setSettings(response.data);
      setOriginalSettings(JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(settings) !== originalSettings;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${API}/site-settings`, settings);
      setOriginalSettings(JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
      {/* Sticky Save Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-4 mb-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
          <p className="text-gray-600 text-sm">Manage your business information, contact details, and social media</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              Saved!
            </span>
          )}
          {hasChanges() && !saved && (
            <span className="text-amber-600 text-sm">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
              hasChanges() 
                ? 'bg-[#7CB342] hover:bg-[#689F38] text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            } disabled:opacity-50`}
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-[#e8f5e0] rounded-lg flex items-center justify-center">
            <span className="text-[#7CB342] font-bold">B</span>
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
              placeholder="9870990795"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
              placeholder="careers@dryfruto.com"
            />
            <p className="text-xs text-gray-500 mt-1">Email for job applications on Career page</p>
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
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
              <span key={index} className="inline-flex items-center gap-1 bg-[#e8f5e0] text-[#558B2F] px-3 py-1 rounded-full text-sm">
                {type}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...settings.bulkOrderProductTypes];
                    updated.splice(index, 1);
                    setSettings({ ...settings, bulkOrderProductTypes: updated });
                  }}
                  className="ml-1 text-[#7CB342] hover:text-[#558B2F]"
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
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
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
              className="px-4 py-2 bg-[#7CB342] hover:bg-[#689F38] text-white rounded-lg flex items-center gap-2"
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
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#f5f9f0]0 outline-none"
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
              className="px-4 py-2 bg-[#f5f9f0]0 hover:bg-[#7CB342] text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Account Security Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Lock className="w-4 h-4 text-red-600" />
          </span>
          Account Security
        </h2>

        {user && (
          <p className="text-sm text-gray-600 mb-4">
            Logged in as: <strong>{user.username}</strong>
          </p>
        )}

        {!showPasswordSection ? (
          <button
            onClick={() => setShowPasswordSection(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        ) : (
          <div className="space-y-4 max-w-md">
            {passwordMessage && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                passwordMessage.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {passwordMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{passwordMessage.text}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Enter new password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  if (!currentPassword || !newPassword || !confirmPassword) {
                    setPasswordMessage({ type: 'error', text: 'Please fill in all fields' });
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
                    return;
                  }
                  if (newPassword.length < 6) {
                    setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
                    return;
                  }

                  setPasswordChanging(true);
                  setPasswordMessage(null);
                  
                  const result = await changePassword(currentPassword, newPassword);
                  
                  if (result.success) {
                    setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setTimeout(() => {
                      setShowPasswordSection(false);
                      setPasswordMessage(null);
                    }, 2000);
                  } else {
                    setPasswordMessage({ type: 'error', text: result.message });
                  }
                  
                  setPasswordChanging(false);
                }}
                disabled={passwordChanging}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {passwordChanging ? 'Changing...' : 'Update Password'}
              </button>
              <button
                onClick={() => {
                  setShowPasswordSection(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordMessage(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#f5f9f0]0 hover:bg-[#7CB342] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsManager;
