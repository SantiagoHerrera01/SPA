// src/middlewares/verifyToken.js
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const verifyToken = (req, res, next) => {
  const { token } = req.cookies; // el token está en cookie

  if (!token) {
    return res.status(401).json({ message: "No autorizado, token faltante" });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }

    req.user = user; // { id_usuario, id_rol, nombre_usuario, ... }
    next();
  });
};
