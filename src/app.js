import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js'

const app = express();

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser())

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes)

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

export default app;
