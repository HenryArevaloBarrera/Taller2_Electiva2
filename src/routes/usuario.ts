import express, { Request, Response, Router } from "express";
import { findAll, findById, save, update, deleteById } from "../controllers/controlles-usuario";
import { authMiddleware } from "../middlewares/auth";
import Usuario from "../models/usuario";
import Producto from "../models/productos";

const router: Router = express.Router();

router.get("/", authMiddleware, findAll);

router.get("/me", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = (req as any).user;
    const productos = await Producto.find({ usuarioId: usuario._id });
    res.status(200).json({ state: true, usuario, productos });
  } catch (err: any) {
    res.status(500).json({ state: false, error: err.message });
  }
});

router.put("/me", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (req as any).user._id;
    const updates = req.body;
    const result = await Usuario.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ state: true, usuario: result });
  } catch (err: any) {
    res.status(500).json({ state: false, error: err.message });
  }
});

router.get("/:id", authMiddleware, findById);
router.post("/", save);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, deleteById);

export default router;
