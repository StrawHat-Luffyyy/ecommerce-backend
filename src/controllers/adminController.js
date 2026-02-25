import prisma from "../config/db.js";

// @desc    Get dashboard analytics (Total sales, order counts, etc.)
// @route   GET /api/admin/analytics
// @access  Private/Admin

export const getAnalytics = async (req, res) => {
  try {
    const revenueData = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: "PAID" },
    });
    const totalRevenue = revenueData._sum.totalAmount || 0;
    const orderStats = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });
    // Format the order stats into a clean object: { PAID: 5, PENDING: 2 }
    const formattedStats = orderStats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lt: 10 } },
      select: { id: true, name: true, stock: true },
      take: 5,
      orderBy: { stock: "asc" },
    });
    res.status(200).json({
      status: "success",
      data: {
        revenue: parseFloat(totalRevenue).toFixed(2),
        orders: formattedStats,
        lowStockAlerts: lowStockProducts,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to load analytics" });
  }
};

// @desc    Get all orders (with user details)
// @route   GET /api/admin/orders
// @access  Private/Admin

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({
      status: "success",
      results: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch orders" });
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatus = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });
    res.status(200).json({
      status: "success",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    // Handle case where ID doesn't exist
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }
    res
      .status(500)
      .json({ status: "error", message: "Failed to update order status" });
  }
};
