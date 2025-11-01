import express from "express";
import { findAll, findById, save, update, deleteById } from "../controllers/controlles-usuario.js";
import { authMiddleware } from "../middlewares/auth.js";
import Usuario from "../models/usuario.js";
import Producto from "../models/productos.js";
const router = express.Router();
router.get("/", authMiddleware, findAll);
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const usuario = req.user;
        const productos = await Producto.find({ usuarioId: usuario._id });
        res.status(200).json({ state: true, usuario, productos });
    }
    catch (err) {
        res.status(500).json({ state: false, error: err.message });
    }
});
router.put("/me", authMiddleware, async (req, res) => {
    try {
        const id = req.user._id;
        const updates = req.body;
        const result = await Usuario.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json({ state: true, usuario: result });
    }
    catch (err) {
        res.status(500).json({ state: false, error: err.message });
    }
});
router.get("/:id", authMiddleware, findById);
router.post("/", save);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, deleteById);
export default router;
