const BASE_URL = 'https://sua-api-escolar.com/api';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    throw new Error('Erro na requisição');
  }

  return response.json();
};