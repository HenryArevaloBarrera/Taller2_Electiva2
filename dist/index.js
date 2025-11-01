// ✅ Cargar variables de entorno
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// ✅ Compatibilidad con __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Cargar el archivo .env desde la raíz del proyecto
dotenv.config({ path: path.join(__dirname, "../.env") });

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import serverless from "serverless-http";
import routsAuth from "./routes/auth.js";
import routsUsuarios from "./routes/usuario.js";
import routsProductos from "./routes/producto.js";
import { getDbStatus } from "./drivers/conection-db.js";

// ✅ Conexión a MongoDB
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("❌ Error: MONGO_URI no está definido en .env");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// Evitar caché
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Configuración de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rutas de renderizado
app.get("/", (req, res) => {
  res.render("index", { title: "Inicio", dbStatus: getDbStatus() });
});
app.get("/productos", (req, res) => res.render("productos", { title: "Productos" }));
app.get("/register", (req, res) => res.render("register", { title: "Registro" }));
app.get("/login", (req, res) => res.render("login", { title: "Iniciar Sesión" }));
app.get("/perfil", (req, res) => res.render("perfil", { title: "Mi Perfil" }));
app.get("/producto/:id", (req, res) => res.render("producto", { id: req.params.id }));

// Rutas API
app.use("/api/auth", routsAuth);
app.use("/api/usuarios", routsUsuarios);
app.use("/api/productos", routsProductos);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📖 Documentación Swagger en http://localhost:${PORT}/api-docs`);
});

export const handler = serverless(app);
