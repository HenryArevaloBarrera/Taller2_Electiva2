import Producto from "../models/productos.js";
export async function findAll(req, res) {
    try {
        const productos = await Producto.find().populate("usuarioId", "nombre correo telefono");
        res.status(200).json({ state: true, productos, total: productos.length });
    }
    catch (error) {
        res.status(500).json({ state: false, error: error.message });
    }
}
export async function findById(req, res) {
    const { id } = req.params;
    try {
        const producto = await Producto.findById(id).populate("usuarioId", "nombre correo telefono");
        if (!producto) {
            res.status(404).json({ state: false, error: "No se encontró el producto" });
            return;
        }
        res.status(200).json({ state: true, producto });
    }
    catch (error) {
        res.status(500).json({ state: false, error: error.message });
    }
}
export async function save(req, res) {
    try {
        const nuevoProducto = new Producto({
            ...req.body,
            usuarioId: req.user._id,
        });
        const result = await nuevoProducto.save();
        res.status(201).json({ state: true, producto: result });
    }
    catch (error) {
        res.status(500).json({ state: false, error: error.message });
    }
}
export async function update(req, res) {
    const { id } = req.params;
    try {
        const result = await Producto.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            res.status(404).json({ state: false, error: "No se encontró el producto" });
            return;
        }
        res.status(200).json({ state: true, producto: result });
    }
    catch (error) {
        res.status(500).json({ state: false, error: error.message });
    }
}
export async function deleteById(req, res) {
    const { id } = req.params;
    try {
        const result = await Producto.findByIdAndDelete(id);
        if (!result) {
            res.status(404).json({ state: false, error: "No se encontró el producto" });
            return;
        }
        res.status(200).json({ state: true, producto: result });
    }
    catch (error) {
        res.status(500).json({ state: false, error: error.message });
    }
}
