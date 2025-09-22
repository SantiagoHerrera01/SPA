import { getPool } from "../db.js"; // tu conexión MySQL

export const addCourse = async (req, res) => {
  const { nombre_curso, descripcion } = req.body;

  try {

    // Insertar curso
    const [result] = await getPool().query(
      `INSERT INTO cursos (nombre_curso, descripcion) 
       VALUES (?, ?)`,
      [nombre_curso, descripcion]
    );

    const courseId = result.insertId;

    // Respuesta
    res.status(201).json({
      id_curso: courseId,
      nombre_curso,
      descripcion,
    });
  } catch (error) {
    console.error("❌ Error en agregar curso:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getCourses = async (req, res) => {
  try {
    const [rows] = await getPool().query(
      "SELECT id_curso, nombre_curso, descripcion FROM cursos"
    );

    res.status(200).json(rows); // devuelve un array de cursos
  } catch (error) {
    console.error("❌ Error al obtener cursos:", error);
    res.status(500).json({ message: error.message });
  }
};