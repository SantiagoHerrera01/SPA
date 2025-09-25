// src/routes/courses.js
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { addCourse, getCourses} from "../controller/course.controller.js";
import { getPool } from "../db.js";

const router = Router();

router.post("/addCurso", verifyToken, authorizeRoles(1,3), addCourse); // admin y profesor
router.get("/getCursos", verifyToken, getCourses); // todos los usuarios logueados
router.get("/misCursos", verifyToken, authorizeRoles(1, 3), async (req, res) => {
    console.log("👉 Usuario autenticado:", req.user);
  try {
    const { id_usuario, id_rol } = req.user;
    let query, params;

    if (id_rol === 1) {
      // Admin ve todos
      query = `SELECT c.*, u.nombre_usuario AS profesor 
               FROM cursos c 
               JOIN usuarios u ON c.id_profesor = u.id_usuario`;
      params = [];
    } else {
      // Profesor ve solo los suyos
      query = `SELECT c.*, u.nombre_usuario AS profesor 
               FROM cursos c 
               JOIN usuarios u ON c.id_profesor = u.id_usuario
               WHERE c.id_profesor = ?`;
      params = [id_usuario];
    }

    const [rows] = await getPool().query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener mis cursos:", error);
    res.status(500).json({ message: error.message });
  }
});


export default router;
