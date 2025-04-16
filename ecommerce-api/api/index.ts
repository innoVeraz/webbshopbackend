import dotenv from "dotenv";
import express from "express";
import { connectDB } from "../src/config/db"; // ändra vägen!
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();
const app = express();

// Webhook behöver ligga först
app.use('/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));

// Importera routes från src
import productRouter from "../src/routes/products";
import customerRouter from "../src/routes/customers";
import orderRouter from "../src/routes/orders";
import orderItemRouter from "../src/routes/orderItems";
import authRouter from "../src/routes/auth";
import stripeRouter from "../src/routes/stripe";

app.use('/products', productRouter);
app.use('/customers', customerRouter);
app.use('/orders', orderRouter);
app.use('/order-items', orderItemRouter);
app.use('/auth', authRouter);
app.use('/stripe', stripeRouter);

connectDB();

// 🟡 Ingen vanlig `app.listen()` på Vercel!

// ✅ Export för Vercel serverless function
export default app;
