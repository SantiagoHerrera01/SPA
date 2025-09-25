import { getPool } from "../db.js"; // tu conexión MySQL

export const addCourse = async (req, res) => {
  const { nombre_curso, descripcion } = req.body;
  const id_profesor = req.user.id_usuario; // 👈 del token

  try {
    const [result] = await getPool().query(
      `INSERT INTO cursos (nombre_curso, descripcion, id_profesor) 
       VALUES (?, ?, ?)`,
      [nombre_curso, descripcion, id_profesor]
    );

    res.status(201).json({
      id_curso: result.insertId,
      nombre_curso,
      descripcion,
      id_profesor,
    });
  } catch (error) {
    console.error("❌ Error en agregar curso:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getCourses = async (req, res) => {
  try {
    const [rows] = await getPool().query(
      `SELECT 
         c.id_curso, 
         c.nombre_curso, 
         c.descripcion,
         u.nombre_usuario AS profesor
       FROM cursos c
       LEFT JOIN usuarios u ON c.id_profesor = u.id_usuario`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error al obtener cursos:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getMyCourses = async (req, res) => {
  console.log("🪪 Usuario autenticado:", req.user); // 👈 agrega esto
  const { id_usuario, id_rol } = req.user;

  try {
    let query;
    let params = [];

    // Si es administrador, ve todos
    if (id_rol === 1) {
      query = `
        SELECT c.id_curso, c.nombre_curso, c.descripcion, u.nombre_usuario AS profesor
        FROM cursos c
        LEFT JOIN usuarios u ON c.id_profesor = u.id_usuario
      `;
    } else {
      // Si es profesor, solo ve los suyos
      query = `
        SELECT c.id_curso, c.nombre_curso, c.descripcion, u.nombre_usuario AS profesor
        FROM cursos c
        LEFT JOIN usuarios u ON c.id_profesor = u.id_usuario
        WHERE c.id_profesor = ?
      `;
      params = [id_usuario];
    }

    const [rows] = await getPool().query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error al obtener cursos:", error);
    res.status(500).json({ message: error.message });
  }
};

