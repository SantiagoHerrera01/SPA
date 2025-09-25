import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; // <-- añadí useRef
import axios from "axios";
import { useUser } from "../../context/UserContext";
import Typed from "typed.js";
import "./NavBar.css";

const API_URL = "http://localhost:5001/api";

export default function NavBar() {
  const { user, loginUser, logoutUser } = useUser();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  // 🔹 Typed.js
  const typedRef = useRef(null);
  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["StudyHub"],
      typeSpeed: 120,
      backSpeed: 10,
      loop: false,
      showCursor: false,
    });

    return () => typed.destroy();
  }, []);

  // 🔹 Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/user`, { withCredentials: true });
        loginUser(res.data);
      } catch (err) {
        logoutUser();
      }
    };
    fetchUser();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      logoutUser();
      navigate("/");
    } catch (err) {
      console.error("❌ Error al cerrar sesión:", err.response?.data || err.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/dashboard" className="navbar-title">
          <span ref={typedRef}></span>
        </Link>
        <Link to="/dashboard">Inicio</Link>
        <Link to="/cursos">Cursos</Link>
        {user && user.id_rol === 1 && <Link to="/matriculas">Matrículas</Link>}
      </div>

      <div className="navbar-user">
        {user ? (
          <div className="user-menu">
            <span className="user-name" onClick={() => setOpenMenu(!openMenu)}>
              {user.nombre_usuario}
            </span>
            {openMenu && (
              <div className="dropdown">
                <Link to="/perfil" className="dropdown-item">Perfil</Link>
                <Link to="/ajustes" className="dropdown-item">Ajustes</Link>
                {(user.id_rol === 1 || user.id_rol === 3) && <Link to="/mis-cursos" className="dropdown-item">Mis cursos</Link>}
                <button onClick={handleLogout} className="dropdown-item logout">Cerrar sesión</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/" className="login-btn">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}
