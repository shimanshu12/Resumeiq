import axios from 'axios';
import { supabase } from '../supabase/supabaseClient';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const defaultBaseUrl = import.meta.env.PROD
  ? 'https://resumeiq-f7g6.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: configuredBaseUrl || defaultBaseUrl,
});

// Attach the current Supabase access token to every request so the backend
// can verify identity via requireAuth middleware.
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
