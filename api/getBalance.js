const axios = require("axios")
const getSignedHeaders = require("../helpers/getSignedHeaders")
require("dotenv").config()
const apiUrl = process.env.API_URL

const getBalance = async () => {
  return await axios.post(`${apiUrl}/auth/r/wallets`, {}, {headers: getSignedHeaders("/auth/r/wallets", {})})
    .then(({ data }) => {
      const balance = {}
      data.map(item => item[2] !== 0 ? balance[item[1]] = item[2] : null)
      return balance
    })
}

module.exports = getBalance
