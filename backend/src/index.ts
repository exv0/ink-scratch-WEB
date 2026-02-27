import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path"; 
import libraryRoutes from "./routes/library.routes";


import { connectDatabase } from "./database/mongodb";
import { PORT } from "./config";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import mangaRoutes from "./routes/manga.routes";
import { runMangaImportJob } from "./jobs/manga.importer";

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
app.use("/api/library", libraryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manga", mangaRoutes);

async function startServer() {
  try {
    await connectDatabase(); 
    console.log("Mongoose readyState:", mongoose.connection.readyState);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    // Run once on startup, then every 24 hours
    console.log("[Importer] Scheduling manga import job...");
    runMangaImportJob().catch(console.error);
    setInterval(() => runMangaImportJob().catch(console.error), 24 * 60 * 60 * 1000);

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();