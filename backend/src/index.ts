import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDatabase } from "./database/mongodb";
import { PORT } from "./config";

import authRoutes from "./routes/auth.routes";

dotenv.config();

const app: Application = express();

// ✅ ADD CORS FIRST (before other middleware)
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

// ✅ IMPORTANT: Your routes are under /api/auth
// So the endpoints are: /api/auth/register and /api/auth/login
app.use("/api/auth", authRoutes);

async function startServer() {
  try {
    await connectDatabase(); 
    console.log("Mongoose readyState:", mongoose.connection.readyState);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();