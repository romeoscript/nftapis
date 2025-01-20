import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * @swagger
 * /purchases:  
 *   post:
 *     summary: Record a new purchase for a wallet.
 *     tags: 
 *         - Purchases
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletId:
 *                 type: number
 *                 description: The ID of the wallet making the purchase.
 *               title:
 *                 type: string
 *                 description: The title of the purchased item.
 *               price:
 *                 type: number
 *                 description: The price of the item.
 *               description:
 *                 type: string
 *                 description: Description of the purchased item.
 *               category:
 *                 type: string
 *                 description: Category of the purchased item.
 *               image:
 *                 type: string
 *                 description: URL of the item image.
 *               txHash:
 *                 type: string
 *                 description: Solana transaction hash.
 *             required:
 *               - walletId
 *               - title
 *               - price
 *               - description
 *               - category
 *     responses:
 *       201:
 *         description: Purchase recorded successfully.
 *       400:
 *         description: Missing or invalid input.
 *       404:
 *         description: Wallet not found.
 *       500:
 *         description: Internal server error.
 */

export async function createPurchase(req, res) {
  try {
    const { 
      walletId,
      title,
      price,
      description,
      category,
      image,
      txHash 
    } = req.body;

    // Validate required fields
    if (!walletId || !title || !price || !description || !category) {
      return res.status(400).json({ 
        message: "Missing required fields. WalletId, title, price, description, and category are required." 
      });
    }

    // Validate price
    if (price <= 0) {
      return res.status(400).json({ 
        message: "Price must be greater than 0" 
      });
    }

    // Check if wallet exists
    const wallet = await db.walletUser.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found"
      });
    }

    // Create purchase record
    const purchase = await db.purchase.create({
      data: {
        walletId,
        title,
        price,
        description,
        category,
        image,
        txHash
      },
    });

    return res.status(201).json({
      purchase,
      message: "Purchase recorded successfully"
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
