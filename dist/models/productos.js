import mongoose, { Schema } from "mongoose";
const ProductoSchema = new Schema({
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, default: "" },
    fechaPublicacion: { type: Date, default: Date.now },
    numeroLikes: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
    usuarioId: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
}, { timestamps: true });
const Producto = mongoose.models.Producto || mongoose.model("Producto", ProductoSchema);
export default Producto;
