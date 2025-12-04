import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authroutes.js";
import bookRoutes from "./routes/bookroutes.js";
import commentRoutes from "./routes/commentroutes.js";
import recommendRoutes from "./routes/recommendroutes.js";

dotenv.config();
const app = express();

// --- MIDDLEWARE FIRST ---
app.use(
  cors({
    origin: ["http://localhost:5173", "https://novely-2.vercel.app"],
    credentials: true,
  })
);

app.use(express.json()); // must be before routes

// --- ROUTES REGISTER ---
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/recommend", recommendRoutes);

const PORT = process.env.PORT ||5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
