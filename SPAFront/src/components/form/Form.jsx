// src/components/Form.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Form.css";

const API_URL = "http://localhost:5001/api";

const Form = ({ onCourseCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName || !description) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/addCurso`,
        {
          nombre_curso: courseName,
          descripcion: description,
        },
        { withCredentials: true }
      );

      onCourseCreated(res.data); // 👈 notifica al padre
      setCourseName("");
      setDescription("");
      closeModal();
    } catch (error) {
      console.error("❌ Error al crear curso:", error);
      alert("No tienes permisos para crear un curso o hubo un error.");
    }
  };

  return (
    <>
      <button className="new-course-button" onClick={openModal}>
        Nuevo Curso +
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
            <h2>Registro de Curso</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="courseName">Nombre del Curso</label>
              <input
                type="text"
                id="courseName"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />

              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <button type="submit">Registrar Curso</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
