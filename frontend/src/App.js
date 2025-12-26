import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductPage from "./pages/ProductPage";
import BulkOrder from "./pages/BulkOrder";
import Career from "./pages/Career";
import AboutUs from "./pages/AboutUs";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import FrontendManager from "./pages/admin/FrontendManager";
import ProductsManager from "./pages/admin/ProductsManager";
import SettingsManager from "./pages/admin/SettingsManager";
import SubmissionsManager from "./pages/admin/SubmissionsManager";
import AboutUsManager from "./pages/admin/AboutUsManager";

function App() {
  return (
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
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="frontend" element={<FrontendManager />} />
              <Route path="products" element={<ProductsManager />} />
              <Route path="submissions" element={<SubmissionsManager />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="about-us" element={<AboutUsManager />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </DataProvider>
  );
}

export default App;
