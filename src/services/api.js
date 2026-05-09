import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Attach token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const signUp = (data) => API.post('/auth/signup', data);
export const signIn = (data) => API.post('/auth/signin', data);

export const getSubscriptions = () => API.get('/subscriptions');
export const getLeakageAnalysis = () => API.get('/subscriptions/leakage');
export const addSubscription = (data) => API.post('/subscriptions', data);
export const updateSubscription = (id, data) => API.put(`/subscriptions/${id}`, data);
export const deleteSubscription = (id) => API.delete(`/subscriptions/${id}`);
export const logUsage = (id) => API.patch(`/subscriptions/${id}/log-usage`);