const axios = require("axios")
require("dotenv").config()
const apiUrl = process.env.API_URL

const getMarketData = async () => {
  return await axios.get(`${apiUrl}/tickers?symbols=btcuah`).then(({ data }) => ({
    sellPrice: data[0][1],
    buyPrice: data[0][3],
    priceChange: data[0][5],
    prineChangePercent: data[0][6]
  }))
}

module.exports = getMarketData
