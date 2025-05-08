import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { paystackWebhook } from '../controllers/paystack.contoller.js';

const router = express.Router();

router.post("/paystackWebhook", protectRoute,express.raw({ type: 'application/json' }), paystackWebhook)

export default router;