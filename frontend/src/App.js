import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductPage from "./pages/ProductPage";
import BulkOrder from "./pages/BulkOrder";
import Career from "./pages/Career";
import AboutUs from "./pages/AboutUs";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import FrontendManager from "./pages/admin/FrontendManager";
import ProductsManager from "./pages/admin/ProductsManager";
import SettingsManager from "./pages/admin/SettingsManager";
import SubmissionsManager from "./pages/admin/SubmissionsManager";
import DataManager from "./pages/admin/DataManager";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="App">
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/bulk-order" element={<BulkOrder />} />
              <Route path="/career" element={<Career />} />
              <Route path="/about" element={<AboutUs />} />
              
              {/* Admin Login Route (Public) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="frontend" element={<FrontendManager />} />
                <Route path="products" element={<ProductsManager />} />
                <Route path="submissions" element={<SubmissionsManager />} />
                <Route path="settings" element={<SettingsManager />} />
                <Route path="data" element={<DataManager />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
