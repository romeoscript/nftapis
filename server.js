import express from "express";
const app = express();
const PORT = 5000;
import { getNFTs } from "./routes/nft.js";
import { registerUser } from "./routes/registerUser.js";
import { POST } from "./routes/loginUser.js";

app.use(express.json());

app.get("/nft", getNFTs);
app.post("/register", registerUser);
app.post("/login", POST);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
