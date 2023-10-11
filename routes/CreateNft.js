import dotenv from 'dotenv';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth.js';

const db = new PrismaClient();

// Multer Configuration
const upload = multer({ storage: multer.memoryStorage() });

// Load environment variables
dotenv.config();

export async function createNft(req, res) {
  try {
    // Authenticate the user
    await authenticateUser(req, res);

    // Apply multer middleware to handle file uploads
    const uploadMiddleware = upload.single('image'); 
    await new Promise((resolve, reject) => {
      uploadMiddleware(req, res, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded.' });
    }

    const body = req.body;

    // If no user is attached to the request, it means authentication failed
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }

    const { name, description, blockchain } = body;

    if (!name || !description || !blockchain) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const result = await new Promise((resolve, reject) => {
      const streamLoad = cloudinary.uploader.upload_stream(
        { folder: 'NftImages' },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      req.file.stream.pipe(streamLoad);
    });

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
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({
      message: errorMessage,
      details: error instanceof Error ? error.message : error
    });
  }
}
