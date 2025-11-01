import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Usuario from "../models/usuario";

interface IUser {
  _id: string;
  nombre: string;
  correo: string;
  contraseña: string;
  telefono?: string;
  direccion?: string;
}

export async function findAll(req: Request, res: Response): Promise<void> {
  try {
    const result = await Usuario.find().select("-contraseña");
    res.status(200).json({ state: true, data: result });
  } catch (error: any) {
    res.status(500).json({ state: false, error: error.message });
  }
}

export async function findById(req: Request, res: Response): Promise<void> {
  const { id, correo } = req.params;
  try {
    let result: IUser | null = null;
    if (correo) result = await Usuario.findOne({ correo }).select("-contraseña");
    else if (id) result = await Usuario.findById(id).select("-contraseña");
    if (!result) {
      res.status(404).json({ state: false, error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({ state: true, data: result });
  } catch (error: any) {
    res.status(500).json({ state: false, error: error.message });
  }
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const usuario = await Usuario.findById((req as any).user._id).select("-contraseña");
    if (!usuario) {
      res.status(404).json({ state: false, error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({ state: true, usuario });
  } catch (error: any) {
    res.status(500).json({ state: false, error: error.message });
  }
}

export async function save(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, correo, contraseña, telefono, direccion } = req.body;
    if (!nombre || !correo || !contraseña) {
      res.status(400).json({ state: false, error: "Nombre, correo y contraseña son obligatorios" });
      return;
    }

    const existe = await Usuario.findOne({ correo });
    if (existe) {
      res.status(400).json({ state: false, error: "El correo ya está registrado" });
      return;
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new Usuario({ nombre, correo, contraseña: hash, telefono, direccion });
    const result = await nuevoUsuario.save();
    res.status(201).json({ state: true, data: result });
  } catch (error: any) {
    res.status(500).json({ state: false, error: error.message });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const updateData = { ...req.body };
    if (updateData.contraseña) updateData.contraseña = await bcrypt.hash(updateData.contraseña, 10);
    const result = await Usuario.findByIdAndUpdate(id, updateData, { new: true }).select("-contraseña");
    if (!result) {
      res.status(404).json({ state: false, error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({ state: true, data: result });
  } catch (error: any) {
    res.status(500).json({ state: false, error: error.message });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const updateData = { ...req.body };
    if (updateData.contraseña) updateData.contraseña = await bcrypt.hash(updateData.contraseña, 10);
    const result = await Usuario.findByIdAndUpdate((req as any).user._id, updateData, { new: true }).select("-contraseña");
    if (!result) {
      res.status(404).json({ state: false, error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({ state: true, usuario: result });
  } catch (error: any) {
    res.status(500).json({ state: false, error: error.message });
  }
}

export async function deleteById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const result = await Usuario.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({ state: false, error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({ state: true, data: result });
  } catch (error: any) {
    res.status(500).json({ state: false, error: error.message });
  }
}
