import NavBar from "../../components/navBar/NavBar";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import Form from "../../components/form/Form";

export default function MyCourses() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCourseSubmit = (course) => {
    setCourses([...courses, course]);
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
    <NavBar />
    <div style={{ padding: "2rem" }}>
      
      <p>Profesor: {user?.nombre_usuario}</p>

      <div style={{ padding: "40px", backgroundColor: "#f3f4f6", minHeight: "100vh" }}>

      <Form
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCourseSubmit}
      />

      <h2 style={{ marginTop: "30px" }}>Cursos Registrados:</h2>
      <ul>
        {courses.map((course, index) => (
          <li key={index}>
            <strong>{course.courseName}</strong>: {course.description}
          </li>
        ))}
      </ul>
    </div>
    </div>
    </>
  );
}
