// frontend/src/components/Login.jsx

import { useState, useEffect } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import { FiSmartphone, FiLock, FiKey, FiUser } from 'react-icons/fi'; // Import icons
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa'; // Social media icons
import { loginUser, resetPassword } from '../lib/auth';
import { CoinStack, CreditCard, PiggyBank } from '../components/decorative/FinanceElements';
import '../components/auth.css';

export default function Login() {
  const [formData, setFormData] = useState({ upiId: "", phone: "", password: "" });
  const [showForgot, setShowForgot] = useState(false);
  const [fp, setFp] = useState({ name: '', upiId: '', newPassword: '', confirm: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!fp.name || !fp.upiId || !fp.newPassword) { alert('Fill all fields'); return; }
    if (fp.newPassword !== fp.confirm) { alert('Passwords do not match'); return; }
    try {
      await resetPassword({ name: fp.name, upiId: fp.upiId, newPassword: fp.newPassword });
      alert('Password updated. You can now log in.');
      setShowForgot(false);
      setFp({ name: '', upiId: '', newPassword: '', confirm: '' });
    } catch (err) {
      alert(err?.response?.data?.msg || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.upiId && !formData.phone) {
        alert('Enter UPI ID or Phone');
        return;
      }
      const user = await loginUser(formData);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/app/dashboard');
      }
    } catch (err) {
      alert(err?.response?.data?.msg || err.message);
    }
  };

  return (
    <>
    {/* Enhanced auth background with decorative elements */}
    <div className="min-h-screen w-full flex items-center justify-center px-4 auth-bg bg-gray-50 dark:bg-gray-900">
      {/* Decorative finance elements */}
      <div className="finance-icon coin-1 hidden md:block">
        <CoinStack size="xl" />
      </div>
      <div className="finance-icon coin-2 hidden md:block">
        <CoinStack size="lg" />
      </div>
      <div className="finance-icon card-1 hidden md:block">
        <CreditCard size="xl" />
      </div>
      <div className="finance-icon piggy hidden md:block">
        <PiggyBank size="xl" />
      </div>
      
      <div className="auth-card w-full max-w-md p-8 space-y-6 z-10">
      <h2 className="auth-title text-3xl font-bold text-center mb-6">
        Welcome Back
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* UPI ID Field */}
        <div className="auth-input relative">
          <input
            type="text"
            placeholder="yourname@bank (or leave blank if using phone)"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
            className="w-full rounded-lg transition duration-300"
          />
          <FiKey className="icon w-5 h-5" />
        </div>

        {/* Phone Field (optional alternative to UPI) */}
        <div className="auth-input relative">
          <input
            type="tel"
            placeholder="Phone Number (or leave blank if using UPI)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg transition duration-300"
          />
          <FiSmartphone className="icon w-5 h-5" />
        </div>

        {/* Password Field */}
        <div className="auth-input relative">
          <input
            type="password"
            placeholder="••••••••"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg transition duration-300"
          />
          <FiLock className="icon w-5 h-5" />
          <div className="mt-2 flex items-center justify-between text-sm">
            <button type="button" onClick={()=>setShowForgot(true)} className="auth-link">Forgot password?</button>
            <Link to="/forgot" className="text-gray-400 hover:underline">Try on separate page</Link>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="auth-button w-full py-3"
        >
          Login
        </button>
      </form>
      
      {/* Social login divider */}
      <div className="social-divider">
        <span>or continue with</span>
      </div>
      
      {/* Social login buttons */}
      <div className="social-login-container">
        <button className="social-login-button google-button">
          <FaGoogle className="icon" />
          <span>Google</span>
        </button>
        <button className="social-login-button facebook-button">
          <FaFacebookF className="icon" />
        </button>
        <button className="social-login-button twitter-button">
          <FaTwitter className="icon" />
        </button>
      </div>

      <p className="text-sm text-center text-gray-400 mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="auth-link">
          Sign up
        </Link>
      </p>
      </div>
    </div>

    {showForgot && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="auth-modal w-full max-w-md p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="auth-title text-lg font-semibold">Reset Password</h3>
            <button 
              onClick={()=>setShowForgot(false)} 
              className="rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="auth-input relative">
              <input 
                value={fp.name} 
                onChange={e=>setFp({...fp, name:e.target.value})} 
                placeholder="Your Name" 
                className="w-full rounded-lg transition duration-300" 
              />
              <FiUser className="icon w-5 h-5" />
            </div>
            
            <div className="auth-input relative">
              <input 
                value={fp.upiId} 
                onChange={e=>setFp({...fp, upiId:e.target.value})} 
                placeholder="yourname@bank" 
                className="w-full rounded-lg transition duration-300" 
              />
              <FiKey className="icon w-5 h-5" />
            </div>
            
            <div className="auth-input relative">
              <input 
                type="password" 
                value={fp.newPassword} 
                onChange={e=>setFp({...fp, newPassword:e.target.value})} 
                placeholder="New Password" 
                className="w-full rounded-lg transition duration-300" 
              />
              <FiLock className="icon w-5 h-5" />
            </div>
            
            <div className="auth-input relative">
              <input 
                type="password" 
                value={fp.confirm} 
                onChange={e=>setFp({...fp, confirm:e.target.value})} 
                placeholder="Confirm Password" 
                className="w-full rounded-lg transition duration-300" 
              />
              <FiLock className="icon w-5 h-5" />
            </div>
            
            <button className="auth-button w-full py-2 mt-2">Update Password</button>
          </form>
        </div>
      </div>
    )}
    </>
  );
}