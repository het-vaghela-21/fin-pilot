import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: BASE_URL });

export const registerUser = async ({ name, upiId, phone, password }) => {
  const { data } = await api.post('/api/users/register', { name, upiId, phone, password });
  return data; // { id, name, upiId, phone }
};

export const resetPassword = async ({ name, upiId, newPassword }) => {
  const { data } = await api.post('/api/users/forgot', { name, upiId, newPassword });
  return data; // { ok: true }
};

export const loginUser = async ({ upiId, phone, password }) => {
  const payload = { password };
  if (upiId) payload.upiId = upiId;
  if (phone) payload.phone = phone;
  const { data } = await api.post('/api/users/login', payload);
  return data; // { id, name, upiId, phone }
};

export default api;
