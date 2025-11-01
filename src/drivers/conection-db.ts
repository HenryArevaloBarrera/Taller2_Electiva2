import mongoose from "mongoose";

let dbStatus = "❌ Desconectado";

export async function connectDB(): Promise<void> {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("La variable MONGO_URI no está definida");
    await mongoose.connect(uri);
    dbStatus = "✅ Conectado a Mongo Atlas";
    console.log(dbStatus);
  } catch (error: any) {
    dbStatus = "❌ Error al conectar: " + error.message;
    console.error(dbStatus);
  }
}

connectDB();

export function getDbStatus(): string {
  return dbStatus;
}
