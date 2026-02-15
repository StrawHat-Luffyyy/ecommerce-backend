import bcrypt from "bcryptjs";
import prisma from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({
        // 409 = Conflict
        status: "error",
        message: "User already exists with this email",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      // 201 = Created
      status: "success",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
