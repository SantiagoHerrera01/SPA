import mysql from "mysql2/promise";

let pool;

export const connectDB = async () => {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "$ANtiagoC0106*",
      database: process.env.DB_NAME || "spa", 
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log("Conectado a MySQL");
    return pool;
  } catch (error) {
    console.error("Error al conectar a MySQL:", error.message);
    process.exit(1);
  }
};

export const getPool = () => pool;