const express = require("express");
const app = express();
app.use(express.json());


const Nftroutes = require("./routes/nft");
const Register = require("./routes/registerUser")
app.use("/nfts", Nftroutes);
app.use("/register", Register);


module.exports = app;
