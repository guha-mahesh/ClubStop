// Backend URL configuration
// Automatically detects environment and uses appropriate URL

const getBackendUrl = (): string => {
  // If VITE_BACKEND_URL is set, use it (for custom backends)
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // For local development with Docker, use localhost:3001
  if (import.meta.env.DEV && window.location.hostname === 'localhost') {
    return 'http://localhost:3001';
  }
  
  // Default: Use the remote Render backend (works for both local and production)
  return 'https://clubstop.onrender.com';
};

export const backendUrl = getBackendUrl();

// Debug: Log the backend URL being used
console.log('Backend URL:', backendUrl);
console.log('Environment:', import.meta.env.DEV ? 'development' : 'production');
console.log('Hostname:', window.location.hostname); 