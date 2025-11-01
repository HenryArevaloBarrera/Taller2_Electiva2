import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.js";
export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            res.status(401).json({ state: false, error: "Token no proporcionado" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ state: false, error: "Token inválido" });
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("JWT_SECRET no está definido");
        const decoded = jwt.verify(token, secret);
        const usuario = await Usuario.findOne({ correo: decoded.correo });
        if (!usuario) {
            res.status(404).json({ state: false, error: "Usuario no encontrado" });
            return;
        }
        req.user = usuario;
        next();
    }
    catch (err) {
        res.status(401).json({ state: false, error: "Token inválido o expirado" });
    }
};
