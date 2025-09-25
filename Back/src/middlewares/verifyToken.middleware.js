import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const verifyToken = (req, res, next) => {
  const { token } = req.cookies;
  console.log("🔑 Token recibido:", token);

  if (!token) {
    return res.status(401).json({ message: "No autorizado, token faltante" });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("❌ Token inválido o expirado:", err.message);
      return res.status(403).json({ message: "Token inválido o expirado" });
    }

    console.log("✅ Token decodificado:", user);
    req.user = user;
    next();
  });
};
