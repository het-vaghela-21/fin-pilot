// frontend/src/components/Login.jsx

import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import { FiSmartphone, FiLock, FiKey } from 'react-icons/fi'; // Import icons
import { loginUser, resetPassword } from '../lib/auth';

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
    {/* Glassmorphism Card Container (Original "Liquid Glass" theme) */}
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-2xl border bg-white/90 backdrop-blur-md border-gray-200 text-gray-900 dark:bg-gray-900/70 dark:border-gray-700 dark:text-gray-100">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
        Welcome Back
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* UPI ID Field */}
        <div className="relative">
          <FiKey className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
          <input
            type="text"
            placeholder="yourname@bank (or leave blank if using phone)"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
            className="w-full px-4 py-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          />
        </div>

        {/* Phone Field (optional alternative to UPI) */}
        <div className="relative">
          <FiSmartphone className="absolute w-5 h-5 text-gray-400 top-3.5 left-4" />
          <input
            type="tel"
            placeholder="Phone Number (or leave blank if using UPI)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          />
        </div>

        {/* Password Field */}
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
          <div className="mt-2 flex items-center justify-between text-sm">
            <button type="button" onClick={()=>setShowForgot(true)} className="text-blue-400 hover:underline">Forgot password?</button>
            <Link to="/forgot" className="text-gray-400 hover:underline">Try on separate page</Link>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 transform hover:scale-105"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 dark:text-gray-300">
        Don’t have an account?{" "}
        <Link to="/register" className="font-medium text-blue-400 hover:underline">
          Sign up
        </Link>
      </p>
      </div>
    </div>

    {showForgot && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-xl border bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Reset Password</h3>
            <button onClick={()=>setShowForgot(false)} className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Close</button>
          </div>
          <form onSubmit={handleForgot} className="space-y-3">
            <input value={fp.name} onChange={e=>setFp({...fp, name:e.target.value})} placeholder="Your Name" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
            <input value={fp.upiId} onChange={e=>setFp({...fp, upiId:e.target.value})} placeholder="yourname@bank" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
            <input type="password" value={fp.newPassword} onChange={e=>setFp({...fp, newPassword:e.target.value})} placeholder="New Password" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
            <input type="password" value={fp.confirm} onChange={e=>setFp({...fp, confirm:e.target.value})} placeholder="Confirm Password" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
            <button className="w-full rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Update Password</button>
          </form>
        </div>
      </div>
    )}
    </>
  );
}