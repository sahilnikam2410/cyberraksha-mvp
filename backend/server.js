import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { connectDB } from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import caseRoutes from "./src/routes/case.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import portalRoutes from "./src/routes/portal.routes.js";
import botRoutes from "./src/routes/bot.routes.js";

dotenv.config();
await connectDB();

const app = express();

/* -------------------- SECURITY -------------------- */
app.use(helmet());

/* -------------------- CORS FIX (FINAL) -------------------- */
app.use(
  cors({
    origin: "*", // allow all origins (fixes Vercel dynamic URLs)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handle preflight explicitly
app.options("*", cors());

/* -------------------- BODY PARSER -------------------- */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* -------------------- LOGGING -------------------- */
app.use(morgan("dev"));

/* -------------------- RATE LIMIT -------------------- */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
});
app.use(limiter);

/* -------------------- FILE PATH -------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------- UPLOADS -------------------- */
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use("/uploads", express.static(uploadsPath));

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) =>
  res.json({ ok: true, app: "CyberRaksha API" })
);

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/portal", portalRoutes);
app.use("/api/bot", botRoutes);

/* -------------------- 404 -------------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`✅ Backend running on port ${PORT}`)
);
