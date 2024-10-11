import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginRegister.css";

const Register = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name: user.fullName,             
        email: user.email,
        password: user.password,
        password_confirmation: user.confirmPassword,
      });

      const responseObj = response.data;
      if (responseObj.data.token) {
        localStorage.setItem("token", responseObj.data.token);

        navigate("/info");
      } else {
        alert("Erro ao registrar o usuário.");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      alert("Erro no registro: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h2>Cadastro</h2>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirmar Senha:</label>
          <input
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
      <p className="login-link">
        Já possui uma conta? <a href="/login">Faça login</a>
      </p>
    </div>
  );
};

export default Register;
