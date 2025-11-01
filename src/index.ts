import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import path from "path";

import cors from "cors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import serverless from "serverless-http";

import routsAuth from "./routes/auth";
import routsUsuarios from "./routes/usuario";
import routsProductos from "./routes/producto";
import { getDbStatus } from "./drivers/conection-db";

// Conexión a MongoDB
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

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rutas de renderizado
app.get("/", (req: Request, res: Response) => {
  res.render("index", { title: "Inicio", dbStatus: getDbStatus() });
});

app.get("/productos", (req: Request, res: Response) => {
  res.render("productos", { title: "Productos" });
});

app.get("/register", (req: Request, res: Response) => {
  res.render("register", { title: "Registro" });
});

app.get("/login", (req: Request, res: Response) => {
  res.render("login", { title: "Iniciar Sesión" });
});

app.get("/perfil", (req: Request, res: Response) => {
  res.render("perfil", { title: "Mi Perfil" });
});

app.get("/producto/:id", (req: Request, res: Response) => {
  res.render("producto", { id: req.params.id });
});

// Rutas API
app.use("/api/auth", routsAuth);
app.use("/api/usuarios", routsUsuarios);
app.use("/api/productos", routsProductos);

// Swagger

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📖 Documentación Swagger en http://localhost:${PORT}/api-docs`);
});

export const handler = serverless(app);
