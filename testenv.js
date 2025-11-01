import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log("JWT_SECRET:", process.env.JWT_SECRET);