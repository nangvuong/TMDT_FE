import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Profile from '../pages/Profile/Profile';
import ProductPage from '../pages/Product/Product';
import CategoryPage from '../pages/Category/Category';
import NotFound from '../pages/NotFound/NotFound';
import ProtectedRoute from '../components/routes/ProtectedRoute';

// Shop Pages
import EquipmentPage from '../pages/Shop/Equipment';
import SupplementsPage from '../pages/Shop/Supplements';
import ClothingPage from '../pages/Shop/Clothing';
import SalePage from '../pages/Shop/Sale';

// Support Pages
import ContactPage from '../pages/Support/Contact';
import ShippingPage from '../pages/Support/Shipping';
import ReturnsPage from '../pages/Support/Returns';
import FAQPage from '../pages/Support/FAQ';

// Company Pages
import AboutPage from '../pages/Company/About';
import BlogPage from '../pages/Company/Blog';
import CareersPage from '../pages/Company/Careers';
import PrivacyPage from '../pages/Company/Privacy';

/**
 * Router Configuration - Main routing setup for the application
 */
const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/categories/:categoryId" element={<CategoryPage />} />
        
        {/* Shop Routes */}
        <Route path="/shop/equipment" element={<EquipmentPage />} />
        <Route path="/shop/supplements" element={<SupplementsPage />} />
        <Route path="/shop/clothing" element={<ClothingPage />} />
        <Route path="/shop/sale" element={<SalePage />} />

        {/* Support Routes */}
        <Route path="/support/contact" element={<ContactPage />} />
        <Route path="/support/shipping" element={<ShippingPage />} />
        <Route path="/support/returns" element={<ReturnsPage />} />
        <Route path="/support/faq" element={<FAQPage />} />

        {/* Company Routes */}
        <Route path="/company/about" element={<AboutPage />} />
        <Route path="/company/blog" element={<BlogPage />} />
        <Route path="/company/careers" element={<CareersPage />} />
        <Route path="/company/privacy" element={<PrivacyPage />} />

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        {/* 404 Not Found - Catch all undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
