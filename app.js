const axios = require("axios")
require('dotenv').config()

const public_key = process.env.PUBLIC_KEY

async function getPrices() {
  return await axios.get("https://api.kuna.io/v3/tickers?symbols=btcuah").then(r => ({
    buyPrice: r.data[0][1],
    sellPrice: r.data[0][3]
  }))
}

(async function app() {
  const prices = await getPrices()
  console.log(prices)
  console.log(public_key)
})()
