import React, { useState } from 'react';
import { Package, Phone, MessageCircle, CheckCircle, Truck, Shield, Award, Send, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BulkOrder = () => {
  const { siteSettings } = useData();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    productType: '',
    quantity: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappLink = siteSettings.whatsappLink || `https://wa.me/91${siteSettings.phone}`;
  const callLink = `tel:+91${siteSettings.phone}`;

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in bulk ordering.\n\nName: ${formData.name}\nCompany: ${formData.company}\nProduct: ${formData.productType}\nQuantity: ${formData.quantity}\n\nMessage: ${formData.message}`;
    window.open(`${whatsappLink}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.productType || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/bulk-orders`, formData);
      setSubmitted(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        productType: '',
        quantity: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again or contact us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    { icon: Package, title: 'Competitive Pricing', desc: 'Special rates for bulk quantities' },
    { icon: Truck, title: 'Pan India Delivery', desc: 'We deliver across all states' },
    { icon: Shield, title: 'Quality Guaranteed', desc: '100% premium quality products' },
    { icon: Award, title: 'Custom Packaging', desc: 'Branded packaging available' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="bg-[#7CB342] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bulk Orders</h1>
            <p className="text-lg text-[#e8f5e0] max-w-2xl mx-auto">
              Partner with us for your business needs. Get premium dry fruits at wholesale prices.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#f5f9f0] to-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="w-12 h-12 bg-[#e8f5e0] rounded-full flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="w-6 h-6 text-[#8BC34A]" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Inquiry Form */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Request a Quote</h2>
                
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-4">Your inquiry has been submitted successfully. Our team will contact you shortly.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-[#8BC34A] hover:text-[#689F38] font-medium"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                        <input
123|                          type="text"
124|                          value={formData.name}
125|                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8BC34A] outline-none"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8BC34A] outline-none"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8BC34A] outline-none"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8BC34A] outline-none"
                          placeholder="9876543210"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
                        <select
                          value={formData.productType}
                          onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8BC34A] outline-none"
                          required
                        >
                          <option value="">Select Product</option>
                          {(siteSettings.bulkOrderProductTypes || ['Dry Fruits', 'Nuts', 'Seeds', 'Berries', 'Gift Boxes', 'Mixed Products']).map((type, idx) => (
                            <option key={idx} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (in kg) *</label>
                        <input
                          type="text"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8BC34A] outline-none"
                          placeholder="e.g., 50 kg"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8BC34A] outline-none"
                        rows="3"
                        placeholder="Tell us about your specific requirements..."
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-3 md:space-y-0">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-[#8BC34A] hover:bg-[#7CB342] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Submit Inquiry
                          </>
                        )}
                      </button>

                      <span className="hidden md:block text-sm text-gray-500">or</span>
                      <div className="flex items-center gap-4 md:hidden">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>

                      <button
                        type="button"
                        onClick={handleWhatsApp}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Send via WhatsApp
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-[#f5f9f0] rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
                  <ul className="space-y-3">
                    {(siteSettings.bulkOrderBenefits || [
                      'Direct sourcing from farms ensures freshness',
                      'Minimum order quantity: 10 kg',
                      'Special rates for orders above 100 kg',
                      'Custom packaging with your branding',
                      'Regular supply contracts available',
                      'Quality testing certificates provided'
                    ]).map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#8BC34A] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#7CB342] text-white rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-4">Prefer to Talk?</h3>
                  <p className="text-[#e8f5e0] mb-6">Our bulk order team is ready to assist you with personalized quotes and solutions.</p>
                  <a
                    href={callLink}
                    className="flex items-center justify-center gap-2 bg-[#8BC34A] hover:bg-[#689F38] text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call: {siteSettings.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BulkOrder;
