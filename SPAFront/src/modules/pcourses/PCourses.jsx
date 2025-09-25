import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../components/navBar/NavBar";
import Card from "../../components/card/Card";
import { useUser } from "../../context/UserContext";
import "./PCourses.css";

const API_URL = "http://localhost:5001/api";

function PCourses() {
  const { user } = useUser(); // 👈 obtenemos el usuario logueado
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/getCursos`, {
          withCredentials: true, // importante para que envíe cookies con el JWT
        });
        setCourses(res.data);
      } catch (err) {
        console.error("❌ Error al obtener cursos:", err);
        setError("Hubo un error al cargar los cursos.");
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <NavBar />

      <div className="pcourses-container">
        <h2 className="pcourses-title">📚 Nuestros Cursos</h2>

        {error && <p className="pcourses-error">{error}</p>}

        <div className="pcourses-grid">
          {courses.length > 0 ? (
            courses.map((course) => (
              <Card
                key={course.id_curso}
                title={course.nombre_curso}
                description={course.descripcion}
                imageUrl={`https://source.unsplash.com/random/400x250?study,${course.nombre_curso}`}
                link={`/curso/${course.id_curso}`}
                creator={course.id_profesor}                // 🧑‍💼 nombre del creador
                role={course.id_rol}                   // 🔑 rol del creador
                assignedProfessor={course.id_profesor} // 🧑‍🏫 si el admin asignó uno
                currentUserRole={user?.id_rol}         // 👤 rol del usuario logueado
              />
            ))
          ) : (
            !error && (
              <p className="pcourses-empty">No hay cursos disponibles 😔</p>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default PCourses;
