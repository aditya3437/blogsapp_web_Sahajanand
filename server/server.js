require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");

const app = express();
const defaultOrigins = "http://localhost:5173,https://blogsapp-web-sahajanand.vercel.app";
const configuredOrigins = (process.env.CLIENT_ORIGIN || defaultOrigins)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    const localDevelopmentOrigin =
      process.env.NODE_ENV !== "production" &&
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
    if (!origin || configuredOrigins.includes(origin) || localDevelopmentOrigin) {
      return callback(null, true);
    }
    const error = new Error("Origin is not allowed by CORS");
    error.status = 403;
    return callback(error);
  },
}));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with that email already exists" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource ID" });
  }

  console.error("Request failed:", error);
  return res.status(error.status || 500).json({
    message: error.status ? error.message : "Internal server error",
  });
});

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured before starting the server");
  }

  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
