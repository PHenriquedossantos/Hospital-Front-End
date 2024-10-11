import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const tempToken = localStorage.getItem("tempToken");
  
    if (!tempToken) {
      alert("Token temporário não encontrado. Por favor, faça login novamente.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/verify-two-factor", {
        two_factor_code: code,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempToken}`,
        }
      });
  
      const data = response.data;
      setLoading(false);
  
      if (data.data && data.data.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("verified", "true");
        localStorage.removeItem("tempToken");
        navigate("/info");
      } else {
        alert("Código de verificação incorreto ou falha na verificação.");
      }
    } catch (error) {
      setLoading(false);
      alert("Erro ao processar a verificação: " + (error.response?.data?.message || error.message));
    }
  };
  
  return (
    <div className="form-container">
      <form onSubmit={handleVerify} className="form-box">
        <h2>Verifique seu código</h2>
        <div className="form-group">
          <label>Código de verificação:</label>
          <input
            className="code-input"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="Digite o código enviado para seu email"
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Verificando..." : "Verificar"}
        </button>
      </form>
    </div>
  );
};

export default VerifyCode;
