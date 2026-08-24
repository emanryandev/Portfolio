import axios, { AxiosError, AxiosResponse } from 'axios';

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
  withCredentials: true, // Required for Sanctum cookie-based auth
  withXSRFToken: true, // Required in newer Axios versions to send X-XSRF-TOKEN
});

// Normalized Error Type
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Request Interceptor: CSRF Token
apiClient.interceptors.request.use(async (config) => {
  // If it's a mutating request, we need a CSRF cookie
  const isMutating = ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() ?? '');
  
  // Note: For a real app, you might want to only fetch this once per session or on initialization
  // For simplicity, we just rely on Axios withCredentials to send the cookie, 
  // but if it's missing, Laravel will reject. It's often better to fetch CSRF during initial app load.
  
  return config;
});

// Response Interceptor: Error Normalization
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Standardize 204 No Content
    if (response.status === 204) {
      return null as any; // Returns null for successful deletes/empty responses
    }
    
    // Unpack data wrapper if it exists (Optional, depending on usage pattern)
    // return response.data;
    
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: 'An unexpected error occurred.',
    };

    if (error.response) {
      const data = error.response.data as any;
      
      switch (apiError.status) {
        case 401:
          apiError.message = 'Unauthenticated. Please log in.';
          // If we're already in the admin area (but not the login page itself), redirect to login
          if (typeof window !== 'undefined' && 
              window.location.pathname.startsWith('/admin') && 
              window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login';
          }
          break;
        case 403:
          apiError.message = 'Unauthorized access.';
          break;
        case 404:
          apiError.message = 'Resource not found.';
          break;
        case 422:
          apiError.message = data.message || 'Validation failed.';
          apiError.errors = data.errors;
          break;
        case 429:
          apiError.message = 'Too many requests. Please try again later.';
          break;
        case 500:
        default:
          apiError.message = data.message || 'Server error occurred.';
          break;
      }
    } else if (error.request) {
      apiError.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(apiError);
  }
);
