import express from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/stripeController';

const router = express.Router();

router.post('/create-checkout', createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;