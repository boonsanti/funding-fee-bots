const CronJob = require("cron").CronJob;
const request = require("request");
const axios = require("axios");
//MODEL
const Setting = require("../models/Setting");
//COMPONENT
const { notify } = require("../components/Line");

module.exports = {
  compair(io) {
    new CronJob(
      "*/2 * * * * *",
      async function () {
        var settings = await Setting.db.find({});

        summary = {};
        for (const s of settings) {
          summary[s.name] = s.value;
        }

        ////////////////////////////////////////////////////
        // SYSTEM FEED
        ////////////////////////////////////////////////////
        var usdt = summary.BTCTHB / summary.USDTTHB;
        var Binance = summary.BTCUSDT;
        var message = `${((usdt / Binance - 1) * 100).toFixed(3)} %`;

        var feed = {
          message: message,
          color: "text-info",
        };
        io.emit("system_feed", feed);
        console.log("compair -> feed", feed);
      },
      null,
      true,
      "Europe/London"
    );
  },
};
