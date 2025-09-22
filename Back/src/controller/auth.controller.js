import bcrypt from "bcryptjs";
import { createTokenAcess } from "../libs/jwt.js";
import { getPool } from "../db.js"; // tu conexión MySQL

// REGISTRO
export const register = async (req, res) => {
  const { nombre_usuario, correo_usuario, password } = req.body;

  try {
    // Validar si ya existe un usuario con el mismo correo
    const [existingUser] = await getPool().query(
      "SELECT * FROM usuarios WHERE correo_usuario = ?",
      [correo_usuario]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await getPool().query(
      `INSERT INTO usuarios (nombre_usuario, correo_usuario, password) 
       VALUES (?, ?, ?)`,
      [nombre_usuario, correo_usuario, passwordHash]
    );

    const userId = result.insertId;

    // Crear token de larga duración
    const token = await createTokenAcess({ id: userId });

    // Guardar token en cookie “infinita” (10 años)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 años
    });

    // Respuesta
    res.status(201).json({
      id_usuario: userId,
      nombre_usuario,
      correo_usuario,
    });
  } catch (error) {
    console.error("❌ Error en register:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { correo_usuario, password } = req.body;

  try {
    const [rows] = await getPool().query(
      "SELECT * FROM usuarios WHERE correo_usuario = ?",
      [correo_usuario]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // ✅ Incluir id_rol en el token
    const token = await createTokenAcess({
      id_usuario: user.id_usuario,
      id_rol: user.id_rol,
      nombre_usuario: user.nombre_usuario
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 años
    });

    res.json({
      id_usuario: user.id_usuario,
      nombre_usuario: user.nombre_usuario,
      correo_usuario: user.correo_usuario,
      id_rol: user.id_rol
    });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ message: error.message });
  }
};

// OBTENER USUARIO LOGUEADO
export const user = async (req, res) => {
  try {
    const [rows] = await getPool().query(
      "SELECT id_usuario, nombre_usuario, correo_usuario, id_rol FROM usuarios WHERE id_usuario = ?",
      [req.user.id] // req.user viene del middleware verifyToken
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error en profile:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.json({ message: "Sesión cerrada correctamente" });
};
