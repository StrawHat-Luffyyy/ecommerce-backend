import prisma from "../config/db.js";
import redisClient from "../config/redis.js";

// @desc    Create new order from Cart
// @route   POST /api/orders
// @access  Private

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartKey = `cart:${userId}`;
    const cartData = await redisClient.get(cartKey);
    if (!cartData) {
      return res
        .status(400)
        .json({ status: "error", message: "Cart is empty" });
    }
    const cart = JSON.parse(cartData);
    if (cart.items.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Cart is empty" });
    }
    const productIds = cart.items.map((item) => item.productId);
    const productsInDb = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    let totalAmount = 0;
    const orderItemsData = [];
    for (const cartItem of cart.items) {
      const dbProduct = productsInDb.find((p) => p.id === cartItem.productId);
      if (!dbProduct) {
        return res.status(404).json({
          status: "error",
          message: `Product ${cartItem.productId} not found`,
        });
      }
      totalAmount += parseFloat(dbProduct.price) * cartItem.quantity;
      orderItemsData.push({
        productId: dbProduct.id,
        quantity: cartItem.quantity,
        price: dbProduct.price,
      });
    }
    const order = await prisma.$transaction(async (tx) => {
      // Create a base order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });
      // Deduct Inventory with atomic stock validation
      for (const item of orderItemsData) {
        const updateResult = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });
        if (updateResult.count === 0) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }
      }
      return newOrder;
    });
    // Clear redis cart after successful transaction
    await redisClient.del(cartKey);
    res.status(201).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res
      .status(500)
      .json({ status: "error", message: error.message || "Failed to create order" });
  }
};
