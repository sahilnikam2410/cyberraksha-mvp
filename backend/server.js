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

/* ===========================
   Security & Middleware
=========================== */

app.use(helmet());

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===========================
   ✅ PRODUCTION CORS FIX
=========================== */

const allowedOrigins = [
  "http://localhost:3000",
  "https://cyberraksha-q4pswdv3b-sahil-anil-nikams-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser requests (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

/* ===========================
   Logging & Rate Limit
=========================== */

app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

/* ===========================
   Uploads Folder Setup
=========================== */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use("/uploads", express.static(uploadsPath));

/* ===========================
   Routes
=========================== */

app.get("/", (req, res) => {
  res.json({ ok: true, app: "CyberRaksha API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/portal", portalRoutes);
app.use("/api/bot", botRoutes);

/* ===========================
   404 Handler
=========================== */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ===========================
   Start Server
=========================== */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
