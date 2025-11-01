import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProducto extends Document {
  titulo: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagen?: string;
  fechaPublicacion?: Date;
  numeroLikes?: number;
  activo?: boolean;
  usuarioId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductoSchema: Schema<IProducto> = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, default: "" },
    fechaPublicacion: { type: Date, default: Date.now },
    numeroLikes: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
    usuarioId: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  },
  { timestamps: true }
);

const Producto: Model<IProducto> =
  mongoose.models.Producto || mongoose.model<IProducto>("Producto", ProductoSchema);

export default Producto;
