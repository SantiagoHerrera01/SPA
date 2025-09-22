import NavBar from "../../components/navBar/NavBar";
import "./dashboard.css";
import Card from "../../components/card/Card";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const API_URL = "http://localhost:5001/api";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/getCursos`, { withCredentials: true });
        setCourses(res.data);
      } catch (err) {
        console.error("Error al traer cursos:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = () => {
    console.log("Cerrar sesión");
  };

  return (
    <div className="dashboard">
      <NavBar onLogout={handleLogout} />
      <div className="cards-container">
        {courses.map((course) => (
          <Card
            key={course.id_curso}
            title={course.nombre_curso}
            description={course.descripcion}
            imageUrl={course.imagen || "https://source.unsplash.com/400x300/?study"}
            // link={`/curso/${course.id_curso}`}
          />
        ))}
      </div>
    </div>
  );
}
