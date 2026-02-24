import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiClient";

export const useRegister = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiClient("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          nome: name,
          email: email,
          password: password,
        }),
      });

      // Após cadastrar, volta para login
      navigate("/");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    loading,
    error,
    handleRegister
  };
};