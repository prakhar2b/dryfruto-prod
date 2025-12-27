import React, { useState, useEffect } from 'react';
import { Package, Mail, Download, Trash2, Eye, Search, Filter, RefreshCw } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SubmissionsManager = () => {
  const [activeTab, setActiveTab] = useState('bulk');
  const [bulkOrders, setBulkOrders] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bulkRes, newsRes] = await Promise.all([
        axios.get(`${API}/bulk-orders`),
        axios.get(`${API}/newsletter`)
      ]);
      setBulkOrders(bulkRes.data);
      setNewsletters(newsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBulkOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/bulk-orders/${orderId}?status=${status}`);
      setBulkOrders(bulkOrders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteBulkOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await axios.delete(`${API}/bulk-orders/${orderId}`);
      setBulkOrders(bulkOrders.filter(o => o.id !== orderId));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const deleteNewsletter = async (subId) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await axios.delete(`${API}/newsletter/${subId}`);
      setNewsletters(newsletters.filter(n => n.id !== subId));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]).filter(k => k !== 'id');
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredBulkOrders = bulkOrders.filter(order =>
    order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone?.includes(searchTerm) ||
    order.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNewsletters = newsletters.filter(sub =>
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.new}`}>
        {status || 'new'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Form Submissions</h1>
        <p className="text-gray-600">Manage bulk order inquiries and newsletter subscriptions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'bulk' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Package className="w-5 h-5" />
          Bulk Orders ({bulkOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('newsletter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'newsletter' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Mail className="w-5 h-5" />
          Newsletter ({newsletters.length})
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
        <button
          onClick={() => exportToCSV(
            activeTab === 'bulk' ? bulkOrders : newsletters,
            activeTab === 'bulk' ? 'bulk_orders' : 'newsletter_subscriptions'
          )}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Bulk Orders Table */}
          {activeTab === 'bulk' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {filteredBulkOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No bulk order inquiries yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredBulkOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{order.name}</div>
                            {order.company && <div className="text-xs text-gray-500">{order.company}</div>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-800">{order.phone}</div>
                            {order.email && <div className="text-xs text-gray-500">{order.email}</div>}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">{order.productType}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{order.quantity}</td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status || 'new'}
                              onChange={(e) => updateBulkOrderStatus(order.id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteBulkOrder(order.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Newsletter Table */}
          {activeTab === 'newsletter' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {filteredNewsletters.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No newsletter subscriptions yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredNewsletters.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600">{formatDate(sub.createdAt)}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{sub.email}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteNewsletter(sub.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Inquiry Details</h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Name</label>
                  <p className="font-medium">{selectedOrder.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Company</label>
                  <p className="font-medium">{selectedOrder.company || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <p className="font-medium">{selectedOrder.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="font-medium">{selectedOrder.email || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Product Type</label>
                  <p className="font-medium">{selectedOrder.productType}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Quantity</label>
                  <p className="font-medium">{selectedOrder.quantity}</p>
                </div>
              </div>
              
              {selectedOrder.message && (
                <div>
                  <label className="text-xs text-gray-500">Message</label>
                  <p className="bg-gray-50 p-3 rounded-lg text-sm">{selectedOrder.message}</p>
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                Submitted: {formatDate(selectedOrder.createdAt)}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <a
                href={`tel:${selectedOrder.phone}`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Call
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsManager;
