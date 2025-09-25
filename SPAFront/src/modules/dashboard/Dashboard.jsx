import NavBar from "../../components/navBar/NavBar";
import "./dashboard.css";
import { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function Dashboard() {
  const typedRef = useRef(null);

  const handleLogout = () => {
    console.log("Cerrar sesión");
  };

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["StudyHub"],
      typeSpeed: 120,
      backSpeed: 100,
      loop: true,
      showCursor: false,
    });

    return () => {
      typed.destroy(); // limpieza al desmontar
    };
  }, []);

  return (
    <div className="dashboard">
      <NavBar onLogout={handleLogout} />
      <h1 className="title">
        Bienvenido a <span className="title2" ref={typedRef}></span>
      </h1>
    </div>
  );
}
