import { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from "../config/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { orderId, items } = req.body;
    
    console.log('Creating checkout session for order:', orderId, 'with items:', items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item: any) => ({
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
    await db.query(updateOrderSql, [session.id, orderId]);

    res.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret || ''
    );

    console.log('Webhook event received:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      console.log('Processing completed checkout for order:', orderId);

      if (orderId) {
        const updateOrderSql = `
          UPDATE orders 
          SET payment_status = ?, order_status = ?
          WHERE id = ?
        `;
        await db.query(updateOrderSql, ['paid', 'received', orderId]);

        const getOrderItemsSql = `
          SELECT product_id, quantity 
          FROM order_items 
          WHERE order_id = ?
        `;
        const [orderItems] = await db.query(getOrderItemsSql, [orderId]);

        for (const item of orderItems) {
          const updateStockSql = `
            UPDATE products 
            SET stock_quantity = stock_quantity - ? 
            WHERE id = ? AND stock_quantity >= ?
          `;
          await db.query(updateStockSql, [
            item.quantity,
            item.product_id,
            item.quantity
          ]);
        }

        console.log('Order and inventory updated successfully:', orderId);
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};