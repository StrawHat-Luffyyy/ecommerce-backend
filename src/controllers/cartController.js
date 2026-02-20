import prisma from "../config/db.js";
import redisClient from "../config/redis.js";

const CART_EXPIRATION = 604800; // 7 days in seconds

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private

export const getCart = async (req, res) => {
  try {
    const cartKey = `cart:${req.user.id}`;
    const cartData = await redisClient.get(cartKey);
    if (!cartData) {
      return res.status(200).json({ status: "success", data: { items: [] } });
    }
    res.status(200).json({
      status: "success",
      data: JSON.parse(cartData),
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch cart" });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity <= 0) throw error;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    const cartKey = `cart:${req.user.id}`;
    let cart = { items: [] };
    const existingCart = await redisClient.get(cartKey);
    if (existingCart) {
      cart = JSON.parse(existingCart);
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        name: product.name,
        price: product.price,
      });
    }
    await redisClient.setEx(cartKey, CART_EXPIRATION, JSON.stringify(cart));
    res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ status: "error", message: "Failed to update cart" });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cartKey = `cart:${req.user.id}`;
    const cartData = await redisClient.get(cartKey);
    if (!cartData) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    let cart = JSON.parse(cartData);
    cart.items = cart.items.filter((item) => item.productId !== productId);
    await redisClient.setEx(cartKey, CART_EXPIRATION, JSON.stringify(cart));
    res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to remove item" });
  }
};
