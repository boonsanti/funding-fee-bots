const config = require("../config");

module.exports = {
  async show(body) {
    const WebSocket = require("ws");

    const ws = new WebSocket(
      "wss://api.bitkub.com/websocket-api/market.ticker.thb_usdt,market.ticker.thb_btc"
    );

    var quote = {};

    ws.on("message", async function incoming(data) {
      data = JSON.parse(data);
      if (data.stream.includes("thb_usdt")) {
        quote["USDTTHBlowestAsk"] = data.lowestAsk;
        quote["USDTTHBhighestBid"] = data.highestBid;
      }
      if (data.stream.includes("thb_btc")) {
        quote["BTCTHBhighestBid"] = data.highestBid;
        quote["BTCTHBlowestAsk"] = data.lowestAsk;
      }
    });

    const Binance = require("node-binance-api");

    const binance = new Binance({});

    binance.websockets.trades(
      ["BTCUSDT", "LTCUSDT", "BULLUSDT", "BCHUSDT", "ETHUSDT", "DOGEUSDT"],
      (trades) => {
        let {
          e: eventType,
          E: eventTime,
          s: symbol,
          p: price,
          q: quantity,
          m: maker,
          a: tradeId,
        } = trades;
        quote[symbol] = price;
      }
    );

    const BitMEXClient = require("bitmex-realtime-api");
    // See 'options' reference below
    const client = new BitMEXClient({ testnet: false });

    client.addStream("XBTUSD", "trade", function (data, symbol, tableName) {
      if (!data.length) return;
      quote["XBTUSD"] = data[data.length - 1].price;
    });

    setInterval(async function () {
      console.clear();
      var message = `
      Binance  ${(quote.BTCUSDT / 1).toFixed(2)} Bitmex  ${(
        quote.XBTUSD / 1
      ).toFixed(2)} : ${(quote.BTCUSDT - quote.XBTUSD).toFixed(2)}

      ${(quote.BTCTHBhighestBid / 1).toFixed(0)} / ${(
        quote.BTCTHBlowestAsk / 1
      ).toFixed(0)}

      Bitkub BTCTHB/Binance Price ${(
        quote.BTCTHBhighestBid / quote.BTCUSDT
      ).toFixed(2)} / ${(quote.BTCTHBlowestAsk / quote.BTCUSDT).toFixed(2)}
      
      Bitkub USDT/THB ${quote.USDTTHBhighestBid} / ${quote.USDTTHBlowestAsk} 

      Sell BTC/THB -> Buy USDT/THB -> Buy BTC/USDT : ${(
        (quote.BTCTHBhighestBid / quote.BTCUSDT / quote.USDTTHBlowestAsk - 1) *
        100
      ).toFixed(2)} % 
      
      Buy BTC/THB -> Sell USDT/THB -> Sell BTC/USDT : ${(
        ((quote.USDTTHBhighestBid / quote.BTCTHBlowestAsk) * quote.BTCUSDT -
          1) *
        100
      ).toFixed(2)} %
      `;
      console.log(message);
    }, 100);
  },
};
