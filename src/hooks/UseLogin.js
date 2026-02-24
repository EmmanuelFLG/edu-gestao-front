import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pegamos a função login de dentro do nosso Contexto Global
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(email, password);

      // Verificamos se result existe antes de acessar .success
      if (result && result.success) {
         console.log("Logado!");
      } else {
        setError(result?.error || 'Erro ao conectar ao servidor');
        setLoading(false);
      }
    } catch (err) {
      setError("Erro inesperado");
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin
  };
};