import { createContext, useState, useEffect, useContext } from 'react';
import { apiClient } from '../services/apiClient';

const AuthContext = createContext({});

// Definindo tempo da secao
const duracaoSecao = 24 * 60 * 60 * 1000; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('auth_token');
    // Pega prazo de validade
    const expiresAt = localStorage.getItem('expires_at');
    const agora = new Date().getTime();

    if (savedUser && savedToken && expiresAt) {
      // Verifica se o prazo venceu
      if (agora > parseInt(expiresAt)) {
        logout();
      } else {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }), 
      });

      if (data.token && data.usuario) {
        const agora = new Date().getTime();
        const tempoExpiracao = agora + duracaoSecao;

        // 5. AJUSTE: Normalizando para o formato que o Front usa
        const userLogado = {
          id: data.usuario.id,
          nome: data.usuario.nome,
          email: data.usuario.email,
          role: data.usuario.roles[0]?.replace('ROLE_', '') || 'USER'
        };

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(userLogado));
        // 6. ADICIONADO: Salva quando deve expirar
        localStorage.setItem('expires_at', tempoExpiracao.toString());
        
        setUser(userLogado);
        return { success: true };
      }
      return { success: false, error: 'Dados de usuário não recebidos' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('expires_at');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);