import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../components/pages/home/HomePage';
import ShopPage from '../components/pages/shop/ShopPage';
import LoginPage from '../components/pages/auth/LoginPage';
import RegisterPage from '../components/pages/auth/RegisterPage';
import ForgotPasswordPage from '../components/pages/auth/ForgotPasswordPage';
import CartPage from '../components/pages/cart/CartPage';
import CheckoutPage from '../components/pages/checkout/CheckoutPage';
import ProductDetailsPage from '../components/pages/shop/ProductDetailsPage';
import PrivacyPolicyPage from '../components/pages/legal/PrivacyPolicyPage';
import TermsConditionsPage from '../components/pages/legal/TermsConditionsPage';
import ContactPage from '../components/pages/contact/ContactPage';
import AdminPage from '../components/pages/admin/AdminPage';
import AdminRoute from '../components/pages/admin/AdminRoute';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/product/:productSlug" element={<ProductDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
