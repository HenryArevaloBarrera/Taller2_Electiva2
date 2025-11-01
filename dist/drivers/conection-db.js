import mongoose from "mongoose";
let dbStatus = "❌ Desconectado";
export async function connectDB() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri)
            throw new Error("La variable MONGO_URI no está definida");
        await mongoose.connect(uri);
        dbStatus = "✅ Conectado a Mongo Atlas";
        console.log(dbStatus);
    }
    catch (error) {
        dbStatus = "❌ Error al conectar: " + error.message;
        console.error(dbStatus);
    }
}
connectDB();
export function getDbStatus() {
    return dbStatus;
}
