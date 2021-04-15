const { pair, coin, order_size, ex_fee, gap_multiply } = require("../config");

const {
  TELEGRAM_TOKEN,
  LINE_NOTI,
  BINANCE_KEY,
  BINANCE_SECRET,
} = require("../apikey");

const { sendMessage } = require("./Telegram");
const { notify } = require("./Line");

module.exports = {
  async show() {
    try {
      const Binance = require("node-binance-api");

      var binance = new Binance();

      var q = {};

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
        if (maker) {
          maker = `\x1b[31m`;
        } else {
          maker = `\x1b[32m`;
        }
        // console.log(
        //   `\x1b[33m`,
        //   `${new Date(eventTime).toLocaleTimeString()}`,
        //   maker,
        //   `${(price / 1).toFixed(2)}`,
        //   `\x1b[35m`,
        //   `${(quantity / 1).toFixed(6)}BTC`
        // );
      });

      binance.options({
        APIKEY: BINANCE_KEY,
        APISECRET: BINANCE_SECRET,
      });

      setInterval(async function () {
        binance.balance((error, balances) => {
          if (error) return console.error(error);
          q["fiat"] = balances.USDT.available / 1;
          q["asset"] = balances[coin].available / 1;

          q["musdt"] = q["fiat"];
          q["mbtc"] = q["asset"] * q.price;
          q["mgap"] = `${(q.fiat * gap_multiply).toFixed(2)} / ${Math.abs(
            q.fiat / 1 - q.asset * q.price
          ).toFixed(2)}`;

          console.log(
            `\x1b[34m`,
            `${pair} ${(q.price / 1).toFixed(2)}`,
            `\x1b[33m`,
            `balance: ${(q.musdt + q.mbtc).toFixed(2)}`,
            `\x1b[32m`,
            `GAP ${q.mgap}`
          );
        });
      }, 2000);

      var fiat = null;
      var asset = null;
      var start_price = null;
      var capital = null;

      var count = { buy: 0, sell: 0 };
      var message = "";
      var fee = 1 - ex_fee / 100;

      setInterval(async function () {
        if (!fiat) {
          fiat = q.fiat;
        }
        if (!asset) {
          asset = q.asset;
        }
        if (!capital) {
          capital = fiat / 1 + asset * q.price;
          start_price = q.price;
        }

        var orderside = "";
        if (Math.abs(q.fiat / 1 - q.asset * q.price) > q.fiat * gap_multiply) {
          if (q.fiat / 1 - q.asset * q.price > 0) {
            binance.buy(pair, (order_size / q.price).toFixed(6), q.price);

            fiat = fiat - order_size;
            asset = asset + (order_size / q.price) * fee;

            orderside = "🍏";
            count.buy = count.buy + 1;
          } else {
            binance.sell(pair, (order_size / q.price).toFixed(6), q.price);

            fiat = fiat + order_size * fee;
            asset = asset - order_size / q.price;

            orderside = "🍎";
            count.sell = count.sell + 1;
          }
          var message = `${orderside} ${(q.price / 1).toFixed(0)} 💰${(
            q.fiat +
            q.asset * start_price -
            capital
          ).toFixed(2)}/${(q.fiat + q.asset * q.price - capital).toFixed(
            2
          )} | B:${count.buy} S:${count.sell}`;

          if (TELEGRAM_TOKEN) {
            sendMessage(message);
          }
          if (LINE_NOTI) {
            notify(message);
          }
          console.log(
            `\x1b[34m`,
            `${pair} ${(q.price / 1).toFixed(2)}`,
            `\x1b[33m`,
            `balance: ${(q.musdt + q.mbtc).toFixed(2)}`,
            `\x1b[32m`,
            `GAP ${q.mgap}`
          );
          console.log(message);
        } //check diff.
      }, 5000);
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
