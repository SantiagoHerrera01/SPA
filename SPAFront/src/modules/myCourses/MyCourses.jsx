import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../components/navBar/NavBar";
import { useUser } from "../../context/UserContext";
import Form from "../../components/form/Form";
import "./MyCourses.css";

const API_URL = "http://localhost:5001/api";

export default function MyCourses() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/misCursos`, {
          withCredentials: true,
        });
        setCourses(res.data);
      } catch (error) {
        console.error("❌ Error al obtener mis cursos:", error);
        setError("No se pudieron cargar los cursos.");
      }
    };

    fetchMyCourses();
  }, []);

  const handleCourseCreated = (newCourse) => {
    setCourses([...courses, newCourse]);
  };

  return (
    <>
      <NavBar />
      <div className="mycourses-container">
        <h1 className="mycourses-title">📚 Gestión de Mis Cursos</h1>
        <p className="mycourses-user">
          👤 Profesor: <strong>{user?.nombre_usuario}</strong>
        </p>

        {/* Solo profesor o admin pueden crear cursos */}
        {(user?.id_rol === 1 || user?.id_rol === 3) && (
          <Form onCourseCreated={handleCourseCreated} />
        )}

        <h2 className="mycourses-subtitle">📘 Mis Cursos:</h2>

        {error && <p className="mycourses-error">{error}</p>}

        {courses.length > 0 ? (
          <div className="courses-list">
            {courses.map((course) => (
              <div className="course-card" key={course.id_curso}>
                <img
                  src={
                    course.imagen ||
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"
                  }
                  alt={course.nombre_curso}
                  className="course-image"
                />
                <div className="course-content">
                  <h3 className="course-name">{course.nombre_curso}</h3>
                  <p className="course-description">{course.descripcion}</p>
                  <p className="course-professor">
                    👨‍🏫 Profesor: <strong>{course.profesor || "No asignado aún"}</strong>
                  </p>

                  {/* 🔥 BOTONES EDITAR / ELIMINAR */}
                  {(user?.id_rol === 1 || user?.id_rol === 3) && (
                    <div className="course-actions">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          alert(`✏️ Editar curso: ${course.nombre_curso}`)
                        }
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          alert(`🗑️ Eliminar curso: ${course.nombre_curso}`)
                        }
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && <p className="no-courses">No tienes cursos creados aún 😔</p>
        )}
      </div>
    </>
  );
}
