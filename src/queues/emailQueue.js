import Queue from "bull";
import { transporter } from "../config/mailer.js";
import nodemailer from "nodemailer";

export const emailQueue = new Queue("email-queue", {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
});

//Define the Worker
emailQueue.process(async (job) => {
  const { userEmail, orderId, totalAmount } = job.data;
  console.log(`Worker processing email for Order ${orderId}...`);
  try {
    const info = await transporter.sendMail({
      from: "E-Commerce Store <no-reply@store.com>",
      to: userEmail,
      subject: `Order Confirmation - #${orderId}`,
      html: `<h2>Thank you for your purchase!</h2>
        <p>Your order <strong>#${orderId}</strong> has been successfully processed.</p>
        <p>Total Paid: <strong>$${totalAmount}</strong></p>
        <p>We will notify you when it ships.</p>`,
    });
    console.log(
      `Email sent! Preview URL: ${nodemailer.getTestMessageUrl(info)}`,
    );
  } catch (error) {
    console.error(`Failed to send email for ${orderId}:`, error);
    throw error; // Tells Bull to retry the job later
  }
});

emailQueue.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error ${err.message}`);
});
