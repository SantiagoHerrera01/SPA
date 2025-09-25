import bcrypt from "bcryptjs";
import { createTokenAcess } from "../libs/jwt.js";
import { getPool } from "../db.js";

// 📝 REGISTRO
export const register = async (req, res) => {
  const { nombre_usuario, correo_usuario, password } = req.body;

  try {
    // Verificar si el correo ya existe
    const [existingUser] = await getPool().query(
      "SELECT * FROM usuarios WHERE correo_usuario = ?",
      [correo_usuario]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar sin especificar id_rol (la BD lo pone automáticamente en 2)
    const [result] = await getPool().query(
      `INSERT INTO usuarios (nombre_usuario, correo_usuario, password) 
       VALUES (?, ?, ?)`,
      [nombre_usuario, correo_usuario, passwordHash]
    );

    const userId = result.insertId;

    // ✅ Consultar el usuario recién creado para obtener su rol real desde la BD
    const [newUserRows] = await getPool().query(
      "SELECT id_usuario, nombre_usuario, correo_usuario, id_rol FROM usuarios WHERE id_usuario = ?",
      [userId]
    );

    const newUser = newUserRows[0];

    // Crear token con rol real desde BD
    const token = await createTokenAcess({
      id_usuario: newUser.id_usuario,
      id_rol: newUser.id_rol,
      nombre_usuario: newUser.nombre_usuario,
    });

    // Guardar token en cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("❌ Error en register:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔐 LOGIN
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

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // ✅ Crear token con rol desde BD
    const token = await createTokenAcess({
      id_usuario: user.id_usuario,
      id_rol: user.id_rol,
      nombre_usuario: user.nombre_usuario,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    });

    res.json({
      id_usuario: user.id_usuario,
      nombre_usuario: user.nombre_usuario,
      correo_usuario: user.correo_usuario,
      id_rol: user.id_rol,
    });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ message: error.message });
  }
};

// 👤 OBTENER USUARIO LOGUEADO
export const user = async (req, res) => {
  try {
    const [rows] = await getPool().query(
      "SELECT id_usuario, nombre_usuario, correo_usuario, id_rol FROM usuarios WHERE id_usuario = ?",
      [req.user.id_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error en obtener usuario:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🚪 LOGOUT
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Sesión cerrada con éxito" });
};
