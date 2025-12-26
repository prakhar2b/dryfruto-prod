import React, { useState, useEffect, useRef } from 'react';
import { Save, Download, Upload, RotateCcw, Palette, Type, Layout, Square, Eye, Check } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Default theme for reset
const defaultTheme = {
  colors: {
    primary: "#3d2518",
    primaryLight: "#4d2f20",
    accent: "#f59e0b",
    accentHover: "#d97706",
    background: "#fffbeb",
    backgroundAlt: "#fef3c7",
    text: "#1f2937",
    textLight: "#6b7280",
    white: "#ffffff",
    success: "#16a34a",
    error: "#dc2626"
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    headingFont: "Inter, system-ui, sans-serif",
    baseFontSize: "16px",
    h1Size: "3rem",
    h2Size: "2rem",
    h3Size: "1.5rem"
  },
  header: {
    background: "#3d2518",
    text: "#ffffff",
    navText: "#ffffff",
    navHover: "#f59e0b"
  },
  footer: {
    background: "#3d2518",
    text: "#fef3c7",
    linkColor: "#f59e0b"
  },
  buttons: {
    primaryBg: "#f59e0b",
    primaryText: "#ffffff",
    primaryHover: "#d97706",
    secondaryBg: "#3d2518",
    secondaryText: "#ffffff",
    secondaryHover: "#2d1810",
    borderRadius: "0.5rem"
  },
  cards: {
    background: "#ffffff",
    border: "#e5e7eb",
    shadow: "0 1px 3px rgba(0,0,0,0.1)",
    borderRadius: "1rem"
  }
};

// Font options
const fontOptions = [
  { value: "Inter, system-ui, sans-serif", label: "Inter (Default)" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "'Lato', sans-serif", label: "Lato" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'Merriweather', serif", label: "Merriweather" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "system-ui, sans-serif", label: "System UI" }
];

const ColorPicker = ({ label, value, onChange, description }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded cursor-pointer border-2 border-gray-200"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-500 outline-none"
      />
    </div>
    {description && <p className="text-xs text-gray-500">{description}</p>}
  </div>
);

const ThemeManager = () => {
  const [theme, setTheme] = useState(defaultTheme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');
  const [previewKey, setPreviewKey] = useState(0);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Apply theme to preview iframe and main document
  useEffect(() => {
    applyThemeCSS(theme);
  }, [theme]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/site-settings`);
      if (response.data.theme) {
        setTheme(deepMerge(defaultTheme, response.data.theme));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Deep merge helper
  const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };

  const applyThemeCSS = (themeConfig) => {
    const root = document.documentElement;
    
    // Apply CSS variables to main document for live preview
    if (themeConfig.colors) {
      Object.entries(themeConfig.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
    
    if (themeConfig.typography) {
      root.style.setProperty('--font-family', themeConfig.typography.fontFamily);
      root.style.setProperty('--heading-font', themeConfig.typography.headingFont);
    }
    
    if (themeConfig.header) {
      root.style.setProperty('--header-bg', themeConfig.header.background);
      root.style.setProperty('--header-text', themeConfig.header.text);
      root.style.setProperty('--header-nav-hover', themeConfig.header.navHover);
    }
    
    if (themeConfig.footer) {
      root.style.setProperty('--footer-bg', themeConfig.footer.background);
      root.style.setProperty('--footer-text', themeConfig.footer.text);
    }
    
    if (themeConfig.buttons) {
      root.style.setProperty('--btn-primary-bg', themeConfig.buttons.primaryBg);
      root.style.setProperty('--btn-primary-hover', themeConfig.buttons.primaryHover);
      root.style.setProperty('--btn-secondary-bg', themeConfig.buttons.secondaryBg);
      root.style.setProperty('--btn-radius', themeConfig.buttons.borderRadius);
    }

    // Force preview refresh
    setPreviewKey(prev => prev + 1);
  };

  const updateThemeSection = (section, key, value) => {
    setTheme(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${API}/site-settings`, { theme });
      alert('Theme settings saved successfully!');
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Error saving theme settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API}/export-theme`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'theme_export.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting theme');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      if (importData.siteSettings?.theme) {
        setTheme(deepMerge(defaultTheme, importData.siteSettings.theme));
      }
      
      // Import full data to backend
      await axios.post(`${API}/import-theme`, importData);
      
      alert('Theme imported successfully! Refreshing...');
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing theme. Please check the file format.');
    }
    
    event.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to the default theme? This will discard all unsaved changes.')) {
      setTheme(defaultTheme);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-gray-500">Loading theme settings...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'header', label: 'Header', icon: Layout },
    { id: 'footer', label: 'Footer', icon: Layout },
    { id: 'buttons', label: 'Buttons', icon: Square },
    { id: 'cards', label: 'Cards', icon: Square }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Theme Customizer</h1>
          <p className="text-gray-600">Customize colors, typography, and styling with live preview</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Theme
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Theme'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-[600px] overflow-y-auto">
            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker
                  label="Primary Color"
                  value={theme.colors.primary}
                  onChange={(v) => updateThemeSection('colors', 'primary', v)}
                  description="Main brand color (header, footer)"
                />
                <ColorPicker
                  label="Primary Light"
                  value={theme.colors.primaryLight}
                  onChange={(v) => updateThemeSection('colors', 'primaryLight', v)}
                  description="Lighter variant of primary"
                />
                <ColorPicker
                  label="Accent Color"
                  value={theme.colors.accent}
                  onChange={(v) => updateThemeSection('colors', 'accent', v)}
                  description="Buttons, highlights, CTAs"
                />
                <ColorPicker
                  label="Accent Hover"
                  value={theme.colors.accentHover}
                  onChange={(v) => updateThemeSection('colors', 'accentHover', v)}
                  description="Hover state for accent"
                />
                <ColorPicker
                  label="Background"
                  value={theme.colors.background}
                  onChange={(v) => updateThemeSection('colors', 'background', v)}
                  description="Page background"
                />
                <ColorPicker
                  label="Background Alt"
                  value={theme.colors.backgroundAlt}
                  onChange={(v) => updateThemeSection('colors', 'backgroundAlt', v)}
                  description="Alternate sections"
                />
                <ColorPicker
                  label="Text Color"
                  value={theme.colors.text}
                  onChange={(v) => updateThemeSection('colors', 'text', v)}
                  description="Main text color"
                />
                <ColorPicker
                  label="Text Light"
                  value={theme.colors.textLight}
                  onChange={(v) => updateThemeSection('colors', 'textLight', v)}
                  description="Secondary text"
                />
                <ColorPicker
                  label="Success"
                  value={theme.colors.success}
                  onChange={(v) => updateThemeSection('colors', 'success', v)}
                  description="Success messages"
                />
                <ColorPicker
                  label="Error"
                  value={theme.colors.error}
                  onChange={(v) => updateThemeSection('colors', 'error', v)}
                  description="Error messages"
                />
              </div>
            )}

            {/* Typography Tab */}
            {activeTab === 'typography' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Font</label>
                  <select
                    value={theme.typography.fontFamily}
                    onChange={(e) => updateThemeSection('typography', 'fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {fontOptions.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heading Font</label>
                  <select
                    value={theme.typography.headingFont}
                    onChange={(e) => updateThemeSection('typography', 'headingFont', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {fontOptions.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Font Size</label>
                    <input
                      type="text"
                      value={theme.typography.baseFontSize}
                      onChange={(e) => updateThemeSection('typography', 'baseFontSize', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="16px"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">H1 Size</label>
                    <input
                      type="text"
                      value={theme.typography.h1Size}
                      onChange={(e) => updateThemeSection('typography', 'h1Size', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="3rem"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">H2 Size</label>
                    <input
                      type="text"
                      value={theme.typography.h2Size}
                      onChange={(e) => updateThemeSection('typography', 'h2Size', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="2rem"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">H3 Size</label>
                    <input
                      type="text"
                      value={theme.typography.h3Size}
                      onChange={(e) => updateThemeSection('typography', 'h3Size', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="1.5rem"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Header Tab */}
            {activeTab === 'header' && (
              <div className="space-y-4">
                <ColorPicker
                  label="Background Color"
                  value={theme.header.background}
                  onChange={(v) => updateThemeSection('header', 'background', v)}
                />
                <ColorPicker
                  label="Text Color"
                  value={theme.header.text}
                  onChange={(v) => updateThemeSection('header', 'text', v)}
                />
                <ColorPicker
                  label="Navigation Text"
                  value={theme.header.navText}
                  onChange={(v) => updateThemeSection('header', 'navText', v)}
                />
                <ColorPicker
                  label="Navigation Hover"
                  value={theme.header.navHover}
                  onChange={(v) => updateThemeSection('header', 'navHover', v)}
                />
              </div>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
              <div className="space-y-4">
                <ColorPicker
                  label="Background Color"
                  value={theme.footer.background}
                  onChange={(v) => updateThemeSection('footer', 'background', v)}
                />
                <ColorPicker
                  label="Text Color"
                  value={theme.footer.text}
                  onChange={(v) => updateThemeSection('footer', 'text', v)}
                />
                <ColorPicker
                  label="Link Color"
                  value={theme.footer.linkColor}
                  onChange={(v) => updateThemeSection('footer', 'linkColor', v)}
                />
              </div>
            )}

            {/* Buttons Tab */}
            {activeTab === 'buttons' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Primary Button</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker
                    label="Background"
                    value={theme.buttons.primaryBg}
                    onChange={(v) => updateThemeSection('buttons', 'primaryBg', v)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={theme.buttons.primaryText}
                    onChange={(v) => updateThemeSection('buttons', 'primaryText', v)}
                  />
                  <ColorPicker
                    label="Hover Background"
                    value={theme.buttons.primaryHover}
                    onChange={(v) => updateThemeSection('buttons', 'primaryHover', v)}
                  />
                </div>
                <h3 className="font-medium text-gray-800 pt-4">Secondary Button</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker
                    label="Background"
                    value={theme.buttons.secondaryBg}
                    onChange={(v) => updateThemeSection('buttons', 'secondaryBg', v)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={theme.buttons.secondaryText}
                    onChange={(v) => updateThemeSection('buttons', 'secondaryText', v)}
                  />
                  <ColorPicker
                    label="Hover Background"
                    value={theme.buttons.secondaryHover}
                    onChange={(v) => updateThemeSection('buttons', 'secondaryHover', v)}
                  />
                </div>
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                  <input
                    type="text"
                    value={theme.buttons.borderRadius}
                    onChange={(e) => updateThemeSection('buttons', 'borderRadius', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="0.5rem"
                  />
                </div>
              </div>
            )}

            {/* Cards Tab */}
            {activeTab === 'cards' && (
              <div className="space-y-4">
                <ColorPicker
                  label="Background Color"
                  value={theme.cards.background}
                  onChange={(v) => updateThemeSection('cards', 'background', v)}
                />
                <ColorPicker
                  label="Border Color"
                  value={theme.cards.border}
                  onChange={(v) => updateThemeSection('cards', 'border', v)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Box Shadow</label>
                  <input
                    type="text"
                    value={theme.cards.shadow}
                    onChange={(e) => updateThemeSection('cards', 'shadow', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="0 1px 3px rgba(0,0,0,0.1)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                  <input
                    type="text"
                    value={theme.cards.borderRadius}
                    onChange={(e) => updateThemeSection('cards', 'borderRadius', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="1rem"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Live Preview</span>
          </div>
          <div key={previewKey} className="p-6 space-y-6 overflow-auto max-h-[600px]" style={{ backgroundColor: theme.colors.background }}>
            {/* Header Preview */}
            <div 
              className="rounded-lg p-4 flex items-center justify-between"
              style={{ backgroundColor: theme.header.background }}
            >
              <span className="font-bold text-lg" style={{ color: theme.header.text }}>Logo</span>
              <div className="flex gap-4">
                {['Home', 'Shop', 'About'].map(item => (
                  <span 
                    key={item} 
                    className="cursor-pointer transition-colors"
                    style={{ color: theme.header.navText }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Preview */}
            <div 
              className="rounded-lg p-8 text-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <h1 
                className="text-2xl font-bold mb-2"
                style={{ 
                  color: theme.colors.white,
                  fontFamily: theme.typography.headingFont
                }}
              >
                Welcome to Our Store
              </h1>
              <p style={{ color: theme.colors.backgroundAlt }}>Premium quality products</p>
            </div>

            {/* Cards Preview */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div 
                  key={i}
                  className="p-4"
                  style={{ 
                    backgroundColor: theme.cards.background,
                    borderRadius: theme.cards.borderRadius,
                    boxShadow: theme.cards.shadow,
                    border: `1px solid ${theme.cards.border}`
                  }}
                >
                  <div className="w-full h-20 bg-gray-200 rounded mb-3"></div>
                  <h3 
                    className="font-semibold"
                    style={{ 
                      color: theme.colors.text,
                      fontFamily: theme.typography.headingFont
                    }}
                  >
                    Product {i}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ 
                      color: theme.colors.textLight,
                      fontFamily: theme.typography.fontFamily
                    }}
                  >
                    Description text here
                  </p>
                  <p 
                    className="font-bold mt-2"
                    style={{ color: theme.colors.accent }}
                  >
                    ₹999
                  </p>
                </div>
              ))}
            </div>

            {/* Buttons Preview */}
            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-2 font-medium transition-colors"
                style={{
                  backgroundColor: theme.buttons.primaryBg,
                  color: theme.buttons.primaryText,
                  borderRadius: theme.buttons.borderRadius
                }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 font-medium transition-colors"
                style={{
                  backgroundColor: theme.buttons.secondaryBg,
                  color: theme.buttons.secondaryText,
                  borderRadius: theme.buttons.borderRadius
                }}
              >
                Secondary Button
              </button>
            </div>

            {/* Text Preview */}
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.colors.backgroundAlt }}
            >
              <h2 
                className="text-xl font-bold mb-2"
                style={{ 
                  color: theme.colors.text,
                  fontFamily: theme.typography.headingFont
                }}
              >
                Typography Preview
              </h2>
              <p 
                style={{ 
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily
                }}
              >
                This is body text showing your font choices.
              </p>
              <p 
                className="text-sm mt-2"
                style={{ 
                  color: theme.colors.textLight,
                  fontFamily: theme.typography.fontFamily
                }}
              >
                This is secondary text with lighter color.
              </p>
            </div>

            {/* Footer Preview */}
            <div 
              className="rounded-lg p-4"
              style={{ backgroundColor: theme.footer.background }}
            >
              <div className="flex justify-between items-center">
                <span style={{ color: theme.footer.text }}>© 2024 Your Brand</span>
                <div className="flex gap-4">
                  {['Privacy', 'Terms'].map(item => (
                    <span 
                      key={item}
                      style={{ color: theme.footer.linkColor }}
                      className="cursor-pointer"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeManager;
