const DEFAULT_API_BASE_URL =
  import.meta.env.PUBLIC_ECOMMERCE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3005' : 'https://smarttechnologyexpo.mx/server');

const API_BASE_URL = DEFAULT_API_BASE_URL.replace(/\/$/, '');

export function getEcommerceApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function ecommerceFetch(path, options = {}) {
  return fetch(getEcommerceApiUrl(path), options);
}
