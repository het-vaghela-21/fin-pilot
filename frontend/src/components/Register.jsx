// frontend/src/components/Register.jsx

import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock } from 'react-icons/fi'; // Import icons

export default function Register() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Data:", formData);
    // You can add API call here
    alert("Registration attempt with: " + formData.email); // For testing
  };

  return (
    // Glassmorphism Card Container
    <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700">
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

        {/* Email Field with Icon */}
        <div className="relative">
          <FiMail className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
          <input
            type="email"
            placeholder="you@example.com"
            name="email"
            value={formData.email}
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

      <p className="text-sm text-center text-gray-300">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}