import express, { Router } from "express";
import { findAll, findById, save, update, deleteById } from "../controllers/controlles-productos";
import { authMiddleware } from "../middlewares/auth";

const router: Router = express.Router();

router.get("/", findAll);
router.get("/:id", findById);
router.post("/", authMiddleware, save);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, deleteById);

export default router;
