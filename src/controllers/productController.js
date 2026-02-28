import prisma from "../config/db.js";

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
    } = req.query;

    // Pagination logic
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build the where clause filter
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { name: category };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) where.price.gte = min;
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) where.price.lte = max;
      }
    }

    // Sorting logic
    let orderBy = { createdAt: "desc" }; // Default: Newest first
    if (sortBy === "price_asc") orderBy = { price: "asc" };
    if (sortBy === "price_desc") orderBy = { price: "desc" };

    // Execute Query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limitNum,
        where,
        orderBy,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      status: "success",
      results: products.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
      data: products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ status: "error", message: "Server Error" });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, images } = req.body;
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
        images: images || [],
      },
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to create product" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, images } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
        images,
      },
    });
    res.status(200).json({ status: "success", data: updatedProduct });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    res
      .status(500)
      .json({ status: "error", message: "Failed to update product" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res
      .status(200)
      .json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete product" });
  }
};
