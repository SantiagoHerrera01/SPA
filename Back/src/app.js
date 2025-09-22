import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api", authRoutes);
app.use("/api", courseRoutes);

export default app;
