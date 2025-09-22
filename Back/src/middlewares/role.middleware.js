export function authorizeRoles(...rolesPermitidos) {
  return (req, res, next) => {
    const { id_rol } = req.user; // req.user debe tener el rol (agregado al verificar el token)
    if (!rolesPermitidos.includes(id_rol)) {
      return res.status(403).json({ message: "No tienes permisos para esta acción" });
    }
    next();
  };
}