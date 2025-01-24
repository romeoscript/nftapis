import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const PORT = 5001;
import { buy } from "./routes/Buy.js";
import { createNft } from "./routes/CreateNft.js";
import { getUserNFTs } from "./routes/getusernft.js";
import { createStripeSession } from "./routes/stripePayment.js";
import { getNFTs } from "./routes/nft.js";
import { registerUser } from "./routes/registerUser.js";
import { getNFT } from "./routes/particularnft.js";
import { POST as loginUser } from "./routes/loginUser.js";
import { getNearbyMechanics } from "./routes/registermech.js";
import { registerWalletUser } from "./routes/createUserWallet.js";
import { createPurchase } from "./routes/purchase.js";
import { registerMechanic } from "./routes/createMechanic.js";
import { getProductById, getProducts, updateProduct, createProduct } from "./routes/products.js";

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NFT API",
      version: "1.0.0",
      description: "A simple Express NFT API"
    },
    servers: [
      { url: "http://localhost:5000" },
      { url: "https://nftapis.onrender.com" }
    ]
  },
  apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// CORS configuration - Allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: false // Set to false when using '*' for origin
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to parse JSON bodies
app.use(express.json());

// Define your API routes
app.get("/nft", getNFTs);
app.get("/mynfts", getUserNFTs);
app.post("/buy/:tokenid", buy);
app.get("/nft/:tokenid", getNFT);
app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/creatNft", createNft);
app.post("/create-stripe-session", createStripeSession);
app.get("/mechanics", getNearbyMechanics);
app.post("/mechanics", registerMechanic);
app.post("/walletUser", registerWalletUser);
app.post("/purchase", createPurchase);
app.post("/product", createProduct);
app.get("/products", getProducts);
app.patch("/product", updateProduct);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});