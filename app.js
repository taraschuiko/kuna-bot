const axios = require("axios")
require('dotenv').config()
const apiUrl = process.env.API_URL
const getSignedHeaders = require("./helpers/getSignedHeaders")

async function getMarketData() {
  return await axios.get(`${apiUrl}/tickers?symbols=btcuah`).then(({ data }) => ({
    sellPrice: data[0][1],
    buyPrice: data[0][3],
    priceChange: data[0][5]
  }))
}

async function getBalance() {
  return await axios.post(`${apiUrl}/auth/r/wallets`, {}, {headers: getSignedHeaders("/auth/r/wallets", {})})
    .then(({ data }) => {
      const balance = {}
      data.map(item => item[2] !== 0 ? balance[item[1]] = item[2] : null)
      return balance
    })
}

(async function app() {
  boughtPrice = null
  setInterval(async () => {
    const marketData = await getMarketData()
    const balance = await getBalance()
    console.log(marketData, balance)
    console.log("bought price", boughtPrice)
    if (boughtPrice === null) {
      boughtPrice = marketData.buyPrice
    } else {
      if (boughtPrice < marketData.sellPrice) {
        console.log("Sell!")
        console.log(`Bought with ${boughtPrice}, sell with ${marketData.sellPrice}`)
        boughtPrice = null
      }
    }
  }, 5000)
})()
