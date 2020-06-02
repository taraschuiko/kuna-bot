const axios = require("axios")
require('dotenv').config()
const apiUrl = process.env.API_URL
const getSignedHeaders = require("./helpers/getSignedHeaders")

async function getMarketData() {
  return await axios.get(`${apiUrl}/tickers?symbols=btcuah`).then(r => ({
    buyPrice: r.data[0][1],
    sellPrice: r.data[0][3]
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
  const marketData = await getMarketData()
  const balance = await getBalance()
  console.log(marketData)
  console.log(balance)
})()
