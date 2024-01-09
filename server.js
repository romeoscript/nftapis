import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const PORT = 5000;

// Import your route handlers
import { getNFTs, registerUser, loginUser, createNft, getUserNFTs, buy, createStripeSession, getNFT } from "./routes";

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
  apis: ["./routes/*.js"] // path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Use CORS with options
app.use(cors({
  origin: "*", // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies
  allowedHeaders: "Content-Type,Authorization"
}));

// Enable pre-flight across-the-board
app.options('*', cors()); // include before other routes

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
