"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("../src/config/db"); // ändra vägen!
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Webhook behöver ligga först
app.use('/stripe/webhook', express_1.default.raw({ type: 'application/json' }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
// Importera routes från src
const products_1 = __importDefault(require("../src/routes/products"));
const customers_1 = __importDefault(require("../src/routes/customers"));
const orders_1 = __importDefault(require("../src/routes/orders"));
const orderItems_1 = __importDefault(require("../src/routes/orderItems"));
const auth_1 = __importDefault(require("../src/routes/auth"));
const stripe_1 = __importDefault(require("../src/routes/stripe"));
app.use('/products', products_1.default);
app.use('/customers', customers_1.default);
app.use('/orders', orders_1.default);
app.use('/order-items', orderItems_1.default);
app.use('/auth', auth_1.default);
app.use('/stripe', stripe_1.default);
(0, db_1.connectDB)();
// VIKTIGT: Korrekt metod för Vercel-deployment
// Detta exporterar hela Express-app instansen direkt
module.exports = app;
//# sourceMappingURL=index.js.map