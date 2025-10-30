// frontend/src/components/Register.jsx

import { useState, useEffect } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiSmartphone, FiKey, FiLock } from 'react-icons/fi';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa'; // Social media icons
import { registerUser } from '../lib/auth';
import { CoinStack, CreditCard, PiggyBank } from '../components/decorative/FinanceElements';
import '../components/auth.css';

export default function Register() {
  const [formData, setFormData] = useState({ name: "", upiId: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(formData);
      const saved = { ...user, role: 'user' };
      localStorage.setItem('user', JSON.stringify(saved));
      navigate('/app/dashboard');
    } catch (err) {
      alert(err?.response?.data?.msg || err.message);
    }
  };

  return (
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
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Name Field with Icon */}
        <div className="auth-input relative">
          <input
            type="text"
            placeholder="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg transition duration-300"
          />
          <FiUser className="icon w-5 h-5" />
        </div>

        {/* UPI ID Field */}
        <div className="auth-input relative">
          <input
            type="text"
            placeholder="yourname@bank"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
            required
            className="w-full rounded-lg transition duration-300"
          />
          <FiKey className="icon w-5 h-5" />
        </div>

        {/* Phone Field */}
        <div className="auth-input relative">
          <input
            type="tel"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full rounded-lg transition duration-300"
          />
          <FiSmartphone className="icon w-5 h-5" />
        </div>

        {/* Password Field with Icon */}
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="auth-button w-full py-3"
        >
          Register
        </button>
      </form>
      
      {/* Social login divider */}
      <div className="social-divider">
        <span>or register with</span>
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
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Log in
        </Link>
      </p>
      </div>
    </div>
  );
}