import nftData from "../nftData.json" assert { type: "json" };
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { authenticateUser } from "../middleware/auth.js";

const db = new PrismaClient();

dotenv.config;
export async function buy(req, res) {
   
  const tokenId = req.params.tokenid; // Assuming token ID is passed as a query parameter

  if (!tokenId) {
    return res.status(400).json({ message: "Token ID is required" });
  }

  try {
    await authenticateUser(req, res);
    const nftData1 = nftData.find((nft) => nft.token_id === tokenId);

    if (!nftData1) {
      return res.status(404).json({ message: "NFT not found" });
    }

    // Extract relevant properties from the found NFT
    const { name, image, description, blockchain } = nftData1;

    // Upload the NFT using the provided method
    const nftpost = await db.nftpost.create({
      data: {
        name,
        image, // Assuming the image URL from nftData is directly usable
        description,
        blockchain,
        userId: req.user.userId, // Assuming req.user.userId is available and correct
      },
    });

    // Return the uploaded NFT data
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
