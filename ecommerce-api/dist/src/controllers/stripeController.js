"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const db_1 = require("../config/db");
// Uppdaterar till en giltig Stripe API-version
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2022-11-15'
});
const createCheckoutSession = async (req, res) => {
    try {
        const { orderId, items } = req.body;
        console.log('Creating checkout session for order:', orderId, 'with items:', items);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: items.map((item) => ({
                price_data: {
                    currency: item.currency || 'sek',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.unit_amount,
                },
                quantity: item.quantity,
            })),
            success_url: req.body.success_url,
            cancel_url: req.body.cancel_url,
            metadata: {
                orderId: orderId.toString(),
            },
        });
        const updateOrderSql = `
      UPDATE orders 
      SET payment_id = ?
      WHERE id = ?
    `;
        await db_1.db.query(updateOrderSql, [session.id, orderId]);
        res.json({ url: session.url, sessionId: session.id });
    }
    catch (error) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.createCheckoutSession = createCheckoutSession;
const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret || '');
        console.log('Webhook event received:', event.type);
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;
            console.log('Processing completed checkout for order:', orderId);
            if (orderId) {
                const updateOrderSql = `
          UPDATE orders 
          SET payment_status = ?, order_status = ?
          WHERE id = ?
        `;
                await db_1.db.query(updateOrderSql, ['paid', 'received', orderId]);
                const getOrderItemsSql = `
          SELECT product_id, quantity 
          FROM order_items 
          WHERE order_id = ?
        `;
                // Använd RowDataPacket[] istället för egen interface
                const [orderItemsResult] = await db_1.db.query(getOrderItemsSql, [orderId]);
                // Behandla orderItemsResult som vanlig array
                const orderItems = orderItemsResult;
                for (const item of orderItems) {
                    const updateStockSql = `
            UPDATE products 
            SET stock_quantity = stock_quantity - ? 
            WHERE id = ? AND stock_quantity >= ?
          `;
                    await db_1.db.query(updateStockSql, [
                        item.quantity,
                        item.product_id,
                        item.quantity
                    ]);
                }
                console.log('Order and inventory updated successfully:', orderId);
            }
        }
        res.json({ received: true });
    }
    catch (err) {
        console.error('Webhook error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};
exports.handleWebhook = handleWebhook;
//# sourceMappingURL=stripeController.js.map