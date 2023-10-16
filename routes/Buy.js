import nftData from "../nftData.json" assert { type: "json" };
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { authenticateUser } from "../middleware/auth.js";

const db = new PrismaClient();

dotenv.config;

/**
 * @swagger
 * /buy/{tokenid}:
 *   post:
 *     tags:
 *       - NFT
 *     description: Buy an NFT based on token ID
 *     parameters:
 *       - in: path
 *         name: tokenid
 *         required: true
 *         description: ID of the NFT token to buy
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully bought the NFT and returns the uploaded NFT data
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
 *         description: Bad request - Token ID is required
 *       404:
 *         description: NFT not found
 *       500:
 *         description: Internal Server Error
 */
export async function buy(req, res) {
  const tokenId = req.params.tokenid;

  if (!tokenId) {
    return res.status(400).json({ message: "Token ID is required" });
  }

  try {
    await authenticateUser(req, res);
    const nftData1 = nftData.find((nft) => nft.token_id === tokenId);

    if (!nftData1) {
      return res.status(404).json({ message: "NFT not found" });
    }

    const { name, image, description, blockchain } = nftData1;

    const nftpost = await db.nftpost.create({
      data: {
        name,
        image,
        description,
        blockchain,
        userId: req.user.userId,
      },
    });

    return res.status(200).json(nftpost);
  } catch (error) {
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({
      message: errorMessage,
      details: error.message || error,
    });
  }
}
