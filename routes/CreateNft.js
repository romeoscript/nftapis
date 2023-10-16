import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../middleware/auth.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
import upload from "../middleware/upload.js";

const db = new PrismaClient();

// Load environment variables
dotenv.config();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /createNft:
 *   post:
 *     tags:
 *       - NFT
 *     description: Create a new NFT
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               blockchain:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - name
 *               - description
 *               - blockchain
 *               - image
 *     responses:
 *       201:
 *         description: Successfully created the NFT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 image:
 *                   type: string
 *                 description:
 *                   type: string
 *                 blockchain:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: Bad request - Missing required fields or No image uploaded
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Internal Server Error
 */

export async function createNft(req, res) {
  try {
    // Authenticate the user
    await authenticateUser(req, res);

    // Apply multer middleware to handle file uploads
    await new Promise((resolve, reject) => {
      upload.single("image")(req, res, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    const body = req.body;

    // If no user is attached to the request, it means authentication failed
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Authentication failed." });
    }

    const { name, description, blockchain } = body;

    if (!name || !description || !blockchain) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        req.file.path,
        { folder: "NftImages" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Delete the temporarily stored file
    //fs.unlinkSync(req.file.path);

    // Create the NFT post
    const nftpost = await db.nftpost.create({
      data: {
        name,
        image: result.secure_url,
        description,
        blockchain,
        userId: req.user.userId,
      },
    });

    return res.status(201).json(nftpost);
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
