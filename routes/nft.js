const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {

  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await axios.get('https://api.opensea.io/api/v1/assets', {
      headers: {
        'X-API-KEY': '0ade3081dbe445b99bde612a3069a364'
      },
      params: {
        order_direction: 'desc',
        offset: '0',
        limit: '200'
      }
    });

    const seenCollections = new Set();
    const uniqueCollectionAssets = [];
    const otherAssets = [];

    for (const asset of response.data.assets) {
      if (uniqueCollectionAssets.length < 22 && !seenCollections.has(asset.collection.slug)) {
        seenCollections.add(asset.collection.slug);
        uniqueCollectionAssets.push(asset);
      } else {
        otherAssets.push(asset);
      }
    }

    const combinedAssets = [...uniqueCollectionAssets, ...otherAssets];

    const filteredData = combinedAssets.slice(0, 52).map(asset => ({
      name: asset.asset_contract.name,
      description: asset.description,
      token_id: asset.token_id,
      address: asset.asset_contract.address,
      image: asset.asset_contract.image_url,
      video: asset.animation_url,
      date: asset.asset_contract.created_date,
      blockchain: asset.asset_contract.chain_identifier,
      price: asset.asset_contract.seller_fee_basis_points * 0.0001
    }));

    return res.status(200).json(filteredData);

  } catch (error) {
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({
      message: errorMessage,
      details: error.message || error
    });
  }
});

module.exports = router

