import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const PORT = 5000;

import { getNFTs } from "./routes/nft.js";
import { registerUser } from "./routes/registerUser.js";
import { POST } from "./routes/loginUser.js";
import { createNft } from "./routes/CreateNft.js";
import { getUserNFTs } from "./routes/getusernft.js";
import { buy } from "./routes/Buy.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NFT API",
      version: "1.0.0",
      description: "A simple Express NFT API",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
      { url: "https://nftapis.onrender.com" },
    ],
  },
  apis: ["./routes/*.js"], // path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(cors());

app.get("/nft", getNFTs);
app.get("/mynfts", getUserNFTs);
app.post("/buy/:tokenid", buy);
app.post("/register", registerUser);
app.post("/login", POST);
app.post("/creatNft", createNft);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
