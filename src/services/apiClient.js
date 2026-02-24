const BASE_URL = 'http://localhost:8080';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    // Se o erro for 401, o token pode estar inválido.
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      // Opcional: window.location.href = '/login';
    }

    const errorData = await response.json().catch(() => ({}));
    // No seu Java usamos Map.of("error", ...), então buscamos errorData.error
    throw new Error(errorData.error || `Erro ${response.status}: Falha na requisição`);
  }

  return response.json();
};