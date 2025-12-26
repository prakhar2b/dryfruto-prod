import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductPage from "./pages/ProductPage";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import FrontendManager from "./pages/admin/FrontendManager";
import ProductsManager from "./pages/admin/ProductsManager";
import SettingsManager from "./pages/admin/SettingsManager";

function App() {
  return (
    <DataProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="frontend" element={<FrontendManager />} />
              <Route path="products" element={<ProductsManager />} />
              <Route path="settings" element={<SettingsManager />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </DataProvider>
  );
}

export default App;
