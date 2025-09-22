// src/components/Form.jsx
import React, { useState } from "react";
import "./Form.css";

const Form = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseName || !description) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    onSubmit({ courseName, description });
    setCourseName("");
    setDescription("");
    closeModal();
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
                placeholder="Ingresa el nombre del curso"
              />

              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ingresa una descripción del curso"
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
