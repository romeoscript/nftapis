import express from "express";
import cors from 'cors';
const app = express();
const PORT = 5000;
import { getNFTs } from "./routes/nft.js";
import { registerUser } from "./routes/registerUser.js";
import { POST } from "./routes/loginUser.js";
import { createNft } from "./routes/CreateNft.js";
import { getUserNFTs } from "./routes/getusernft.js";
import { buy } from "./routes/Buy.js";


app.use(express.json());
app.use(cors()); // <-- use the CORS middleware here

app.get("/nft", getNFTs);
app.get("/mynfts", getUserNFTs)
app.post("/buy/:tokenid", buy)


app.post("/register", registerUser);
app.post("/login", POST);
app.post("/creatNft",  createNft);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
