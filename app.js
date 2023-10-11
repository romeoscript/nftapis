const express = require("express");
const app = express();

const Nftroutes = require("./routes/nft");
app.use("/nfts", Nftroutes);
app.use((req, res, next) =>{
    res.status(200).json({
        message:'getat'
      
    })
  
})

module.exports = app;
