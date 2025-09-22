// src/routes/courses.js
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { addCourse, getCourses} from "../controller/course.controller.js";

const router = Router();

router.post("/addCurso", verifyToken, authorizeRoles(1,3), addCourse); // admin y profesor
router.get("/getCursos", verifyToken, getCourses); // todos los usuarios logueados

export default router;
