import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import noteRoutes from "./routes/note.routes.js";
import taskRoutes from "./routes/task.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

/* ------------------------- Middleware ------------------------- */

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* ------------------------- Routes ------------------------- */

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    service: "CRM",
  });
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Lead Routes
app.use("/api/leads", leadRoutes);

// Contact Routes
app.use("/api/contacts", contactRoutes);

// Note Routes
app.use("/api/notes", noteRoutes);

// Task Routes
app.use("/api/tasks", taskRoutes);

// AI Routes
app.use("/api/ai", aiRoutes);

// Analytics Routes
app.use("/api/analytics", analyticsRoutes);

/* ------------------------- Error Handling ------------------------- */

app.use(notFound);
app.use(errorHandler);

/* ------------------------- Boot ------------------------- */

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

start();

export default app;