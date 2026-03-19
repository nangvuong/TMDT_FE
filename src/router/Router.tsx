import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CountersProvider } from '../contexts/CountersContext';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Profile from '../pages/Profile/Profile';
import Setting from '../pages/Setting/Setting';
import ProductPage from '../pages/Product/Product';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
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

// Wishlist Page
import WishlistPage from '../pages/Wishlist/Wishlist';

/**
 * Router Configuration - Main routing setup for the application
 */
const Router: React.FC = () => {
  return (
    <CountersProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
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

        <Route 
          path="/setting" 
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Not Found - Catch all undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </BrowserRouter>
    </CountersProvider>
  );
};

export default Router;
