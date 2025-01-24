import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
export async function getProducts(req, res) {
    try {
      const products = await db.product.findMany();
      return res.json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
   }
   
   // Get product by ID 
   export async function getProductById(req, res) {
    try {
      const product = await db.product.findUnique({
        where: { id: parseInt(req.params.id) }
      });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }
      return res.json({ success: true, data: product });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
   }
   
   // Create product
   export async function createProduct(req, res) {
    try {
      const { title, price, description, category, image } = req.body;
     
   
      const product = await db.product.create({
        data: { title, price, description, category, image }
      });
   
      return res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      return res.status(500).json({
        success: false, 
        message: error.message
      });
    }
   }
   
   // Update product
   export async function updateProduct(req, res) {
    try {
      const { title, price, description, category, image } = req.body;
      
      const product = await db.product.update({
        where: { id: parseInt(req.params.id) },
        data: { title, price, description, category, image }
      });
   
      return res.json({
        success: true,
        data: product
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
   }