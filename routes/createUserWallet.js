import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * @swagger
 * /wallet/register:  
 *   post:
 *     summary: Register a new wallet user.
 *     tags: 
 *         - Wallet Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: The Solana wallet address of the user.
 *             required:
 *               - address
 *     responses:
 *       201:
 *         description: Wallet user registered successfully.
 *       400:
 *         description: Missing or invalid input.
 *       409:
 *         description: Wallet address already registered.
 *       500:
 *         description: Internal server error.
 */

export async function registerWalletUser(req, res) {
  try {
    const { address } = req.body;

    // Validate fields
    if (!address) {
      return res.status(400).json({ message: "Wallet address is required." });
    }

    // Validate Solana address format (base58 check)
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if (!solanaAddressRegex.test(address)) {
      return res.status(400).json({ message: "Invalid Solana wallet address format." });
    }

    // Check if wallet already exists
    const existingWallet = await db.walletUser.findUnique({
      where: { address: address },
    });

    if (existingWallet) {
      return res.status(409).json({
        wallet: null,
        message: "Wallet address is already registered",
      });
    }

    // Create new wallet user
    const newWalletUser = await db.walletUser.create({
      data: {
        address,
      },
    });

    return res.status(201).json({ 
      wallet: newWalletUser, 
      message: "Wallet registered successfully" 
    });

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