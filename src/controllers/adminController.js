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
