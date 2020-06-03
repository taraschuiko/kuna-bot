const readline = require("readline")
require("dotenv").config()
const getMarketData = require("./api/getMarketData")
const getBalance = require("./api/getBalance")

const isAppDevMode = process.env.APP_MODE === "DEV"
const buyWhenChangePercentIsLowerThan = process.env.BUY_WHEN_CHANGE_PERCENT_IS_LOWER_THAN
const tradeWithPercentOfUAH = process.env.TRADE_WITH_PERCENT_OF_UAH
const sellWhenPriceIsGreaterByTimes = process.env.SELL_WHEN_PRICE_IS_GREATER_BY_TIMES

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async function app() {
  boughtPrice = null
  goal = null
  spentUAH = null
  boughtBTC = null
  stopWhenSold = false

  console.log("-----------------------------------------------")
  console.log("To stop when sold input 's'")
  rl.on('line', input => {
    input === "s" ? stopWhenSold = true : null
    console.log("I'm going to stop when I sell")
  })

  setInterval(async () => {
    const marketData = await getMarketData()
    const balance = await getBalance()

    if (boughtPrice === null && !stopWhenSold && buyWhenChangePercentIsLowerThan > marketData.prineChangePercent) {
      boughtPrice = marketData.buyPrice
      goal = Math.floor(boughtPrice + boughtPrice * sellWhenPriceIsGreaterByTimes)
      spentUAH = tradeWithPercentOfUAH * balance.UAH / 100
      boughtBTC = spentUAH / marketData.buyPrice
      console.log("Balance before: ", balance.UAH)
      console.log("Bought with price: ", boughtPrice)
      console.log("Balance after: ", balance.UAH - tradeWithPercentOfUAH * balance.UAH / 100)
      console.log("Spent UAH: ", spentUAH)
      console.log("Got bitcoins: ", boughtBTC)
      console.log("Goal price is: ", goal)
    } else if (boughtPrice !== null && goal <= marketData.sellPrice) {
      console.log("Sold!")
      console.log(`Bought with ${boughtPrice}, sold with ${marketData.sellPrice}`)
      console.log("Profit UAH: ", boughtBTC * marketData.sellPrice - spentUAH)
      boughtPrice = null
      goal = null
      spentUAH = null
      boughtBTC = null
    }

    if (isAppDevMode) {
      console.log("-----------------------------------------------")
      console.log("Bought price: ", boughtPrice)
      console.log("Current sell price: ", marketData.sellPrice)
      console.log("Goal is: ", goal)
    }
  }, 5000)
})()
