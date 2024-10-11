import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="home-container">
      <h1>Bem-vindo</h1>
      <p>Escolha uma opção para continuar:</p>
      <div className="button-group">
        <button onClick={handleLoginClick} className="home-button login-button">
          Login
        </button>
        <button
          onClick={handleRegisterClick}
          className="home-button register-button"
        >
          Cadastro
        </button>
      </div>
    </div>
  );
};

export default Home;
