import React, { useState, useEffect } from 'react';
import { Save, Plus, X, Image, Type, List, Target, Eye, Heart, Award } from 'lucide-react';
import axios from 'axios';
import ImageUpload from '../../components/common/ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AboutUsManager = () => {
  const [settings, setSettings] = useState({
    aboutHeroSubtitle: 'Your trusted partner for premium quality dry fruits, nuts, and seeds since 2014.',
    aboutStoryParagraphs: [],
    aboutStoryImage: '',
    aboutStats: [],
    aboutVision: '',
    aboutVisionPoints: [],
    aboutMission: '',
    aboutMissionPoints: [],
    aboutValues: [],
    aboutWhyChooseUs: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states for adding new items
  const [newStoryParagraph, setNewStoryParagraph] = useState('');
  const [newVisionPoint, setNewVisionPoint] = useState('');
  const [newMissionPoint, setNewMissionPoint] = useState('');
  const [newStat, setNewStat] = useState({ number: '', label: '' });
  const [newValue, setNewValue] = useState({ title: '', desc: '' });
  const [newWhyChoose, setNewWhyChoose] = useState({ name: '', desc: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/site-settings`);
      setSettings(prev => ({
        ...prev,
        ...response.data
      }));
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
      alert('About Us settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  // Helper functions to manage arrays
  const addToArray = (key, value, resetFn) => {
    if (typeof value === 'string' && !value.trim()) return;
    if (typeof value === 'object' && Object.values(value).some(v => !v.trim())) return;
    
    setSettings(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), value]
    }));
    resetFn();
  };

  const removeFromArray = (key, index) => {
    setSettings(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (key, index, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: prev[key].map((item, i) => i === index ? value : item)
    }));
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
        <h1 className="text-2xl font-bold text-gray-800">About Us Page Settings</h1>
        <p className="text-gray-600">Customize the content displayed on your About Us page</p>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <Type className="w-4 h-4 text-amber-600" />
          </span>
          Hero Section
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
          <textarea
            value={settings.aboutHeroSubtitle || ''}
            onChange={(e) => setSettings({ ...settings, aboutHeroSubtitle: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            rows="2"
            placeholder="Your trusted partner for premium quality dry fruits..."
          />
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <List className="w-4 h-4 text-blue-600" />
          </span>
          Our Story Section
        </h2>

        {/* Story Image */}
        <div className="mb-6">
          <ImageUpload
            label="Story Image"
            value={settings.aboutStoryImage || ''}
            onChange={(url) => setSettings({ ...settings, aboutStoryImage: url })}
            placeholder="Enter image URL or upload"
          />
        </div>

        {/* Story Paragraphs */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Story Paragraphs</label>
          <div className="space-y-3 mb-3">
            {(settings.aboutStoryParagraphs || []).map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={paragraph}
                  onChange={(e) => updateArrayItem('aboutStoryParagraphs', index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  rows="2"
                />
                <button
                  onClick={() => removeFromArray('aboutStoryParagraphs', index)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <textarea
              value={newStoryParagraph}
              onChange={(e) => setNewStoryParagraph(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              rows="2"
              placeholder="Add a new paragraph..."
            />
            <button
              onClick={() => addToArray('aboutStoryParagraphs', newStoryParagraph, () => setNewStoryParagraph(''))}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center gap-2 h-fit"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 text-green-600" />
          </span>
          Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {(settings.aboutStats || []).map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 relative">
              <button
                onClick={() => removeFromArray('aboutStats', index)}
                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
              <input
                value={stat.number}
                onChange={(e) => updateArrayItem('aboutStats', index, { ...stat, number: e.target.value })}
                className="w-full text-2xl font-bold text-amber-600 bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none text-center mb-1"
                placeholder="10+"
              />
              <input
                value={stat.label}
                onChange={(e) => updateArrayItem('aboutStats', index, { ...stat, label: e.target.value })}
                className="w-full text-xs text-gray-600 bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none text-center"
                placeholder="Years Experience"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Number</label>
            <input
              value={newStat.number}
              onChange={(e) => setNewStat({ ...newStat, number: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="50K+"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Label</label>
            <input
              value={newStat.label}
              onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Happy Customers"
            />
          </div>
          <button
            onClick={() => addToArray('aboutStats', newStat, () => setNewStat({ number: '', label: '' }))}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Vision */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-purple-600" />
            </span>
            Our Vision
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vision Statement</label>
            <textarea
              value={settings.aboutVision || ''}
              onChange={(e) => setSettings({ ...settings, aboutVision: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vision Points</label>
            <div className="space-y-2 mb-3">
              {(settings.aboutVisionPoints || []).map((point, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  <input
                    value={point}
                    onChange={(e) => updateArrayItem('aboutVisionPoints', index, e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button onClick={() => removeFromArray('aboutVisionPoints', index)} className="text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newVisionPoint}
                onChange={(e) => setNewVisionPoint(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addToArray('aboutVisionPoints', newVisionPoint, () => setNewVisionPoint(''))}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                placeholder="Add vision point..."
              />
              <button
                onClick={() => addToArray('aboutVisionPoints', newVisionPoint, () => setNewVisionPoint(''))}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-red-600" />
            </span>
            Our Mission
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
            <textarea
              value={settings.aboutMission || ''}
              onChange={(e) => setSettings({ ...settings, aboutMission: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mission Points</label>
            <div className="space-y-2 mb-3">
              {(settings.aboutMissionPoints || []).map((point, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  <input
                    value={point}
                    onChange={(e) => updateArrayItem('aboutMissionPoints', index, e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button onClick={() => removeFromArray('aboutMissionPoints', index)} className="text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newMissionPoint}
                onChange={(e) => setNewMissionPoint(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addToArray('aboutMissionPoints', newMissionPoint, () => setNewMissionPoint(''))}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                placeholder="Add mission point..."
              />
              <button
                onClick={() => addToArray('aboutMissionPoints', newMissionPoint, () => setNewMissionPoint(''))}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-pink-600" />
          </span>
          Core Values
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {(settings.aboutValues || []).map((value, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 relative">
              <button
                onClick={() => removeFromArray('aboutValues', index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
              <input
                value={value.title}
                onChange={(e) => updateArrayItem('aboutValues', index, { ...value, title: e.target.value })}
                className="w-full font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none mb-2"
                placeholder="Value Title"
              />
              <textarea
                value={value.desc}
                onChange={(e) => updateArrayItem('aboutValues', index, { ...value, desc: e.target.value })}
                className="w-full text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none"
                rows="2"
                placeholder="Value description..."
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Title</label>
            <input
              value={newValue.title}
              onChange={(e) => setNewValue({ ...newValue, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Quality First"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <input
              value={newValue.desc}
              onChange={(e) => setNewValue({ ...newValue, desc: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="We source only the finest..."
            />
          </div>
          <button
            onClick={() => addToArray('aboutValues', newValue, () => setNewValue({ title: '', desc: '' }))}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 text-orange-600" />
          </span>
          Why Choose Us
        </h2>
        <div className="space-y-3 mb-4">
          {(settings.aboutWhyChooseUs || []).map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 flex gap-4 items-start">
              <div className="flex-1 grid md:grid-cols-2 gap-3">
                <input
                  value={item.name}
                  onChange={(e) => updateArrayItem('aboutWhyChooseUs', index, { ...item, name: e.target.value })}
                  className="px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  placeholder="Feature Name"
                />
                <input
                  value={item.desc}
                  onChange={(e) => updateArrayItem('aboutWhyChooseUs', index, { ...item, desc: e.target.value })}
                  className="px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  placeholder="Feature description..."
                />
              </div>
              <button
                onClick={() => removeFromArray('aboutWhyChooseUs', index)}
                className="text-red-500 hover:text-red-700 mt-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              value={newWhyChoose.name}
              onChange={(e) => setNewWhyChoose({ ...newWhyChoose, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Quality Assurance"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <input
              value={newWhyChoose.desc}
              onChange={(e) => setNewWhyChoose({ ...newWhyChoose, desc: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Every product goes through strict quality checks..."
            />
          </div>
          <button
            onClick={() => addToArray('aboutWhyChooseUs', newWhyChoose, () => setNewWhyChoose({ name: '', desc: '' }))}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save About Us Settings'}
        </button>
      </div>
    </div>
  );
};

export default AboutUsManager;
