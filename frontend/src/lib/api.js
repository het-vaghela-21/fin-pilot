import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: BASE_URL });

const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
};
const withUser = (params = {}) => {
  const u = getUser();
  if (u?.id && !params.userId) return { ...params, userId: u.id };
  return params;
};

export const createTransaction = async (payload) => {
  const u = getUser();
  const body = u?.id ? { ...payload, userId: u.id } : payload;
  const { data } = await api.post('/api/transactions', body);
  return data;
};

export const listTransactions = async (params = {}) => {
  const { data } = await api.get('/api/transactions', { params: withUser(params) });
  return data;
};

export const getStats = async (params = {}) => {
  const { data } = await api.get('/api/transactions/stats', { params: withUser(params) });
  return data; // { totals: {income, expense}, balance }
};

export const getSummary = async (params = {}) => {
  const { data } = await api.get('/api/transactions/summary', { params: withUser(params) });
  return data; // [{date, income, expense, balance}]
};

// Goals
export const getGoal = async (params = {}) => {
  const { data } = await api.get('/api/goals', { params: withUser(params) });
  return data; // { userId, year, amount }
};

export const setGoal = async (payload) => {
  const u = getUser();
  const body = u?.id ? { ...payload, userId: u.id } : payload;
  const { data } = await api.post('/api/goals', body);
  return data; // upserted goal
};

// Users (admin)
export const listUsers = async () => {
  const { data } = await api.get('/api/users/all');
  return data; // [{id,name,upiId,phone}]
};

export default api;
