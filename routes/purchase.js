import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

class PurchaseError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.name = 'PurchaseError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function createPurchase(req, res) {
  try {
    const { 
      address,
      title,
      price,
      description,
      category,
      image,
      txHash 
    } = req.body;

    // Validate transaction hash
    if (!txHash || typeof txHash !== 'string') {
      throw new PurchaseError(
        "Invalid transaction hash", 
        400, 
        { reason: "Transaction hash must be a string", received: typeof txHash }
      );
    }

    // Validate required fields
    const validationErrors = [];

    // if (!walletId) validationErrors.push("Wallet ID is required");
    if (!title) validationErrors.push("Title is required");
    if (!price) validationErrors.push("Price is required");
    if (!description) validationErrors.push("Description is required");
    if (!category) validationErrors.push("Category is required");

    if (validationErrors.length > 0) {
      throw new PurchaseError(
        "Validation failed", 
        400, 
        { errors: validationErrors }
      );
    }

    // Check for duplicate transaction
    const existingPurchase = await db.purchase.findFirst({
      where: { txHash }
    });

    if (existingPurchase) {
      throw new PurchaseError(
        "Duplicate transaction", 
        409, 
        { txHash }
      );
    }

    // Create purchase record
    const purchase = await db.purchase.create({
      data: {
        address,
        title,
        price,
        description,
        category,
        image,
        txHash
      },
    });

    return res.status(201).json({
      success: true,
      message: "Purchase recorded successfully",
      data: purchase
    });

  } catch (error) {
    if (error instanceof PurchaseError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      error: error.message
    });
  }
}