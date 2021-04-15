const { MODE } = require("./config");

if (MODE == "1") {
  const Simulate = require("./components/Simulate");
  Simulate.show();
} else if (MODE == "2") {
  const AutoRebalancing = require("./components/AutoRebalancing");
  AutoRebalancing.show();
} else if (MODE == "3") {
  const DcaBtc = require("./components/dcabtc");
  DcaBtc.show();
} else if (MODE == "4") {
  const Arbitrage = require("./components/Arbitrage");
  Arbitrage.show();
} else if (MODE == "5") {
  const AMM = require("./components/AMM");
  AMM.show();
} else if (MODE == "6") {
  const BuyShort = require("./components/BuyShort");
  BuyShort.show();
}
