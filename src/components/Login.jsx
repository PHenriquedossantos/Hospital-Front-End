import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import eyeHide from "../assets/eye-password-hide.svg";
import eyeShow from "../assets/eye-password-show.svg";
import "./LoginRegister.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email: email,
        password: password,
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      const responseObj = response.data;
      if (responseObj.data.token) {
        localStorage.setItem("tempToken", responseObj.data.token);
        localStorage.setItem("verified", "false");

        navigate("/verify");
      } else {
        alert("Login falhou");
      }
    } catch (error) {
      alert("Erro ao processar o login: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
 
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Digite seu email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
            />
            <span
              className="toggle-password"
              onClick={handleTogglePasswordVisibility}
            >
              <img
                src={showPassword ? eyeHide : eyeShow}
                alt={showPassword ? "Esconder senha" : "Mostrar senha"}
                className="password-icon"
              />
            </span>
          </div>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Entrando..." : "Login"}
        </button>
      </form>
      <p className="register-link">
        Não possui conta? <a href="/register">Se cadastre aqui</a>
      </p>
    </div>
  );
};

export default Login;
