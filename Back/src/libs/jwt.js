// src/libs/jwt.js
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export function createTokenAcess(payload) {
  return new Promise((resolve, reject) => {

    jwt.sign(
      payload,
      TOKEN_SECRET,
      { expiresIn: "10y" },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
}
