import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

const API_URL = "http://localhost:5001/api";

export default function LoginForm() {
  const [correo_usuario, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { correo_usuario, password },
        { withCredentials: true } 
      );

      loginUser(res.data);


      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        {error && <div style={styles.error}>{error}</div>}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo_usuario}
          onChange={(e) => setCorreo(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Entrar</button>
        <div style={styles.registerText}>
          ¿No tienes cuenta?{" "}
          <span style={styles.link} onClick={goToRegister}>
            Regístrate aquí
          </span>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  form: {
    background: "#fff",
    padding: "2rem 2.5rem",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    minWidth: "320px",
  },
  title: {
    marginBottom: "1.5rem",
    color: "#333",
    textAlign: "center",
  },
  input: {
    marginBottom: "1rem",
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.75rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "1rem",
    fontSize: "1rem",
    transition: "background 0.3s",
  },
  registerText: {
    textAlign: "center",
    color: "#555",
    fontSize: "0.95rem",
  },
  link: {
    color: "#764ba2",
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: "4px",
  },
  error: {
    background: "#ffe0e0",
    color: "#d32f2f",
    padding: "0.5rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    textAlign: "center",
  },
};
