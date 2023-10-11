import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pkg from 'bcryptjs';


const { compare } = pkg;
const db = new PrismaClient();
// Load environment variables
dotenv.config();

export async function POST(req, res) {
  try {
    const body = await req.body;
    const { email, password } = body;

    const user = await db.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    // Here, you can set the JWT in a cookie or send it back in the response.
    // For simplicity, we're sending it in the response.
    return res.status(200).json({ token: token, message: "Login successful" });
  } catch (error) {
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({
      message: errorMessage,
      details: error instanceof Error ? error.message : error,
    });
  }
}
