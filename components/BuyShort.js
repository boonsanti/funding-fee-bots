const {
  primary,
  secondary,
  order_size,
  ex_fee,
  gap_multiply,
} = require("../config");

const {
  TELEGRAM_TOKEN,
  LINE_NOTI,
  BINANCE_KEY,
  BINANCE_SECRET,
} = require("../apikey");

const moment = require("moment");

const { sendMessage } = require("./Telegram");
const { notify } = require("./Line");
const { printTable } = require("console-table-printer");

module.exports = {
  async show() {
    try {
      var q = {};
      var pair = primary + secondary;

      const Binance = require("node-binance-api");

      var binance = new Binance();

      binance.options({
        APIKEY: BINANCE_KEY,
        APISECRET: BINANCE_SECRET,
      });

      binance.websockets.trades([pair], (trades) => {
        let {
          e: eventType,
          E: eventTime,
          s: symbol,
          p: price,
          q: quantity,
          m: maker,
          a: tradeId,
        } = trades;
        q["price"] = price;
        q["eventTime"] = moment(eventTime).format("YYYY-MM-DD, HH:mm:ss");
      });

      setInterval(function () {
        binance.balance(async (error, balances) => {
          if (error) return console.error(error);

          var futuresPositionRisk = await binance.futuresPositionRisk();

          var statusBot = false;
          var futureStopLeverage = 2;

          //Define Parameter
          q["secondary"] = balances[secondary].available / 1;
          q["primary"] = balances[primary].available / 1;
          q["markPrice"] = futuresPositionRisk["BNBUSDT"].markPrice / 1;
          q["liquidationPrice"] =
            futuresPositionRisk["BNBUSDT"].liquidationPrice / 1;

          //Bot Running Status
          if (
            q["liquidationPrice"] > q["markPrice"] * futureStopLeverage &&
            q["secondary"] / q["markPrice"] > 0.1
          ) {
            statusBot = true;
          }

          //Create a table
          const testCases = [
            {
              Symbol: primary,
              Amount: q["primary"].toFixed(2),
              Status: `Mark Price: ${(q["markPrice"] / 1).toFixed(2)}`,
              Stop: `Leverage: ${futureStopLeverage.toFixed(0)}`,
              BotRunning: statusBot,
            },
            {
              Symbol: secondary,
              Amount: q["secondary"].toFixed(2),
              Status: `Entry Price: ${(
                futuresPositionRisk["BNBUSDT"].entryPrice / 1
              ).toFixed(2)}`,
              Stop: `Stop Price: >${(
                q["markPrice"] * futureStopLeverage
              ).toFixed(2)}`,
              BotRunning: q["eventTime"],
            },
            {
              Symbol: "Future Size",
              Amount: futuresPositionRisk["BNBUSDT"].positionAmt,
              Stop: `Liq. Price: ${(q["liquidationPrice"] / 1).toFixed(2)}`,
              Status: `PNL(ROE%): ${(
                futuresPositionRisk["BNBUSDT"].unRealizedProfit / 1
              ).toFixed(2)}`,
            },
          ];

          // Trading
          if (statusBot) {
            await binance.marketBuy("BNBBUSD", 0.1);
            await binance.futuresMarketSell("BNBUSDT", 0.1);
          }

          // Clear Screen Before Print
          console.clear();
          //print Table
          printTable(testCases);
        });
      }, 2000);
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
