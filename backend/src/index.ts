import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path"; 

import { connectDatabase } from "./database/mongodb";
import { PORT } from "./config";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes"; // ✅ Import admin routes

dotenv.config();

const app: Application = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // ✅ Register admin routes

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