import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!selectedFile) {
      alert("Por favor, selecione um arquivo antes de fazer o upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/importar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Arquivo enviado com sucesso!");
      } else {
        alert("Falha no upload do arquivo.");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert(
        "Erro ao fazer o upload do arquivo: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/info");
  };

  return (
    <div className="upload-container">

      <form onSubmit={handleSubmit} className="upload-form">
        <h2>Upload de Arquivo</h2>
        <div className="form-group">
          <label htmlFor="file-upload">Selecione um arquivo:</label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            className="file-input"
            required
          />
        </div>
        {selectedFile && (
          <div className="file-info">
            <p>Arquivo selecionado: {selectedFile.name}</p>
          </div>
        )}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Enviando..." : "Upload"}
        </button>
      </form>
      <button onClick={handleBack} className="back-button">
        Voltar para os pacientes
      </button>
    </div>
  );
};

export default FileUpload;
