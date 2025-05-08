import crypto from 'crypto';
import dotenv from 'dotenv';
import Order from '../models/order.model.js';

dotenv.config();

export const paystackWebhook = async (req, res) => {
  try {
    const paystackSignature = req.headers['x-paystack-signature'];
    const eventBody = JSON.stringify(req.body); // Corrected

    // Generate hash using the secret key to validate the webhook
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(eventBody)
      .digest('hex');

    if (hash !== paystackSignature) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Check if the event is a charge success event
    const event = req.body;
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const email = event.data.email;
      const amount = event.data.amount / 100; // Convert to Naira

      const order = await Order.findOne({ paymentReference: reference });
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Update the order status to paid
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        status: event.data.status,
        email: email,
        amount: amount,
        transactionId: event.data.id, // Correct Paystack transaction ID
      };
      order.transactionDate = new Date(event.data.createdAt);
      order.orderStatus = 'processing'; // Set the order status to processing or any other status you prefer
      await order.save();

      console.log(`Order ${order._id} has been paid`);
    } else {
      console.log(`❗ Order not found for payment reference: ${reference}`);
    }

    // Optionally send an email to the user using Nodemailer or any other email service
    return res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};