// frontend/src/components/Register.jsx

import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiSmartphone, FiKey, FiLock } from 'react-icons/fi';
import { registerUser } from '../lib/auth';

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
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      {/* Glassmorphism Card Container */}
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-2xl border bg-white/90 backdrop-blur-md border-gray-200 text-gray-900 dark:bg-gray-900/70 dark:border-gray-700 dark:text-gray-100">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Name Field with Icon */}
        <div className="relative">
          <FiUser className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
          <input
            type="text"
            placeholder="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 pl-12 text-white bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        {/* UPI ID Field */}
        <div className="relative">
          <FiKey className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
          <input
            type="text"
            placeholder="yourname@bank"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 pl-12 text-white bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        {/* Phone Field */}
        <div className="relative">
          <FiSmartphone className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
          <input
            type="tel"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 pl-12 text-white bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        {/* Password Field with Icon */}
        <div className="relative">
          <FiLock className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
          <input
            type="password"
            placeholder="••••••••"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 pl-12 text-white bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 transform hover:scale-105"
        >
          Register
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 dark:text-gray-300">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-400 hover:underline">
          Log in
        </Link>
      </p>
      </div>
    </div>
  );
}