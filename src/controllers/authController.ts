import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario";

interface IUsuario {
  _id: string;
  nombre: string;
  correo: string;
  contraseña: string;
}

export async function login(req: Request, res: Response): Promise<void> {
  const { correo, contraseña }: { correo: string; contraseña: string } = req.body;

  try {
    const usuario: IUsuario | null = await Usuario.findOne({ correo });
    if (!usuario) {
      res.status(401).json({ state: false, error: "Usuario no encontrado" });
      return;
    }

    const isMatch: boolean = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isMatch) {
      res.status(401).json({ state: false, error: "Contraseña incorrecta" });
      return;
    }

    const payload = { id: usuario._id, correo: usuario.correo };
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET no está definido");

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    res.status(200).json({
      state: true,
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    });
  } catch (error: any) {
    res.status(500).json({ state: false, error: error.message });
  }
}
