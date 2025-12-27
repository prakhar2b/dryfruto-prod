import React, { useState, useEffect } from 'react';
import { Package, Image, Star, Gift, TrendingUp } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    testimonials: 0,
    giftBoxes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, categories, testimonials, giftBoxes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/testimonials`),
        axios.get(`${API}/gift-boxes`)
      ]);

      setStats({
        products: products.data.length,
        categories: categories.data.length,
        testimonials: testimonials.data.length,
        giftBoxes: giftBoxes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    try {
      setLoading(true);
      await axios.post(`${API}/seed-data`);
      await fetchStats();
      alert('Data seeded successfully!');
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Error seeding data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { name: 'Categories', value: stats.categories, icon: Image, color: 'bg-green-500' },
    { name: 'Testimonials', value: stats.testimonials, icon: Star, color: 'bg-yellow-500' },
    { name: 'Gift Boxes', value: stats.giftBoxes, icon: Gift, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to DryFruto Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={seedData}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <TrendingUp className="w-5 h-5" />
            Seed Initial Data
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          Click "Seed Initial Data" to populate the database with default products, categories, and other content.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
