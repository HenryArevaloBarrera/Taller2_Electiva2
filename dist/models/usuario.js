import mongoose, { Schema } from "mongoose";
const UsuarioSchema = new Schema({
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, default: "" },
}, { timestamps: true });
const Usuario = mongoose.models.Usuario || mongoose.model("Usuario", UsuarioSchema);
export default Usuario;
