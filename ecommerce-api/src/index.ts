import dotenv from "dotenv";
import express from "express";
import {connectDB} from "./config/db";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config();
const app = express();

app.use('/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "*", // Tillåt alla origins när den hostas på Vercel
  credentials: true,  // ✅ Allows cookies
}));

app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "../public")));

import productRouter from "./routes/products";
import customerRouter from "./routes/customers";
import orderRouter from "./routes/orders";
import orderItemRouter from "./routes/orderItems";
import authRouter from "./routes/auth";
import stripeRouter from "./routes/stripe";

app.use('/products', productRouter)
app.use('/customers', customerRouter)
app.use('/orders', orderRouter)
app.use('/order-items', orderItemRouter)
app.use('/auth', authRouter)
app.use('/stripe', stripeRouter)

connectDB();

// Start Express server lokalt när det inte är på Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}`);
  });
}

// Exportera för Vercel serverless function
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
