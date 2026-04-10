const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const leadRoutes = require("./routes/lead.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const apiRoutes = require("./routes/api.routes.js");
const { notFound, errorHandler } = require("./middleware/errorHandler.js");

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — allow React dev server + production origin ────────────────────────

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ single allowed origin
    credentials: true,
  })
);


// ── HTTP request logging ──────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/lead", leadRoutes);
app.use("/api/user", authRoutes);
app.use("/api/lead", adminRoutes);
app.use("/api", apiRoutes);

// ── Error handling (must be last) ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
