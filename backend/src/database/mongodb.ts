import mongoose from "mongoose";
import dns from "dns";
import { MONGODB_URI } from "../config";

async function resolveMongoSRV(uri: string): Promise<string> {
  // Only process mongodb+srv:// URIs
  if (!uri.startsWith("mongodb+srv://")) return uri;

  const url = new URL(uri);
  const hostname = url.hostname;

  // Use Google DNS to resolve SRV records (bypasses ISP blocking)
  const resolver = new dns.promises.Resolver();
  resolver.setServers(["8.8.8.8", "8.8.4.4"]);

  const records = await resolver.resolveSrv(`_mongodb._tcp.${hostname}`);
  if (!records.length) throw new Error("No SRV records found");

  // Build direct mongodb:// connection string from resolved hosts
  const hosts = records.map(r => `${r.name}:${r.port}`).join(",");
  const auth = url.username ? `${url.username}:${url.password}@` : "";
  const dbPath = url.pathname || "/";
  const params = url.search ? url.search + "&ssl=true&authSource=admin" : "?ssl=true&authSource=admin";

  return `mongodb://${auth}${hosts}${dbPath}${params}`;
}

export async function connectDatabase() {
  try {
    let uri = MONGODB_URI;

    if (MONGODB_URI.startsWith("mongodb+srv://")) {
      try {
        uri = await resolveMongoSRV(MONGODB_URI);
        console.log("Resolved SRV to direct connection");
      } catch {
        console.log("SRV resolution failed, trying original URI...");
      }
    }

    await mongoose.connect(uri, { family: 4 });
    console.log("Connect to MongoDB");
  } catch (error) {
    console.log("Database Error: ", error);
    process.exit(1);
  }
}