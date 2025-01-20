import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * @swagger
 * /purchases/{walletId}:  
 *   get:
 *     summary: Get all purchases for a wallet.
 *     tags: 
 *         - Purchases
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the wallet
 *     responses:
 *       200:
 *         description: List of purchases returned successfully.
 *       404:
 *         description: Wallet not found.
 *       500:
 *         description: Internal server error.
 */

export async function getWalletPurchases(req, res) {
    try {
      const { walletId } = req.params;
  
      const wallet = await db.walletUser.findUnique({
        where: { id: parseInt(walletId) },
        include: {
          purchases: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
  
      if (!wallet) {
        return res.status(404).json({
          message: "Wallet not found"
        });
      }
  
      return res.status(200).json({
        purchases: wallet.purchases,
        message: "Purchases retrieved successfully"
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