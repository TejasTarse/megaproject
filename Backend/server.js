import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import postRoutes from "./routes/postRoutes.js";   // ⭐ MUST BE HERE

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",               // local frontend
      "http://localhost:5174",               // local admin
      "https://megaproject-8tdb.vercel.app",  // deployed frontend
      "https://YOUR-ADMIN.vercel.app"        // deployed admin (if any)
    ],
    credentials: true,
  })
);
app.use(express.json());

// ⭐ ROUTES MUST BE BELOW middleware
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/posts", postRoutes);  // ⭐ MUST BE HERE

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
