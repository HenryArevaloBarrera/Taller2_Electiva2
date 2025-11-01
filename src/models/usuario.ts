import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUsuario extends Document {
  nombre: string;
  correo: string;
  contraseña: string;
  telefono: string;
  direccion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UsuarioSchema: Schema<IUsuario> = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, default: "" },
  },
  { timestamps: true }
);

const Usuario: Model<IUsuario> =
  mongoose.models.Usuario || mongoose.model<IUsuario>("Usuario", UsuarioSchema);

export default Usuario;
