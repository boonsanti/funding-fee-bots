var {
  histo,
  limit,
  pair,
  capital,
  order_size,
  ex_fee,
  gap_multiply,
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

    // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    await binance.candlesticks(
      pair,
      histo,
      (error, ticks, symbol) => {
        var q = {};

        q["fiat"] = 0;
        q["asset"] = 0;

        startprice = ticks[0][4];
        ticks.forEach((t) => {
          q["fiat"] = q["fiat"] + order_size;
          q["asset"] = q["asset"] + order_size / t[4];
          q["lastprice"] = t[4];
        });

        console.log(
          `USDT = ${q["fiat"]} | BTC = ${q["asset"] * q["lastprice"]}`
        );
        console.log(`${((q["asset"] * q["lastprice"]) / q["fiat"]) * 100}`);
      },
      { limit: limit }
    );
  },
};
