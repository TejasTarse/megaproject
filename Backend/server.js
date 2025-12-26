import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

/* ===============================
   CORS CONFIG (IMPORTANT)
================================ */
app.use(
  cors({
    origin: [
      "http://localhost:5173",          // local frontend
      "http://localhost:5174",          // local admin (if any)
      "https://megaproject-ys5e.vercel.app", // frontend (change if new)
      "https://megaproject-8tdb.vercel.app", // optional
    ],
    credentials: true, // ⭐ MUST be true for cookies
  })
);

/* ===============================
   MIDDLEWARES
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/posts", postRoutes);

/* ===============================
   TEST ROUTE
================================ */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ===============================
   DATABASE
================================ */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

/* ===============================
   SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
