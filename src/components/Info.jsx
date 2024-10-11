import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./info.css";

const ItemList = () => {
  const [items, setItems] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 
  const [popupVisible, setPopupVisible] = useState(false); 
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const navigate = useNavigate(); 

  // Delay de 500ms para o debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchItems = async (page = 1, nome = '') => {
    const token = localStorage.getItem("token"); 
    const endpoint = nome ? `http://localhost:8000/api/paciente/nome/${nome}` : `http://localhost:8000/api/pacientes?page=${page}`;

    try {
      const response = await axios.get(endpoint, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setItems(response.data.data); 
        setTotalPages(response.data.last_page);
      } else {
        console.error('A resposta da API não contém um array de pacientes:', response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  };

  useMemo(() => {
    if (debouncedSearchTerm) {
      fetchItems(1, debouncedSearchTerm);
    } else {
      fetchItems(currentPage); 
    }
  }, [currentPage, debouncedSearchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemClick = async (id) => {
    const token = localStorage.getItem("token"); 
    try {
      const response = await axios.get(`http://localhost:8000/api/paciente/detalhes/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.data) {
        setSelectedPatient(response.data);
        setPopupVisible(true);
      } else {
        console.error('A resposta da API não contém os detalhes do paciente:', response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar os detalhes do paciente:', error);
    }
  };

  const closePopup = () => {
    setPopupVisible(false); 
    setSelectedPatient(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.reload();
  };

  const handleUpload = () => {
    navigate("/upload");
  };

  // Função para renderizar o range de páginas
  const renderPageButtons = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Número de botões visíveis

    const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (currentPage > 1) {
      pageNumbers.push(
        <button key="first" onClick={() => paginate(1)}>{"<<"}</button>,
        <button key="prev" onClick={() => paginate(currentPage - 1)}>{"<"}</button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pageNumbers.push(
        <button key="next" onClick={() => paginate(currentPage + 1)}>{">"}</button>,
        <button key="last" onClick={() => paginate(totalPages)}>{">>"}</button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="item-list-container">
      <h2>Lista de Pacientes</h2>
      
      <div className="menu">
        <button onClick={handleUpload} className="menu-button">Fazer Upload de Dados</button>
        <button onClick={handleLogout} className="menu-button">Logout</button>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <ul className={`item-list ${popupVisible ? 'fade-out' : ''}`}>
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item.id}
              className="item"
              onClick={() => handleItemClick(item.id)}
            >
              {item.nome}
            </li>
          ))
        ) : (
          <li className="item">Nenhum paciente encontrado.</li>
        )}
      </ul>
      <div className="pagination">
        {renderPageButtons()}
      </div>

      {popupVisible && selectedPatient && (
        <div className={`popup ${popupVisible ? 'fade-in' : 'fade-out'}`}>
          <div className="popup-content">
            <h3>Detalhes do Paciente</h3>
            <p><strong>Nome:</strong> {selectedPatient.nome}</p>
            <p><strong>Hospital:</strong> {selectedPatient.hospital}</p>
            <p><strong>Plano de saúde:</strong> {selectedPatient.plano_saude}</p>
            <button onClick={closePopup} className="close-popup">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;
