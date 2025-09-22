import dotenv from "dotenv";
import app from "./app.js";
import { connectDB, getPool } from "./db.js";

// Carga el .env de la raíz
dotenv.config();

async function main() {
  await connectDB(); // Espera a que la conexión esté lista

  await createTables();

  app.listen(5001, () => console.log(`server on PORT 5001`));
}

async function createTables() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id_rol INT AUTO_INCREMENT PRIMARY KEY,
      nombre_rol VARCHAR(50) UNIQUE NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario INT AUTO_INCREMENT PRIMARY KEY,
      nombre_usuario VARCHAR(100),
      correo_usuario VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      id_rol INT DEFAULT 2,
      FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cursos (
      id_curso INT AUTO_INCREMENT PRIMARY KEY,
      nombre_curso VARCHAR(100) NOT NULL,
      descripcion TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS matriculas (
      id_matricula INT AUTO_INCREMENT PRIMARY KEY,
      id_usuario INT,
      id_curso INT,
      fecha_matricula DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
      FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
    )
  `);
}

main().catch(err => {
  console.error("Error creando tablas:", err);
});
