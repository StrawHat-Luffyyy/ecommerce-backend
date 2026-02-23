import stripe from "../config/stripe.js";
import prisma from "../config/db.js";
import { emailQueue } from "../queues/emailQueue.js";

// @desc    Handle Stripe Webhooks
// @route   POST /api/webhooks/stripe
// @access  Public (But secured by Stripe Signature)
export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  //console.log(webhookSecret);

  let event;
  try {
    //Verify the request came from Stripe
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  //handle the specific event we care about
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.error(
        "No orderId found in payment intent metadata:",
        paymentIntent.metadata,
      );
      return res.status(400).json({
        error: "Missing orderId in payment intent metadata",
      });
    }

    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
        include: { user: true }, // Include user to get email for notification
      });
      console.log(`Order ${orderId} successfully marked as PAID!`);
      emailQueue.add(
        {
          userEmail: updatedOrder.user.email,
          orderId: updatedOrder.id,
          totalAmount: updatedOrder.totalAmount,
        },
        {
          attempts: 3,
          backoff: 5000,
        },
      );
      console.log(
        `Email job added to the queue for ${updatedOrder.user.email}`,
      );
    } catch (error) {
      console.error(`Failed to update order ${orderId} in database:`, error);
      return res.status(500).json({
        error: "Failed to update order status",
      });
    }
  }
  res.status(200).json({ received: true });
};
