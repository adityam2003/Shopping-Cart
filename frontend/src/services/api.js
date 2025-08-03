import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const signup = async (username, password) => {
  const response = await api.post('/users', { username, password });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('username', username);
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post('/users/login', { username, password });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('username', username);
  return response.data;
};

export const getItems = async () => {
  const response = await api.get('/items');
  return response.data;
};

export const getItem = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const getCart = async () => {
  try {
    const response = await api.get('/carts/me');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { items: [] };
    }
    throw error;
  }
};

export const addToCart = async (itemId, quantity = 1) => {
  try {
    const response = await api.post('/carts', { 
      item_id: itemId,
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to add items to cart');
    }
    throw error;
  }
};

export const createOrder = async (cartId) => {
  const response = await api.post('/orders', {
    cart_id: cartId
  });
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders/me');
  return response.data;
};

export const cleanupCart = async () => {
  const response = await api.post('/carts/cleanup');
  return response.data;
};

export const deleteCartItem = async (itemId) => {
  const response = await api.delete('/carts/items', { 
    data: { item_id: itemId }
  });
  return response.data;
};