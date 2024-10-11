import axios from "axios";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import FileUpload from "./components/FileUpload";
import VerifyCode from "./components/VerifyCode";
import Info from "./components/Info";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || !verifyToken(token) || localStorage.getItem("verified") === "false") {
    return <Navigate to="/login" />;
  }

  return children;
};

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

const verifyToken = async (token) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/validate-token", {
      token: token,
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={ <VerifyCode />} />
          <Route path="/upload" element={<ProtectedRoute><FileUpload /></ProtectedRoute>} />
          <Route path="/info" element={<ProtectedRoute><Info /></ProtectedRoute>} />
        </Routes>
    </Router>
  );
}

export default App;

