import dotenv from "dotenv";
import express from "express";
import { connectDB } from "../src/config/db"; 
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

// Lägg till en enkel testroute direkt i index.ts för felsökning
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'API är online!', env: process.env.NODE_ENV });
});

app.use('/products', productRouter);
app.use('/customers', customerRouter);
app.use('/orders', orderRouter);
app.use('/order-items', orderItemRouter);
app.use('/auth', authRouter);
app.use('/stripe', stripeRouter);

connectDB();

// Gör appen tillgänglig både för lokalt bruk och för Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}`);
  });
}

// Exportmetod 1 - CommonJS
module.exports = app;

// Exportmetod 2 - För TypeScript/ES modules
export default app;
