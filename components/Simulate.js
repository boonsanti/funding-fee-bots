const axios = require("axios");
const moment = require("moment");
var {
  pair,
  histo,
  limit,
  capital,
  order_size,
  ex_fee,
  gap_multiply,
  natee,
} = require("../config");

module.exports = {
  async show() {
    const Binance = require("node-binance-api");

    var binance = new Binance();

    // สั่งให้พิมพ์ค่าออกไป
    console.log("Simulation Start");
    console.log("Loading data...");

    if (histo == "1m") {
      var days = limit / 1440;
    } else if (histo == "3m") {
      var days = limit / (1440 / 3);
    } else if (histo == "5m") {
      var days = limit / (1440 / 5);
    } else if (histo == "15m") {
      var days = limit / (1440 / 15);
    } else if (histo == "30m") {
      var days = limit / (1440 / 30);
    } else if (histo == "1h") {
      var days = limit / (1440 / 60);
    } else if (histo == "2h") {
      var days = limit / (1440 / 60 / 2);
    } else if (histo == "4h") {
      var days = limit / (1440 / 60 / 4);
    } else if (histo == "6h") {
      var days = limit / (1440 / 60 / 6);
    } else if (histo == "8h") {
      var days = limit / (1440 / 60 / 8);
    } else if (histo == "12h") {
      var days = limit / (1440 / 60 / 12);
    } else if (histo == "1d") {
      var days = limit / (1440 / 60 / 24);
    } else if (histo == "3d") {
      var days = limit / (1440 / 60 / 24 / 3);
    } else if (histo == "1w") {
      var days = limit / (1440 / 60 / 24 / 7);
    } else if (histo == "1M") {
      var days = limit / (1440 / 60 / 24 / 30);
    }

    var priceData = [];
    var q = {};

    // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    await binance.candlesticks(
      pair,
      histo,
      (error, ticks, symbol) => {
        priceData = ticks;

        q["primary"] = capital / priceData[0][4] / 2; // <-- capital(BTC) of primary(BNB)

        q["secondary"] = capital / 2; // <-- capital of secondary(BTC)

        var fee = 1 - ex_fee / 100;

        var count = { buy: 0, sell: 0 };
        var orderside = "";
        var color = "33";

        for (const p of priceData) {
          q["price"] = p[4];

          balance_start = q.primary + q.secondary / priceData[0][4]; // value in primary(BTC)
          current_value = q.primary + q.secondary / q.price;

          while (
            Math.abs(q.primary / 1 - q.secondary / q.price) >
            q.primary * gap_multiply
          ) {
            order_size = Math.abs(q.primary / 1 - q.secondary / q.price) / 2;

            if (order_size < 0.1) {
              order_size = 0.1;
            }

            if (q.primary / 1 - q.secondary / q.price > 0) {
              q.primary = q.primary - order_size;
              q.secondary = q.secondary + (order_size / q.price) * fee;

              color = "32";
              orderside = "🍏 B";
              count.buy = count.buy + 1;
            } else {
              q.primary = q.primary + order_size * fee;
              q.secondary = q.secondary - order_size / q.price;

              color = "31";
              orderside = "🍎 S";
              count.sell = count.sell + 1;
            }

            var gap = `${(q.primary * gap_multiply).toFixed(2)} / ${Math.abs(
              q.primary / 1 - q.secondary / q.price
            ).toFixed(2)}`;
            var message = `${moment(p[6]).format(
              "YYYY-MM-DD, HH:mm:ss"
            )} ${orderside} ${(q.price / 1).toFixed(6)} [ $${(
              q.primary / 1
            ).toFixed(2)}, ฿${q.secondary.toFixed(6)} ] 💰${(
              balance_start - capital
            ).toFixed(2)}/${(current_value - capital).toFixed(2)} | B:${
              count.buy
            } S:${count.sell} | GAP : ${gap}`;

            console.log(`\x1b[${color}m`, message);
          }
        }
        console.log("-----------------------------------------");
        console.log(
          `\x1b[33m`,
          `(${days.toFixed(2)} days) Start ${pair}:${
            priceData[0][4]
          } -> Current ${pair}:${q.price} (Gain : ${(
            q.price / priceData[0][4]
          ).toFixed(2)})`
        );
        if (q.primary / 1 + q.secondary * q.price - capital > 0) {
          console.log(
            `\x1b[33m`,
            `Profit: ${(current_value - capital).toFixed(2)} (${(
              ((current_value - capital) * 100) /
              capital
            ).toFixed(2)}% of ${capital})`
          );
          console.log(
            `\x1b[33m`,
            `Estimated Annual Yield: ${(
              ((current_value - capital) * 100 * 365) /
              capital /
              days
            ).toFixed(2)}%`
          );
        } else {
          console.log(
            `\x1b[33m`,
            `Current Price ${pair}:${q.price} (${days.toFixed(0)} days): ${(
              current_value - capital
            ).toFixed(2)} (${(
              ((current_value - capital) * 100) /
              capital
            ).toFixed(2)}% of ${capital})`
          );
        }
      },
      { limit: limit, endTime: new Date().getTime() - 1000 * 60 * natee }
    );
  },
};
